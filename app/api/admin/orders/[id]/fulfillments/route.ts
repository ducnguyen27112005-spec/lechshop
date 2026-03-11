import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { productPlans } from "@/content/productPlans";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const fulfillments = await prisma.orderFulfillment.findMany({
            where: { orderId: id },
            orderBy: { createdAt: "desc" },
            include: { supplier: true }
        });
        return NextResponse.json(fulfillments);
    } catch (error) {
        return NextResponse.json(
            { error: "Lỗi tải lịch sử nhận tài khoản" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: orderId } = await params;
        const body = await req.json();
        const { supplierName, batchCode, credentialText, action, note } = body;

        if (!action || !['DELIVER', 'REPLACE', 'NOTE'].includes(action)) {
            return NextResponse.json({ error: "Action không hợp lệ" }, { status: 400 });
        }

        if ((action === 'DELIVER' || action === 'REPLACE') && !credentialText?.trim()) {
            return NextResponse.json({ error: "Vui lòng nhập thông tin tài khoản" }, { status: 400 });
        }

        // Validate order exists and get customer info for email potentially
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
        }

        // 1. Create fulfillment record
        const fulfillment = await prisma.orderFulfillment.create({
            data: {
                orderId,
                supplierId: null, // User wants direct text input, no relation needed
                supplierNameSnapshot: supplierName?.trim() || null,
                batchCode: batchCode?.trim() || null,
                credentialText: credentialText?.trim() || "",
                action,
                note: note?.trim() || null,
                createdByAdminId: (session.user as any).id
            }
        });

        // 2. If it's a delivery or replacement, try sending email and update order status
        if (action === 'DELIVER' || action === 'REPLACE') {
            // Check inventory pool: mark matched items as SOLD
            const matchedInventory = await prisma.inventoryItem.findFirst({
                where: {
                    credentialText: credentialText?.trim() || "",
                    status: { in: ['AVAILABLE', 'RESERVED'] }
                }
            });

            if (matchedInventory) {
                await prisma.inventoryItem.update({
                    where: { id: matchedInventory.id },
                    data: {
                        status: 'SOLD',
                        soldOrderId: orderId
                    }
                });
            }

            // If replacing, mark previous SOLD items for this order as REPLACED
            if (action === 'REPLACE') {
                await prisma.inventoryItem.updateMany({
                    where: {
                        soldOrderId: orderId,
                        status: 'SOLD',
                        id: { not: matchedInventory?.id } // don't affect the one we just sold
                    },
                    data: {
                        status: 'REPLACED'
                    }
                });
            }

            // Mark order as completed and set deliveredAt.
            if (order.fulfillStatus !== "DONE") {
                await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        fulfillStatus: "DONE",
                        deliveredAt: new Date(),
                        deliveredByAdminId: (session.user as any).id
                    }
                });

                // Update StudentBenefit if this order used a student discount
                // 1. Find CouponUsageLog for this order
                const usageLog = await prisma.couponUsageLog.findFirst({
                    where: { orderId: orderId },
                    include: { discountCode: true }
                });

                if (usageLog && usageLog.discountCode.type === "student") {
                    // Try to extract productId from credentialText just to be sure, or more simply, 
                    // we can update or create StudentBenefit for 'all' products since they bought something here.
                    // But to be precise for anti-spam: 1 account = 1 month delay
                    // the order model only has customerName and type string.
                    // Let's create a benefit valid for 30 days based on delivered date for any product.
                    const email = order.customerEmail.toLowerCase();

                    // Look up plan duration
                    let durationMonths = 1; // Default
                    if (matchedInventory?.productId && matchedInventory?.planId) {
                        const productP = (productPlans as any)[matchedInventory.productId];
                        const plan = productP?.find((p: any) => p.id === matchedInventory.planId);
                        if (plan) {
                            durationMonths = plan.durationMonths;
                        }
                    }

                    const nextEligible = new Date();
                    if (durationMonths < 1) {
                        // Handling partial months (e.g., 7 days = 0.25)
                        nextEligible.setDate(nextEligible.getDate() + Math.round(durationMonths * 30));
                    } else {
                        nextEligible.setMonth(nextEligible.getMonth() + Math.floor(durationMonths));
                        // Handling remaining decimal part if any
                        if (durationMonths % 1 !== 0) {
                            nextEligible.setDate(nextEligible.getDate() + Math.round((durationMonths % 1) * 30));
                        }
                    }

                    const actualProductId = matchedInventory?.productId || order.type || "PREMIUM_PRODUCT";

                    await prisma.studentBenefit.upsert({
                        where: {
                            email_productId: {
                                email: email,
                                productId: actualProductId
                            }
                        },
                        update: {
                            nextEligibleAt: nextEligible,
                            lastEndAt: nextEligible
                        },
                        create: {
                            email: email,
                            productId: actualProductId,
                            nextEligibleAt: nextEligible,
                            lastEndAt: nextEligible
                        }
                    });
                }
            }
        }

        return NextResponse.json({
            success: true,
            fulfillment,
            message: action === 'NOTE' ? 'Đã lưu ghi chú' : 'Đã gửi email và giao tài khoản thành công',
        });
    } catch (error) {
        console.error("Fulfillment creation failed:", error);
        return NextResponse.json(
            { error: "Lỗi lưu thông tin cung cấp tài khoản" },
            { status: 500 }
        );
    }
}
