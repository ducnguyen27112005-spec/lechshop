export const categoryMap: Record<string, { title: string; productIds: string[]; description?: string }> = {
    "giai-tri": {
        title: "Giải trí cao cấp",
        description: "Nâng tầm trải nghiệm giải trí với các tài khoản Premium chất lượng cao, hình ảnh 4K, không quảng cáo.",
        productIds: ["netflix-premium", "youtube-premium"]
    },
    "cong-cu-ai": {
        title: "Công cụ AI thông minh",
        description: "Tổng hợp các trợ lý trí tuệ nhân tạo (AI) hàng đầu thế giới.",
        productIds: ["chatgpt-plus", "gemini-pro"]
    },
    "sang-tao-noi-dung": {
        title: "Thiết kế & Đồ họa",
        description: "Công cụ hỗ trợ thiết kế, biên tập video và sáng tạo nội dung chuyên nghiệp.",
        productIds: ["capcut-pro", "canva-pro"]
    },
    "lam-viec-van-phong": {
        title: "Làm việc & Văn phòng",
        description: "Tối ưu hóa hiệu suất làm việc với bộ công cụ văn phòng và quản lý dự án hàng đầu.",
        productIds: []
    },
    "hoc-tap-nghien-cuu": {
        title: "Học tập & Nghiên cứu",
        description: "Tiếp cận kho tri thức nhân loại và nâng cao kỹ năng ngoại ngữ.",
        productIds: []
    },
    "kinh-doanh-marketing": {
        title: "Kinh doanh & Marketing",
        description: "Giải pháp hỗ trợ quảng cáo và tiếp thị kỹ thuật số hiệu quả.",
        productIds: []
    },
    "mxh": {
        title: "Tăng tương tác MXH",
        description: "Dịch vụ tăng tương tác, follow và like cho các nền tảng mạng xã hội phổ biến.",
        productIds: [
            "tiktok-followers",
            "facebook-followers",
            "instagram-followers",
            "youtube-subscribers",
            "google-maps-review",
            "threads-followers",
            "shopee-services",
            "spotify-services",
            "website-traffic-services",
            "twitter-services"
        ]
    },
    "phan-mem": {
        title: "Phần mềm & Bảo mật",
        description: "Cung cấp key bản quyền phần mềm chính hãng, bảo mật và ổn định.",
        productIds: []
    },
    "dich-vu-ban-chay": {
        title: "Dịch vụ bán chạy",
        description: "Những sản phẩm và dịch vụ được khách hàng tin dùng và lựa chọn nhiều nhất.",
        productIds: ["netflix-premium", "chatgpt-plus", "youtube-premium", "canva-pro"]
    }
};

export const CATEGORIES = Object.entries(categoryMap).map(([slug, data]) => ({
    slug,
    title: data.title
}));
