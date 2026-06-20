"use client";

import { useState, useEffect } from "react";
import { premiumProducts, CompactProduct } from "@/content/products";
import { getProductsConfig } from "@/lib/product-config";
import { categoryMap } from "@/lib/categories";
import Container from "@/components/shared/Container";
import { ShoppingCart, Zap, HeadphonesIcon, Shield, Flame, BadgeCheck } from "lucide-react";
import Link from "next/link";
import DynamicPrice from "@/components/common/DynamicPrice";
import { getDeterministicSoldCount } from "@/lib/utils";

function getHomepageProducts(): CompactProduct[] {
    const config = getProductsConfig();
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

function getDiscountPercent(original?: string, current?: string): number | null {
    if (!original || !current) return null;
    const origNum = parseInt(original.replace(/\D/g, ""));
    const curNum = parseInt(current.replace(/\D/g, ""));
    if (!origNum || !curNum || origNum <= curNum) return null;
    return Math.round(((origNum - curNum) / origNum) * 100);
}

export default function PremiumAccountsPage() {
    const [displayProducts, setDisplayProducts] = useState<CompactProduct[]>([]);

    useEffect(() => {
        const filterKeywords = ["chatgpt", "gemini", "youtube", "canva", "capcut", "netflix", "gg", "google", "antigravity"];
        const filterProducts = (products: CompactProduct[]) => {
            return products.filter(p => {
                const t = p.title.toLowerCase();
                return filterKeywords.some(kw => t.includes(kw));
            });
        };

        setDisplayProducts([]);

        let apiProductsCache: CompactProduct[] = [];

        const updateDisplay = () => {
            if (apiProductsCache.length > 0) {
                setDisplayProducts(apiProductsCache);
            } else {
                setDisplayProducts([]);
            }
        };

        const loadProducts = async () => {
            try {
                const { fetchThatimProducts, mapThatimToCompactProducts } = await import("@/lib/api/thatim");
                const apiProducts = await fetchThatimProducts();
                
                if (apiProducts && apiProducts.length > 0) {
                    const mappedProducts = mapThatimToCompactProducts(apiProducts);
                    apiProductsCache = filterProducts(mappedProducts);
                    updateDisplay();
                }
            } catch (err) {
                console.error("Failed to load products from API:", err);
            }
        };

        loadProducts();

        const handleUpdate = () => updateDisplay();
        window.addEventListener("products-config-updated", handleUpdate);
        return () => {
            window.removeEventListener("products-config-updated", handleUpdate);
        };
    }, []);

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
        <div className="min-h-screen bg-gray-50 py-12">
            <Container>
                {/* JSON-LD Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(productSchemaList),
                    }}
                />

                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Tài Khoản <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Premium Hot</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Cung cấp đa dạng các loại tài khoản giá rẻ, uy tín chất lượng, kích hoạt siêu tốc 24/7. Hỗ trợ bảo hành 1 đổi 1 suốt thời gian sử dụng.
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {displayProducts.map((product) => {
                        const BadgeIcon = product.badge ? badgeIcons[product.badge] || BadgeCheck : null;
                        const BenefitIcon = product.benefit ? benefitIcons[product.benefit] || Zap : null;
                        const discount = getDiscountPercent(product.originalPrice, product.startingPrice);

                        return (
                            <Link
                                href={`/san-pham/${product.slug}`}
                                key={product.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 relative block hover:-translate-y-1"
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
                                    <div className="h-[140px] sm:h-[200px] relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                                        <img
                                            src={product.image}
                                            alt={`${product.title} – Giá tốt nhất tại LechShop`}
                                            title={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                            loading="lazy"
                                            itemProp="image"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 sm:p-5 flex flex-col flex-1">
                                        {product.category && (
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 truncate font-medium">
                                                {product.category}
                                            </p>
                                        )}

                                        <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 line-clamp-2 leading-snug" itemProp="name">
                                            {product.title}
                                        </h2>

                                        {/* Benefit Tag */}
                                        {product.benefit && (
                                            <div className="flex items-center gap-1.5 mb-3">
                                                {BenefitIcon && <BenefitIcon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                                                <span className="text-xs text-emerald-600 font-semibold truncate">
                                                    {product.benefit}
                                                </span>
                                            </div>
                                        )}

                                        {/* Price Area */}
                                        <div className="mt-auto" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1">
                                                <p className="text-sm sm:text-xl font-extrabold text-red-600 leading-none" itemProp="price">
                                                    <DynamicPrice
                                                        slug={product.slug}
                                                        fallback={product.startingPrice}
                                                    />
                                                </p>
                                                {product.originalPrice && (
                                                    <p className="text-[10px] sm:text-xs text-gray-400 line-through">
                                                        {product.originalPrice}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-[10px] sm:text-xs text-gray-400 mb-3 sm:mb-4 font-medium">
                                                {product.soldCount || "500+"} đã bán
                                            </p>
                                            <meta itemProp="priceCurrency" content="VND" />
                                            <link itemProp="availability" href="https://schema.org/InStock" />
                                        </div>

                                        {/* Full-width CTA Button */}
                                        <div
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 text-white rounded-lg py-2.5 sm:py-3 shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                            aria-label={`Mua ${product.title}`}
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            <span className="text-xs sm:text-sm font-bold">Mua ngay</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                </div>
            </Container>
        </div>
    );
}
