// Banner configuration stored in localStorage
// This allows admin to update banners without DB migration

export interface BannerItem {
    image: string;
    link: string;
    title: string;
}

export interface BannerConfig {
    mainBanners: BannerItem[]; // 3 hero slider banners
    sideBanners: BannerItem[]; // 2 right-side banners
}

const STORAGE_KEY = "lecshop_banner_config";

export const defaultBannerConfig: BannerConfig = {
    mainBanners: [
        {
            image: "/images/banner-animation.mp4",
            link: "/#premium",
            title: "Banner video chính",
        },
        {
            image: "/images/banner-premium-2026.png?v=1",
            link: "/#premium",
            title: "Banner Premium 2026",
        },
        {
            image: "/images/huong-dan-mua-hang.jpg",
            link: "/huong-dan",
            title: "Hướng dẫn mua hàng",
        },
    ],
    sideBanners: [
        {
            image: "/images/gemini-sidebar-2.png",
            link: "/san-pham/gemini-pro",
            title: "Gemini Advanced",
        },
        {
            image: "/images/chatgpt-sidebar-2.jpg",
            link: "/san-pham/chatgpt-plus",
            title: "ChatGPT Plus",
        },
    ],
};

export function getBannerConfig(): BannerConfig {
    if (typeof window === "undefined") return defaultBannerConfig;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored) as BannerConfig;
            // Ensure arrays have correct length
            if (parsed.mainBanners?.length >= 1 && parsed.sideBanners?.length >= 1) {
                return parsed;
            }
        }
    } catch { }
    return defaultBannerConfig;
}

export function saveBannerConfig(config: BannerConfig): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent("banner-config-updated"));
}
