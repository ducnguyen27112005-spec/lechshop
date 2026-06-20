export interface Product {
    id: string;
    slug: string;
    name: string;
    shortDesc: string;
    description: string;
    image: string;
    features: string[];
    pricing: {
        duration: string;
        price: string;
    }[];
    seoTitle?: string;
    seoDescription?: string;
    metaDescription?: string;
    altText?: string;
    badges?: string[];
    originalPrice?: string; // For display in detail page if needed
}

export interface CompactProduct {
    id: string;
    slug: string;
    title: string;
    bullets: string[];
    startingPrice: string;
    image: string;
    originalPrice?: string;
    soldCount?: string;
    category?: string;
    badge?: string;
    benefit?: string;
}

export interface SocialService {
    id: string;
    title: string;
    bullets: string[];
    ctaText: string;
    ctaLink: string;
    image?: string;
}

// Full product details (used in detail pages)
export const products: Product[] = [
    {
        id: "netflix-premium",
        slug: "netflix-premium",
        name: "Netflix Premium",
        shortDesc: "Hỗ trợ đăng ký và gia hạn Netflix Premium với gift code hợp lệ",
        description:
            "Chúng tôi cung cấp dịch vụ hỗ trợ đăng ký tài khoản Netflix Premium chính hãng. Tất cả gift code đều hợp lệ, được cung cấp từ nguồn uy tín, đảm bảo an toàn và tuân thủ điều khoản sử dụng.",
        image: "/images/netflix-premium-new.png",
        features: [
            "Hỗ trợ đăng ký tài khoản Netflix Premium",
            "Gift code chính hãng, hợp lệ 100%",
            "Hỗ trợ gia hạn nhanh chóng",
            "Chất lượng Ultra HD 4K",
            "Xem đồng thời trên nhiều thiết bị",
            "Hỗ trợ 24/7",
        ],
        pricing: [
            { duration: "1 tháng", price: "89.000 VNĐ" }
        ],
    },
    {
        id: "chatgpt-plus",
        slug: "chatgpt-plus",
        name: "ChatGPT Plus",
        shortDesc: "Hỗ trợ nâng cấp tài khoản ChatGPT Plus với thanh toán an toàn",
        description:
            "Dịch vụ hỗ trợ nâng cấp tài khoản ChatGPT Plus của bạn lên gói cao cấp. Thanh toán an toàn, nhanh chóng, hỗ trợ tận tình từ đội ngũ chuyên nghiệp.",
        image: "/images/chatgpt-plus.png",
        features: [
            "Hỗ trợ nâng cấp tài khoản ChatGPT Plus",
            "Thanh toán an toàn qua cổng VNPay/Momo",
            "Kích hoạt nhanh trong vòng 30 phút",
            "Truy cập GPT-4 và GPT-4 Turbo",
            "Ưu tiên truy cập ngay cả khi traffic cao",
            "Hỗ trợ kỹ thuật 24/7",
        ],
        pricing: [
            { duration: "1 tháng", price: "99.000 VNĐ" },
            { duration: "3 tháng", price: "329.000 VNĐ" },
            { duration: "1 năm", price: "1.179.000 VNĐ" },
        ],
        seoTitle: "Mua Tài Khoản ChatGPT Plus Chính Hãng – Giá Tốt Nhất 2025",
        seoDescription: "Nâng cấp tài khoản ChatGPT Plus chính chủ, sử dụng GPT-4o và GPT-4 Turbo mới nhất. Tận hưởng sức mạnh AI cao cấp, xử lý tác vụ nhanh chóng, ổn định và bảo mật. Dịch vụ uy tín, bảo hành trọn đời gói, hỗ trợ kỹ thuật 24/7.",
        metaDescription: "Mua tài khoản ChatGPT Plus giá rẻ chính hãng. Nâng cấp GPT-4o, AI cao cấp, ổn định lâu dài. Bảo hành uy tín 1 đổi 1. Hỗ trợ 24/7.",
        altText: "Tài khoản ChatGPT Plus chính hãng – nâng cấp GPT-4o giá rẻ",
        badges: ["Bán chạy", "Uy tín – Bảo hành"],
        originalPrice: "520.000 VNĐ"
    },
    {
        id: "youtube-premium",
        slug: "youtube-premium",
        name: "YouTube Premium",
        shortDesc: "Trải nghiệm YouTube không quảng cáo, tải video offline",
        description: "Nâng cấp tài khoản YouTube của bạn lên Premium để tận hưởng các tính năng độc quyền: xem không giới hạn quảng cáo, phát trong nền và YouTube Music.",
        image: "/images/TT youtube.png",
        features: ["Không quảng cáo", "Phát trong nền", "YouTube Music", "Tải video offline"],
        pricing: [
            { duration: "1 tháng", price: "55.000 VNĐ" },
            { duration: "3 tháng", price: "129.000 VNĐ" },
            { duration: "6 tháng", price: "219.000 VNĐ" },
            { duration: "1 năm", price: "439.000 VNĐ" }
        ]
    },
    {
        id: "capcut-pro",
        slug: "capcut-pro",
        name: "CapCut Pro",
        shortDesc: "Công cụ chỉnh sửa video chuyên nghiệp không giới hạn",
        description: "Nâng tầm video của bạn với CapCut Pro. Truy cập kho hiệu ứng cao cấp, tính năng tách nền AI và xuất video chất lượng cao không watermark.",
        image: "/images/capcut-pro-new-2.jpg",
        features: [
            "Mở khóa toàn bộ hiệu ứng Pro",
            "Tách nền video bằng AI siêu tốc",
            "Không watermark khi xuất file",
            "Lưu trữ đám mây 100GB",
            "Hỗ trợ xuất video 4K 60fps"
        ],
        pricing: [
            { duration: "7 ngày", price: "19.000 VNĐ" },
            { duration: "14 ngày", price: "39.000 VNĐ" },
            { duration: "1 tháng", price: "49.000 VNĐ" },
            { duration: "3 tháng", price: "160.000 VNĐ" },
            { duration: "6 tháng", price: "265.000 VNĐ" },
            { duration: "1 năm", price: "440.000 VNĐ" }
        ]
    },
    {
        id: "canva-pro",
        slug: "canva-pro",
        name: "Canva Pro",
        shortDesc: "Thiết kế đồ họa chuyên nghiệp, dễ dàng cho mọi người",
        description: "Mở khóa toàn bộ tiềm năng sáng tạo của bạn với Canva Pro. Truy cập hàng triệu mẫu thiết kế, hình ảnh cao cấp và các công cụ hỗ trợ AI như xóa nền, đổi kích cỡ ma thuật.",
        image: "/images/canva-pro-new.jpg",
        features: [
            "Hàng triệu hình ảnh và font chữ cao cấp",
            "Công cụ xóa nền chỉ bằng một cú nhấp",
            "Đổi kích cỡ thiết kế nhanh chóng (Magic Resize)",
            "Lập kế hoạch nội dung mạng xã hội",
            "Lưu dự liệu và thương hiệu riêng biệt"
        ],
        pricing: [
            { duration: "1 tháng", price: "49.000 VNĐ" },
            { duration: "1 năm", price: "279.000 VNĐ" }
        ]
    },
    {
        id: "gemini-pro",
        slug: "gemini-pro",
        name: "Gemini Pro",
        shortDesc: "Trải nghiệm AI tiên tiến nhất của Google",
        description: "Khám phá sức mạnh của Google Gemini Pro. Hỗ trợ phân tích đa phương tiện, lập trình nâng cao và khả năng suy luận logic vượt trội cho mọi tác vụ công việc.",
        image: "/images/gemini.jpg",
        features: [
            "Mô hình AI đa phương tiện mạnh mẽ nhất",
            "Xử lý văn bản, hình ảnh và video nhanh chóng",
            "Hỗ trợ phân tích dữ liệu và lập trình chuyên sâu",
            "Tích hợp hoàn hảo với hệ sinh thái Google",
            "Ưu tiên sử dụng tính năng mới nhất"
        ],
        pricing: [
            { duration: "1 năm", price: "189.000 VNĐ" }
        ]
    }
];

