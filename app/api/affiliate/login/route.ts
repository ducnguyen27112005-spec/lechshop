import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

// POST /api/affiliate/login
export async function POST(req: NextRequest) {
    try {
        const { phone, password } = await req.json();

        if (!phone || !password) {
            return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin." }, { status: 400 });
        }

        const user = await prisma.affiliateUser.findUnique({
            where: { phone: phone.trim() },
        });

        if (!user || !user.isActive) {
            return NextResponse.json({ error: "Tài khoản không tồn tại hoặc đã bị khóa." }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Mật khẩu không đúng." }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                id: user.id,
                phone: user.phone,
                fullName: user.fullName,
                referralCode: user.referralCode,
            },
        });
    } catch (err) {
        console.error("[affiliate/login]", err);
        return NextResponse.json({ error: "Lỗi hệ thống." }, { status: 500 });
    }
}
