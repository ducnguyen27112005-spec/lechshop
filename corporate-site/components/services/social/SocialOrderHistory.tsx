"use client";

import { useEffect, useState } from "react";
import { Copy, Loader2, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SocialOrder {
    id: string;
    code: string;
    serviceName: string;
    targetUrl: string;
    quantity: number | null;
    totalPrice: number | null;
    status: string;
    createdAt: string;
    server: string;
    startCount: number;
    buffCount: number;
}

// Mock Data Generator (since backend might not have all fields yet)
const mockOrders: SocialOrder[] = [
    // Empty for now to show empty state, or populate if needed
];

export function SocialOrderHistory({ serviceSlug }: { serviceSlug?: string }) {
    const [orders, setOrders] = useState<SocialOrder[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [rowsPerPage, setRowsPerPage] = useState("10");
    const [sortOrder, setSortOrder] = useState("newest");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/social/orders");
            if (res.ok) {
                const data = await res.json();
                // Transform data if needed to match SocialOrder interface
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Đã sao chép");
    };

    return (
        <div className="space-y-6">
            {/* Header / Title */}
            <div className="flex items-center justify-between">
                <h3 className="text-gray-700 font-bold uppercase">Lịch sử đặt hàng</h3>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-1">
                {/* Rows Per Page */}
                <div className="md:col-span-1">
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(e.target.value)}
                        className="w-full h-10 px-3 py-2 bg-white border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="md:col-span-2">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full h-10 px-3 py-2 bg-white border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                </div>

                {/* Date From */}
                <div className="md:col-span-2">
                    <div className="relative">
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="bg-white"
                        />
                    </div>
                </div>

                {/* Date To */}
                <div className="md:col-span-2">
                    <div className="relative">
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="bg-white"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-10 px-3 py-2 bg-white border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="all">Tất cả</option>
                        <option value="running">Đang chạy</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>

                {/* Search */}
                <div className="md:col-span-3 flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white pl-8"
                        />
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <Button variant="outline" size="icon" className="shrink-0 bg-white" title="Xóa bộ lọc" onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setDateFrom("");
                        setDateTo("");
                        setRowsPerPage("10");
                        setSortOrder("newest");
                    }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-md bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#e4e7ea] text-gray-700 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-3 min-w-[100px]">Thông tin</th>
                                <th className="p-3 min-w-[200px]">Chi tiết</th>
                                <th className="p-3 min-w-[150px]">Cấu hình</th>
                                <th className="p-3 min-w-[150px]">Thời gian</th>
                                <th className="p-3 min-w-[100px]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center bg-gray-50">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                                        <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center bg-white">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            {/* Empty State Icon similar to screenshot */}
                                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
                                                    alt="Empty"
                                                    className="w-12 h-12 opacity-50 grayscale"
                                                />
                                            </div>
                                            <span className="text-gray-500 font-medium">Chưa có đơn hàng nào.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="p-3 align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-gray-900">#{order.code}</span>
                                                <span className="text-xs text-gray-500">{order.serviceName}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 align-top">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1 max-w-[250px]">
                                                    <span className="text-xs font-semibold text-gray-500 shrink-0">Link:</span>
                                                    <a href={order.targetUrl} target="_blank" className="text-blue-500 hover:underline truncate text-xs block">
                                                        {order.targetUrl}
                                                    </a>
                                                    <button onClick={() => copyToClipboard(order.targetUrl)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Copy className="w-3 h-3 text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 align-top">
                                            <div className="space-y-1 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Người mua:</span>
                                                    <span className="font-medium text-purple-600">user_test</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Số lượng:</span>
                                                    <span className="font-bold">{order.quantity}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Tổng tiền:</span>
                                                    <span className="font-bold text-red-500">{order.totalPrice?.toLocaleString()}đ</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 align-top">
                                            <div className="text-xs text-gray-500">
                                                <div>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                                                <div>{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</div>
                                            </div>
                                        </td>
                                        <td className="p-3 align-top">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {order.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer (Mockup) */}
                {orders.length > 0 && (
                    <div className="p-4 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-600">
                        <span>Hiển thị 1 đến {orders.length} trong số {orders.length} bản ghi</span>
                        <div className="flex gap-1">
                            <Button variant="outline" size="sm" disabled className="h-7 w-7 p-0">{"<"}</Button>
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-blue-500 text-white hover:bg-blue-600 border-blue-600">1</Button>
                            <Button variant="outline" size="sm" disabled className="h-7 w-7 p-0">{">"}</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
