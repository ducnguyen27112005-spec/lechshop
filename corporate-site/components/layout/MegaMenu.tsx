"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Bot, Gamepad2, Palette, ThumbsUp, Briefcase, GraduationCap, TrendingUp, Shield } from "lucide-react";
import { getProductsConfig, fetchProductsConfig, ProductConfig } from "@/lib/product-config";
import { categoryMap } from "@/lib/categories";
import { services as externalServices } from "@/data/services";
// Category display config with icons & colors
const CATEGORY_DISPLAY: Record<string, {
    title: string;
    icon: React.ElementType;
    hoverBg: string;
    hoverBorder: string;
    hoverText: string;
    iconBg: string;
    iconText: string;
    iconHoverBg: string;
    linkHoverColor: string;
}> = {
    "cong-cu-ai": {
        title: "Tài khoản AI",
        icon: Bot,
        hoverBg: "hover:bg-red-50",
        hoverBorder: "hover:border-red-100",
        hoverText: "group-hover:text-red-700",
        iconBg: "bg-red-100",
        iconText: "text-red-600",
        iconHoverBg: "group-hover:bg-red-600",
        linkHoverColor: "hover:text-red-600",
    },
    "giai-tri": {
        title: "Tài khoản Giải trí",
        icon: Gamepad2,
        hoverBg: "hover:bg-orange-50",
        hoverBorder: "hover:border-orange-100",
        hoverText: "group-hover:text-orange-700",
        iconBg: "bg-orange-100",
        iconText: "text-orange-600",
        iconHoverBg: "group-hover:bg-orange-600",
        linkHoverColor: "hover:text-orange-600",
    },
    "sang-tao-noi-dung": {
        title: "Thiết Kế & Đồ Họa",
        icon: Palette,
        hoverBg: "hover:bg-blue-50",
        hoverBorder: "hover:border-blue-100",
        hoverText: "group-hover:text-blue-700",
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        iconHoverBg: "group-hover:bg-blue-600",
        linkHoverColor: "hover:text-blue-600",
    },
    "lam-viec-van-phong": {
        title: "Làm việc & Văn phòng",
        icon: Briefcase,
        hoverBg: "hover:bg-emerald-50",
        hoverBorder: "hover:border-emerald-100",
        hoverText: "group-hover:text-emerald-700",
        iconBg: "bg-emerald-100",
        iconText: "text-emerald-600",
        iconHoverBg: "group-hover:bg-emerald-600",
        linkHoverColor: "hover:text-emerald-600",
    },
    "phan-mem": {
        title: "Phần mềm & Bảo mật",
        icon: Shield,
        hoverBg: "hover:bg-purple-50",
        hoverBorder: "hover:border-purple-100",
        hoverText: "group-hover:text-purple-700",
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        iconHoverBg: "group-hover:bg-purple-600",
        linkHoverColor: "hover:text-purple-600",
    },
    "hoc-tap-nghien-cuu": {
        title: "Học tập & Nghiên cứu",
        icon: GraduationCap,
        hoverBg: "hover:bg-amber-50",
        hoverBorder: "hover:border-amber-100",
        hoverText: "group-hover:text-amber-700",
        iconBg: "bg-amber-100",
        iconText: "text-amber-600",
        iconHoverBg: "group-hover:bg-amber-600",
        linkHoverColor: "hover:text-amber-600",
    },
    "kinh-doanh-marketing": {
        title: "Kinh doanh & Marketing",
        icon: TrendingUp,
        hoverBg: "hover:bg-pink-50",
        hoverBorder: "hover:border-pink-100",
        hoverText: "group-hover:text-pink-700",
        iconBg: "bg-pink-100",
        iconText: "text-pink-600",
        iconHoverBg: "group-hover:bg-pink-600",
        linkHoverColor: "hover:text-pink-600",
    },
};

interface MenuProduct {
    slug: string;
    name: string;
}

