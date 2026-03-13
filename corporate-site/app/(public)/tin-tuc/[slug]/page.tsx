import { Metadata } from "next";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import PostDetailContent from "@/components/blog/PostDetailContent";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
        include: { category: true }
    });

    if (!post) return { title: "Không tìm thấy bài viết" };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lechshop.vn";
    const canonical = `${baseUrl}/tin-tuc/${post.slug}`;
    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || "";
    const ogImage = post.ogImage || post.thumbnailUrl || post.thumbnail || "";

    return {
        title: `${title} | LechShop Blog`,
        description: description,
        alternates: {
            canonical: canonical,
        },
        openGraph: {
            title: title,
            description: description,
            url: canonical,
            siteName: "LechShop",
            images: ogImage ? [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ] : [],
            locale: "vi_VN",
            type: "article",
            publishedTime: post.createdAt.toISOString(),
            authors: ["Admin"],
            section: post.category?.name || "Tin tức",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: ogImage ? [ogImage] : [],
        },
    };
}

export default async function NewsDetailPage(props: PageProps) {
    const params = await props.params;
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
        include: {
            category: true,
            tags: true,
            relatedProducts: true
        }
    });

    if (!post) {
        notFound();
    }

    // Convert to plain object for client component
    const plainPost = JSON.parse(JSON.stringify(post));

    const relatedPosts = await prisma.post.findMany({
        where: {
            id: { not: post.id },
            status: "PUBLISHED"
        },
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
            category: true,
            tags: true,
        }
    });

    const plainRelatedPosts = JSON.parse(JSON.stringify(relatedPosts));

    return (
        <PostDetailContent post={plainPost} relatedPosts={plainRelatedPosts} />
    );
}
