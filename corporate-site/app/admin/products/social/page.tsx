"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { DataTable } from "@/components/admin/shared/DataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { formatCurrency } from "@/lib/utils";

export default function SocialServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/admin/social-services");
            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: "Nền tảng", accessor: (item: any) => (
                <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black">{item.platform}</span>
            )
        },
        { header: "Loại DV", accessor: "serviceType" },
        { header: "Tên dịch vụ", accessor: "name" },
        { header: "Giá/đv", accessor: (item: any) => formatCurrency(item.pricePerUnit) },
        { header: "Min/Max", accessor: (item: any) => `${item.min} - ${item.max}` },
        {
            header: "Trạng thái", accessor: (item: any) => (
                <StatusBadge status={String(item.isActive)} />
            )
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dịch vụ Mạng xã hội"
                description="Quản lý các gói tăng tương tác Facebook, TikTok, Instagram."
            >
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all">
                    <Plus className="h-5 w-5" /> Thêm dịch vụ
                </button>
            </PageHeader>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        placeholder="Tìm kiếm dịch vụ..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 font-bold text-sm transition-all">
                    <Filter className="h-4 w-4" /> Lọc
                </button>
            </div>

            <DataTable
                columns={columns}
                data={services}
                isLoading={loading}
                onEdit={(item) => console.log("Edit", item)}
                onDelete={(item) => console.log("Delete", item)}
            />
        </div>
    );
}
