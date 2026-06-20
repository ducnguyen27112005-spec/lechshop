"use client";

import { useEffect, useState } from "react";
import { getProductBySlug, fetchProductsConfig } from "@/lib/product-config";

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
        fetchProductsConfig().then(() => {
            const config = getProductBySlug(slug);
            if (config && config.plans && config.plans.length > 0) {
                const validPlans = config.plans.filter(p => p.inStock);
                const plansToCheck = validPlans.length > 0 ? validPlans : config.plans;

                if (plansToCheck.length > 0) {
                    const minPrice = Math.min(...plansToCheck.map((p) => p.price));
                    if (minPrice !== Infinity) {
                        const formatted = minPrice.toLocaleString("vi-VN") + "đ";
                        setPriceDisplay(formatted);
                    }
                }
            }
        });
    }, [slug]);

    return (
        <span className={className}>
            {prefix}{priceDisplay}
        </span>
    );
}
