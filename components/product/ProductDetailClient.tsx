"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, fetchProductsConfig } from "@/lib/product-config";
import ProductDetailView, { ProductData } from "./ProductDetailView";
import { Loader2 } from "lucide-react";

interface ProductDetailClientProps {
    slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        fetchProductsConfig().then(() => {
            const config = getProductBySlug(slug);

            if (config) {
                const mappedProduct: ProductData = {
                    name: config.name,
                    slug: config.slug,
                    image: config.image || "/images/placeholder.jpg",
                    description: config.description,
                    shortDesc: config.shortDesc,
                    features: ["Bảo hành 1 đổi 1", "Hỗ trợ 24/7"],
                    type: "premium",
                    category: config.category || "Sản phẩm",
                    seoTitle: config.seoTitle,
                    seoDescription: config.shortDesc,
                    pricing: config.plans.map(p => ({
                        duration: p.label,
                        price: new Intl.NumberFormat('vi-VN').format(p.price) + 'đ'
                    })),
                    badges: ["Mới"],
                    altText: config.name,
                };
                setProduct(mappedProduct);
            } else {
                setIsNotFound(true);
            }
            setLoading(false);
        });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isNotFound) {
        notFound();
        return null;
    }

    // Pass mapped product
    return product ? <ProductDetailView productData={product} /> : null;
}
