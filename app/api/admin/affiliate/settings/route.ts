import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const setting = await prisma.setting.findUnique({
            where: { id: "site-settings" }
        });
        const affiliateConfig = typeof setting?.affiliateConfig === 'object' ? setting.affiliateConfig : {
            defaultRate: 10,
            holdDays: 7,
            minWithdraw: 100000,
            maxWithdraw: 1000000
        };

        return NextResponse.json(affiliateConfig || {});
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const payload = await req.json();

        // Validating payload schema could go here

        const setting = await prisma.setting.upsert({
            where: { id: "site-settings" },
            update: {
                affiliateConfig: payload
            },
            create: {
                id: "site-settings",
                affiliateConfig: payload
            }
        });

        return NextResponse.json(setting.affiliateConfig);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
