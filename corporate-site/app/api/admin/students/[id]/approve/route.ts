import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendStudentDiscountEmail } from "@/lib/mail";

// Random uppercase code generator
const generateRandomCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Authenticate admin
        // const session = await getServerSession(authOptions);
        // if (!session?.user) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        const { id } = await params;
        if (!id) return NextResponse.json({ error: "Thiếu ID yêu cầu" }, { status: 400 });

        const body = await req.json();
        const { adminNote } = body;

        // Fetch pending ticket
        const studentRequest = await prisma.studentRequest.findUnique({
            where: { id }
        });

        if (!studentRequest) {
            return NextResponse.json({ error: "Không tìm thấy yêu cầu" }, { status: 404 });
        }

        if (studentRequest.status === 'approved') {
            return NextResponse.json({ error: "Yêu cầu này đã được duyệt trước đó" }, { status: 400 });
        }

        // Logic 1: Find Active Existing Code to prevent duplicate code accumulation 
        let activeDiscount = await prisma.discountCode.findFirst({
            where: {
                type: 'student',
                email: studentRequest.email,
                isActive: true,
                expiresAt: { gt: new Date() }
            }
        });

        // Setup standard student discount: 15% (or read from config if you prefer globally configurable)
        // Currently hardcoding 15% baseline for MVP. If `maxDiscountAmount` is needed we can set it to ~500k VNĐ.
        const defaultDiscountPercent = 15;
        const validDays = 30; // Code expires in 30 days
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + validDays);

        let newCodeStr = '';

        // If no active code, generate new one
        if (!activeDiscount) {
            newCodeStr = `SV-${generateRandomCode()}`;

            // Transaction: Approve Request & Generate Code
            const [updatedReq, newDiscount] = await prisma.$transaction([
                prisma.studentRequest.update({
                    where: { id },
                    data: { status: "approved", adminNote: adminNote || null }
                }),
                prisma.discountCode.create({
                    data: {
                        code: newCodeStr,
                        type: "student",
                        email: studentRequest.email,
                        discountPercent: defaultDiscountPercent,
                        maxDiscountAmount: 500000,
                        usageLimit: null, // Mọi sản phẩm, không giới hạn dùng chung
                        usedCount: 0,
                        used: false,
                        applyTo: "all",
                        productId: null,
                        isPublic: false,
                        isActive: true,
                        // createdByAdminId: session.user.id,
                        expiresAt: expirationDate
                    }
                })
            ]);
            activeDiscount = newDiscount;
        } else {
            // Already has an active discount that hasn't expired. Just approve the ticket.
            newCodeStr = activeDiscount.code;
            await prisma.studentRequest.update({
                where: { id },
                data: { status: "approved", adminNote: adminNote || null }
            });
        }

        // Send Email Delivery
        const formattedDate = new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(activeDiscount.expiresAt);
        const mailResult = await sendStudentDiscountEmail(
            studentRequest.email,
            studentRequest.fullName,
            activeDiscount.code,
            activeDiscount.discountPercent,
            formattedDate
        );

        return NextResponse.json({
            success: true,
            message: "Duyệt thành công và gửi mã",
            mailSent: mailResult.success
        });

    } catch (error) {
        console.error("Approve Request Error:", error);
        return NextResponse.json(
            { error: "Lỗi Server trong lúc phê duyệt" },
            { status: 500 }
        );
    }
}
