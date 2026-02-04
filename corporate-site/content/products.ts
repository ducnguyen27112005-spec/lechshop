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
}

export interface CompactProduct {
    id: string;
    slug: string;
    title: string;
    bullets: string[];
    startingPrice: string;
    image: string;
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
        image: "/images/netflix.jpg",
        features: [
            "Hỗ trợ đăng ký tài khoản Netflix Premium",
            "Gift code chính hãng, hợp lệ 100%",
            "Hỗ trợ gia hạn nhanh chóng",
            "Chất lượng Ultra HD 4K",
            "Xem đồng thời trên nhiều thiết bị",
            "Hỗ trợ 24/7",
        ],
        pricing: [
            { duration: "1 tháng", price: "260.000 VNĐ" },
            { duration: "3 tháng", price: "720.000 VNĐ" },
            { duration: "6 tháng", price: "1.380.000 VNĐ" },
            { duration: "12 tháng", price: "2.640.000 VNĐ" },
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
            { duration: "1 tháng", price: "550.000 VNĐ" },
            { duration: "3 tháng", price: "1.580.000 VNĐ" },
            { duration: "6 tháng", price: "3.050.000 VNĐ" },
        ],
    },
    {
        id: "youtube-premium",
        slug: "youtube-premium",
        name: "YouTube Premium",
        shortDesc: "Trải nghiệm YouTube không quảng cáo, tải video offline",
        description: "Nâng cấp tài khoản YouTube của bạn lên Premium để tận hưởng các tính năng độc quyền: xem không giới hạn quảng cáo, phát trong nền và YouTube Music.",
        image: "/images/youtube.png",
        features: ["Không quảng cáo", "Phát trong nền", "YouTube Music", "Tải video offline"],
        pricing: [
            { duration: "1 tháng", price: "79.000 VNĐ" },
            { duration: "6 tháng", price: "450.000 VNĐ" },
            { duration: "1 năm", price: "850.000 VNĐ" }
        ]
    },
    {
        id: "capcut-pro",
        slug: "capcut-pro",
        name: "CapCut Pro",
        shortDesc: "Công cụ chỉnh sửa video chuyên nghiệp không giới hạn",
        description: "Nâng tầm video của bạn với CapCut Pro. Truy cập kho hiệu ứng cao cấp, tính năng tách nền AI và xuất video chất lượng cao không watermark.",
        image: "/images/capcut.jpg",
        features: [
            "Mở khóa toàn bộ hiệu ứng Pro",
            "Tách nền video bằng AI siêu tốc",
            "Không watermark khi xuất file",
            "Lưu trữ đám mây 100GB",
            "Hỗ trợ xuất video 4K 60fps"
        ],
        pricing: [
            { duration: "1 tháng", price: "120.000 VNĐ" },
            { duration: "1 năm", price: "950.000 VNĐ" }
        ]
    },
    {
        id: "canva-pro",
        slug: "canva-pro",
        name: "Canva Pro",
        shortDesc: "Thiết kế đồ họa chuyên nghiệp, dễ dàng cho mọi người",
        description: "Mở khóa toàn bộ tiềm năng sáng tạo của bạn với Canva Pro. Truy cập hàng triệu mẫu thiết kế, hình ảnh cao cấp và các công cụ hỗ trợ AI như xóa nền, đổi kích cỡ ma thuật.",
        image: "/images/canva.jpg",
        features: [
            "Hàng triệu hình ảnh và font chữ cao cấp",
            "Công cụ xóa nền chỉ bằng một cú nhấp",
            "Đổi kích cỡ thiết kế nhanh chóng (Magic Resize)",
            "Lập kế hoạch nội dung mạng xã hội",
            "Lưu dự liệu và thương hiệu riêng biệt"
        ],
        pricing: [
            { duration: "1 tháng", price: "150.000 VNĐ" },
            { duration: "6 tháng", price: "650.000 VNĐ" },
            { duration: "1 năm", price: "1.200.000 VNĐ" }
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
            { duration: "1 tháng", price: "450.000 VNĐ" },
            { duration: "1 năm", price: "4.800.000 VNĐ" }
        ]
    }
];

// Compact premium products for homepage
export const premiumProducts: CompactProduct[] = [
    {
        id: "chatgpt-plus",
        slug: "chatgpt-plus",
        title: "ChatGPT Plus",
        bullets: ["Truy cập GPT-4", "Ưu tiên tốc độ", "Hỗ trợ 24/7"],
        startingPrice: "550.000đ",
        image: "/images/chatgpt-plus.png"
    },
    {
        id: "youtube-premium",
        slug: "youtube-premium",
        title: "YouTube Premium",
        bullets: ["Xem không quảng cáo", "Tải video offline", "YouTube Music"],
        startingPrice: "180.000đ",
        image: "/images/youtube.png"
    },
    {
        id: "capcut-pro",
        slug: "capcut-pro",
        title: "CapCut Pro",
        bullets: ["Chỉnh sửa chuyên nghiệp", "Hiệu ứng cao cấp", "Không watermark"],
        startingPrice: "120.000đ",
        image: "/images/capcut.jpg"
    },
    {
        id: "canva-pro",
        slug: "canva-pro",
        title: "Canva Pro",
        bullets: ["Hàng triệu template", "Background remover", "Magic resize"],
        startingPrice: "150.000đ",
        image: "/images/canva.jpg"
    },
    {
        id: "netflix-premium",
        slug: "netflix-premium",
        title: "Netflix Premium",
        bullets: ["Chất lượng 4K", "4 màn hình cùng lúc", "Gift code hợp lệ"],
        startingPrice: "260.000đ",
        image: "/images/netflix.jpg"
    },
    {
        id: "gemini-pro",
        slug: "gemini-pro",
        title: "Gemini Pro",
        bullets: ["AI tiên tiến", "Phân tích đa phương tiện", "Tốc độ cao"],
        startingPrice: "450.000đ",
        image: "/images/gemini.jpg"
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
        image: "/images/tiktok-follow.png",
    },
    {
        id: "facebook-followers",
        title: "Tăng follow Facebook",
        bullets: ["Người dùng thật", "Tăng trưởng ổn định", "An toàn với thuật toán"],
        ctaText: "Liên hệ",
        ctaLink: "/lien-he",
        image: "/images/facebook-follow.png",
    },
    {
        id: "instagram-followers",
        title: "Tăng follow Instagram",
        bullets: ["Follow chất lượng cao", "Tăng engagement", "Hỗ trợ 24/7"],
        ctaText: "Bắt đầu",
        ctaLink: "/lien-he",
        image: "/images/instagram-follow.png",
    },
];
