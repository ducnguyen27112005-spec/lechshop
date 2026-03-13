"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { DashboardKPI } from "@/components/admin/dashboard/DashboardKPI";
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts";
import { DashboardAlerts } from "@/components/admin/dashboard/DashboardAlerts";
import { DashboardFilterBar, FilterState } from "@/components/admin/dashboard/DashboardFilterBar";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { format, subDays } from "date-fns";
import { Eye, Copy, Check, ChevronDown } from "lucide-react";

export default function AdminDashboardPage() {
    const today = new Date();

    const [filter, setFilter] = useState<FilterState>({
        from: format(subDays(today, 6), "yyyy-MM-dd"), // 7days default
        to: format(today, "yyyy-MM-dd"),
        type: "all",
        preset: "7days",
    });

    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const url = new URL("/api/admin/dashboard/summary", window.location.origin);
            url.searchParams.set("from", filter.from);
            url.searchParams.set("to", filter.to);
            url.searchParams.set("type", filter.type);

            const res = await fetch(url.toString());
            if (!res.ok) {
                throw new Error("Failed to fetch dashboard data");
            }
            const json = await res.json();
            setData(json);
            setLastUpdated(new Date());
        } catch (err: any) {
            console.error("Dashboard fetch error:", err);
            setError("Không thể tải dữ liệu bảng điều khiển. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        // Prevent fetching if custom and dates aren't fully formed (though HTML5 date picker usually guarantees yyyy-MM-dd)
        if (filter.from && filter.to) {
            fetchData();
        }
    }, [filter, fetchData]);

    const statusColors: Record<string, string> = {
        PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
        NEW: "bg-blue-50 text-blue-700 border-blue-200",
        COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        FAILED: "bg-red-50 text-red-700 border-red-200",
        PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
    };

    const statusLabels: Record<string, string> = {
        PAID: "Đã TT",
        PENDING: "Chờ TT",
        CANCELLED: "Đã hủy",
        NEW: "Mới",
        COMPLETED: "Hoàn thành",
        FAILED: "Lỗi",
        PROCESSING: "Đang xử lý",
    };

    const handleStatusChange = async (orderId: string, currentType: 'product' | 'social', newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: currentType, normalizedStatus: newStatus })
            });
            const result = await res.json();

            if (!res.ok) throw new Error(result.error || "Update failed");

            showToast("Đã cập nhật trạng thái đơn hàng");

            // Cập nhật state nội bộ để UI đổi liền
            setData((prev: any) => ({
                ...prev,
                recentOrders: prev.recentOrders.map((o: any) =>
                    o.id === orderId ? { ...o, status: newStatus } : o
                )
            }));
        } catch (err: any) {
            console.error(err);
            showToast(err.message || "Lỗi cập nhật", "error");
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast(`Đã copy mã: ${text}`);
    };

    const STATUS_OPTIONS = [
        { value: 'CHO_THANH_TOAN', label: 'Chờ xử lý / Mới' },
        { value: 'DA_THANH_TOAN', label: 'Đã thanh toán' },
        { value: 'DANG_XU_LY', label: 'Đang xử lý' },
        { value: 'HOAN_TAT', label: 'Hoàn thành' },
        { value: 'THAT_BAI', label: 'Lỗi / Cần thông tin' },
        { value: 'DA_HUY', label: 'Đã hủy' }
    ];

    return (
        <div className="space-y-6 relative">
            {/* Simple Toast */}
            {toast && toast.show && (
                <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-bold flex items-center gap-2 transition-all animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {toast.type === 'success' ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">!</div>}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <PageHeader
                title="Bảng điều khiển"
                description="Tổng quan hoạt động kinh doanh"
            />

            {/* Filter Bar */}
            <DashboardFilterBar
                filter={filter}
                onChange={setFilter}
                onRefresh={fetchData}
                isLoading={isLoading}
                lastUpdated={lastUpdated}
            />

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-sm">Lỗi tải dữ liệu</p>
                            <p className="text-xs text-red-600 mt-0.5">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-white text-red-700 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Loading Overlay or Layout */}
            {isLoading && !data && (
                <div className="flex flex-col gap-6 animate-pulse">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white h-[120px] rounded-2xl border border-gray-100"></div>)}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-2 bg-white h-[320px] rounded-2xl border border-gray-100"></div>
                        <div className="bg-white h-[320px] rounded-2xl border border-gray-100"></div>
                    </div>
                </div>
            )}

            {data && (
                <>
                    {/* KPI Cards */}
                    <DashboardKPI
                        stats={data.kpi}
                        compare={data.compare}
                        filter={filter}
                    />

                    {/* Charts */}
                    <DashboardCharts
                        revenueByDay={data.charts.revenueByDay}
                        ordersByDay={data.charts.ordersByDay}
                        statusBreakdown={data.statusBreakdown}
                    />

                    {/* Bottom Section: Recent Orders + Alerts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="text-sm font-black text-gray-900">Đơn hàng gần đây ({filter.preset === 'thisMonth' ? 'Tháng này' : filter.preset === '30days' ? '30 ngày' : '7 ngày'})</h3>
                                <Link
                                    href={`/admin/orders?from=${filter.from}&to=${filter.to}&type=${filter.type}`}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Xem tất cả →
                                </Link>
                            </div>
                            <div className="overflow-x-auto relative min-h-[150px]">
                                {isLoading && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
                                        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 hidden md:table-header-group">
                                        <tr>
                                            <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Mã đơn</th>
                                            <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Loại / Nguồn</th>
                                            <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Khách hàng</th>
                                            <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Số tiền</th>
                                            <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap hidden lg:table-cell">Ngày</th>
                                            <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 flex flex-col md:table-row-group">
                                        {data.recentOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500 font-medium">
                                                    Không có đơn hàng nào trong khoảng thời gian này.
                                                </td>
                                            </tr>
                                        ) : data.recentOrders.map((order: any) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group flex flex-col md:table-row py-3 md:py-0">
                                                <td className="px-5 py-1.5 md:py-3 flex justify-between items-center md:table-cell">
                                                    <span className="text-[10px] md:hidden font-bold text-gray-400">MÃ ĐƠN</span>
                                                    <span className="text-xs font-black text-blue-600">#{order.code}</span>
                                                </td>
                                                <td className="px-5 py-1.5 md:py-3 flex justify-between items-center md:table-cell">
                                                    <span className="text-[10px] md:hidden font-bold text-gray-400">LOẠI NGUỒN</span>
                                                    <div className="text-right md:text-left">
                                                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${order.type === 'product' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-pink-50 text-pink-700 border border-pink-100'}`}>
                                                            {order.type === 'product' ? 'Sản phẩm' : 'Social'}
                                                        </span>
                                                        <p className="text-[10px] text-gray-400 mt-0.5 font-medium hidden md:block">{order.source}</p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-1.5 md:py-3 flex justify-between items-center md:table-cell">
                                                    <span className="text-[10px] md:hidden font-bold text-gray-400">KHÁCH HÀNG</span>
                                                    <div className="text-right md:text-left">
                                                        <p className="text-xs font-bold text-gray-900">{order.customerName}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium truncate max-w-[120px] sm:max-w-[200px]" title={order.contact}>{order.contact}</p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-1.5 md:py-3 flex justify-between items-center md:table-cell">
                                                    <span className="text-[10px] md:hidden font-bold text-gray-400">SỐ TIỀN</span>
                                                    <span className="text-xs font-bold text-gray-900">{formatCurrency(order.amount)}</span>
                                                </td>
                                                <td className="px-5 py-1.5 md:py-3 flex justify-between items-center hidden lg:table-cell">
                                                    <span className="text-[11px] text-gray-400 font-medium">{formatDate(order.createdAt)}</span>
                                                </td>
                                                <td className="px-5 py-1.5 md:py-3 flex justify-between items-center md:table-cell text-right">
                                                    <span className="text-[10px] md:hidden font-bold text-gray-400">THAO TÁC</span>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="relative">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleStatusChange(order.id, order.type, e.target.value)}
                                                                className={`appearance-none px-2 pr-6 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${statusColors[order.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
                                                            >
                                                                {STATUS_OPTIONS.map(opt => (
                                                                    <option key={opt.value} value={opt.value} className="text-gray-900 bg-white font-medium uppercase tracking-normal">
                                                                        {opt.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className={`w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${statusColors[order.status] ? (statusColors[order.status].includes('emerald') ? 'text-emerald-600' : statusColors[order.status].includes('amber') ? 'text-amber-600' : statusColors[order.status].includes('red') ? 'text-red-600' : 'text-blue-600') : 'text-gray-400'}`} />
                                                        </div>
                                                        <button
                                                            onClick={() => handleCopy(order.code)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="Copy MÃ ĐƠN"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                        <Link
                                                            href={order.type === 'product' ? `/admin/orders/${order.id}` : `/admin/social`}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Alerts */}
                        <DashboardAlerts alerts={data.alerts || []} />
                    </div>
                </>
            )}
        </div>
    );
}
