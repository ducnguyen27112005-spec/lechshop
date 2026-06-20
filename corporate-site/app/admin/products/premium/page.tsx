"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { DataTable } from "@/components/admin/shared/DataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";

export default function PremiumProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/admin/premium-products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: "Tên sản phẩm", accessor: (item: any) => (
                <div className="flex items-center gap-3">
                    {item.thumbnail && (
                        <img src={item.thumbnail} alt="" className="h-8 w-8 rounded-lg object-cover" />
                    )}
                    <span>{item.name}</span>
                </div>
            )
        },
        { header: "Slug", accessor: "slug" },
        { header: "Giá", accessor: (item: any) => formatCurrency(item.price) },
        { header: "Thời hạn", accessor: (item: any) => `${item.durationDays} ngày` },
        {
            header: "Trạng thái", accessor: (item: any) => (
                <StatusBadge status={String(item.isActive)} />
            )
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sản phẩm Premium"
                description="Quản lý danh sách các tài khoản Premium (Netflix, ChatGPT...)."
            >
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all">
                    <Plus className="h-5 w-5" /> Thêm sản phẩm
                </button>
            </PageHeader>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={products}
                isLoading={loading}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
            />
        </div>
    );
}
