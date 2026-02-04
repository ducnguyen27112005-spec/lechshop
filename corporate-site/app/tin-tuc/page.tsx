import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/shared/Card";
import { posts } from "@/content/posts";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function NewsPage() {
    return (
        <div className="py-16">
            <Container>
                <SectionHeading
                    title="Tin tức & Bài viết"
                    subtitle="Cập nhật thông tin mới nhất về sản phẩm và dịch vụ"
                    centered
                    className="mb-12"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.id} href={`${routes.news}/${post.slug}`}>
                            <Card hover className="h-full overflow-hidden">
                                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {post.title.substring(0, 20)}...
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                                    <div className="mt-4 text-blue-600 font-medium text-sm hover:text-blue-700">
                                        Đọc thêm →
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </Container>
        </div>
    );
}
