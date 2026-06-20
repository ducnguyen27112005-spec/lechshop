"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, X, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Plan {
    id: string;
    serviceId: string;
    service?: { title: string };
    code: string;
    name: string;
    pricePerUnit: number;
    currency: string;
    min: number;
    max: number;
    tags: string;
    description: string;
    isActive: boolean;
}

interface Service {
    id: string;
    title: string;
    category?: { name: string };
}

export default function AdminSocialPlans() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        serviceId: "",
        code: "",
        name: "",
        pricePerUnit: 0,
        currency: "VND",
        min: 100,
        max: 10000,
        tags: "",
        description: "",
        isActive: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [plansRes, servicesRes] = await Promise.all([
                fetch("/api/admin/social/plans"),
                fetch("/api/admin/social/services")
            ]);

            if (plansRes.ok && servicesRes.ok) {
                const plansData = await plansRes.json();
                const servicesData = await servicesRes.json();
                setPlans(plansData);
                setServices(servicesData);
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
            serviceId: services[0]?.id || "",
            code: "",
            name: "",
            pricePerUnit: 0,
            currency: "VND",
            min: 100,
            max: 10000,
            tags: "",
            description: "",
            isActive: true
        });
        setIsModalOpen(true);
    };

    const handleEdit = (plan: Plan) => {
        setEditingId(plan.id);
        setFormData({
            serviceId: plan.serviceId,
            code: plan.code,
            name: plan.name,
            pricePerUnit: plan.pricePerUnit,
            currency: plan.currency,
            min: plan.min,
            max: plan.max,
            tags: plan.tags || "",
            description: plan.description || "",
            isActive: plan.isActive
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa gói này?")) return;
        try {
            const res = await fetch(`/api/admin/social/plans/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Đã xóa gói");
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
                ? `/api/admin/social/plans/${editingId}`
                : "/api/admin/social/plans";
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

    const filtered = plans.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gói dịch vụ (Server/Option)</h1>
                    <p className="text-gray-500 text-sm">Quản lý các gói server, giá tiền cho từng dịch vụ</p>
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
                            placeholder="Tìm kiếm gói..."
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
                                <th className="px-6 py-4">Mã gói</th>
                                <th className="px-6 py-4">Tên gói</th>
                                <th className="px-6 py-4">Dịch vụ</th>
                                <th className="px-6 py-4 text-right">Giá</th>
                                <th className="px-6 py-4 text-center">Giới hạn (Min-Max)</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-8">Đang tải...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-8 text-gray-500">Chưa có gói nào</td></tr>
                            ) : (
                                filtered.map((plan) => (
                                    <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 font-mono text-sm uppercase">{plan.code}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{plan.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{plan.service?.title}</td>
                                        <td className="px-6 py-4 text-right font-medium text-blue-600">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: plan.currency }).format(plan.pricePerUnit)}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                                            {plan.min.toLocaleString()} - {plan.max.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {plan.isActive ? (
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
                                                    onClick={() => handleEdit(plan)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(plan.id)}
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
                                    {editingId ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ áp dụng</label>
                                    <select
                                        required
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    >
                                        <option value="">Chọn dịch vụ</option>
                                        {services.map(s => (
                                            <option key={s.id} value={s.id}>{s.category?.name} - {s.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã gói (Code)</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm uppercase"
                                            placeholder="SV1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên gói hiển thị</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Server 1 (Rẻ, chậm)"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá / đơn vị</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.pricePerUnit}
                                            onChange={(e) => setFormData({ ...formData, pricePerUnit: parseFloat(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tối thiểu (Min)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.min}
                                            onChange={(e) => setFormData({ ...formData, min: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tối đa (Max)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.max}
                                            onChange={(e) => setFormData({ ...formData, max: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (phân cách bằng dấu phẩy)</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Rẻ, Nhanh, Bảo hành"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
