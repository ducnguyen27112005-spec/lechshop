export interface Plan {
    id: string;
    label: string;
    durationMonths: number;
    price: number;
    originalPrice?: number; // giá gốc để tính % discount
    discount?: number; // phần trăm giảm giá
    bonus?: string; // thông tin quà tặng kèm
    inStock?: boolean; // trạng thái còn hàng
    accountTemplate?: string; // Mẫu format tài khoản
}

export const productPlans: Record<string, Plan[]> = {
    "chatgpt-plus": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 99000, originalPrice: 520000, discount: 81, accountTemplate: "Email: \nMật khẩu: \nProfile: \nMã PIN: \nHạn sử dụng: " },
        { id: "3m", label: "3 Tháng", durationMonths: 3, price: 329000, originalPrice: 1560000, discount: 79, accountTemplate: "Email: \nMật khẩu: \nProfile: \nMã PIN: \nHạn sử dụng: " },
        { id: "12m", label: "1 Năm", durationMonths: 12, price: 1179000, originalPrice: 6240000, discount: 81, accountTemplate: "Email: \nMật khẩu: \nProfile: \nMã PIN: \nHạn sử dụng: " }
    ],
    "netflix-premium": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 89000, originalPrice: 260000, discount: 65, accountTemplate: "Tài khoản Netflix Premium\nEmail: \nMật khẩu: \nProfile số: \nMã PIN: \nHạn sử dụng: " }
    ],
    "youtube-premium": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 55000, originalPrice: 90000, discount: 39, accountTemplate: "Mời bạn bấm vào link sau để tham gia Family: \n\nEmail của bạn đã được add Premium tới ngày: " },
        { id: "3m", label: "3 Tháng", durationMonths: 3, price: 129000, originalPrice: 165000, discount: 22, accountTemplate: "Mời bạn bấm vào link sau để tham gia Family: \n\nEmail của bạn đã được add Premium tới ngày: " },
        { id: "6m", label: "6 Tháng", durationMonths: 6, price: 219000, originalPrice: 330000, discount: 34, accountTemplate: "Mời bạn bấm vào link sau để tham gia Family: \n\nEmail của bạn đã được add Premium tới ngày: " },
        { id: "12m", label: "1 Năm", durationMonths: 12, price: 439000, originalPrice: 660000, discount: 33, accountTemplate: "Mời bạn bấm vào link sau để tham gia Family: \n\nEmail của bạn đã được add Premium tới ngày: " }
    ],
    "capcut-pro": [
        { id: "7d", label: "7 Ngày", durationMonths: 0.25, price: 19000, originalPrice: 29000, discount: 34, accountTemplate: "Tài khoản CapCut Pro\nEmail đăng nhập: \nMật khẩu: \nHạn sử dụng: " },
        { id: "14d", label: "14 Ngày", durationMonths: 0.5, price: 39000, originalPrice: 59000, discount: 34, accountTemplate: "Tài khoản CapCut Pro\nEmail đăng nhập: \nMật khẩu: \nHạn sử dụng: " },
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 49000, originalPrice: 79000, discount: 38, accountTemplate: "Tài khoản CapCut Pro\nEmail đăng nhập: \nMật khẩu: \nHạn sử dụng: " },
        { id: "3m", label: "3 Tháng", durationMonths: 3, price: 160000, originalPrice: 237000, discount: 32, accountTemplate: "Tài khoản CapCut Pro\nEmail đăng nhập: \nMật khẩu: \nHạn sử dụng: " },
        { id: "6m", label: "6 Tháng", durationMonths: 6, price: 265000, originalPrice: 474000, discount: 44, accountTemplate: "Tài khoản CapCut Pro\nEmail đăng nhập: \nMật khẩu: \nHạn sử dụng: " },
        { id: "12m", label: "1 Năm", durationMonths: 12, price: 440000, originalPrice: 948000, discount: 54, accountTemplate: "Tài khoản CapCut Pro\nEmail đăng nhập: \nMật khẩu: \nHạn sử dụng: " }
    ],
    "canva-pro": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 49000, originalPrice: 90000, discount: 45, accountTemplate: "Link tham gia Nhóm Canva Pro:\n\nTrạng thái: Đã add Email của bạn" },
        { id: "12m", label: "1 Năm", durationMonths: 12, price: 279000, originalPrice: 588000, discount: 52, accountTemplate: "Link tham gia Nhóm Canva Pro:\n\nTrạng thái: Đã add Email của bạn" }
    ],
    "gemini-pro": [
        { id: "12m", label: "1 Năm", durationMonths: 12, price: 189000, originalPrice: 600000, discount: 68, accountTemplate: "Link tham gia Family (Gemini Advanced):\n\nTrạng thái: Đã gửi lời mời, bạn vui lòng check mail" }
    ]
} as const;

export function getPlansForProduct(slug: string, startingPrice: number = 0): Plan[] {
    if (productPlans[slug]) {
        return productPlans[slug];
    }
    // Fallback if no specific plans defined
    return [{ id: "default", label: "Gói cơ bản", durationMonths: 1, price: startingPrice }];
}
