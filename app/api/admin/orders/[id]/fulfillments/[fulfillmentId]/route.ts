import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string, fulfillmentId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: orderId, fulfillmentId } = await params;

        // Verify fulfillment exists and belongs to this order
        const fulfillment = await prisma.orderFulfillment.findUnique({
            where: { id: fulfillmentId }
        });

        if (!fulfillment || fulfillment.orderId !== orderId) {
            return NextResponse.json({ error: "Không tìm thấy dữ liệu cấp phát tài khoản" }, { status: 404 });
        }

        // Transactions: Delete fulfillment & conditionally update order status
        await prisma.$transaction(async (tx) => {
            // 1. Delete the fulfillment
            await tx.orderFulfillment.delete({
                where: { id: fulfillmentId }
            });

            // Undo Inventory item if it was picked from kho
            await tx.inventoryItem.updateMany({
                where: {
                    soldOrderId: orderId,
                    credentialText: fulfillment.credentialText
                },
                data: {
                    status: 'AVAILABLE',
                    soldOrderId: null,
                    reservedOrderId: null
                }
            });

            // 2. Check remaining DELIVER or REPLACE fulfillments for the order
            const remainingDeliveries = await tx.orderFulfillment.count({
                where: {
                    orderId,
                    action: { in: ['DELIVER', 'REPLACE'] }
                }
            });

            // If no delivery remaining, revert order to PROCESSING/NEW and clear delivered fields
            if (remainingDeliveries === 0) {
                // Determine previous status conceptually. Usually goes back to NEW or PROCESSING.
                // We'll set it to NEW for simplicity, since it's waiting again.
                await tx.order.update({
                    where: { id: orderId },
                    data: {
                        fulfillStatus: "NEW", // Can also be derived. For premium, if paid but no acc, it's new/processing.
                        deliveredAt: null,
                        deliveredByAdminId: null
                    }
                });
            }
        });

        return NextResponse.json({ success: true, message: "Đã Undo và xoá dữ liệu gửi account." });
    } catch (error) {
        console.error("Undo fulfillment failed:", error);
        return NextResponse.json(
            { error: "Lỗi nội bộ hệ thống khi undo fulfillment." },
            { status: 500 }
        );
    }
}
