import { CompactProduct } from "@/content/products";
import { getDeterministicSoldCount } from "@/lib/utils";

export interface ThatimPlan {
    cycle_id?: number;
    option_id?: number;
    cycle: number;
    price: number;
    discount: number;
    note: string;
    is_active: boolean;
}

export interface ThatimProduct {
    id: number;
    name: string;
    slug: string;
    price?: string | number;
    image: string;
    thumbnail: string;
    note: string;
    desc: string;
    status: string;
    time_data?: ThatimPlan[];
}

// Since we use a server proxy, we don't need the key on the client anymore
const API_BASE_URL = "/api/thatim";

let categoryCache: ThatimProduct[] | null = null;
let categoryCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache

// Cache for price multiplier
let multiplierCache: { global: number; specific: Record<string, number> } | null = null;
let multiplierCacheTime = 0;
const MULTIPLIER_CACHE_TTL = 1000 * 60 * 2; // 2 minutes

/**
 * Fetch the price multipliers from admin config
 */
async function fetchThatimMultipliers(): Promise<{ global: number; specific: Record<string, number> }> {
    try {
        if (multiplierCache !== null && Date.now() - multiplierCacheTime < MULTIPLIER_CACHE_TTL) {
            return multiplierCache;
        }

        const res = await fetch("/api/admin/prices/update-multipliers", { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            // thatimGlobalPercent = fallback for products not in productModifiers
            const global = typeof data.thatimGlobalPercent === "number" ? data.thatimGlobalPercent : 0;
            const specific: Record<string, number> = data.productModifiers || {};
            const result = { global, specific };
            multiplierCache = result;
            multiplierCacheTime = Date.now();
            return result;
        }
    } catch {
        // fallback
    }
    return multiplierCache ?? { global: 0, specific: {} };
}


/**
 * Fetch all categories and products from Thatim API
 */
export async function fetchThatimProducts(): Promise<ThatimProduct[]> {
    try {
        if (typeof window !== "undefined") {
            // Client side caching
            if (categoryCache && Date.now() - categoryCacheTime < CACHE_TTL) {
                return categoryCache;
            }
        }

        // Fetch multiplier and products in parallel — use allSettled so one failure doesn't block both
        const [multipliersResult, apiResult] = await Promise.allSettled([
            fetchThatimMultipliers(),
            fetch(`${API_BASE_URL}?action=category`),
        ]);

        const multipliersData = multipliersResult.status === "fulfilled"
            ? multipliersResult.value
            : { global: 0, specific: {} };

        if (apiResult.status === "rejected") {
            throw new Error(`Thatim API fetch failed: ${apiResult.reason}`);
        }

        const apiRes = apiResult.value;
        if (!apiRes.ok) {
            throw new Error(`Thatim API returned ${apiRes.status}`);
        }

        const json = await apiRes.json();
        if (json && json.data) {
            // Normalize API slugs to match internal website slugs for backward compatibility
            const SLUG_MAP: Record<string, string> = {
                "netflix-ultra-4k": "netflix-premium",
                "google-gemini-pro": "gemini-pro",
                "chatgpt-plus-codex": "chatgpt-plus"
            };
            
            const normalizedData = json.data.map((item: ThatimProduct) => {
                if (SLUG_MAP[item.slug]) {
                    item.slug = SLUG_MAP[item.slug];
                }

                // Apply dynamic price multiplier: prefer specific per-product over global
                const specificPct = multipliersData.specific[item.slug];
                const pct = specificPct !== undefined ? specificPct : multipliersData.global;
                const multiplier = 1 + pct / 100;

                if (item.price) {
                    item.price = Math.round(Number(item.price) * multiplier);
                }
                
                if (item.time_data && Array.isArray(item.time_data)) {
                    item.time_data = item.time_data.map(td => ({
                        ...td,
                        price: Math.round(Number(td.price) * multiplier)
                    }));
                }

                return item;
            });

            if (typeof window !== "undefined") {
                categoryCache = normalizedData;
                categoryCacheTime = Date.now();
            }
            return normalizedData;
        }
        return [];
    } catch (error) {
        console.error("Error fetching Thatim API products:", error);
        return [];
    }
}

/**
 * Force clear the product cache so next fetch picks up new multiplier
 */
export function invalidateThatimCache(): void {
    categoryCache = null;
    categoryCacheTime = 0;
    multiplierCache = null;
    multiplierCacheTime = 0;
}

/**
 * Maps Thatim products to local CompactProduct format
 */
export function mapThatimToCompactProducts(apiProducts: ThatimProduct[]): CompactProduct[] {
    return apiProducts.map((item) => {
        let startingPrice = item.price ? parseInt(item.price as string) : 0;
        let originalPrice = undefined;

        if (item.time_data && item.time_data.length > 0) {
            const validTimeData = item.time_data.filter((td) => td.is_active !== false);
            if (validTimeData.length > 0) {
                const lowest = validTimeData.reduce(
                    (min, p) => (p.price < min.price ? p : min),
                    validTimeData[0]
                );
                startingPrice = lowest.price;

                if (lowest.discount && lowest.discount < 0) {
                    const orig = Math.round(lowest.price / (1 - Math.abs(lowest.discount) / 100));
                    originalPrice = `${orig.toLocaleString("vi-VN")}đ`;
                }
            }
        }

        const sourceImage = item.thumbnail || item.image;
        const imageUrl = sourceImage?.startsWith("http")
            ? sourceImage
            : `https://thatim.vn${sourceImage}`;

        return {
            id: item.id.toString(),
            slug: item.slug,
            title: item.name,
            category: "TÀI KHOẢN PREMIUM",
            bullets: [item.note || item.desc || "Tài khoản chất lượng cao"],
            startingPrice: startingPrice > 0 ? `${startingPrice.toLocaleString("vi-VN")}đ` : "Liên hệ",
            originalPrice,
            image: imageUrl,
            soldCount: `${getDeterministicSoldCount(item.slug, "TÀI KHOẢN PREMIUM")}`,
            badge: "Bán chạy",
            benefit: "Bảo hành 1 đổi 1",
        };
    });
}
