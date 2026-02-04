"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users2,
    FileText,
    HelpCircle,
    Settings,
    ChevronRight,
    CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { label: "Bảng điều khiển", href: "/admin", icon: LayoutDashboard },
    { label: "Lịch sử chuyển tiền", href: "/admin/transactions", icon: CreditCard },
    { label: "Đơn hàng sản phẩm", href: "/admin/orders?type=PREMIUM", icon: ShoppingBag },
    { label: "Đơn hàng Social", href: "/admin/orders?type=SOCIAL", icon: Users2 },
    { label: "Quản lý Banner", href: "/admin/banners", icon: Package },
    { label: "Bài viết và tin tức", href: "/admin/posts", icon: FileText },
    { label: "Câu hỏi thường gặp", href: "/admin/faq", icon: HelpCircle },
    { label: "Cài đặt hệ thống", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-gray-900 text-white flex flex-col h-full border-r border-gray-800">
            <div className="p-6">
                <div className="text-xl font-black tracking-tighter text-blue-400">
                    QUẢN TRỊ VIÊN
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 shadow-sm"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("h-5 w-5", isActive ? "text-blue-400" : "text-gray-400")} />
                                {item.label}
                            </div>
                            {isActive && <ChevronRight className="h-4 w-4" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                    <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center font-black">A</div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">Quản trị viên</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Quyền Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
