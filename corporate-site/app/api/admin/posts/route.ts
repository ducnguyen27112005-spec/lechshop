import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(posts);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const post = await prisma.post.create({
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                thumbnail: data.thumbnail,
                status: data.status,
                publishedAt: data.status === "PUBLISHED" ? new Date() : null,
            }
        });
        return NextResponse.json(post);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
