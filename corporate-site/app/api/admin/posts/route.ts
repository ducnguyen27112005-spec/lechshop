import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const posts = await prisma.post.findMany({
            include: {
                category: true,
                tags: true,
                relatedProducts: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();

        // SEO Auto-generation logic
        const metaTitle = body.metaTitle || body.title;
        let metaDescription = body.metaDescription || body.excerpt;
        if (!metaDescription && body.content) {
            // Strip some markdown basics and slice
            metaDescription = body.content
                .replace(/[#*`]/g, "")
                .slice(0, 160)
                .trim();
        }

        const post = await prisma.post.create({
            data: {
                title: body.title,
                slug: body.slug,
                excerpt: body.excerpt,
                content: body.content,
                thumbnail: body.thumbnail,
                thumbnailUrl: body.thumbnailUrl,
                status: body.status || "DRAFT",
                isFeatured: body.isFeatured || false,
                metaTitle: metaTitle,
                metaDescription: metaDescription,
                ogImage: body.ogImage || body.thumbnailUrl || body.thumbnail,
                categoryId: body.categoryId,
                tags: body.tags ? {
                    connect: body.tags.map((id: string) => ({ id }))
                } : undefined,
                relatedProducts: body.relatedProductIds ? {
                    connect: body.relatedProductIds.map((id: string) => ({ id }))
                } : undefined,
                publishedAt: body.status === "PUBLISHED" ? new Date() : null,
            }
        });
        return NextResponse.json(post);
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();

        // SEO Auto-generation logic for update if status is becoming PUBLISHED or if fields are empty
        let metaTitle = body.metaTitle;
        let metaDescription = body.metaDescription;

        if (body.status === "PUBLISHED") {
            if (!metaTitle) metaTitle = body.title;
            if (!metaDescription) {
                metaDescription = body.excerpt;
                if (!metaDescription && body.content) {
                    metaDescription = body.content
                        .replace(/[#*`]/g, "")
                        .slice(0, 160)
                        .trim();
                }
            }
        }

        const post = await prisma.post.update({
            where: { id: body.id },
            data: {
                title: body.title,
                slug: body.slug,
                excerpt: body.excerpt,
                content: body.content,
                thumbnail: body.thumbnail,
                thumbnailUrl: body.thumbnailUrl,
                status: body.status,
                isFeatured: body.isFeatured,
                metaTitle: metaTitle,
                metaDescription: metaDescription,
                ogImage: body.ogImage || body.thumbnailUrl || body.thumbnail,
                categoryId: body.categoryId,
                tags: body.tags ? {
                    set: body.tags.map((id: string) => ({ id }))
                } : undefined,
                relatedProducts: body.relatedProductIds ? {
                    set: body.relatedProductIds.map((id: string) => ({ id }))
                } : undefined,
                publishedAt: (body.status === "PUBLISHED") ? new Date() : undefined,
            }
        });
        return NextResponse.json(post);
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return new NextResponse("Missing ID", { status: 400 });

        await prisma.post.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting post:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
