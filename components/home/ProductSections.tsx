"use client";

import { useState, useEffect } from "react";
import { premiumProducts, CompactProduct } from "@/content/products";
import { getProductsConfig, fetchProductsConfig, fetchPriceMultipliers } from "@/lib/product-config";
import { categoryMap } from "@/lib/categories";
import { services } from "@/data/services";
import Container from "../shared/Container";
import { ShoppingCart, Zap, HeadphonesIcon, Shield, Flame, BadgeCheck, Award } from "lucide-react";
import Link from "next/link";
import DynamicPrice from "../common/DynamicPrice";
import { getDeterministicSoldCount } from "@/lib/utils";

/** Convert admin ProductConfig[] → CompactProduct[] for homepage display */
function getHomepageProducts(): CompactProduct[] {
    const config = getProductsConfig(true);
    return config.products.map((p) => {
        const lowestPrice = p.plans.length > 0
            ? Math.min(...p.plans.map((pl) => pl.price))
            : 0;
        const formatted = lowestPrice > 0
            ? `${lowestPrice.toLocaleString("vi-VN")}đ`
            : "Liên hệ";
        return {
            id: p.id,
            slug: p.slug,
            title: `Tài khoản ${p.name}`,
            category: (p.category && categoryMap[p.category]?.title?.toUpperCase()) || p.category?.toUpperCase() || "",
            bullets: [p.shortDesc],
            startingPrice: formatted,
            originalPrice: p.originalPrice || undefined,
            soldCount: `${getDeterministicSoldCount(p.slug, p.category)}`,
            image: p.image,
        };
    });
}

/** Compute discount percentage */
function getDiscountPercent(original?: string, current?: string): number | null {
    if (!original || !current) return null;
    const origNum = parseInt(original.replace(/\D/g, ""));
    const curNum = parseInt(current.replace(/\D/g, ""));
    if (!origNum || !curNum || origNum <= curNum) return null;
    return Math.round(((origNum - curNum) / origNum) * 100);
}

