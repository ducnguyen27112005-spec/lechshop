"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, X, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Service {
    id: string;
    categoryId: string;
    category?: { name: string };
    title: string;
    slug: string;
    shortDescription: string;
    targetType: string;
    unitLabel: string;
    coverImageUrl: string;
    sortOrder: number;
    isActive: boolean;
    _count?: { plans: number };
}

interface Category {
    id: string;
    name: string;
}

export default function AdminSocialServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        categoryId: "",
        title: "",
        slug: "",
        shortDescription: "",
        targetType: "profile",
        unitLabel: "follow",
        coverImageUrl: "",
        sortOrder: 0,
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [paramsRes, catsRes] = await Promise.all([
                fetch("/api/admin/social/services"),
                fetch("/api/admin/social/categories")
            ]);

            if (paramsRes.ok && catsRes.ok) {
                const servicesData = await paramsRes.json();
                const catsData = await catsRes.json();
                setServices(servicesData);
                setCategories(catsData);
            }
        } catch (error) {
            toast.error("Lỗi tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingId(null);
        setFormData({
            categoryId: categories[0]?.id || "",
            title: "",
            slug: "",
            shortDescription: "",
            targetType: "profile",
            unitLabel: "follow",
            coverImageUrl: "",
            sortOrder: 0,
            isActive: true
        });
        setIsModalOpen(true);
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setFormData({
            categoryId: service.categoryId,
            title: service.title,
            slug: service.slug,
            shortDescription: service.shortDescription || "",
            targetType: service.targetType,
            unitLabel: service.unitLabel,
            coverImageUrl: service.coverImageUrl || "",
            sortOrder: service.sortOrder,
            isActive: service.isActive
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
        try {
            const res = await fetch(`/api/admin/social/services/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Đã xóa dịch vụ");
                fetchData();
            } else {
                toast.error("Không thể xóa");
            }
        } catch {
            toast.error("Lỗi khi xóa");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `/api/admin/social/services/${editingId}`
                : "/api/admin/social/services";
            const method = editingId ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingId ? "Đã cập nhật" : "Đã tạo mới");
                setIsModalOpen(false);
                fetchData();
            } else {
                toast.error("Có lỗi xảy ra");
            }
        } catch {
            toast.error("Lỗi kết nối");
        }
    };

    const filtered = services.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dịch vụ MXH</h1>
                    <p className="text-gray-500 text-sm">Quản lý các dịch vụ con (Tăng like, view, follow...)</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Thêm mới
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Tên dịch vụ</th>
                                <th className="px-6 py-4">Danh mục</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4 text-center">Gói</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-8">Đang tải...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Chưa có dịch vụ nào</td></tr>
                            ) : (
                                filtered.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {service.coverImageUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={service.coverImageUrl} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <ImageIcon className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <span className="font-semibold text-gray-900">{service.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                                {service.category?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{service.slug}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                                                {service._count?.plans || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {service.isActive ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Hiển thị
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Đang ẩn
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(service)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 h-[90vh] flex flex-col">
                        <form onSubmit={handleSubmit} className="flex flex-col h-full">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                                <h3 className="font-bold text-lg text-gray-900">
                                    {editingId ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                        <select
                                            required
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
                                            placeholder="tiktok-follow"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Ví dụ: Tăng Follow TikTok"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                                    <textarea
                                        rows={2}
                                        value={formData.shortDescription}
                                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại Target</label>
                                        <select
                                            value={formData.targetType}
                                            onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        >
                                            <option value="profile">Profile (User)</option>
                                            <option value="video">Video (Post)</option>
                                            <option value="livestream">Livestream</option>
                                            <option value="uid_or_link">Link hoặc UID</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị (Label)</label>
                                        <input
                                            type="text"
                                            value={formData.unitLabel}
                                            onChange={(e) => setFormData({ ...formData, unitLabel: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="follow, view, tim..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (URL)</label>
                                    <input
                                        type="text"
                                        value={formData.coverImageUrl}
                                        onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-2"
                                        placeholder="https://..."
                                    />
                                    {formData.coverImageUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={formData.coverImageUrl} alt="Preview" className="h-20 w-auto rounded border" />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                                        <input
                                            type="number"
                                            value={formData.sortOrder}
                                            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 w-full cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Hiển thị</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {editingId ? "Lưu thay đổi" : "Tạo mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
