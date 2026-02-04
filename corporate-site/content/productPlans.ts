export interface Plan {
    id: string;
    label: string;
    durationMonths: number;
    price: number;
    originalPrice?: number; // giá gốc để tính % discount
    discount?: number; // phần trăm giảm giá
    bonus?: string; // thông tin quà tặng kèm
}

export const productPlans: Record<string, Plan[]> = {
    "chatgpt-plus": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 550000 },
        { id: "3m", label: "3 Tháng", durationMonths: 3, price: 1500000, originalPrice: 1650000, discount: 10 },
        { id: "12m", label: "1 Năm", durationMonths: 12, price: 5500000, originalPrice: 6600000, discount: 17 }
    ],
    "netflix-premium": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 260000 },
        { id: "3m", label: "3 Tháng", durationMonths: 3, price: 720000, originalPrice: 780000, discount: 8 },
        { id: "6m", label: "6 Tháng", durationMonths: 6, price: 1380000, originalPrice: 1560000, discount: 12 },
        { id: "12m", label: "12 Tháng", durationMonths: 12, price: 2640000, originalPrice: 3120000, discount: 15 }
    ],
    "youtube-premium": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 30000 },
        { id: "3m", label: "3 Tháng", durationMonths: 3, price: 76500, originalPrice: 90000, discount: 15, bonus: "Không Kèm Canva Pro" },
        { id: "6m", label: "6 Tháng", durationMonths: 6, price: 144000, originalPrice: 180000, discount: 20, bonus: "+ Tặng Kèm Canva Pro" },
        { id: "12m", label: "12 Tháng", durationMonths: 12, price: 270000, originalPrice: 360000, discount: 25, bonus: "+ Tặng Kèm Canva Pro" },
        { id: "24m", label: "24 Tháng", durationMonths: 24, price: 468000, originalPrice: 720000, discount: 35, bonus: "+ Tặng Kèm Canva Pro" },
        { id: "36m", label: "36 Tháng", durationMonths: 36, price: 648000, originalPrice: 1080000, discount: 40, bonus: "+ Tặng Kèm Canva Pro" }
    ],
    "capcut-pro": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 120000 },
        { id: "6m", label: "6 Tháng", durationMonths: 6, price: 600000, originalPrice: 720000, discount: 17 },
        { id: "12m", label: "1 Năm", durationMonths: 12, price: 950000, originalPrice: 1440000, discount: 34 }
    ],
    "canva-pro": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 150000 },
        { id: "6m", label: "6 Tháng", durationMonths: 6, price: 650000, originalPrice: 900000, discount: 28 },
        { id: "12m", label: "1 Năm", durationMonths: 12, price: 1200000, originalPrice: 1800000, discount: 33 }
    ],
    "gemini-pro": [
        { id: "1m", label: "1 Tháng", durationMonths: 1, price: 450000 },
        { id: "6m", label: "6 Tháng", durationMonths: 6, price: 2400000, originalPrice: 2700000, discount: 11 },
        { id: "12m", label: "1 Năm", durationMonths: 12, price: 4800000, originalPrice: 5400000, discount: 11 }
    ]
} as const;

export function getPlansForProduct(slug: string, startingPrice: number = 0): Plan[] {
    if (productPlans[slug]) {
        return productPlans[slug];
    }
    // Fallback if no specific plans defined
    return [{ id: "default", label: "Gói cơ bản", durationMonths: 1, price: startingPrice }];
}
