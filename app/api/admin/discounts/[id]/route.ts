import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT: Update a discount code
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        const data = await req.json();

        // Check if discount exists
        const existing = await prisma.discountCode.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Mã giảm giá không tồn tại" }, { status: 404 });
        }

        const updateData: any = {};

        if (data.discountPercent !== undefined) {
            const percent = parseInt(data.discountPercent);
            if (percent < 1 || percent > 100) {
                return NextResponse.json({ error: "Phần trăm giảm giá phải từ 1 đến 100" }, { status: 400 });
            }
            updateData.discountPercent = percent;
        }

        if (data.usageLimit !== undefined) {
            updateData.usageLimit = parseInt(data.usageLimit);
        }

        if (data.isActive !== undefined) {
            updateData.isActive = Boolean(data.isActive);
        }

        if (data.expiresAt !== undefined) {
            updateData.expiresAt = new Date(data.expiresAt);
        }

        if (data.maxDiscountAmount !== undefined) {
            if (data.maxDiscountAmount !== null && data.maxDiscountAmount !== "") {
                const maxAmount = parseInt(data.maxDiscountAmount);
                if (maxAmount < 0) {
                    return NextResponse.json({ error: "Giảm tối đa phải lớn hơn hoặc bằng 0" }, { status: 400 });
                }
                updateData.maxDiscountAmount = maxAmount;
            } else {
                updateData.maxDiscountAmount = null;
            }
        }

        if (data.applyTo !== undefined) {
            updateData.applyTo = data.applyTo;
        }

        if (data.isPublic !== undefined) {
            updateData.isPublic = Boolean(data.isPublic);
        }

        if (data.productId !== undefined) {
            updateData.productId = data.productId || null;
            if (existing.type === 'student' && !updateData.productId && !existing.productId) {
                // only if both are empty - usually shouldn't happen if created correctly
                // but better safe
            }
        }

        // Validate types
        if (existing.type === 'student' && updateData.isPublic) {
            return NextResponse.json({ error: "Mã sinh viên không thể để chế độ hoàn toàn công khai" }, { status: 400 });
        }

        const discount = await prisma.discountCode.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(discount);
    } catch (error) {
        console.error("Error updating discount:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}

// DELETE: Delete a discount code
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;

        const existing = await prisma.discountCode.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Mã giảm giá không tồn tại" }, { status: 404 });
        }

        await prisma.discountCode.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting discount:", error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
    }
}
