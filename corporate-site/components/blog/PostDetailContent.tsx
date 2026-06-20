"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, Hash, ShoppingCart, GraduationCap, ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";
import Container from "@/components/shared/Container";
import BlogSidebar from "@/components/blog/BlogSidebar";
import CommentSection from "@/components/blog/CommentSection";
import BlogImage from "@/components/blog/BlogImage";

export default function PostDetailContent({ post, relatedPosts }: { post: any; relatedPosts: any[] }) {
    const viewCounted = useRef(false);

    useEffect(() => {
        if (post && !viewCounted.current) {
            fetch("/api/blog/view", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: post.id })
            }).catch(err => console.error("Failed to increment view", err));
            viewCounted.current = true;
        }
    }, [post]);

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <Container>
                {/* Breadcrumb / Back */}
                <div className="mb-8">
                    <Link
                        href={routes.news}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại tin tức
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 overflow-hidden">
                            <article>
                                {/* Header */}
                                <header className="mb-8">
                                    <div className="flex flex-wrap items-center gap-4 mb-4">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {post.category?.name || "Tin tức"}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                                            <Eye className="h-4 w-4" />
                                            {post.viewCount || 0} lượt xem
                                        </span>
                                    </div>

                                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                        {post.title}
                                    </h1>

                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-8">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {(post.author || "A").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{post.author || "Admin"}</p>
                                            <p className="text-xs text-gray-500">Tác giả</p>
                                        </div>
                                    </div>
                                </header>

                                {/* Featured Image */}
                                <div className="relative aspect-video rounded-xl overflow-hidden mb-10 shadow-sm border border-gray-100">
                                    <BlogImage
                                        src={post.thumbnailUrl || post.thumbnail || post.image || ""}
                                        alt={post.title}
                                        fill
                                        className="w-full h-full"
                                    />
                                </div>

                                {/* Excerpt */}
                                <div className="text-lg text-gray-700 mb-8 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-4 pr-4 rounded-r-lg">
                                    {post.excerpt}
                                </div>

                                {/* Content */}
                                <div className="prose prose-lg max-w-none prose-img:rounded-xl prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:underline prose-p:text-gray-700 prose-li:text-gray-700">
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {post.content}
                                    </div>
                                </div>

                                {/* End of Post CTAs */}
                                <div className="mt-12 py-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href={post.relatedProducts?.[0] ? `/san-pham/${post.relatedProducts[0].slug}` : routes.products}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 group"
                                    >
                                        <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        Mua ngay sản phẩm này
                                    </Link>
                                    <Link
                                        href={routes.studentDiscount}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-900 font-bold border-2 border-gray-100 rounded-2xl hover:border-blue-600 hover:text-blue-600 transition-all group"
                                    >
                                        <GraduationCap className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        Nhận mã giảm giá sinh viên
                                    </Link>
                                </div>
                            </article>

                            {/* Related Products Block */}
                            {post.relatedProducts?.length > 0 && (
                                <div className="mt-12 pt-12 border-t border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                                        Sản phẩm được nhắc đến
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {post.relatedProducts.map((product: any) => (
                                            <Link
                                                key={product.id}
                                                href={`/san-pham/${product.slug}`}
                                                className="group p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center gap-4"
                                            >
                                                <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                                                    {product.thumbnail && (
                                                        <BlogImage
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-blue-600 font-bold text-sm mt-0.5">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {(post.tags && post.tags.length > 0) && (
                                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                                    {post.tags.map((tag: any) => (
                                        <Link
                                            key={tag.id}
                                            href={`${routes.news}?tag=${tag.slug}`}
                                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-1"
                                        >
                                            <Hash className="h-3 w-3" />
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                                    Bài viết liên quan
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link key={relatedPost.id} href={`${routes.news}/${relatedPost.slug}`} className="group block h-full">
                                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100 flex flex-col relative">
                                                <div className="aspect-[16/10] relative overflow-hidden">
                                                    <BlogImage
                                                        src={relatedPost.thumbnailUrl || relatedPost.thumbnail || relatedPost.image || ""}
                                                        alt={relatedPost.title}
                                                        fill
                                                        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-blue-600 shadow-sm uppercase tracking-widest border border-blue-100/50">
                                                        {relatedPost.category?.name || "Tin tức"}
                                                    </div>
                                                </div>
                                                <div className="p-6 flex flex-col flex-1">
                                                    <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-3 font-black uppercase tracking-widest">
                                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(relatedPost.createdAt).toLocaleDateString('vi-VN')}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {relatedPost.viewCount || 0}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                                        {relatedPost.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                                                        {relatedPost.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <div className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                                                            ĐỌC TIẾP <ArrowRight className="h-3 w-3" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comments */}
                        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                            <CommentSection postId={post.id} postTitle={post.title} postSlug={post.slug} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 pl-0 lg:pl-8">
                        <BlogSidebar />
                    </div>
                </div>
            </Container>
        </div>
    );
}
