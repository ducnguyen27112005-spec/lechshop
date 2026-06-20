"use client";

import { routes } from "@/lib/routes";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { GraduationCap, Sparkles, ShoppingBag } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { useEffect, useState } from "react";
import { getProductsConfig, fetchProductsConfig, ProductConfig } from "@/lib/product-config";
import Image from "next/image";

export default function BlogSidebar() {
    const [latestProducts, setLatestProducts] = useState<ProductConfig[]>([]);

    useEffect(() => {
        fetchProductsConfig().then(() => {
            const config = getProductsConfig();
            setLatestProducts(config.products.slice(0, 5));
        });
    }, []);

    return (
        <div className="space-y-8 sticky top-24">
            {/* Student Offer Promo */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-4">
                        <Sparkles className="h-3 w-3 text-yellow-300" />
                        ƯU ĐÃI ĐỘC QUYỀN
                    </div>
                    <h3 className="text-xl font-black mb-2 leading-tight">Gói Sinh Viên<br />Giảm Tới 20%</h3>
                    <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                        Xác thực email SV để nhận ngay mã giảm giá cho mọi tài khoản Premium.
                    </p>
                    <Link
                        href={routes.studentDiscount}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <GraduationCap className="h-5 w-5" />
                        Nhận ưu đãi ngay
                    </Link>
                </div>
            </div>
            {/* Categories Widget */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 relative pl-4">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-full"></span>
                        Danh mục sản phẩm
                    </h3>
                </div>
                <div className="p-2">
                    <nav className="flex flex-col">
                        {CATEGORIES.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/danh-muc/${category.slug}`}
                                className="group flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-gray-600 font-medium group-hover:text-blue-600 transition-colors">
                                    {category.title}
                                </span>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Latest Products Widget */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 relative pl-4">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-full"></span>
                        Sản phẩm bán chạy
                    </h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {latestProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/san-pham/${product.slug}`}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                        >
                            <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                {product.image && (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h4>
                                <div className="text-blue-600 font-bold text-sm">
                                    {product.plans?.[0]?.price
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.plans[0].price)
                                        : 'Liên hệ'}
                                </div>
                            </div>
                        </Link>
                    ))}
                    {latestProducts.length === 0 && (
                        <div className="p-6 text-center text-gray-400 text-sm">
                            Đang cập nhật...
                        </div>
                    )}
                </div>
            </div>

            {/* Support Widget */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                <h3 className="font-bold text-lg mb-2">Hỗ trợ trực tuyến</h3>
                <p className="text-blue-100 text-sm mb-4">
                    Liên hệ ngay với chúng tôi nếu bạn cần hỗ trợ hoặc tư vấn về dịch vụ.
                </p>
                <Link
                    href={routes.contact}
                    className="block w-full py-2.5 bg-white text-blue-600 font-bold text-center rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                >
                    Liên hệ ngay
                </Link>
            </div>
        </div>
    );
}
