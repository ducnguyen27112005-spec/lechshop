"use client";

import { useEffect, useState } from "react";
import { getProductBySlug, fetchProductsConfig, fetchPriceMultipliers } from "@/lib/product-config";

interface DynamicPriceProps {
    slug: string;
    fallback: string;
    className?: string;
    prefix?: string;
}

export default function DynamicPrice({
    slug,
    fallback,
    className = "",
    prefix = "",
}: DynamicPriceProps) {
    const [priceDisplay, setPriceDisplay] = useState(fallback);

    useEffect(() => {
        const loadPrice = async () => {
            // 1. Try Thatim API price first (already has multiplier applied)
            try {
                const { fetchThatimProducts } = await import("@/lib/api/thatim");
                const apiProducts = await fetchThatimProducts();
                if (apiProducts && apiProducts.length > 0) {
                    const apiProduct = apiProducts.find(p => p.slug === slug);
                    if (apiProduct && apiProduct.time_data && apiProduct.time_data.length > 0) {
                        const validTimeData = apiProduct.time_data.filter((td) => td.is_active !== false);
                        if (validTimeData.length > 0) {
                            const lowest = validTimeData.reduce(
                                (min, p) => (p.price < min.price ? p : min),
                                validTimeData[0]
                            );
                            setPriceDisplay(lowest.price.toLocaleString("vi-VN") + "đ");
                            return;
                        }
                    }
                }
            } catch {
                // Ignore Thatim API error, fall through to local
            }

            // 2. Fallback: local product config with multipliers applied
            try {
                await Promise.all([fetchProductsConfig(), fetchPriceMultipliers()]);
                const localProduct = getProductBySlug(slug, true);
                if (localProduct && localProduct.plans.length > 0) {
                    const lowestPrice = Math.min(...localProduct.plans.map(p => p.price));
                    if (lowestPrice > 0) {
                        setPriceDisplay(lowestPrice.toLocaleString("vi-VN") + "đ");
                    }
                }
            } catch {
                // Keep original fallback
            }
        };
        loadPrice();
    }, [slug]);

    return (
        <span className={className}>
            {prefix}{priceDisplay}
        </span>
    );
}
