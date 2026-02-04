import { posts } from "@/content/posts";
import Container from "../shared/Container";
import SectionHeading from "../shared/SectionHeading";
import Card from "../shared/Card";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { ArrowRight } from "lucide-react";

export default function NewsBlock() {
    const featured = posts[0];
    const recent = posts.slice(1, 4);

    return (
        <section className="py-16 bg-white">
            <Container>
                <SectionHeading
                    title="Tin tức mới nhất"
                    subtitle="Cập nhật thông tin hữu ích về sản phẩm và dịch vụ"
                    className="mb-12"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Featured Post - Left */}
                    <Link href={`${routes.news}/${featured.slug}`}>
                        <Card hover className="h-full overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                                Featured Image
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-500 mb-2">{featured.date}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                                    {featured.title}
                                </h3>
                                <p className="text-gray-600 line-clamp-3">{featured.excerpt}</p>
                            </div>
                        </Card>
                    </Link>

                    {/* Recent Posts - Right */}
                    <div className="space-y-4">
                        {recent.map((post) => (
                            <Link
                                key={post.id}
                                href={`${routes.news}/${post.slug}`}
                                className="block"
                            >
                                <Card hover className="p-4">
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md"></div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500 mb-1">{post.date}</p>
                                            <h4 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* View All Link */}
                <div className="mt-8 text-center">
                    <Link
                        href={routes.news}
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                        Xem tất cả tin tức
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </Container>
        </section>
    );
}
