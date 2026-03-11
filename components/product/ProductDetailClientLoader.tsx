"use client";

import { useEffect, useState } from "react";
import { getProductBySlug, fetchProductsConfig } from "@/lib/product-config";
import { categoryMap } from "@/lib/categories";
import ProductDetailView, { ProductData } from "./ProductDetailView";
import { notFound } from "next/navigation";
import Container from "@/components/shared/Container";

/**
 * Client-side loader for products saved in admin config.
 * Used when the server-side lookup fails (product not in hardcoded defaults).
 */
export default function ProductDetailClientLoader({ slug }: { slug: string }) {
    const [productData, setProductData] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);

    useEffect(() => {
        fetchProductsConfig().then(() => {
            const config = getProductBySlug(slug);
            if (!config) {
                setNotFoundState(true);
                setLoading(false);
                return;
            }

            const data: ProductData = {
                name: config.name,
                slug: config.slug,
                image: config.image || "/images/placeholder.jpg",
                description: config.description,
                shortDesc: config.shortDesc,
                features: ["Bảo hành 1 đổi 1", "Hỗ trợ 24/7"],
                type: "premium" as const,
                category: (config.category && categoryMap[config.category]?.title) || config.category || "Sản phẩm",
                seoTitle: config.seoTitle,
                seoDescription: config.shortDesc,
                pricing: config.plans.map((p) => ({
                    duration: p.label,
                    price: new Intl.NumberFormat("vi-VN").format(p.price) + "đ",
                })),
                badges: ["Mới"],
                altText: config.name,
                originalPrice: config.originalPrice || undefined,
            };

            setProductData(data);
            setLoading(false);
        });
    }, [slug]);

    if (loading) {
        return (
            <section className="py-16 bg-gray-50 min-h-screen">
                <Container>
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-500">Đang tải sản phẩm...</span>
                    </div>
                </Container>
            </section>
        );
    }

    if (notFoundState || !productData) {
        notFound();
    }

    return <ProductDetailView productData={productData} />;
}
