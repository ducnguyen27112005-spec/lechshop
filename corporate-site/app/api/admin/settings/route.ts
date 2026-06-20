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
        return NextResponse.json(setting || {});
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const setting = await prisma.setting.upsert({
            where: { id: "site-settings" },
            update: {
                hotline: data.hotline,
                email: data.email,
                address: data.address,
                socialLinks: data.socialLinks,
                footerText: data.footerText,
            },
            create: {
                id: "site-settings",
                hotline: data.hotline,
                email: data.email,
                address: data.address,
                socialLinks: data.socialLinks,
                footerText: data.footerText,
            }
        });
        return NextResponse.json(setting);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
