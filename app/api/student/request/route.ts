import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, studentId, school } = body;

        // Validation
        if (!fullName || !email || !studentId || !school) {
            return NextResponse.json(
                { error: "Vui lòng điền đầy đủ thông tin" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Email không hợp lệ" },
                { status: 400 }
            );
        }

        // Kiểm tra spam và trùng lặp
        const existingRequest = await prisma.studentRequest.findFirst({
            where: {
                OR: [{ email }, { studentId }],
            },
            orderBy: { createdAt: "desc" }
        });

        if (existingRequest) {
            // Nếu đã duyệt thì không xếp hàng xin nữa
            if (existingRequest.status === "approved") {
                return NextResponse.json(
                    { error: "Email hoặc Mã số Sinh viên này đã được duyệt xác thực trước đây. Bạn không cần gửi lại form." },
                    { status: 409 }
                );
            }

            // Nếu đang pending (hoặc pending mới đây < 24h)
            if (existingRequest.status === "pending") {
                const hoursSinceCreated = (new Date().getTime() - new Date(existingRequest.createdAt).getTime()) / (1000 * 60 * 60);

                if (hoursSinceCreated < 24) {
                    return NextResponse.json(
                        { error: "Bạn đã gửi yêu cầu xác thực gần đây. Vui lòng chờ phản hồi qua email!" },
                        { status: 429 }
                    );
                }
            }

            // Nếu Rejected, hoặc Pending từ quá lâu (coi như dead ticket)
            // Sẽ update lại request cũ thay vì duplicate ID
            const updated = await prisma.studentRequest.update({
                where: { id: existingRequest.id },
                data: {
                    fullName,
                    email,
                    studentId,
                    school,
                    status: "pending", // set lại trạng thái chờ
                    adminNote: null
                }
            });

            return NextResponse.json({ success: true, request: updated });
        }

        // Tạo Request Mới
        const request = await prisma.studentRequest.create({
            data: {
                fullName,
                email,
                studentId,
                school,
                status: "pending",
            },
        });

        return NextResponse.json({ success: true, request });
    } catch (error: any) {
        console.error("Create Request Error:", error);
        // Bắt lỗi Unique Constraint Prisma nếu có race condition
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Email hoặc Mã Sinh viên đã tồn tại." },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Lỗi hệ thống khi xử lý yêu cầu." },
            { status: 500 }
        );
    }
}
