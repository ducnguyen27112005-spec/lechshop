import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendStudentDiscountEmail } from "@/lib/mail";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: "Thiếu ID yêu cầu" }, { status: 400 });

        const studentRequest = await prisma.studentRequest.findUnique({
            where: { id }
        });

        if (!studentRequest) {
            return NextResponse.json({ error: "Không tìm thấy yêu cầu" }, { status: 404 });
        }

        if (studentRequest.status !== 'approved') {
            return NextResponse.json({ error: "Chỉ có thể gửi lại mail cho sinh viên đã được duyệt." }, { status: 400 });
        }

        // Tìm mã giảm giá đang active của email này
        const activeDiscount = await prisma.discountCode.findFirst({
            where: {
                type: 'student',
                email: studentRequest.email,
                isActive: true,
                expiresAt: { gt: new Date() }
            }
        });

        if (!activeDiscount) {
            return NextResponse.json({ error: "Không tìm thấy mã giảm giá Active nào cấp cho sinh viên này (Có thể mã đã hết hạn hoặc bị xóa)." }, { status: 404 });
        }

        // Thực hiện gửi mail lại
        const formattedDate = new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(activeDiscount.expiresAt);
        const mailResult = await sendStudentDiscountEmail(
            studentRequest.email,
            studentRequest.fullName,
            activeDiscount.code,
            activeDiscount.discountPercent,
            formattedDate
        );

        if (!mailResult.success) {
            return NextResponse.json({ error: "Lỗi cấu hình khi gửi lại Email. Xem log server." }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Đã gửi lại Email thành công tới: " + studentRequest.email
        });

    } catch (error) {
        console.error("Resend Email Error:", error);
        return NextResponse.json(
            { error: "Lỗi Server" },
            { status: 500 }
        );
    }
}
