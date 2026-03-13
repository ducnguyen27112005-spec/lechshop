import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { name: "asc" }
        });
        return NextResponse.json(tags);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const tag = await prisma.tag.create({
            data: {
                name: body.name,
                slug: body.slug
            }
        });
        return NextResponse.json(tag);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
