"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { DataTable } from "@/components/admin/shared/DataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: "Mã đơn", accessor: (item: any) => (
                <span className="text-blue-600 font-black">#{item.code}</span>
            )
        },
        {
            header: "Khách hàng", accessor: (item: any) => (
                <div>
                    <p className="font-bold">{item.customerName}</p>
                    <p className="text-[11px] text-gray-400">{item.customerEmail}</p>
                </div>
            )
        },
        { header: "Loại", accessor: "type" },
        { header: "Tổng tiền", accessor: (item: any) => formatCurrency(item.amount) },
        {
            header: "Thanh toán", accessor: (item: any) => (
                <StatusBadge status={item.paymentStatus} />
            )
        },
        {
            header: "Xử lý", accessor: (item: any) => (
                <StatusBadge status={item.fulfillStatus} />
            )
        },
        { header: "Ngày đặt", accessor: (item: any) => formatDate(item.createdAt) },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Quản lý đơn hàng"
                description="Theo dõi và xử lý các yêu cầu từ khách hàng."
            />

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        placeholder="Tìm kiếm mã đơn, tên khách, email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 font-bold text-sm">Tất cả</button>
                    <button className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl font-bold text-sm border border-yellow-100">Cần xử lý</button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={orders}
                isLoading={loading}
                onEdit={(item) => console.log("Detail/Edit", item)}
            />
        </div>
    );
}
