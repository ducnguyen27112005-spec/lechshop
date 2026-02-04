import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const banners = await prisma.banner.findMany({
            orderBy: { order: "asc" }
        });
        return NextResponse.json(banners);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const banner = await prisma.banner.create({
            data: {
                title: data.title,
                imageUrl: data.imageUrl,
                link: data.link,
                order: parseInt(data.order || "0"),
                isActive: data.isActive ?? true,
            }
        });
        return NextResponse.json(banner);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
