import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: {
                status: "PUBLISHED"
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                thumbnail: true,
                thumbnailUrl: true,
                status: true,
                viewCount: true,
                isFeatured: true,
                metaTitle: true,
                metaDescription: true,
                ogImage: true,
                createdAt: true,
                category: true,
                tags: true,
                relatedProducts: true
            }
        });
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
