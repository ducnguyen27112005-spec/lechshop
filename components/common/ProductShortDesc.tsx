"use client";

import { useEffect, useState } from "react";
import { getProductBySlug, fetchProductsConfig } from "@/lib/product-config";
import { cn } from "@/lib/utils";

interface ProductShortDescProps {
    slug: string;
    fallback: string;
    className?: string;
}

export default function ProductShortDesc({
    slug,
    fallback,
    className,
}: ProductShortDescProps) {
    const [content, setContent] = useState(fallback);

    useEffect(() => {
        fetchProductsConfig().then(() => {
            const config = getProductBySlug(slug);
            if (config?.shortDesc) {
                setContent(config.shortDesc);
            }
        });
    }, [slug]);

    return (
        <p className={cn("text-gray-700 text-base font-bold leading-relaxed mb-5", className)}>
            {content}
        </p>
    );
}
