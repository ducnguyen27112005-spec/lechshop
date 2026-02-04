"use client";

import { useEffect, useState } from "react";
import { Plus, Search, FileText } from "lucide-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { DataTable } from "@/components/admin/shared/DataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/admin/posts");
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: "Tiêu đề bài viết", accessor: (item: any) => (
                <div className="flex items-center gap-3">
                    {item.thumbnail && (
                        <img src={item.thumbnail} alt="" className="h-10 w-16 rounded-lg object-cover bg-gray-100" />
                    )}
                    <div className="max-w-md">
                        <p className="font-bold line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{item.slug}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Trạng thái", accessor: (item: any) => (
                <StatusBadge status={item.status} />
            )
        },
        { header: "Ngày cập nhật", accessor: (item: any) => formatDate(item.updatedAt) },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Bài viết & Tin tức"
                description="Quản lý blog, thông báo và tin tức trên website."
            >
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all">
                    <Plus className="h-5 w-5" /> Viết bài mới
                </button>
            </PageHeader>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        placeholder="Tìm kiếm bài viết..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={posts}
                isLoading={loading}
                onEdit={(item) => console.log("Edit Post", item)}
                onDelete={(item) => console.log("Delete Post", item)}
            />
        </div>
    );
}
