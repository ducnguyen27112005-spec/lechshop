"use client";

import { useEffect, useState } from "react";
import { getProductBySlug, fetchProductsConfig } from "@/lib/product-config";

interface Props {
    productSlug: string;
    productName: string;
    fallbackContent?: string;
}

export default function ProductArticleSection({
    productSlug,
    productName,
    fallbackContent,
}: Props) {
    const [content, setContent] = useState<string>(fallbackContent || "");

    useEffect(() => {
        fetchProductsConfig().then(() => {
            const config = getProductBySlug(productSlug);
            if (config?.productArticle) setContent(config.productArticle);
        });

        const handleUpdate = () => {
            const updated = getProductBySlug(productSlug);
            if (updated?.productArticle) setContent(updated.productArticle);
        };
        window.addEventListener("products-config-updated", handleUpdate);
        return () => window.removeEventListener("products-config-updated", handleUpdate);
    }, [productSlug]);

    if (!content) return null;

    return (
        <div className="bg-white rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-100 prose prose-blue max-w-none">
            <style jsx global>{`
                .prose h2 { font-size: 1.5rem; font-weight: 800; margin-top: 2em; margin-bottom: 1em; color: #111827; }
                .prose h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.75em; color: #374151; }
                .prose p { margin-bottom: 1.25em; line-height: 1.75; color: #4b5563; }
                .prose ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.25em; }
                .prose li { margin-bottom: 0.5em; }
                .prose img { border-radius: 0.75rem; margin-top: 1.5em; margin-bottom: 1.5em; width: 100%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                .prose strong { color: #111827; font-weight: 700; }
                .prose a { color: #2563eb; text-decoration: none; font-weight: 500; }
                .prose a:hover { text-decoration: underline; }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}
