"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, DollarSign, Package, Share2, Calculator } from "lucide-react";
import { toast } from "sonner";

interface SocialCategory {
    id: string;
    name: string;
    slug: string;
}

export default function AdminPricesPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Original data
    const [allProducts, setAllProducts] = useState<{id: string, name: string}[]>([]);
    const [categories, setCategories] = useState<SocialCategory[]>([]);

    // Modifiers state
    const [productPercents, setProductPercents] = useState<Record<string, string>>({});
    const [categoryPercents, setCategoryPercents] = useState<Record<string, string>>({});

    // Global inputs
    const [globalProductPercent, setGlobalProductPercent] = useState("");
    const [globalCategoryPercent, setGlobalCategoryPercent] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Load saved multipliers from server
            let savedMultipliers: any = null;
            try {
                const mRes = await fetch("/api/admin/prices/update-multipliers", { cache: "no-store" });
                if (mRes.ok) {
                    savedMultipliers = await mRes.json();
                }
            } catch {
                // ignore
            }

            // 2. Build product list from local config + keys already saved in multipliers
            // Do NOT call fetchThatimProducts() here — too expensive and we don't need prices in admin
            const { defaultProductsConfig: defaults } = await import("@/lib/product-config");
            const productMap = new Map<string, {id: string, name: string}>();
            defaults.products.forEach(p => productMap.set(p.slug || p.id, { id: p.slug || p.id, name: p.name }));

            // Also add any slugs that are already in saved productModifiers (e.g. Thatim products)
            if (savedMultipliers?.productModifiers) {
                for (const key of Object.keys(savedMultipliers.productModifiers)) {
                    if (!productMap.has(key)) {
                        productMap.set(key, { id: key, name: key });
                    }
                }
            }
            setAllProducts(Array.from(productMap.values()));

            // 3. Build social categories list from known slugs + saved categoryModifiers
            const knownCategories: SocialCategory[] = [
                { id: "tiktok", name: "TikTok", slug: "tiktok" },
                { id: "facebook", name: "Facebook", slug: "facebook" },
                { id: "instagram", name: "Instagram", slug: "instagram" },
                { id: "youtube", name: "YouTube", slug: "youtube" },
                { id: "google-maps", name: "Google Maps", slug: "google-maps" },
                { id: "threads", name: "Threads", slug: "threads" },
                { id: "shopee", name: "Shopee", slug: "shopee" },
                { id: "spotify", name: "Spotify", slug: "spotify" },
                { id: "website-traffic", name: "Website Traffic", slug: "website-traffic" },
                { id: "twitter", name: "Twitter / X", slug: "twitter" },
            ];
            // Merge with any extra keys from saved data
            if (savedMultipliers?.categoryModifiers) {
                for (const key of Object.keys(savedMultipliers.categoryModifiers)) {
                    if (!knownCategories.find(c => c.id === key)) {
                        knownCategories.push({ id: key, name: key, slug: key });
                    }
                }
            }
            setCategories(knownCategories);

            // 4. Apply saved multipliers to state
            if (savedMultipliers) {
                if (savedMultipliers.productModifiers) {
                    const pm: Record<string, string> = {};
                    for (const [key, val] of Object.entries(savedMultipliers.productModifiers)) {
                        pm[key] = String(val);
                    }
                    setProductPercents(pm);
                }
                if (savedMultipliers.categoryModifiers) {
                    const cm: Record<string, string> = {};
                    for (const [key, val] of Object.entries(savedMultipliers.categoryModifiers)) {
                        cm[key] = String(val);
                    }
                    setCategoryPercents(cm);
                }
            }
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    // --- Product Handlers ---
    const handleGlobalProductApply = () => {
        if (!globalProductPercent) return;
        if (allProducts.length === 0) return;

        const newPercents = { ...productPercents };
        allProducts.forEach(prod => {
            newPercents[prod.id] = globalProductPercent;
        });
        setProductPercents(newPercents);
        toast.success(`Đã áp dụng ${globalProductPercent}% cho tất cả Sản phẩm`);
    };

    const handleProductPercentChange = (productId: string, val: string) => {
        setProductPercents(prev => ({
            ...prev,
            [productId]: val
        }));
    };

    // --- Category Handlers ---
    const handleGlobalCategoryApply = () => {
        if (!globalCategoryPercent) return;

        const newPercents = { ...categoryPercents };
        categories.forEach(cat => {
            newPercents[cat.id] = globalCategoryPercent;
        });
        setCategoryPercents(newPercents);
        toast.success(`Đã áp dụng ${globalCategoryPercent}% cho tất cả Dịch vụ MXH`);
    };

    const handleCategoryPercentChange = (categoryId: string, val: string) => {
        setCategoryPercents(prev => ({
            ...prev,
            [categoryId]: val
        }));
    };

    // --- Save Everything ---
    const handleSaveAll = async () => {
        setSaving(true);
        try {
            // Convert string values to numbers for storage
            const prodMods: Record<string, number> = {};
            for (const [key, val] of Object.entries(productPercents)) {
                const num = parseFloat(val);
                if (!isNaN(num)) {
                    prodMods[key] = num;
                }
            }

            const catMods: Record<string, number> = {};
            for (const [key, val] of Object.entries(categoryPercents)) {
                const num = parseFloat(val);
                if (!isNaN(num)) {
                    catMods[key] = num;
                }
            }

            const payload = {
                productModifiers: prodMods,
                categoryModifiers: catMods,
            };

            const res = await fetch("/api/admin/prices/update-multipliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                cache: "no-store"
            });

            if (res.ok) {
                try {
                    const { invalidateThatimCache } = await import("@/lib/api/thatim");
                    invalidateThatimCache();
                } catch (e) {}
                
                try {
                    const { invalidateProductsCache } = await import("@/lib/product-config");
                    invalidateProductsCache();
                    window.dispatchEvent(new Event("products-config-updated"));
                } catch(e) {}
                
                toast.success("Đã lưu cấu hình % thành công! Giá trên trang web sẽ cập nhật ngay.");
            } else {
                toast.error("Có lỗi xảy ra khi lưu");
            }
        } catch (error: any) {
            toast.error(error.message || "Lỗi kết nối");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-2 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-7 h-7 text-green-600" />
                        Quản lý giá đồng loạt
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Áp dụng hệ số nhân (%) lên giá gốc cho Sản phẩm và Dịch vụ (Mức Parent).
                    </p>
                </div>
                <button
                    onClick={handleSaveAll}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Lưu tất cả thay đổi
                </button>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. SẢN PHẨM (Parent Level) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            Sản Phẩm (Mức Gốc)
                        </h2>
                        
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Calculator className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="number"
                                    value={globalProductPercent}
                                    onChange={e => setGlobalProductPercent(e.target.value)}
                                    placeholder="%"
                                    className="w-24 pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">%</span>
                            </div>
                            <button 
                                onClick={handleGlobalProductApply}
                                className="px-3 py-1.5 text-sm font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                            >
                                Áp dụng tất cả
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 overflow-y-auto flex-1 p-4 space-y-2">
                        {allProducts.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                <p>Chưa có sản phẩm nào.</p>
                            </div>
                        ) : (
                            allProducts.map(product => (
                                <div key={product.id} className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                                    <div className="font-bold text-gray-900 truncate flex-1 text-sm">{product.name}</div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number"
                                            value={productPercents[product.id] ?? ""}
                                            onChange={e => handleProductPercentChange(product.id, e.target.value)}
                                            placeholder="0"
                                            className="w-20 px-3 py-1.5 text-center text-sm font-bold text-blue-600 rounded border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <span className="text-xs text-gray-500 font-bold">%</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 2. DỊCH VỤ MXH (Category Level) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Share2 className="h-5 w-5 text-purple-600" />
                            Dịch Vụ MXH (Mức Gốc)
                        </h2>
                        
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Calculator className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    type="number"
                                    value={globalCategoryPercent}
                                    onChange={e => setGlobalCategoryPercent(e.target.value)}
                                    placeholder="%"
                                    className="w-24 pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">%</span>
                            </div>
                            <button 
                                onClick={handleGlobalCategoryApply}
                                className="px-3 py-1.5 text-sm font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors"
                            >
                                Áp dụng tất cả
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 overflow-y-auto flex-1 p-4 space-y-2">
                        {categories.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">Chưa có danh mục nào</div>
                        ) : (
                            categories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-gray-900 text-sm truncate">{cat.name}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number"
                                            value={categoryPercents[cat.id] ?? ""}
                                            onChange={e => handleCategoryPercentChange(cat.id, e.target.value)}
                                            placeholder="0"
                                            className="w-20 px-3 py-1.5 text-center text-sm font-bold text-purple-600 rounded border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                        <span className="text-xs text-gray-500 font-bold">%</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