export default function ProductSections() {
    const [displayProducts, setDisplayProducts] = useState<CompactProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([fetchProductsConfig(), fetchPriceMultipliers()]);

                const { fetchThatimProducts, mapThatimToCompactProducts } = await import("@/lib/api/thatim");
                const apiProducts = await fetchThatimProducts();
                
                const localProducts = getHomepageProducts();
                let apiProductsCache: CompactProduct[] = [];
                
                if (apiProducts && apiProducts.length > 0) {
                    apiProductsCache = mapThatimToCompactProducts(apiProducts);
                }

                if (apiProductsCache.length > 0) {
                    const apiSlugs = new Set(apiProductsCache.map(p => p.slug));
                    const uniqueLocalProducts = localProducts.filter(p => !apiSlugs.has(p.slug));
                    setDisplayProducts([...uniqueLocalProducts, ...apiProductsCache]);
                } else {
                    setDisplayProducts(localProducts);
                }
            } catch (err) {
                console.error("Lỗi khi gọi API Thatim:", err);
                setDisplayProducts(getHomepageProducts());
            } finally {
                setIsLoading(false);
            }
        };

        loadData();

        const handleUpdate = () => {
            // Re-fetch local products if config updates
            setDisplayProducts(prev => {
                const localProducts = getHomepageProducts();
                const apiSlugs = new Set(prev.filter(p => p.originalPrice === undefined).map(p => p.slug)); // Approximate way to keep api products
                const uniqueLocalProducts = localProducts.filter(p => !apiSlugs.has(p.slug));
                return [...uniqueLocalProducts, ...prev.filter(p => apiSlugs.has(p.slug))];
            });
        };
        window.addEventListener("products-config-updated", handleUpdate);
        return () => {
            window.removeEventListener("products-config-updated", handleUpdate);
        };
    }, []);

    // JSON-LD Product schema for SEO
    const productSchemaList = displayProducts.map((product) => ({
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        image: `https://lechshop.com${product.image}`,
        description: product.bullets.join(". "),
        brand: { "@type": "Brand", name: "LechShop" },
        offers: {
            "@type": "Offer",
            price: parseInt(product.startingPrice.replace(/\D/g, "")),
            priceCurrency: "VND",
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "LechShop" },
        },
    }));

    const badgeStyles: Record<string, string> = {
        "Bán chạy": "bg-gradient-to-r from-orange-500 to-red-500 text-white",
        "Chính hãng": "bg-blue-600 text-white",
        "Bảo hành": "bg-emerald-600 text-white",
    };

    const badgeIcons: Record<string, typeof Flame> = {
        "Bán chạy": Flame,
        "Chính hãng": BadgeCheck,
        "Bảo hành": Shield,
    };

    const benefitIcons: Record<string, typeof Zap> = {
        "Giao trong 5 phút": Zap,
        "Hỗ trợ 24/7": HeadphonesIcon,
        "Bảo hành 1 đổi 1": Shield,
    };

    return (
        <>
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchemaList),
                }}
            />

            <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
                <Container>
                    {/* ===== PREMIUM ACCOUNTS SECTION ===== */}
                    <div id="premium" className="mb-12 scroll-mt-32">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-purple-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                Tài khoản Premium
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 ml-[19px]">
                            Dịch vụ tài khoản cao cấp uy tín — Giao hàng tự động
                        </p>

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                            {isLoading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
                                        <div className="h-[120px] sm:h-[180px] bg-gray-200" />
                                        <div className="p-2.5 sm:p-4 flex flex-col flex-1 gap-2">
                                            <div className="h-3 w-1/3 bg-gray-200 rounded" />
                                            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                                            <div className="h-3 w-1/2 bg-gray-200 rounded mb-4" />
                                            <div className="mt-auto flex flex-col gap-2">
                                                <div className="h-5 w-1/3 bg-gray-200 rounded" />
                                                <div className="h-3 w-1/4 bg-gray-200 rounded" />
                                                <div className="h-10 w-full bg-gray-200 rounded mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                displayProducts.map((product) => {
                                    const BadgeIcon = product.badge ? badgeIcons[product.badge] || BadgeCheck : null;
                                    const BenefitIcon = product.benefit ? benefitIcons[product.benefit] || Zap : null;
                                    const discount = getDiscountPercent(product.originalPrice, product.startingPrice);

                                return (
                                    <Link
                                        href={`/san-pham/${product.slug}`}
                                        key={product.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 relative block hover:-translate-y-1"
                                    >
                                        <article itemScope itemType="https://schema.org/Product" className="flex flex-col h-full">
                                            {/* Badge */}
                                            {product.badge && (
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide shadow ${badgeStyles[product.badge] || "bg-gray-600 text-white"}`}>
                                                        {BadgeIcon && <BadgeIcon className="h-3 w-3" />}
                                                        {product.badge}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Discount Badge */}
                                            {discount && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-red-500 text-white shadow">
                                                        -{discount}%
                                                    </span>
                                                </div>
                                            )}

                                            {/* Product Image — fixed height */}
                                            <div className="h-[120px] sm:h-[180px] relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={product.image}
                                                    alt={`${product.title} – Giá tốt nhất tại LechShop`}
                                                    title={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                                    loading="lazy"
                                                    itemProp="image"
                                                />
                                                {/* Bottom gradient overlay */}
                                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                                            </div>

                                            {/* Content */}
                                            <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                                                {product.category && (
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 truncate font-medium">
                                                        {product.category}
                                                    </p>
                                                )}

                                                <h2 className="font-bold text-gray-900 text-xs sm:text-[15px] mb-2 sm:mb-3 line-clamp-2 leading-snug" itemProp="name">
                                                    {product.title}
                                                </h2>

                                                {/* Benefit Tag */}
                                                {product.benefit && (
                                                    <div className="flex items-center gap-1.5 mb-3">
                                                        {BenefitIcon && <BenefitIcon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                                                        <span className="text-[11px] text-emerald-600 font-semibold truncate">
                                                            {product.benefit}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Price Area */}
                                                <div className="mt-auto" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                                    <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1">
                                                        <p className="text-[13px] sm:text-xl font-extrabold text-red-600 leading-none" itemProp="price">
                                                            <DynamicPrice
                                                                slug={product.slug}
                                                                fallback={product.startingPrice}
                                                            />
                                                        </p>
                                                        {product.originalPrice && (
                                                            <p className="text-[9px] sm:text-xs text-gray-400 line-through">
                                                                {product.originalPrice}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 mb-3">
                                                        {product.soldCount || "500+"} đã bán
                                                    </p>
                                                    <meta itemProp="priceCurrency" content="VND" />
                                                    <link itemProp="availability" href="https://schema.org/InStock" />
                                                </div>

                                                {/* Full-width CTA Button */}
                                                <div
                                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 text-white rounded-lg py-2.5 shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                                    aria-label={`Mua ${product.title}`}
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    <span className="text-xs font-bold">Mua ngay</span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            }))}
                        </div>
                    </div>

                    {/* ===== SOCIAL SERVICES SECTION ===== */}
                    <div id="dich-vu" className="scroll-mt-32">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-orange-500 to-red-500" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                Dịch vụ mạng xã hội
                            </h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 ml-[19px]">
                            Tăng trưởng tự nhiên, an toàn — Bảo hành dài hạn
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                            {services.map((service) => (
                                <Link
                                    href={`/san-pham/${service.slug}`}
                                    key={service.slug}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 relative block hover:-translate-y-1"
                                >
                                    <article>
                                        {/* Service Image — fixed height */}
                                        <div className="h-[120px] sm:h-[180px] relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={service.image || "/images/social-service.jpg"}
                                                alt={`Dịch vụ ${service.title} uy tín – Tăng trưởng tự nhiên`}
                                                title={service.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                                loading="lazy"
                                            />
                                            {/* Bottom gradient overlay */}
                                            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-2.5 sm:p-4">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-medium">
                                                DỊCH VỤ MXH
                                            </p>

                                            <h3 className="font-bold text-gray-900 text-xs sm:text-[15px] mb-2 sm:mb-3 line-clamp-1 leading-snug">
                                                {service.title}
                                            </h3>

                                            {/* Price removed as per user request */}

                                            {/* Full-width CTA Button */}
                                            <div
                                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 text-white rounded-lg py-2.5 shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                                aria-label={`Xem dịch vụ ${service.title}`}
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                <span className="text-xs font-bold">Mua ngay</span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}
