"use client";

import Link from "next/link";
import { Plus, Package, BarChart2 } from "lucide-react";

const actions = [
    {
        label: "Tạo đơn",
        href: "/admin/orders",
        icon: Plus,
        color: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
    },
    {
        label: "Thêm sản phẩm",
        href: "/admin/products/premium",
        icon: Package,
        color: "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200",
    },
    {
        label: "Xem báo cáo",
        href: "/admin/orders",
        icon: BarChart2,
        color: "bg-gray-900 hover:bg-gray-800 text-white shadow-gray-300",
    },
];

export function DashboardQuickActions() {
    return (
        <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
                <Link
                    key={action.label}
                    href={action.href}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 ${action.color}`}
                >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                </Link>
            ))}
        </div>
    );
}
