"use client";

import { useEffect, useState } from "react";
import { getProductBySlug, fetchProductsConfig, fetchPriceMultipliers } from "@/lib/product-config";
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
        const loadData = async () => {
            let pData: ProductData | null = null;
            try {
                const { fetchThatimProducts } = await import("@/lib/api/thatim");
                const apiProducts = await fetchThatimProducts();
                
                let foundInApi = false;
                
                if (apiProducts && apiProducts.length > 0) {
                    const apiProduct = apiProducts.find((p) => p.slug === slug);
                    if (apiProduct) {
                        foundInApi = true;
                        let originalPrice: string | undefined = undefined;
                        let plans = [];
                        let apiPlans = [];
                        
                        if (apiProduct.time_data && apiProduct.time_data.length > 0) {
                            const validTimeData = apiProduct.time_data.filter((td) => td.is_active !== false);

                            const isUnitDays = validTimeData.some(td => td.cycle > 48 || [7, 14, 84].includes(td.cycle));

                            const formatCycle = (cycle: number) => {
                                if (isUnitDays) {
                                    if (cycle === 720) return "2 Năm";
                                    if (cycle === 360) return "1 Năm";
                                    if (cycle === 180) return "6 Tháng";
                                    if (cycle === 84 || cycle === 90) return "3 Tháng";
                                    if (cycle === 24 || cycle === 30) return "1 Tháng";
                                    if (cycle >= 360) return `${Math.floor(cycle / 360)} Năm`;
                                    if (cycle >= 30) return `${Math.floor(cycle / 30)} Tháng`;
                                    return `${cycle} Ngày`;
                                } else {
                                    return cycle >= 12 && cycle % 12 === 0 ? `${cycle / 12} Năm` : `${cycle} Tháng`;
                                }
                            };

                            plans = validTimeData.map((td) => ({
                                duration: td.note ? `${formatCycle(td.cycle)} - ${td.note}` : formatCycle(td.cycle),
                                price: new Intl.NumberFormat("vi-VN").format(td.price) + "đ"
                            }));

                            apiPlans = validTimeData.map((td, i) => {
                                let origPrice = undefined;
                                if (td.discount && td.discount < 0) {
                                    origPrice = Math.round(td.price / (1 - Math.abs(td.discount) / 100));
                                }
                                return {
                                    id: `api_plan_${td.cycle_id || td.option_id || td.cycle || i}`,
                                    label: formatCycle(td.cycle),
                                    price: td.price,
                                    originalPrice: origPrice,
                                    description: td.note,
                                };
                            });
                            
                            if (validTimeData.length > 0) {
                                const lowest = validTimeData.reduce((min, p) => p.price < min.price ? p : min, validTimeData[0]);
                                if (lowest.discount && lowest.discount < 0) {
                                    const orig = Math.round(lowest.price / (1 - Math.abs(lowest.discount) / 100));
                                    originalPrice = `${orig.toLocaleString("vi-VN")}đ`;
                                }
                            }
                        } else {
                            plans = [{ duration: "Gói tiêu chuẩn", price: new Intl.NumberFormat("vi-VN").format(Number(apiProduct.price) || 0) + "đ" }];
                            apiPlans = [{
                                id: "api_plan_default",
                                label: "Gói tiêu chuẩn",
                                price: Number(apiProduct.price) || 0
                            }];
                        }

                        const sourceImage = apiProduct.thumbnail || apiProduct.image;
                        const imageUrl = sourceImage?.startsWith('http') ? sourceImage : `https://thatim.vn${sourceImage}`;

                        pData = {
                            name: apiProduct.name,
                            slug: apiProduct.slug,
                            image: imageUrl,
                            description: apiProduct.desc || "Chi tiết sản phẩm",
                            shortDesc: apiProduct.note || "Tài khoản chất lượng cao",
                            features: ["Giao hàng tự động", "Bảo hành 1 đổi 1", "Hỗ trợ 24/7"],
                            type: "premium" as const,
                            category: "TÀI KHOẢN PREMIUM",
                            pricing: plans,
                            apiPlans: apiPlans,
                            badges: ["Bán chạy", "Mới"],
                            altText: apiProduct.name,
                            originalPrice: originalPrice
                        };
                    }
                }
                
                // Nếu không có trong API, mới tìm trong local config (fallback cho các sản phẩm chưa lên API)
                if (!foundInApi) {
                    await Promise.all([fetchProductsConfig(), fetchPriceMultipliers()]);
                    const config = getProductBySlug(slug, true);

                    if (config) {
                        pData = {
                            name: config.name,
                            slug: config.slug,
                            image: config.image || "/images/placeholder.jpg",
                            description: config.description,
                            shortDesc: config.shortDesc,
                            features: ["Bảo hành 1 đổi 1", "Hỗ trợ 24/7"],
                            type: "premium" as const,
                            category: config.category || "Sản phẩm",
                            seoTitle: config.seoTitle,
                            seoDescription: config.shortDesc,
                            pricing: config.plans.map(p => ({
                                duration: p.label,
                                price: new Intl.NumberFormat('vi-VN').format(p.price) + 'đ'
                            })),
                            badges: ["Mới"],
                            altText: config.name,
                            originalPrice: config.originalPrice || undefined,
                        };
                    }
                }
            } catch(e) {
                console.error("Error loading product detail:", e);
            }

            if (!pData) {
                setNotFoundState(true);
            } else {
                setProductData(pData);
            }
            setLoading(false);
        };
        
        loadData();
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
