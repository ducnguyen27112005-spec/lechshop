export interface CategoryMenuItem {
    id: string;
    label: string;
    href: string;
}

export interface ProductCategory {
    title: string;
    items: CategoryMenuItem[];
}

export const productCategories: ProductCategory[] = [
    {
        title: "Tài khoản AI",
        items: [
            { id: "chatgpt-plus", label: "ChatGPT Plus", href: "/san-pham/chatgpt-plus" },
            { id: "gemini-pro", label: "Gemini Pro", href: "/san-pham/gemini-pro" },
            { id: "claude-ai", label: "Claude AI", href: "/san-pham/claude-ai" },
            { id: "copilot-pro", label: "Copilot Pro", href: "/san-pham/copilot-pro" },
        ]
    },
    {
        title: "Tài khoản giải trí",
        items: [
            { id: "netflix-premium", label: "Netflix Premium", href: "/san-pham/netflix-premium" },
            { id: "youtube-premium", label: "YouTube Premium", href: "/san-pham/youtube-premium" },
            { id: "spotify-premium", label: "Spotify Premium", href: "/san-pham/spotify-premium" },
            { id: "tinder", label: "Tinder", href: "/san-pham/tinder" },
        ]
    },
    {
        title: "Tài khoản Thiết Kế & Đồ Họa",
        items: [
            { id: "canva-pro", label: "Canva Pro", href: "/san-pham/canva-pro" },
            { id: "capcut-pro", label: "CapCut Pro", href: "/san-pham/capcut-pro" },
            { id: "adobe", label: "Adobe", href: "/san-pham/adobe" },
            { id: "picsart", label: "Picsart", href: "/san-pham/picsart" },
        ]
    },
    {
        title: "Dịch vụ MXH",
        items: [
            { id: "tiktok-followers", label: "Tăng follow TikTok", href: "/san-pham/tiktok-followers" },
            { id: "facebook-followers", label: "Tăng follow Facebook", href: "/san-pham/facebook-followers" },
            { id: "instagram-followers", label: "Tăng follow Instagram", href: "/san-pham/instagram-followers" },
            { id: "youtube-views", label: "Tăng view YouTube", href: "/lien-he" },
        ]
    },
    {
        title: "Phần mềm bản quyền",
        items: [
            { id: "microsoft-office", label: "Microsoft Office 365", href: "/san-pham/office-365" },
            { id: "windows-key", label: "Key Windows 11", href: "/san-pham/windows-11" },
            { id: "zoom-pro", label: "Zoom Pro", href: "/san-pham/zoom-pro" },
            { id: "trading-view", label: "Trading View", href: "/san-pham/trading-view" },
        ]
    },
    {
        title: "Nâng cấp dung lượng",
        items: [
            { id: "icloud", label: "iCloud", href: "/san-pham/icloud" },
            { id: "google-one", label: "Google One", href: "/san-pham/google-one" },
        ]
    },
];
