import { notFound } from "next/navigation";
import { posts } from "@/content/posts";
import Container from "@/components/shared/Container";
import ButtonLink from "@/components/shared/ButtonLink";
import { routes } from "@/lib/routes";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default function NewsDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="py-16">
            <Container>
                {/* Back Button */}
                <ButtonLink
                    href={routes.news}
                    variant="secondary"
                    className="mb-8 inline-flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại
                </ButtonLink>

                {/* Article */}
                <article className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{post.author}</span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-8 flex items-center justify-center text-white text-2xl font-bold">
                        {post.title}
                    </div>

                    {/* Excerpt */}
                    <div className="text-xl text-gray-600 mb-8 font-medium">
                        {post.excerpt}
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                            {post.content}
                        </div>
                    </div>

                    {/* Tags/Categories would go here */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                Hướng dẫn
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                Tin tức
                            </span>
                        </div>
                    </div>
                </article>

                {/* Related Posts */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Bài viết liên quan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {posts
                            .filter((p) => p.id !== post.id)
                            .slice(0, 3)
                            .map((relatedPost) => (
                                <Link
                                    key={relatedPost.id}
                                    href={`${routes.news}/${relatedPost.slug}`}
                                    className="group"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-md mb-3"></div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {relatedPost.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{relatedPost.date}</p>
                                </Link>
                            ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
