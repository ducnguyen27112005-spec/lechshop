"use client";

import { useEffect, useState } from "react";
import {
    ShoppingBag,
    Users2,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    isUp?: boolean;
    color: string;
}

function StatCard({ title, value, icon: Icon, trend, isUp, color }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl", color)}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-bold",
                        isUp ? "text-green-600" : "text-red-600"
                    )}>
                        {isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {trend}
                    </div>
                )}
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</h3>
            <p className="text-3xl font-black text-gray-900">{value}</p>
        </div>
    );
}

import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        revenue: 0,
        pendingOrders: 0,
    });

    // Simulated fetching for now
    useEffect(() => {
        setStats({
            totalOrders: 156,
            revenue: 14500000,
            pendingOrders: 12,
        });
    }, []);

    return (
        <div className="space-y-8">
            <PageHeader
                title="Bảng điều khiển tổng quan"
                description="Chào mừng bạn quay lại hệ thống quản trị."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Tổng đơn hàng"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    trend="+12% so với tháng trước"
                    isUp={true}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Doanh thu"
                    value={formatCurrency(stats.revenue)}
                    icon={CreditCard}
                    trend="+8.5%"
                    isUp={true}
                    color="bg-green-600"
                />
                <StatCard
                    title="Đơn hàng chờ"
                    value={stats.pendingOrders}
                    icon={TrendingUp}
                    color="bg-yellow-600"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900">Đơn hàng gần đây</h3>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Xem tất cả</button>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Mã đơn</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Số tiền</th>
                                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-bold text-blue-600">#ORD-12345</td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-gray-900">Nguyễn Văn A</p>
                                    <p className="text-[11px] text-gray-400 font-medium">vana@gmail.com</p>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatCurrency(250000)}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700 border border-green-200">
                                        PAID
                                    </span>
                                </td>
                            </tr>
                            {/* More rows... */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
