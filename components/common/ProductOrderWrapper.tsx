"use client";

import { useEffect, useState } from "react";
import { getPlansForProductConfig, PlanConfig, fetchProductsConfig, fetchPriceMultipliers } from "@/lib/product-config";
import { Plan, getPlansForProduct } from "@/content/productPlans";
import ProductOrderSection from "./ProductOrderSection";

interface Props {
    productName: string;
    productSlug: string;
    serviceType: "premium" | "social";
    imageUrl?: string;
    apiPlans?: {
        id: string;
        label: string;
        price: number;
        originalPrice?: number;
    }[];
}

export default function ProductOrderWrapper({
    productName,
    productSlug,
    serviceType,
    imageUrl,
    apiPlans,
}: Props) {
    const [plans, setPlans] = useState<(Plan & { inStock?: boolean })[]>([]);

    useEffect(() => {
        // Fetch from server first, then load plans
        Promise.all([fetchProductsConfig(), fetchPriceMultipliers()]).then(() => {
            if (apiPlans && apiPlans.length > 0) {
                setPlans(apiPlans.map(p => ({
                    ...p,
                    durationMonths: 1, // Giá trị mặc định
                    inStock: true
                })));
            } else {
                const configPlans = getPlansForProductConfig(productSlug, true);
                if (configPlans.length > 0) {
                    setPlans(configPlans);
                } else {
                    setPlans(getPlansForProduct(productSlug, 0));
                }
            }
        });

        const handleUpdate = () => {
            if (apiPlans && apiPlans.length > 0) {
                // Keep API plans
                return;
            }
            const updated = getPlansForProductConfig(productSlug, true);
            if (updated.length > 0) {
                setPlans(updated);
            }
        };
        window.addEventListener("products-config-updated", handleUpdate);
        return () => window.removeEventListener("products-config-updated", handleUpdate);
    }, [productSlug]);

    if (plans.length === 0) return null;

    return (
        <ProductOrderSection
            productName={productName}
            productSlug={productSlug}
            serviceType={serviceType}
            plans={plans}
            imageUrl={imageUrl}
        />
    );
}