// Compact premium products for homepage
export const premiumProducts: CompactProduct[] = [
    {
        id: "chatgpt-plus",
        slug: "chatgpt-plus",
        title: "Tài khoản ChatGPT Plus",
        category: "TÀI KHOẢN AI",
        bullets: ["Truy cập GPT-4", "Ưu tiên tốc độ", "Hỗ trợ 24/7"],
        startingPrice: "99.000đ",
        originalPrice: "520.000đ",
        soldCount: "320",
        image: "/images/chatgpt-plus.png",
        badge: "Bán chạy"
    },
    {
        id: "gemini-pro",
        slug: "gemini-pro",
        title: "Tài khoản Gemini Pro",
        category: "TRỢ LÝ AI",
        bullets: ["AI tiên tiến", "Phân tích đa phương tiện", "Tốc độ cao"],
        startingPrice: "189.000đ",
        soldCount: "460",
        image: "/images/gemini.jpg"
    },
    {
        id: "netflix-premium",
        slug: "netflix-premium",
        title: "Tài khoản Netflix Premium",
        category: "TÀI KHOẢN PHIM ẢNH",
        bullets: ["Chất lượng 4K", "4 màn hình cùng lúc", "Gift code hợp lệ"],
        startingPrice: "89.000đ",
        soldCount: "332",
        image: "/images/netflix-premium-new.png"
    },
    {
        id: "youtube-premium",
        slug: "youtube-premium",
        title: "Tài khoản YouTube Premium",
        category: "TÀI KHOẢN GIẢI TRÍ",
        bullets: ["Xem không quảng cáo", "Tải video offline", "YouTube Music"],
        startingPrice: "55.000đ",
        originalPrice: "90.000đ",
        soldCount: "458",
        image: "/images/TT youtube.png"
    },
    {
        id: "capcut-pro",
        slug: "capcut-pro",
        title: "Tài khoản CapCut Pro",
        category: "CHỈNH SỬA VIDEO",
        bullets: ["Chỉnh sửa chuyên nghiệp", "Hiệu ứng cao cấp", "Không watermark"],
        startingPrice: "19.000đ",
        soldCount: "784",
        image: "/images/capcut-pro-new-2.jpg"
    },
    {
        id: "canva-pro",
        slug: "canva-pro",
        title: "Tài khoản Canva Pro",
        category: "THIẾT KẾ ĐỒ HỌA",
        bullets: ["Hàng triệu template", "Background remover", "Magic resize"],
        startingPrice: "49.000đ",
        soldCount: "553",
        image: "/images/canva-pro-new.jpg"
    },
];

