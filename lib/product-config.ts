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

/**
 * Fetch products config from API (client-side).
 * Uses in-memory cache to avoid repeated fetches.
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
            if (data.products && data.products.length > 0) {
                _cachedConfig = data;
            } else {
                _cachedConfig = defaultProductsConfig;
            }
            _fetchPromise = null;
            return _cachedConfig;
        })
        .catch(() => {
            _fetchPromise = null;
            _cachedConfig = defaultProductsConfig;
            return defaultProductsConfig;
        });

    return _fetchPromise;
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
}

// --- Synchronous getters (use cached data, fallback to defaults) ---

/**
 * Get products config synchronously (from cache or defaults).
 * Components should call fetchProductsConfig() in useEffect first.
 */
export function getProductsConfig(): ProductsConfig {
    return _cachedConfig || defaultProductsConfig;
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
export function getProductBySlug(slug: string): ProductConfig | undefined {
    const config = getProductsConfig();
    return config.products.find((p) => p.slug === slug);
}

/** Get plans for a product (with inStock status) */
export function getPlansForProductConfig(slug: string): PlanConfig[] {
    const product = getProductBySlug(slug);
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