export default function MegaMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [categorizedProducts, setCategorizedProducts] = useState<Record<string, MenuProduct[]>>({});
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const load = () => {
            const config = getProductsConfig();
            const adminProducts = config.products || [];

            const result: Record<string, MenuProduct[]> = {};

            const adminBySlug = new Map<string, ProductConfig>();
            adminProducts.forEach(p => adminBySlug.set(p.slug, p));

            for (const [catSlug, catData] of Object.entries(categoryMap)) {
                if (catSlug === "dich-vu-ban-chay") continue;
                if (!result[catSlug]) result[catSlug] = [];

                const seen = new Set<string>();
                for (const productId of catData.productIds) {
                    seen.add(productId);
                    const adminProduct = adminBySlug.get(productId);

                    let displayName = formatProductName(productId);
                    if (adminProduct) {
                        displayName = adminProduct.name;
                    } else if (catSlug === "mxh") {
                        // Attempt to find actual service name from data/services.ts based on slug parts
                        // For example: "tiktok-followers" -> "tiktok"
                        const baseServiceSlug = productId.split('-')[0];
                        const matchedExtService = externalServices.find(s => s.slug === baseServiceSlug || s.slug === productId);
                        if (matchedExtService) {
                            // If base matched, check if we need to refine. For simplicity, just use the `title`.
                            // However, we want "Tăng follow TikTok" not just "Dịch vụ TikTok".
                            // It's mostly correct, e.g. instagram -> "Tăng Follow Instagram"
                            displayName = matchedExtService.title;
                        }
                    }

                    result[catSlug].push({ slug: productId, name: displayName });
                }

                adminProducts.forEach(p => {
                    if (p.category === catSlug && !seen.has(p.slug)) {
                        result[catSlug].push({ slug: p.slug, name: p.name });
                    }
                });
            }

            adminProducts.forEach(p => {
                if (p.category && !result[p.category]) {
                    result[p.category] = [];
                }
                if (p.category && !categoryMap[p.category]) {
                    const existing = result[p.category] || [];
                    if (!existing.find(x => x.slug === p.slug)) {
                        existing.push({ slug: p.slug, name: p.name });
                        result[p.category] = existing;
                    }
                }
            });

            setCategorizedProducts(result);
        };
        fetchProductsConfig().then(load);
        window.addEventListener("products-config-updated", load);
        return () => {
            window.removeEventListener("products-config-updated", load);
        };
    }, []);

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    // Get categories with display config and products
    const activeCategories = Object.entries(CATEGORY_DISPLAY).filter(
        ([slug]) => categorizedProducts[slug] && categorizedProducts[slug].length > 0
    );

    return (
        <div
            className="flex items-center gap-1 cursor-pointer hover:text-gray-200 h-full relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span className="flex items-center gap-1 h-full font-bold uppercase text-sm">Danh mục sản phẩm</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />

            {isOpen && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[92vw] max-w-[1100px] bg-white text-gray-800 shadow-xl rounded-xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {activeCategories.map(([slug, display]) => {
                            const Icon = display.icon;
                            const products = categorizedProducts[slug] || [];
                            return (
                                <div key={slug} className={`group p-4 rounded-xl ${display.hoverBg} transition-colors border border-transparent ${display.hoverBorder}`}>
                                    <Link href={`/danh-muc/${slug}`} className="flex items-center gap-3 mb-3">
                                        <div className={`p-2 ${display.iconBg} ${display.iconText} rounded-lg ${display.iconHoverBg} group-hover:text-white transition-colors`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className={`font-bold text-gray-900 ${display.hoverText} transition-colors`}>
                                            {display.title}
                                        </h3>
                                    </Link>
                                    <ul className="space-y-2 ml-14">
                                        {products.map((product) => (
                                            <li key={product.slug}>
                                                <Link
                                                    href={`/san-pham/${product.slug}`}
                                                    className={`text-sm text-gray-600 ${display.linkHoverColor} hover:font-medium transition-colors block`}
                                                >
                                                    {product.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* Social services section */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="group p-4 rounded-xl hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100">
                            <Link href="/danh-muc/mxh" className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <ThumbsUp className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                    Dịch vụ MXH
                                </h3>
                            </Link>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-14">
                                {categorizedProducts["mxh"]?.map((product) => (
                                    <Link
                                        key={product.slug}
                                        href={`/san-pham/${product.slug}`}
                                        className="text-sm text-gray-600 hover:text-indigo-600 hover:font-medium transition-colors block text-left"
                                    >
                                        {product.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper: convert slug to display name (fallback)
function formatProductName(slug: string): string {
    return slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
