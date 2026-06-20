import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const url = new URL(req.url);
        const search = url.searchParams.get("search") || "";

        const users = await prisma.affiliateUser.findMany({
            where: {
                OR: [
                    { fullName: { contains: search } },
                    { phone: { contains: search } },
                    { referralCode: { contains: search } },
                ]
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                fullName: true,
                phone: true,
                referralCode: true,
                isActive: true,
                createdAt: true,
            }
        });

        const userIds = users.map(u => u.id);
        const wallets = await prisma.wallet.findMany({
            where: { userId: { in: userIds } }
        });

        const walletMap = new Map(wallets.map(w => [w.userId, w]));

        const result = users.map(u => ({
            ...u,
            wallet: walletMap.get(u.id) || null
        }));

        return NextResponse.json(result);
    } catch (err) {
        console.error("[admin/affiliate/accounts_GET]", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { fullName, phone, password, referralCode } = body;

        if (!fullName || !phone || !password || !referralCode) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Check if phone or referralCode exists
        const existing = await prisma.affiliateUser.findFirst({
            where: {
                OR: [
                    { phone },
                    { referralCode }
                ]
            }
        });

        if (existing) {
            return NextResponse.json({ error: "Số điện thoại hoặc Mã giới thiệu đã tồn tại" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.affiliateUser.create({
            data: {
                fullName,
                phone,
                password: hashedPassword,
                referralCode,
                isActive: true,
            }
        });

        // Create wallet manually since there's no Prisma relation
        await prisma.wallet.create({
            data: {
                userId: newUser.id,
                balanceAvailable: 0,
                balancePending: 0,
                balancePaidTotal: 0
            }
        });

        return NextResponse.json({ message: "Created successfully", id: newUser.id });
    } catch (err) {
        console.error("[admin/affiliate/accounts_POST]", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
