import { products } from "@/content/products";
import { productPlans } from "@/content/productPlans";

// --- Types ---

export interface PlanConfig {
    id: string;
    label: string;
    description?: string;
    durationMonths: number;
    price: number;
    originalPrice?: number;
    discount?: number;
    bonus?: string;
    inStock: boolean;
}

export interface ProductConfig {
    id: string;
    slug: string;
    name: string;
    seoTitle: string;
    category: string;
    shortDesc: string;
    description: string;
    image: string;
    originalPrice: string;
    plans: PlanConfig[];
    productArticle: string;
}

export interface ProductsConfig {
    products: ProductConfig[];
}

// --- Build defaults from existing hardcoded data ---

function buildDefaultProducts(): ProductConfig[] {
    return products.map((p) => {
        const plans: PlanConfig[] = (productPlans[p.slug] || []).map((plan) => ({
            ...plan,
            inStock: true,
        }));

        return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            seoTitle: p.seoTitle || `Mua Tài Khoản ${p.name} – Giá Tốt Nhất`,
            category: "",
            shortDesc: p.shortDesc,
            description: p.description,
            image: p.image,
            originalPrice: p.originalPrice || "",
            plans,
            productArticle: "",
        };
    });
}

export const defaultProductsConfig: ProductsConfig = {
    products: buildDefaultProducts(),
};

// --- In-memory cache for client-side ---
let _cachedConfig: ProductsConfig | null = null;
let _fetchPromise: Promise<ProductsConfig> | null = null;
let _multipliers: Record<string, number> | null = null; // productModifiers keyed by slug
let _multipliersFetchDone = false;

/**
 * Fetch products config from API (client-side).
 * Uses in-memory cache to avoid repeated fetches.
 * NOTE: Does NOT apply multipliers - use getProductsConfig(true) after fetching multipliers separately.
 */
export async function fetchProductsConfig(): Promise<ProductsConfig> {
    if (_cachedConfig) return _cachedConfig;
    if (_fetchPromise) return _fetchPromise;

    _fetchPromise = fetch("/api/products-config", { cache: "no-store" })
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        })
        .then((data: ProductsConfig) => {
            if (data && data.products && data.products.length > 0) {
                _cachedConfig = data;
            } else {
                _cachedConfig = defaultProductsConfig;
            }
            _fetchPromise = null;
            return _cachedConfig!;
        })
        .catch(() => {
            _fetchPromise = null;
            _cachedConfig = defaultProductsConfig;
            return defaultProductsConfig;
        });

    return _fetchPromise;
}

/**
 * Fetch the product price multipliers from admin API (client-side).
 * Call this on public/storefront pages before rendering prices.
 */
export async function fetchPriceMultipliers(): Promise<void> {
    if (_multipliersFetchDone) return;
    try {
        const res = await fetch("/api/admin/prices/update-multipliers", { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            _multipliers = data.productModifiers || {};
        }
    } catch {
        // keep null, multipliers won't be applied
    }
    _multipliersFetchDone = true;
}

/**
 * Save products config via API (client-side).
 * Also updates the cache.
 */
export async function saveProductsConfigToServer(config: ProductsConfig): Promise<boolean> {
    try {
        const res = await fetch("/api/products-config", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config),
        });
        if (res.ok) {
            _cachedConfig = config;
            window.dispatchEvent(new Event("products-config-updated"));
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

/**
 * Invalidate the cache so next read fetches fresh data from server.
 */
export function invalidateProductsCache(): void {
    _cachedConfig = null;
    _fetchPromise = null;
    _multipliers = null;
    _multipliersFetchDone = false;
}

// --- Synchronous getters (use cached data, fallback to defaults) ---

/**
 * Get products config synchronously (from cache or defaults).
 * Components should call fetchProductsConfig() in useEffect first.
 * @param applyMultipliers - if true, applies productModifiers from admin config
 */
export function getProductsConfig(applyMultipliers = false): ProductsConfig {
    const baseConfig = _cachedConfig || defaultProductsConfig;

    if (!applyMultipliers || !_multipliers || Object.keys(_multipliers).length === 0) {
        return baseConfig;
    }

    const cloned = JSON.parse(JSON.stringify(baseConfig)) as ProductsConfig;
    cloned.products.forEach(p => {
        // Lookup by slug (id === slug in all current products)
        const pct = Number(_multipliers![p.slug] ?? _multipliers![p.id] ?? 0);
        if (pct !== 0) {
            const mult = 1 + pct / 100;
            p.plans.forEach(plan => {
                plan.price = Math.round(plan.price * mult);
            });
        }
    });
    return cloned;
}

/**
 * Legacy save function - now saves to server.
 */
export function saveProductsConfig(config: ProductsConfig): void {
    _cachedConfig = config;
    // Fire and forget - save to server
    saveProductsConfigToServer(config);
    window.dispatchEvent(new Event("products-config-updated"));
}

// --- Helpers ---

/** Get config for a single product by slug */
export function getProductBySlug(slug: string, applyMultipliers = false): ProductConfig | undefined {
    const config = getProductsConfig(applyMultipliers);
    return config.products.find((p) => p.slug === slug);
}

/** Get plans for a product (with inStock status) */
export function getPlansForProductConfig(slug: string, applyMultipliers = false): PlanConfig[] {
    const product = getProductBySlug(slug, applyMultipliers);
    if (!product) return [];
    return product.plans;
}

/** Create a new empty product template */
export function createEmptyProduct(): ProductConfig {
    const timestamp = Date.now();
    return {
        id: `product-${timestamp}`,
        slug: `san-pham-${timestamp}`,
        name: "Sản phẩm mới",
        seoTitle: "Sản phẩm mới – Giá Tốt Nhất",
        category: "giai-tri",
        shortDesc: "Mô tả ngắn sản phẩm",
        description: "Mô tả chi tiết sản phẩm...",
        image: "/images/placeholder.png",
        originalPrice: "",
        plans: [
            {
                id: "1m",
                label: "1 Tháng",
                durationMonths: 1,
                price: 99000,
                originalPrice: 200000,
                discount: 50,
                inStock: true,
            },
        ],
        productArticle: "<h2>Tiêu đề bài viết</h2>\n<p>Nội dung mô tả sản phẩm...</p>",
    };
}

/** Create an empty plan */
export function createEmptyPlan(): PlanConfig {
    return {
        id: `plan-${Date.now()}`,
        label: "Gói mới",
        description: "",
        durationMonths: 1,
        price: 0,
        originalPrice: 0,
        discount: 0,
        inStock: true,
    };
}
