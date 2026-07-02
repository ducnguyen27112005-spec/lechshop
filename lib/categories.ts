export const categoryMap: Record<string, { title: string; productIds: string[]; description?: string }> = {
    "giai-tri": {
        title: "Giải trí cao cấp",
        description: "Nâng tầm trải nghiệm giải trí với các tài khoản Premium chất lượng cao, hình ảnh 4K, không quảng cáo.",
        productIds: ["netflix-premium", "youtube-premium", "locket-gold"]
    },
    "cong-cu-ai": {
        title: "Công cụ AI thông minh",
        description: "Tổng hợp các trợ lý trí tuệ nhân tạo (AI) hàng đầu thế giới.",
        productIds: ["chatgpt-plus", "gemini-pro", "google-veo3-ai", "super-grok-ai"]
    },
    "sang-tao-noi-dung": {
        title: "Thiết kế & Đồ họa",
        description: "Công cụ hỗ trợ thiết kế, biên tập video và sáng tạo nội dung chuyên nghiệp.",
        productIds: ["capcut-pro", "canva-pro", "adobe-full-apps", "meitu-svip-1"]
    },
    "lam-viec-van-phong": {
        title: "Làm việc & Văn phòng",
        description: "Tối ưu hóa hiệu suất làm việc với bộ công cụ văn phòng và quản lý dự án hàng đầu.",
        productIds: ["microsoft-office-365"]
    },
    "hoc-tap-nghien-cuu": {
        title: "Học tập & Nghiên cứu",
        description: "Tiếp cận kho tri thức nhân loại và nâng cao kỹ năng ngoại ngữ.",
        productIds: []
    },
    "kinh-doanh-marketing": {
        title: "Kinh doanh & Marketing",
        description: "Giải pháp hỗ trợ quảng cáo và tiếp thị kỹ thuật số hiệu quả.",
        productIds: ["nhom-zalo-1000-mem-2"]
    },
    "mxh": {
        title: "Tăng tương tác MXH",
        description: "Dịch vụ tăng tương tác, follow và like cho các nền tảng mạng xã hội phổ biến.",
        productIds: [
            "tiktok-followers",
            "facebook-followers",
            "instagram-followers",
            "youtube-subscribers",
            "threads-followers",
            "shopee-services",
            "tiktok-live-gio-hang-aff"
        ]
    },
    "dich-vu-ban-chay": {
        title: "Dịch vụ bán chạy",
        description: "Những sản phẩm và dịch vụ được khách hàng tin dùng và lựa chọn nhiều nhất.",
        productIds: ["netflix-premium", "chatgpt-plus", "youtube-premium", "canva-pro"]
    },
    "khac": {
        title: "Sản phẩm khác",
        description: "Các sản phẩm, dịch vụ và tài khoản tiện ích khác.",
        productIds: []
    }
};

export const CATEGORIES = Object.entries(categoryMap).map(([slug, data]) => ({
    slug,
    title: data.title
}));
