"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: string;
    type?: "order" | "payment" | "fulfill" | "post" | "active";
}

const colors: Record<string, string> = {
    // PaymentStatus
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    PAID: "bg-green-100 text-green-700 border-green-200",
    FAILED: "bg-red-100 text-red-700 border-red-200",
    REFUNDED: "bg-gray-100 text-gray-700 border-gray-200",

    // FulfillStatus
    NEW: "bg-blue-100 text-blue-700 border-blue-200",
    PROCESSING: "bg-purple-100 text-purple-700 border-purple-200",
    DONE: "bg-green-100 text-green-700 border-green-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",

    // PostStatus
    DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
    PUBLISHED: "bg-green-100 text-green-700 border-green-200",

    // Active
    true: "bg-green-100 text-green-700 border-green-200",
    false: "bg-red-100 text-red-700 border-red-200",
};

const labels: Record<string, string> = {
    PENDING: "Chờ thanh toán",
    PAID: "Đã thanh toán",
    FAILED: "Thất bại",
    REFUNDED: "Đã hoàn tiền",
    NEW: "Mới",
    PROCESSING: "Đang xử lý",
    DONE: "Hoàn tất",
    CANCELLED: "Đã hủy",
    DRAFT: "Bản nháp",
    PUBLISHED: "Công khai",
    true: "Đang hoạt động",
    false: "Ngừng hoạt động",
};

export function StatusBadge({ status, type }: StatusBadgeProps) {
    const colorClass = colors[status] || "bg-gray-100 text-gray-600 border-gray-200";
    const label = labels[status] || status;

    return (
        <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
            colorClass
        )}>
            {label}
        </span>
    );
}
