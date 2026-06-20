import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// POST: Validate a discount code at checkout
export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!data.code) {
            return NextResponse.json({ valid: false, message: "Vui lòng nhập mã giảm giá" }, { status: 400 });
        }

        const discount = await prisma.discountCode.findUnique({
            where: { code: data.code.toUpperCase() },
        });

        if (!discount) {
            return NextResponse.json({ valid: false, message: "Mã giảm giá không tồn tại" });
        }

        if (!discount.isActive) {
            return NextResponse.json({ valid: false, message: "Mã giảm giá đã bị vô hiệu hoá" });
        }

        if (new Date() > discount.expiresAt) {
            return NextResponse.json({ valid: false, message: "Mã giảm giá đã hết hạn" });
        }

        if (discount.type === "general") {
            if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
                return NextResponse.json({ valid: false, message: "Mã giảm giá đã hết lượt sử dụng" });
            }

            if (!discount.isPublic) {
                if (!data.email) {
                    return NextResponse.json({ valid: false, message: "Mã giảm giá nội bộ yêu cầu email để xác minh" });
                }
                // Check if this coupon has been used by this email before
                const previousUsage = await prisma.couponUsageLog.findFirst({
                    where: {
                        discountCodeId: discount.id,
                        userId: data.email.toLowerCase()
                    }
                });
                if (previousUsage) {
                    return NextResponse.json({ valid: false, message: "Bạn đã sử dụng mã giảm giá này rồi" });
                }
            }
        }

        if (discount.type === "student") {
            if (data.email && discount.email && data.email.toLowerCase() !== discount.email.toLowerCase()) {
                return NextResponse.json({ valid: false, message: "Mã giảm giá không áp dụng cho email này" });
            }

            // --- STUDENT BENEFIT CHECK (ANTI-SPAM / ANTI-ABUSE) ---
            if (data.email && data.productId) {
                const benefit = await prisma.studentBenefit.findUnique({
                    where: {
                        email_productId: {
                            email: data.email.toLowerCase(),
                            productId: data.productId
                        }
                    }
                });

                if (benefit && benefit.nextEligibleAt > new Date()) {
                    const formattedDate = new Intl.DateTimeFormat('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).format(benefit.nextEligibleAt);

                    return NextResponse.json({
                        valid: false,
                        errorCode: "STUDENT_BENEFIT_COOLDOWN",
                        message: `Bạn đã dùng ưu đãi sinh viên cho sản phẩm này. Có thể dùng lại sau: ${formattedDate}`
                    });
                }
            }
        }

        return NextResponse.json({
            valid: true,
            discountPercent: discount.discountPercent,
            code: discount.code,
            type: discount.type,
            maxDiscountAmount: discount.maxDiscountAmount,
            applyTo: discount.applyTo,
            usageLimit: discount.usageLimit,
            usedCount: discount.usedCount,
        });
    } catch (error) {
        console.error("Error validating discount:", error);
        return NextResponse.json({ valid: false, message: "Lỗi hệ thống" }, { status: 500 });
    }
}
