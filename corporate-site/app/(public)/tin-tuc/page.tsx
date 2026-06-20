"use client";

import { Suspense } from "react";
import Container from "@/components/shared/Container";
import Link from "next/link";
import { routes } from "@/lib/routes";
import BlogBanner from "@/components/blog/BlogBanner";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogImage from "@/components/blog/BlogImage";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { useSearchParams } from "next/navigation";
import { Eye, Calendar, Star, Tag as TagIcon, Hash, ArrowRight } from "lucide-react";

function NewsContent() {
    const allPosts = useBlogPosts();
    const searchParams = useSearchParams();

    const categoryFilter = searchParams.get("category");
    const tagFilter = searchParams.get("tag");

    // Filter published posts
    let filteredPosts = allPosts.filter(p => p.status === "PUBLISHED");

    // Apply category filter
    if (categoryFilter) {
        filteredPosts = filteredPosts.filter(p => p.category?.slug === categoryFilter);
    }

    // Apply tag filter
    if (tagFilter) {
        filteredPosts = filteredPosts.filter(p => p.tags?.some(t => t.slug === tagFilter));
    }

    // Identify featured posts
    const featuredPosts = filteredPosts.filter(p => p.isFeatured);

    // Final sorted list: Featured first, then by date (most recent)
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            <BlogBanner />

            <Container className="mt-12">
                {/* Featured Section if filtering is not active */}
                {(!categoryFilter && !tagFilter && featuredPosts.length > 0) && (
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                <Star className="h-6 w-6 fill-amber-500" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bài viết nổi bật</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {featuredPosts.slice(0, 2).map((post) => (
                                <Link key={post.id} href={`${routes.news}/${post.slug}`} className="group relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                                    <BlogImage
                                        src={post.thumbnailUrl || post.thumbnail || (post as any).image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {post.category?.name || "Tin tức"}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-white/80 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                                                <Eye className="h-3 w-3" />
                                                {post.viewCount || 0}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl md:text-3xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-white/70 text-sm line-clamp-2 mb-2 max-w-xl font-medium">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                        <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                        {categoryFilter ? `Danh mục: ${featuredPosts[0]?.category?.name || categoryFilter}` :
                            tagFilter ? `Tag: #${tagFilter}` : "Tất cả bài viết"}
                    </h3>
                    {(categoryFilter || tagFilter) && (
                        <Link href={routes.news} className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all">
                            Xóa bộ lọc
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        {sortedPosts.length === 0 ? (
                            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 font-bold text-lg italic">Hiện tại chưa có bài viết nào trong mục này...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {sortedPosts.map((post) => (
                                    <Link key={post.id} href={`${routes.news}/${post.slug}`} className="group block h-full">
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 flex flex-col relative">
                                            {post.isFeatured && (
                                                <div className="absolute top-4 right-4 z-10 bg-amber-400 text-white p-2 rounded-full shadow-lg">
                                                    <Star className="h-4 w-4 fill-white" />
                                                </div>
                                            )}
                                            <div className="aspect-[16/10] relative overflow-hidden">
                                                <BlogImage
                                                    src={post.thumbnailUrl || post.thumbnail || (post as any).image}
                                                    alt={post.title}
                                                    fill
                                                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-blue-600 shadow-sm uppercase tracking-widest border border-blue-100/50">
                                                    {post.category?.name || "Tin tức"}
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-3 font-black uppercase tracking-widest">
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.viewCount || 0}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        ĐỌC TIẾP <ArrowRight className="h-3 w-3" />
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {post.tags?.slice(0, 2).map((tag: any) => (
                                                            <span key={tag.id} className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase">
                                                                #{tag.slug}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 pl-0 lg:pl-8">
                        <BlogSidebar />
                    </div>
                </div>


            </Container >
        </div >
    );
}

export default function NewsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
            <NewsContent />
        </Suspense>
    );
}
