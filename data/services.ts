export type Plan = {
    id: string; // "SV1"
    name: string; // "Gói Nhanh (Hot)"
    badge?: "HOT" | "AN TOÀN" | "GIÁ TỐT" | "CHẬM" | "TỐC ĐỘ CAO";
    speed: string; // "2K–20K/ngày"
    dropRate: string; // "Tụt thấp"
    resource: string; // "Tài khoản cổ ngoại"
    min: number;
    max: number;
    unitLabel: string; // "follow"
    pricePerUnit: number; // 25
    notes?: string[];
};

export type Service = {
    slug: string; // "tiktok-followers"
    title: string;
    description: string;
    category: "TikTok Global" | "Facebook" | "Instagram" | "YouTube" | "Khác";
    plans: Plan[];
    inputLabel: string; // "Nhập Link hoặc UID cần mua"
    inputPlaceholder: string;
    image?: string; // Cover image
};

export const services: Service[] = [
    {
        slug: "tiktok",
        title: "Dịch vụ TikTok",
        description: "Tổng hợp các dịch vụ TikTok: Tăng Follow, Tim, View, Comment, Share... uy tín và chất lượng.",
        category: "TikTok Global",
        image: "/images/TT tik tok.png",
        inputLabel: "Nhập Link Profile hoặc Video",
        inputPlaceholder: "https://www.tiktok.com/...",
        plans: [] // Contact mode
    },
    // --- NEW SERVICES ---
    {
        slug: "facebook",
        title: "Tăng Follow Facebook",
        description: "Tăng người theo dõi profile/page Facebook, tạo uy tín cho tài khoản bán hàng.",
        category: "Facebook",
        image: "/images/tt face.png",
        inputLabel: "Nhập Link Profile/Page",
        inputPlaceholder: "https://www.facebook.com/...",
        plans: [] // Contact mode
    },
    {
        slug: "instagram",
        title: "Tăng Follow Instagram",
        description: "Tăng follow Instagram chất lượng, giúp tài khoản nổi bật và trust hơn.",
        category: "Instagram",
        image: "/images/TT intargram.png",
        inputLabel: "Nhập Link Profile/Username",
        inputPlaceholder: "https://instagram.com/...",
        plans: [] // Contact mode
    },
    {
        slug: "youtube",
        title: "Tăng Subscribe Youtube",
        description: "Tăng đăng ký kênh Youtube, giúp kênh sớm bật kiếm tiền (BKT).",
        category: "YouTube",
        image: "/images/tăng ytb.jfif",
        inputLabel: "Nhập Link Kênh Youtube",
        inputPlaceholder: "https://www.youtube.com/channel/...",
        plans: []
    },
    {
        slug: "google-maps",
        title: "Review Google Maps",
        description: "Tăng đánh giá 5 sao Google Maps, đẩy SEO local và uy tín doanh nghiệp.",
        category: "Khác",
        image: "/images/TT GG map 5s.png",
        inputLabel: "Nhập Link Google Maps",
        inputPlaceholder: "https://goo.gl/maps/...",
        plans: []
    },
    {
        slug: "threads",
        title: "Tăng Follow Threads",
        description: "Dịch vụ tăng follow mạng xã hội Threads mới nhất của Meta.",
        category: "Khác",
        image: "/images/TT threas.png",
        inputLabel: "Nhập Link Profile Threads",
        inputPlaceholder: "https://www.threads.net/@...",
        plans: []
    },
    {
        slug: "shopee",
        title: "Dịch vụ Shopee",
        description: "Tăng follow shop, like sản phẩm, đặt đơn ảo Shopee uy tín.",
        category: "Khác",
        image: "/images/TT shoppe.png",
        inputLabel: "Nhập Link Shop/Sản phẩm",
        inputPlaceholder: "https://shopee.vn/...",
        plans: []
    },
    {
        slug: "spotify",
        title: "Dịch vụ Spotify",
        description: "Tăng play, follow playlist/artist Spotify.",
        category: "Khác",
        image: "/images/TT spotify.png",
        inputLabel: "Nhập Link Artist/Track",
        inputPlaceholder: "https://open.spotify.com/...",
        plans: []
    },
    {
        slug: "website-traffic",
        title: "Tăng Traffic Website",
        description: "Tăng truy cập website từ nguồn tự nhiên, mạng xã hội, hỗ trợ SEO.",
        category: "Khác",
        image: "/images/TT traffic web.png",
        inputLabel: "Nhập Link Website",
        inputPlaceholder: "https://website.com",
        plans: []
    },
    {
        slug: "twitter",
        title: "Tăng Follow Twitter (X)",
        description: "Tăng người theo dõi Twitter (X) Global/Việt.",
        category: "Khác",
        image: "/images/TT twitter X.png",
        inputLabel: "Nhập Link Profile",
        inputPlaceholder: "https://twitter.com/...",
        plans: []
    }
];

export const getServiceBySlug = (slug: string) => services.find(s => s.slug === slug);

export const getServicesByCategory = () => {
    const grouped: Record<string, Service[]> = {};
    services.forEach(s => {
        if (!grouped[s.category]) grouped[s.category] = [];
        grouped[s.category].push(s);
    });
    return grouped;
};
