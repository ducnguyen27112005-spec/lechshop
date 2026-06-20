import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateStudentCode } from "@/lib/discount";

// GET: List all discount codes with optional filters
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // "student" | "general"
        const status = searchParams.get("status"); // "active" | "expired" | "disabled"

        // Build where clause
        const where: any = {};
        if (type && type !== "all") where.type = type;

        if (status === "active") {
            where.isActive = true;
            where.expiresAt = { gt: new Date() };
        } else if (status === "expired") {
            where.expiresAt = { lte: new Date() };
        } else if (status === "disabled") {
            where.isActive = false;
        }

        const discounts = await prisma.discountCode.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                usageLogs: {
                    orderBy: { usedAt: 'desc' },
                    take: 1
                }
            }
        });

        // Enrich student discounts with Benefit info
        const enrichedDiscounts = await Promise.all(discounts.map(async (d) => {
            if (d.type === "student" && d.email) {
                const benefits = await prisma.studentBenefit.findMany({
                    where: { email: d.email.toLowerCase() }
                });
                return { ...d, benefits };
            }
            return d;
        }));

        return NextResponse.json(enrichedDiscounts);
    } catch (error) {
        console.error("Error fetching discounts:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// POST: Create a new discount code
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();

        // Validate required fields
        if (!data.type || !["student", "general"].includes(data.type)) {
            return NextResponse.json({ error: "Type phải là 'student' hoặc 'general'" }, { status: 400 });
        }

        if (!data.discountPercent || data.discountPercent < 1 || data.discountPercent > 100) {
            return NextResponse.json({ error: "Phần trăm giảm giá phải từ 1 đến 100" }, { status: 400 });
        }

        if (!data.expiresAt) {
            return NextResponse.json({ error: "Ngày hết hạn là bắt buộc" }, { status: 400 });
        }

        let code = data.code;

        if (data.type === "student") {
            if (!data.email) {
                return NextResponse.json({ error: "Email là bắt buộc cho mã sinh viên" }, { status: 400 });
            }

            // Check if email already has an active student code
            const existing = await prisma.discountCode.findFirst({
                where: {
                    email: data.email,
                    type: "student",
                    isActive: true,
                    expiresAt: { gt: new Date() },
                },
            });

            if (existing) {
                return NextResponse.json(
                    { error: `Email này đã có mã giảm giá đang active: ${existing.code}` },
                    { status: 400 }
                );
            }

            // Generate unique code
            let attempts = 0;
            do {
                code = generateStudentCode();
                const exists = await prisma.discountCode.findUnique({ where: { code } });
                if (!exists) break;
                attempts++;
            } while (attempts < 10);

            if (attempts >= 10) {
                return NextResponse.json({ error: "Không thể tạo mã unique, thử lại sau" }, { status: 500 });
            }
        } else {
            // general type
            if (!code) {
                return NextResponse.json({ error: "Mã giảm giá là bắt buộc cho loại general" }, { status: 400 });
            }
            if (!data.usageLimit || data.usageLimit < 1) {
                return NextResponse.json({ error: "Giới hạn sử dụng phải lớn hơn 0" }, { status: 400 });
            }

            // Check code uniqueness
            const existing = await prisma.discountCode.findUnique({ where: { code } });
            if (existing) {
                return NextResponse.json({ error: "Mã giảm giá này đã tồn tại" }, { status: 400 });
            }
        }

        // Validate new fields
        let maxDiscountAmount = null;
        if (data.maxDiscountAmount) {
            maxDiscountAmount = parseInt(data.maxDiscountAmount);
            if (maxDiscountAmount < 0) {
                return NextResponse.json({ error: "Giảm tối đa phải lớn hơn hoặc bằng 0" }, { status: 400 });
            }
        }

        const discount = await prisma.discountCode.create({
            data: {
                code: code.toUpperCase(),
                type: data.type,
                email: data.email || null,
                discountPercent: parseInt(data.discountPercent),
                usageLimit: data.type === "general" ? parseInt(data.usageLimit) : null,
                maxDiscountAmount: maxDiscountAmount,
                applyTo: data.type === "student" ? "all" : (data.applyTo || "all"),
                productId: data.type === "student" ? null : (data.productId || null),
                isPublic: data.isPublic === true || data.isPublic === "true",
                createdByAdminId: (session.user as any)?.id || null,
                expiresAt: new Date(data.expiresAt),
            },
        });

        return NextResponse.json(discount);
    } catch (error) {
        console.error("Error creating discount:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}
