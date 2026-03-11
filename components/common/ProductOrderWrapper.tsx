"use client";

import { useEffect, useState } from "react";
import { getPlansForProductConfig, PlanConfig, fetchProductsConfig } from "@/lib/product-config";
import { Plan, getPlansForProduct } from "@/content/productPlans";
import ProductOrderSection from "./ProductOrderSection";

interface Props {
    productName: string;
    productSlug: string;
    serviceType: "premium" | "social";
    imageUrl?: string;
}

export default function ProductOrderWrapper({
    productName,
    productSlug,
    serviceType,
    imageUrl,
}: Props) {
    const [plans, setPlans] = useState<(Plan & { inStock?: boolean })[]>([]);

    useEffect(() => {
        // Fetch from server first, then load plans
        fetchProductsConfig().then(() => {
            const configPlans = getPlansForProductConfig(productSlug);
            if (configPlans.length > 0) {
                setPlans(configPlans);
            } else {
                setPlans(getPlansForProduct(productSlug, 0));
            }
        });

        const handleUpdate = () => {
            const updated = getPlansForProductConfig(productSlug);
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
