export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image?: string; // Legacy
    thumbnail: string | null;
    thumbnailUrl: string | null;
    status: "DRAFT" | "PUBLISHED" | "HIDDEN";
    viewCount: number;
    isFeatured: boolean;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    categoryId?: string;
    category?: { name: string; slug: string };
    tags?: { id: string; name: string; slug: string }[];
    date: string;
    author: string;
}

export const posts: Post[] = [
    {
        id: "1",
        slug: "huong-dan-dang-ky-netflix",
        title: "Hướng dẫn đăng ký tài khoản Netflix Premium",
        excerpt:
            "Cách đăng ký và sử dụng Netflix Premium một cách an toàn, tiết kiệm và hiệu quả nhất.",
        content: `
# Hướng dẫn đăng ký tài khoản Netflix Premium

Netflix là nền tảng giải trí trực tuyến hàng đầu thế giới...

## Các bước đăng ký

1. Truy cập trang chủ Netflix
2. Chọn gói Premium phù hợp
3. Thanh toán qua gift code hợp lệ
4. Kích hoạt tài khoản

## Lợi ích của gói Premium

- Chất lượng 4K Ultra HD
- Xem đồng thời 4 màn hình
- Download không giới hạn
    `,
        image: "/images/hero-1.jpg",
        thumbnail: "/images/hero-1.jpg",
        thumbnailUrl: "/images/hero-1.jpg",
        status: "PUBLISHED",
        viewCount: 0,
        isFeatured: false,
        date: "2026-01-25",
        author: "Admin",
    },
    {
        id: "2",
        slug: "chatgpt-plus-la-gi",
        title: "ChatGPT Plus là gì? Có nên nâng cấp không?",
        excerpt:
            "Tìm hiểu về các tính năng vượt trội của ChatGPT Plus và lý do bạn nên nâng cấp ngay hôm nay.",
        content: `
# ChatGPT Plus là gì?

ChatGPT Plus là phiên bản cao cấp của ChatGPT...

## Ưu điểm

- Truy cập GPT-4 và GPT-4 Turbo
- Tốc độ phản hồi nhanh hơn
- Ưu tiên trong giờ cao điểm
    `,
        image: "/images/hero-2.jpg",
        thumbnail: "/images/hero-2.jpg",
        thumbnailUrl: "/images/hero-2.jpg",
        status: "PUBLISHED",
        viewCount: 0,
        isFeatured: false,
        date: "2026-01-20",
        author: "Admin",
    },
    {
        id: "3",
        slug: "bao-mat-tai-khoan",
        title: "Bảo mật tài khoản: Những điều cần biết",
        excerpt:
            "Hướng dẫn chi tiết cách bảo vệ tài khoản Netflix và ChatGPT của bạn khỏi rủi ro.",
        content: `
# Bảo mật tài khoản

Bảo mật tài khoản là vô cùng quan trọng...

## Các biện pháp bảo mật

- Sử dụng mật khẩu mạnh
- Bật xác thực 2 yếu tố
- Không chia sẻ thông tin đăng nhập
    `,
        image: "/images/hero-3.jpg",
        thumbnail: "/images/hero-3.jpg",
        thumbnailUrl: "/images/hero-3.jpg",
        status: "PUBLISHED",
        viewCount: 0,
        isFeatured: false,
        date: "2026-01-15",
        author: "Admin",
    },
    {
        id: "4",
        slug: "so-sanh-cac-goi-netflix",
        title: "So sánh các gói Netflix: Chọn gói nào phù hợp?",
        excerpt:
            "Phân tích chi tiết các gói Netflix để giúp bạn lựa chọn phù hợp với nhu cầu.",
        content: `
# So sánh các gói Netflix

Netflix có 3 gói chính: Basic, Standard, Premium...
    `,
        image: "/images/hero-1.jpg",
        thumbnail: "/images/hero-1.jpg",
        thumbnailUrl: "/images/hero-1.jpg",
        status: "PUBLISHED",
        viewCount: 0,
        isFeatured: false,
        date: "2026-01-10",
        author: "Admin",
    },
];
