import { useState, useEffect } from "react";
import { categoryMap } from "@/lib/categories";
import { products, premiumProducts, socialServices } from "@/content/products";
import { services as externalServices } from "@/data/services";

export interface MenuProduct {
    slug: string;
    name: string;
}

export function useNavigationProducts() {
    const [categorizedProducts, setCategorizedProducts] = useState<Record<string, MenuProduct[]>>({});

    useEffect(() => {
        const load = async () => {
            const result: Record<string, MenuProduct[]> = {};

            // Helper to format names
            const formatProductName = (slug: string) => {
                return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            };

            // 1. Initialize result with empty arrays for all predefined categories
            for (const catSlug of Object.keys(categoryMap)) {
                if (catSlug === "dich-vu-ban-chay") continue;
                result[catSlug] = [];
            }

            // 2. Pre-fill with items explicitly defined in categoryMap.productIds
            for (const [catSlug, catData] of Object.entries(categoryMap)) {
                if (catSlug === "dich-vu-ban-chay") continue;
                
                catData.productIds.forEach(id => {
                    let displayName = formatProductName(id);
                    
                    // Try to find name from local products.ts
                    const localProduct = products.find(p => p.slug === id);
                    if (localProduct) displayName = localProduct.name;
                    
                    const localPremium = premiumProducts.find(p => p.slug === id);
                    if (localPremium) displayName = localPremium.title;
                    
                    // Try to find name from socialServices or externalServices
                    const localSocial = socialServices.find(s => s.id === id);
                    if (localSocial) displayName = localSocial.title;
                    
                    const external = externalServices.find(s => s.slug === id);
                    if (external) displayName = external.title;

                    if (!result[catSlug]) result[catSlug] = [];
                    if (!result[catSlug].find(x => x.slug === id)) {
                        result[catSlug].push({ slug: id, name: displayName });
                    }
                });
            }

            // 3. Map API products dynamically if they are fetched
            try {
                const { fetchThatimProducts, mapThatimToCompactProducts } = await import("@/lib/api/thatim");
                const apiData = await fetchThatimProducts();
                if (apiData && apiData.length > 0) {
                    const mappedProducts = mapThatimToCompactProducts(apiData);
                    mappedProducts.forEach(p => {
                        let foundCategory = "khac";
                        for (const [catSlug, catData] of Object.entries(categoryMap)) {
                            if (catData.productIds.includes(p.slug)) {
                                foundCategory = catSlug;
                                break;
                            }
                        }
                        
                        if (!result[foundCategory]) result[foundCategory] = [];
                        
                        const existing = result[foundCategory].find(x => x.slug === p.slug);
                        if (!existing) {
                            result[foundCategory].push({ slug: p.slug, name: p.title });
                        }
                    });
                }
            } catch (err) {
                console.error("Error loading API products for navigation", err);
            }

            setCategorizedProducts(result);
        };
        load();
    }, []);

    return categorizedProducts;
}
