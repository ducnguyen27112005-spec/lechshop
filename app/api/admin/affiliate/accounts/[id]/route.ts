import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { fullName, phone, password, referralCode, isActive } = body;

        const updateData: any = {
            fullName,
            phone,
            referralCode,
            isActive
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const { id } = await params;
        const updatedUser = await prisma.affiliateUser.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ message: "Updated successfully" });
    } catch (err: any) {
        console.error("[admin/affiliate/accounts/[id]_PUT]", err);
        if (err.code === 'P2002') {
            return NextResponse.json({ error: "Số điện thoại hoặc Mã giới thiệu đã tồn tại" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.wallet.deleteMany({
            where: { userId: id }
        });
        
        await prisma.affiliateUser.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("[admin/affiliate/accounts/[id]_DELETE]", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
