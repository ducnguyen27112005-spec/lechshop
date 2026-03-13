import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// POST: Mark a discount code as used after successful order
export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!data.code) {
            return NextResponse.json({ error: "Mã giảm giá là bắt buộc" }, { status: 400 });
        }

        const discount = await prisma.discountCode.findUnique({
            where: { code: data.code.toUpperCase() },
        });

        if (!discount) {
            return NextResponse.json({ error: "Mã giảm giá không tồn tại" }, { status: 404 });
        }

        // Extra fields to save in log
        const { orderId, email, discountAmount, ipAddress } = data;

        if (orderId) {
            const existingLog = await prisma.couponUsageLog.findFirst({
                where: { orderId, discountCodeId: discount.id }
            });
            if (existingLog) {
                return NextResponse.json({ error: "Mã giảm giá đã được áp dụng cho đơn hàng này" }, { status: 400 });
            }
        }

        // Use a transaction to ensure both updates happen
        await prisma.$transaction(async (tx) => {
            // General & Student now both just increment usedCount
            await tx.discountCode.update({
                where: { id: discount.id },
                data: { usedCount: { increment: 1 } },
            });

            // Create log
            await tx.couponUsageLog.create({
                data: {
                    discountCodeId: discount.id,
                    userId: email ? email.toLowerCase() : null,
                    orderId: orderId || null,
                    discountAmount: discountAmount || 0,
                    ipAddress: ipAddress || null,
                }
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error marking discount as used:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}
