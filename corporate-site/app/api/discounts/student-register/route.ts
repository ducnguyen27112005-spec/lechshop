import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateStudentCode } from "@/lib/discount";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.name || !data.email || !data.studentId || !data.school) {
            return NextResponse.json(
                { error: "Vui lòng điền đầy đủ thông tin" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return NextResponse.json(
                { error: "Email không hợp lệ" },
                { status: 400 }
            );
        }

        // Check if this email already has an active student code
        const existing = await prisma.discountCode.findFirst({
            where: {
                email: data.email.toLowerCase(),
                type: "student",
                used: false,
                isActive: true,
                expiresAt: { gt: new Date() },
            },
        });

        if (existing) {
            return NextResponse.json(
                {
                    error: "Email này đã có mã giảm giá sinh viên đang hoạt động",
                    existingCode: existing.code,
                    discountPercent: existing.discountPercent,
                    expiresAt: existing.expiresAt,
                },
                { status: 409 }
            );
        }

        // Generate unique code
        let code = generateStudentCode();
        let attempts = 0;
        while (attempts < 10) {
            const dup = await prisma.discountCode.findFirst({ where: { code } });
            if (!dup) break;
            code = generateStudentCode();
            attempts++;
        }

        // Create discount code (30 days expiry, 15% discount default)
        const discountPercent = 15;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const discount = await prisma.discountCode.create({
            data: {
                code,
                type: "student",
                email: data.email.toLowerCase(),
                discountPercent,
                usageLimit: 1,
                usedCount: 0,
                used: false,
                isActive: true,
                expiresAt,
            },
        });

        return NextResponse.json({
            success: true,
            code: discount.code,
            discountPercent: discount.discountPercent,
            expiresAt: discount.expiresAt,
            message: "Mã giảm giá đã được tạo thành công!",
        });
    } catch (error) {
        console.error("Student register error:", error);
        return NextResponse.json(
            { error: "Đã xảy ra lỗi, vui lòng thử lại sau" },
            { status: 500 }
        );
    }
}
