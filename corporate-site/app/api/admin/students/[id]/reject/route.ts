import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) return NextResponse.json({ error: "Thiếu ID yêu cầu" }, { status: 400 });

        const body = await req.json();
        const { adminNote } = body;

        if (!adminNote || adminNote.trim() === '') {
            return NextResponse.json({ error: "Bắt buộc phải có lý do từ chối (adminNote)" }, { status: 400 });
        }

        const studentRequest = await prisma.studentRequest.findUnique({
            where: { id }
        });

        if (!studentRequest) {
            return NextResponse.json({ error: "Không tìm thấy yêu cầu" }, { status: 404 });
        }

        if (studentRequest.status === 'approved') {
            return NextResponse.json({ error: "Đơn này đã duyệt, không thể từ chối" }, { status: 400 });
        }

        // Cập nhật trạng thái
        const updatedReq = await prisma.studentRequest.update({
            where: { id },
            data: {
                status: "rejected",
                adminNote: adminNote
            }
        });

        return NextResponse.json({
            success: true,
            message: "Đã từ chối đơn thành công",
            request: updatedReq
        });

    } catch (error) {
        console.error("Reject Request Error:", error);
        return NextResponse.json(
            { error: "Lỗi Server" },
            { status: 500 }
        );
    }
}
