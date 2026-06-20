"use client";

import {
    ShoppingBag,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    UserPlus,
    XCircle,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { FilterState } from "./DashboardFilterBar";

interface KPIStat {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    isUp?: boolean;
    color: string;
    bgColor: string;
    href?: string;
}

function StatCard({ title, value, icon: Icon, trend, isUp, color, bgColor, href }: KPIStat) {
    const cardContent = (
        <div className={cn(
            "group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300",
            href ? "hover:shadow-md hover:border-gray-200 cursor-pointer" : "cursor-default"
        )}>
            <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2.5 rounded-xl", bgColor)}>
                    <Icon className={cn("h-5 w-5", color)} />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-0.5 text-[11px] font-bold px-2 py-1 rounded-full",
                        isUp
                            ? "text-emerald-700 bg-emerald-50"
                            : "text-red-700 bg-red-50"
                    )}>
                        {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-2xl font-black text-gray-900 group-hover:text-gray-800 transition-colors">{value}</p>
            <p className="text-[10px] text-gray-400 font-medium mt-1">so với kỳ trước</p>
        </div>
    );

    if (href) {
        return <Link href={href}>{cardContent}</Link>;
    }
    return cardContent;
}

interface DashboardKPIProps {
    stats: {
        totalOrders: number;
        revenue: number;
        pendingOrders: number;
        aov: number;
        newCustomers: number;
        cancelledOrders: number;
    };
    compare: {
        totalOrders: number;
        revenue: number;
        aov: number;
        pendingOrders: number;
        newCustomers: number;
        cancelledOrders: number;
    };
    filter: FilterState;
}

function formatPercent(val: number) {
    const prefixed = val > 0 ? `+${val.toFixed(1)}%` : `${val.toFixed(1)}%`;
    // clean up '.0' if present
    return prefixed.replace('.0%', '%');
}

export function DashboardKPI({ stats, compare, filter }: DashboardKPIProps) {
    const queryParams = `?from=${filter.from}&to=${filter.to}&type=${filter.type}`;

    const kpiCards: KPIStat[] = [
        {
            title: "Tổng đơn hàng",
            value: stats.totalOrders.toLocaleString("vi-VN"),
            icon: ShoppingBag,
            trend: formatPercent(compare.totalOrders),
            isUp: compare.totalOrders >= 0,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            href: `/admin/orders${queryParams}`
        },
        {
            title: "Doanh thu",
            value: formatCurrency(stats.revenue),
            icon: CreditCard,
            trend: formatPercent(compare.revenue),
            isUp: compare.revenue >= 0,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            href: `/admin/orders${queryParams}` // could be filtered by PAID
        },

        {
            title: "Đơn trung bình (AOV)",
            value: formatCurrency(stats.aov),
            icon: BarChart3,
            trend: formatPercent(compare.aov),
            isUp: compare.aov >= 0,
            color: "text-cyan-600",
            bgColor: "bg-cyan-50",
        },
        {
            title: "Đơn hàng chờ",
            value: stats.pendingOrders,
            icon: Clock,
            trend: formatPercent(compare.pendingOrders),
            isUp: compare.pendingOrders >= 0, // Less is better but technically it's a raw stat
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            href: `/admin/orders?status=PENDING&from=${filter.from}&to=${filter.to}&type=${filter.type}`
        },
        {
            title: "Khách hàng mới",
            value: stats.newCustomers,
            icon: UserPlus,
            trend: formatPercent(compare.newCustomers),
            isUp: compare.newCustomers >= 0,
            color: "text-pink-600",
            bgColor: "bg-pink-50",
        },
        {
            title: "Đơn hủy",
            value: stats.cancelledOrders,
            icon: XCircle,
            trend: formatPercent(compare.cancelledOrders),
            isUp: compare.cancelledOrders < 0, // Green if cancelled went down
            color: "text-red-600",
            bgColor: "bg-red-50",
            href: `/admin/orders?status=CANCELLED&from=${filter.from}&to=${filter.to}&type=${filter.type}`
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {kpiCards.map((card) => (
                <StatCard key={card.title} {...card} />
            ))}
        </div>
    );
}
