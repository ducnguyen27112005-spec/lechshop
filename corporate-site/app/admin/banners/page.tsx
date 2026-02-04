"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Image as ImageIcon, Loader2, Save, X, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { DataTable } from "@/components/admin/shared/DataTable";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";

export default function BannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        imageUrl: "",
        link: "",
        order: "0",
        isActive: true
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch("/api/admin/banners");
            const data = await res.json();
            setBanners(data);
        } catch (error) {
            console.error("Failed to fetch banners:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const method = formData.id ? "PATCH" : "POST";

        try {
            const res = await fetch("/api/admin/banners", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchBanners();
            }
        } catch (error) {
            console.error("Failed to save banner:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) return;
        try {
            await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" });
            fetchBanners();
        } catch (error) {
            console.error("Failed to delete banner:", error);
        }
    };

    const openEditModal = (item: any) => {
        setFormData({
            id: item.id,
            title: item.title || "",
            imageUrl: item.imageUrl,
            link: item.link || "",
            order: String(item.order),
            isActive: item.isActive
        });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setFormData({ id: "", title: "", imageUrl: "", link: "", order: "0", isActive: true });
        setIsModalOpen(true);
    };

    const columns = [
        { header: "Thứ tự", accessor: "order", className: "w-16" },
        {
            header: "Hình ảnh", accessor: (item: any) => (
                <img src={item.imageUrl} alt="" className="h-12 w-24 rounded object-cover bg-gray-100" />
            )
        },
        { header: "Tiêu đề", accessor: (item: any) => item.title || "Không có" },
        {
            header: "Trạng thái", accessor: (item: any) => (
                <StatusBadge status={String(item.isActive)} />
            )
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Quản lý Banner"
                description="Thay đổi các hình ảnh biểu ngữ lớn ở đầu trang chủ."
            >
                <button
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all"
                >
                    <Plus className="h-5 w-5" /> Thêm Banner
                </button>
            </PageHeader>

            <DataTable
                columns={columns}
                data={banners}
                isLoading={loading}
                onEdit={openEditModal}
                onDelete={(item) => handleDelete(item.id)}
            />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-black text-gray-900">{formData.id ? "Chỉnh sửa Banner" : "Thêm Banner mới"}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiêu đề (Không bắt buộc)</label>
                                <input
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL Hình ảnh (Bắt buộc)</label>
                                <input
                                    required
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="/images/banner-1.png"
                                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thứ tự hiển thị</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</label>
                                    <select
                                        value={String(formData.isActive)}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.value === "true" })}
                                        className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                                    >
                                        <option value="true">Hiển thị</option>
                                        <option value="false">Ẩn</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
                                >
                                    {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="h-5 w-5" /> Lưu lại</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
