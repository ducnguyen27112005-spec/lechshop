"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit3, X, Loader2, Ticket, Ban, Check, GraduationCap } from "lucide-react";
import { fetchProductsConfig, ProductConfig } from "@/lib/product-config";

interface DiscountCode {
    id: string;
    code: string;
    type: string;
    email: string | null;
    discountPercent: number;
    usageLimit: number | null;
    maxDiscountAmount: number | null;
    applyTo: string;
    productId: string | null; // NEW
    isPublic: boolean;
    usedCount: number;
    used: boolean;
    isActive: boolean;
    expiresAt: string;
    createdAt: string;
    usageLogs?: { usedAt: string }[];
    benefits?: { productId: string; nextEligibleAt: string; lastEndAt: string | null }[]; // Mảng các hạn sản phẩm
}

function getStatus(d: DiscountCode): { label: string; color: string } {
    if (!d.isActive) return { label: "Đã tắt", color: "bg-gray-400 text-white" };
    if (new Date(d.expiresAt) < new Date()) return { label: "Hết hạn", color: "bg-red-100 text-red-700 border border-red-200" };
    if (d.type === "student" && d.used) return { label: "Đã dùng", color: "bg-orange-100 text-orange-700 border border-orange-200" };
    if (d.type === "general" && d.usageLimit && d.usedCount >= d.usageLimit) return { label: "Hết lượt", color: "bg-orange-100 text-orange-700 border border-orange-200" };
    return { label: "Hoạt động", color: "bg-emerald-100 text-emerald-700 border border-emerald-200" };
}