// Social services for homepage
export const socialServices: SocialService[] = [
    {
        id: "tiktok-followers",
        title: "Tăng follow TikTok",
        bullets: ["Follow thật 100%", "Tương tác tự nhiên", "Bảo hành 30 ngày"],
        ctaText: "Bắt đầu",
        ctaLink: "/lien-he",
        image: "/images/TT tik tok.png",
    },
    {
        id: "facebook-followers",
        title: "Tăng follow Facebook",
        bullets: ["Người dùng thật", "Tăng trưởng ổn định", "An toàn với thuật toán"],
        ctaText: "Liên hệ",
        ctaLink: "/lien-he",
        image: "/images/tt face.png",
    },
    {
        id: "instagram-followers",
        title: "Tăng follow Instagram",
        bullets: ["Follow chất lượng cao", "Tăng engagement", "Hỗ trợ 24/7"],
        ctaText: "Bắt đầu",
        ctaLink: "/lien-he",
        image: "/images/TT intargram.png",
    },
    {
        id: "youtube-subscribers",
        title: "Tăng Subscribe Youtube",
        bullets: ["Subscriber thật 100%", "Bảo hành vĩnh viễn", "Hỗ trợ bật kiếm tiền"],
        ctaText: "Liên hệ",
        ctaLink: "/lien-he",
        image: "/images/tăng ytb.jfif",
    },
    {
        id: "google-maps-review",
        title: "Review Google Maps",
        bullets: ["User thật, local IP", "Nội dung chuẩn SEO", "Tăng Top hiển thị"],
        ctaText: "Tư vấn",
        ctaLink: "/lien-he",
        image: "/images/TT GG map 5s.png",
    },
    {
        id: "threads-followers",
        title: "Tăng Follow Threads",
        bullets: ["Tài khoản có avatar", "Theo dõi ổn định", "Đẩy đề xuất"],
        ctaText: "Bắt đầu",
        ctaLink: "/lien-he",
        image: "/images/TT threas.png",
    },
    {
        id: "shopee-services",
        title: "Dịch vụ Shopee",
        bullets: ["Tăng follow, like sản phẩm", "Đặt đơn ảo an toàn", "Nâng hạng Shop"],
        ctaText: "Tư vấn",
        ctaLink: "/lien-he",
        image: "/images/TT shoppe.png",
    },
    {
        id: "spotify-services",
        title: "Dịch vụ Spotify",
        bullets: ["Tăng lượt Play/Follow", "Premium IP Toàn cầu", "Bảo hành 30 ngày"],
        ctaText: "Tư vấn",
        ctaLink: "/lien-he",
        image: "/images/TT spotify.png",
    },
    {
        id: "website-traffic-services",
        title: "Tăng Traffic Website",
        bullets: ["Truy cập tự nhiên", "Nguồn đa dạng", "Tối ưu hóa SEO"],
        ctaText: "Tư vấn",
        ctaLink: "/lien-he",
        image: "/images/TT traffic web.png",
    },
    {
        id: "twitter-services",
        title: "Tăng Follow Twitter (X)",
        bullets: ["Tài khoản NFT/Crypto", "Tăng trưởng theo dõi", "Người dùng thực"],
        ctaText: "Tư vấn",
        ctaLink: "/lien-he",
        image: "/images/TT twitter X.png",
    }
];
