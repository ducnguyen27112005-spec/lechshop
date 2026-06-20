"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, ShoppingCart } from "lucide-react";
import DynamicPrice from "@/components/common/DynamicPrice";
import { getProductsConfig, fetchProductsConfig, ProductConfig } from "@/lib/product-config";
import { routes } from "@/lib/routes";

interface Product {
    id: string;
    slug: string;
    name: string;
    image: string;
    isSocial?: boolean;
    ctaLink?: string;
    pricing: { price: string; duration: string }[];
    category?: string;
}

interface CategoryProductGridProps {
    products: any[];
    categorySlug: string;
}

export default function CategoryProductGrid({ products: initialProducts, categorySlug }: CategoryProductGridProps) {
    const [displayProducts, setDisplayProducts] = useState(initialProducts);

    useEffect(() => {
        fetchProductsConfig().then(() => {
            const localConfig = getProductsConfig();

            const localProducts = localConfig.products.map((p: ProductConfig) => ({
                id: p.id || p.slug,
                slug: p.slug,
                name: p.name,
                image: p.image,
                isSocial: false,
                pricing: [],
                category: p.category,
            }));

            const relevantLocalProducts = localProducts.filter(p => p.category === categorySlug);

            const initialSlugs = new Set(initialProducts.map(p => p.slug));
            const newProducts = relevantLocalProducts.filter(p => !initialSlugs.has(p.slug));

            if (newProducts.length > 0) {
                setDisplayProducts([...initialProducts, ...newProducts]);
            }
        });
    }, [categorySlug, initialProducts]);

    if (displayProducts.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Hiện chưa có sản phẩm nào trong danh mục này.</p>
                <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                    Quay lại trang chủ
                </Link>
            </div>
        );
    }

    // Helper for Discount/Price logic (copied from CategoryPage)
    // Actually, we use DynamicPrice now.
    // But we still need `discount` logic for the badge?
    // Hardcoded discount logic based on ID?
    // Start with strict logic from CategoryPage
    const getDiscount = (product: any) => {
        if (product.isSocial) return 0;
        let discount = 30;
        const pid = product.id.toString().toLowerCase();
        if (pid.includes("netflix")) discount = 85;
        if (pid.includes("youtube")) discount = 92;
        if (pid.includes("spotify")) discount = 54;
        if (pid.includes("chatgpt")) discount = 45;
        return discount;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((product: any) => {
                const discount = getDiscount(product);
                // Determine Link HREF
                const href = product.isSocial
                    ? (product.ctaLink || "/lien-he")
                    : `${routes.products}/${product.slug}`;

                if (product.isSocial) {
                    return (
                        <Link
                            href={href}
                            key={product.id || product.slug} // Use id as primary key for uniqueness
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100 relative block"
                        >
                            <article>
                                {/* Service Image */}
                                <div className="aspect-video relative overflow-hidden bg-gray-900">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.image || "/images/social-service.jpg"}
                                        alt={product.name}
                                        title={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                                        DỊCH VỤ MXH
                                    </p>

                                    <h3 className="font-bold text-gray-900 text-sm lg:text-base mb-2 line-clamp-1 leading-snug">
                                        {product.name}
                                    </h3>

                                    {/* Price / Contact */}
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-lg font-extrabold text-red-600 leading-none mb-0.5">
                                                Liên hệ
                                            </p>
                                            <p className="text-[10px] text-gray-500">
                                                300+ đã bán
                                            </p>
                                        </div>

                                        <div
                                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg px-3 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                                            aria-label={`Xem dịch vụ ${product.name}`}
                                        >
                                            <ShoppingCart className="h-3.5 w-3.5" />
                                            <span className="text-[11px] font-bold whitespace-nowrap">Mua ngay</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    )
                }

                return (
                    <Link
                        href={href}
                        key={product.id || product.slug} // Use id as primary key for uniqueness
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group relative"
                    >
                        {/* Header / Image Area matching the dark card style in mockup */}
                        <div className="aspect-[16/10] bg-[#1a1a1a] relative flex items-center justify-center p-6 overflow-hidden">
                            {/* Product Logo/Image */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Discount Badge - Only for products with price/non-social */}
                            {!product.isSocial && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full z-20 whitespace-nowrap">
                                    GIẢM ĐẾN {discount}%
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4 flex flex-col flex-grow">
                            {/* Title */}
                            <p className="text-gray-500 text-xs mb-1">
                                {product.isSocial ? "Dịch vụ" : "Sản phẩm"}
                            </p>
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-2 line-clamp-1">
                                {product.name}
                            </h3>

                            {/* Price Info */}
                            <div className="mt-auto">
                                {!product.isSocial ? (
                                    <>
                                        <p className="text-red-500 text-xs mb-0.5">
                                            Giảm đến {discount}%
                                        </p>
                                        <p className="text-gray-900 font-bold text-sm md:text-base">
                                            <DynamicPrice
                                                slug={product.slug}
                                                // If local product, pricing array might be empty initially, DynamicPrice fetches it.
                                                // Fallback?
                                                fallback={product.pricing && product.pricing[0] ? product.pricing[0].price : "Liên hệ"}
                                                prefix="Từ "
                                            />
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-900 font-bold text-sm md:text-base mt-4">
                                        Liên hệ báo giá
                                    </p>
                                )}

                                {/* Buy Button */}
                                <button className="w-full mt-3 py-2 px-4 rounded-full border border-blue-500 text-blue-500 font-medium text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                                    <Lock className="w-3 h-3 md:w-4 md:h-4" />
                                    {product.isSocial ? "Tư vấn ngay" : "Mua ngay"}
                                </button>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