export default function AdminDiscountsPage() {
    const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal states
    const [showBenefitsModal, setShowBenefitsModal] = useState(false);
    const [selectedStudentBenefits, setSelectedStudentBenefits] = useState<{ productId: string; nextEligibleAt: string; lastEndAt: string | null }[]>([]);
    const [selectedStudentEmail, setSelectedStudentEmail] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        type: "general" as "student" | "general",
        code: "",
        email: "",
        discountPercent: "10",
        usageLimit: "100",
        maxDiscountAmount: "",
        applyTo: "all",
        productId: "", // NEW
        isPublic: false,
        expiresAt: "",
    });

    const [products, setProducts] = useState<ProductConfig[]>([]);

    const fetchDiscounts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterType !== "all") params.set("type", filterType);
            if (filterStatus !== "all") params.set("status", filterStatus);
            const res = await fetch(`/api/admin/discounts?${params.toString()}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setDiscounts(data);
        } catch {
            setError("Không thể tải danh sách mã giảm giá");
        } finally {
            setLoading(false);
        }
    }, [filterType, filterStatus]);

    useEffect(() => {
        fetchDiscounts();
        fetchProductsConfig().then(config => {
            if (config?.products) setProducts(config.products);
        });
    }, [fetchDiscounts]);

    const resetForm = () => {
        setFormData({
            type: "general",
            code: "",
            email: "",
            discountPercent: "10",
            usageLimit: "100",
            maxDiscountAmount: "",
            applyTo: "all",
            productId: "",
            isPublic: false,
            expiresAt: "",
        });
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            if (editingId) {
                const res = await fetch(`/api/admin/discounts/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        discountPercent: formData.discountPercent,
                        usageLimit: formData.usageLimit,
                        maxDiscountAmount: formData.maxDiscountAmount,
                        applyTo: formData.applyTo,
                        isPublic: formData.isPublic,
                        expiresAt: formData.expiresAt,
                    }),
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.error || "Lỗi cập nhật");
                setSuccess("Đã cập nhật mã giảm giá");
            } else {
                const res = await fetch("/api/admin/discounts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.error || "Lỗi tạo mã");
                setSuccess(`Đã tạo mã giảm giá: ${result.code}`);
            }
            resetForm();
            fetchDiscounts();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (d: DiscountCode) => {
        setFormData({
            type: d.type as "student" | "general",
            code: d.code,
            email: d.email || "",
            discountPercent: String(d.discountPercent),
            usageLimit: String(d.usageLimit || ""),
            maxDiscountAmount: String(d.maxDiscountAmount || ""),
            applyTo: d.applyTo || "all",
            productId: d.productId || "",
            isPublic: Boolean(d.isPublic),
            expiresAt: new Date(d.expiresAt).toISOString().slice(0, 16),
        });
        setEditingId(d.id);
        setShowForm(true);
    };

    const handleToggleActive = async (d: DiscountCode) => {
        try {
            const res = await fetch(`/api/admin/discounts/${d.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !d.isActive }),
            });
            if (!res.ok) throw new Error();
            setSuccess(d.isActive ? "Đã tắt mã giảm giá" : "Đã bật mã giảm giá");
            fetchDiscounts();
        } catch {
            setError("Lỗi cập nhật trạng thái");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xoá mã giảm giá này?")) return;
        try {
            const res = await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            setSuccess("Đã xoá mã giảm giá");
            fetchDiscounts();
        } catch {
            setError("Lỗi xoá mã giảm giá");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-50">
                        <Ticket className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Quản lý mã giảm giá</h1>
                        <p className="text-sm text-gray-500 font-medium">Tạo và quản lý mã giảm giá cho khách hàng</p>
                    </div>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    Tạo mã mới
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center justify-between">
                    {error}
                    <button onClick={() => setError("")}><X className="h-4 w-4" /></button>
                </div>
            )}
            {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium flex items-center justify-between">
                    {success}
                    <button onClick={() => setSuccess("")}><X className="h-4 w-4" /></button>
                </div>
            )}

            {/* Create/Edit Form */}
            {showForm && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-black text-gray-900 mb-4">
                        {editingId ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Type selector - only for new */}
                        {!editingId && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Loại mã</label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, type: "general" }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${formData.type === "general"
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        🎟️ General (nhiều lượt)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, type: "student" }))}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${formData.type === "student"
                                            ? "bg-purple-600 text-white shadow-sm"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                    >
                                        🎓 Student (1 lần)
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Privacy selector - new field */}
                            {formData.type === "general" && (
                                <div className="md:col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isPublic}
                                            onChange={e => setFormData(p => ({ ...p, isPublic: e.target.checked }))}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-bold text-gray-700">Mã công khai (Public)</span>
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1 ml-6 font-medium">
                                        Nếu chọn, ai cũng có thể dùng. Nếu không chọn (Private), chỉ người nhận được cấp và không cần khớp email (đối với general).
                                    </p>
                                </div>
                            )}

                            {/* Code - only for general & new */}
                            {formData.type === "general" && !editingId && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mã giảm giá *</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={e => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                        placeholder="VD: SALE20"
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required={formData.type === "general" && !editingId}
                                    />
                                </div>
                            )}

                            {/* Email - only for student & new */}
                            {formData.type === "student" && !editingId && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email sinh viên *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                        placeholder="sinhvien@edu.vn"
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required={formData.type === "student" && !editingId}
                                    />
                                    <p className="text-xs text-gray-400 mt-1 font-medium">Mã SV-XXXXXX sẽ được tạo tự động</p>
                                </div>
                            )}

                            {/* Discount percent */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">% Giảm giá *</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={formData.discountPercent}
                                    onChange={e => setFormData(p => ({ ...p, discountPercent: e.target.value }))}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Usage limit - only for general */}
                            {formData.type === "general" && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Giới hạn sử dụng *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.usageLimit}
                                        onChange={e => setFormData(p => ({ ...p, usageLimit: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required={formData.type === "general"}
                                    />
                                </div>
                            )}

                            {/* Max discount amount */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Giảm tối đa (VNĐ)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.maxDiscountAmount}
                                    onChange={e => setFormData(p => ({ ...p, maxDiscountAmount: e.target.value }))}
                                    placeholder="Không bắt buộc"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Apply to */}
                            {formData.type === "general" && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Áp dụng cho</label>
                                    <select
                                        value={formData.applyTo}
                                        onChange={e => setFormData(p => ({ ...p, applyTo: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">Tất cả sản phẩm</option>
                                        <option value="specific_products">Sản phẩm cụ thể</option>
                                    </select>
                                </div>
                            )}

                            {/* Product Selector - ONLY for general with specific_products */}
                            {(formData.type === "general" && formData.applyTo === "specific_products") && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Sản phẩm áp dụng *
                                    </label>
                                    <select
                                        value={formData.productId}
                                        onChange={e => setFormData(p => ({ ...p, productId: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">-- Chọn sản phẩm --</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.slug}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Expires at */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ngày hết hạn *</label>
                                <input
                                    type="datetime-local"
                                    value={formData.expiresAt}
                                    onChange={e => setFormData(p => ({ ...p, expiresAt: e.target.value }))}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                {editingId ? "Lưu thay đổi" : "Tạo mã"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors"
                            >
                                Huỷ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả loại</option>
                        <option value="general">🎟️ General</option>
                        <option value="student">🎓 Student</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="expired">Hết hạn</option>
                        <option value="disabled">Đã tắt</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : discounts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm font-bold">Chưa có mã giảm giá nào</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Code</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Loại / SP</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Email</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">% Giảm</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Sử dụng</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Đủ điều kiện</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Trạng thái</th>
                                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {discounts.map(d => {
                                    const status = getStatus(d);
                                    const productName = products.find(p => p.slug === d.productId)?.name || d.productId || "Tất cả";
                                    const lastUsed = d.usageLogs?.[0]?.usedAt;

                                    return (
                                        <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3.5">
                                                <code className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-mono text-xs font-bold">
                                                    {d.code}
                                                </code>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center w-fit gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${d.type === "student"
                                                        ? "bg-purple-50 text-purple-700 border-purple-200"
                                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                                        }`}>
                                                        {d.type === "student" ? "🎓 Student" : "🎟️ General"}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-500 truncate max-w-[120px]" title={d.type === "student" ? "Tất cả sản phẩm" : productName}>
                                                        {d.type === "student" ? "Tất cả sản phẩm" : productName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">
                                                {d.email || (d.isPublic ? <span className="text-[10px] uppercase font-bold text-emerald-600">Public</span> : "—")}
                                            </td>
                                            <td className="px-4 py-3.5 text-sm font-black text-gray-900">
                                                {d.discountPercent}%
                                                {d.maxDiscountAmount && (
                                                    <div className="text-[10px] text-gray-500 font-medium leading-tight">
                                                        Max: {d.maxDiscountAmount.toLocaleString("vi-VN")}đ
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {d.type === "student"
                                                            ? (d.used ? "Đã dùng" : "Chưa dùng")
                                                            : `${d.usedCount}/${d.usageLimit || "∞"}`
                                                        }
                                                    </span>
                                                    {lastUsed && (
                                                        <span className="text-[9px] text-gray-400 font-medium">
                                                            {new Date(lastUsed).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })} {new Date(lastUsed).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                {d.type === "student" && d.benefits && d.benefits.length > 0 ? (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudentBenefits(d.benefits!);
                                                            setSelectedStudentEmail(d.email || "");
                                                            setShowBenefitsModal(true);
                                                        }}
                                                        className="px-3 py-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-blue-600 transition-colors shadow-sm"
                                                    >
                                                        Xem theo SP ({d.benefits.length})
                                                    </button>
                                                ) : d.type === "student" ? (
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold border border-emerald-100">
                                                        Có thể dùng
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center w-fit gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400 font-medium">
                                                        Hết hạn: {new Date(d.expiresAt).toLocaleDateString("vi-VN")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(d)}
                                                        className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleActive(d)}
                                                        className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${d.isActive ? "text-gray-400 hover:text-orange-600" : "text-gray-400 hover:text-emerald-600"
                                                            }`}
                                                        title={d.isActive ? "Tắt mã" : "Bật mã"}
                                                    >
                                                        <Ban className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(d.id)}
                                                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                                                        title="Xoá"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal: Xem hạn mức sản phẩm của Sinh Viên */}
            {showBenefitsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Chi tiết chu kỳ sản phẩm</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">Thông tin các gói đang có hạn cho email: <span className="font-bold text-gray-900">{selectedStudentEmail}</span></p>
                            </div>
                            <button
                                onClick={() => setShowBenefitsModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto">
                            {selectedStudentBenefits.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-gray-500 font-medium">Sinh viên này chưa dùng mã cho sản phẩm nào.</p>
                                </div>
                            ) : (
                                <div className="border border-gray-100 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Sản phẩm</th>
                                                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Gói đã mua (đến)</th>
                                                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Trạng thái ưu đãi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {selectedStudentBenefits.map(b => {
                                                const productName = products.find(p => p.slug === b.productId)?.name || b.productId;
                                                const isEligible = new Date(b.nextEligibleAt) <= new Date();

                                                return (
                                                    <tr key={b.productId} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-4 py-3 font-bold text-gray-900">{productName}</td>
                                                        <td className="px-4 py-3 text-xs text-gray-600">
                                                            {b.lastEndAt ? new Date(b.lastEndAt).toLocaleDateString("vi-VN") : "—"}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {isEligible ? (
                                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold border border-emerald-100">
                                                                    Có thể dùng lại
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[10px] font-bold border border-orange-100">
                                                                    Chờ đến {new Date(b.nextEligibleAt).toLocaleDateString("vi-VN")}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowBenefitsModal(false)}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
