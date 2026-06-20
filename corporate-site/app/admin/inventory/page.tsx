"use client";

import React, { useState, useEffect } from "react";
import {
    Search, Plus, Package, Filter, Server, CheckCircle2,
    XCircle, ArchiveRestore, Database, ShieldAlert, Key, Zap, Clock
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";

// --- Types ---
interface Supplier {
    id: string;
    name: string;
}

interface InventoryItem {
    id: string;
    productId: string;
    planId: string;
    supplierId: string | null;
    supplier?: Supplier | null;
    batchCode: string | null;
    credentialText: string;
    status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'REPLACED' | 'DISABLED';
    reservedOrderId: string | null;
    soldOrderId: string | null;
    createdAt: string;
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterProduct, setFilterProduct] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [importData, setImportData] = useState({
        productId: "",
        planId: "",
        supplierId: "",
        batchCode: "",
        credentialsText: ""
    });
    const [importing, setImporting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invRes, supRes] = await Promise.all([
                fetch(`/api/admin/inventory?status=${filterStatus}&productId=${filterProduct}`),
                fetch("/api/admin/suppliers")
            ]);

            if (invRes.ok && supRes.ok) {
                const invData = await invRes.json();
                const supData = await supRes.json();
                setItems(invData);
                setSuppliers(supData);
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus, filterProduct]);

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!importData.productId || !importData.planId || !importData.credentialsText) {
            toast.error("Vui lòng điền đủ Sản phẩm, Gói và Dữ liệu tài khoản");
            return;
        }

        setImporting(true);
        try {
            const res = await fetch("/api/admin/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(importData)
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setIsImportOpen(false);
                setImportData({
                    productId: "",
                    planId: "",
                    supplierId: "",
                    batchCode: "",
                    credentialsText: ""
                });
                fetchData();
            } else {
                toast.error(data.error || "Lỗi nhập kho");
            }
        } catch (error) {
            toast.error("Gặp sự cố kết nối tới máy chủ");
        } finally {
            setImporting(false);
        }
    };

    const handleDelete = async (id: string, currentStatus: string) => {
        if (!confirm(currentStatus === 'AVAILABLE' ? "Bạn có chắc muốn xóa cứng tài khoản này khỏi kho?" : "Chuyển tài khoản này sang Vô Hiệu Hóa (Chứa lịch sử rác)?")) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/inventory/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                fetchData();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Thao tác thất bại");
        }
    };

    // Derived counts
    const availableCount = items.filter(i => i.status === 'AVAILABLE').length;

    // Search filter
    const displayedItems = items.filter(i => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            i.productId.toLowerCase().includes(q) ||
            i.planId.toLowerCase().includes(q) ||
            i.credentialText.toLowerCase().includes(q) ||
            (i.batchCode && i.batchCode.toLowerCase().includes(q))
        );
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                            <Database className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">KHO TÀI KHOẢN</h1>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Quản lý và cấp phát tự động accounts cho các đơn hàng Premium.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsImportOpen(true)}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 hover:shadow transform hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Nhập Kho Hàng Loạt
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Package className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-bold uppercase tracking-wider">Tổng sản phẩm</span>
                    </div>
                    <span className="text-3xl font-black text-gray-900">{items.length}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Sẵn sàng (Available)</span>
                    </div>
                    <span className="text-3xl font-black text-emerald-600">{availableCount}</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                        <ArchiveRestore className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Đã giữ/Bán</span>
                    </div>
                    <span className="text-3xl font-black text-amber-600">{items.length - availableCount - items.filter(i => i.status === 'DISABLED').length}</span>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài khoản, mã lô..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-semibold text-gray-700 flex-shrink-0 cursor-pointer focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="AVAILABLE">AVAILABLE (Sẵn sàng)</option>
                        <option value="RESERVED">RESERVED (Đang giữ)</option>
                        <option value="SOLD">SOLD (Đã giao)</option>
                        <option value="REPLACED">REPLACED (Đã bị thay)</option>
                        <option value="DISABLED">DISABLED (Hủy)</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Lọc Text SP (vd: netflix)"
                        value={filterProduct}
                        onChange={(e) => setFilterProduct(e.target.value)}
                        className="w-48 px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-5 py-4 text-[10px] font-black min-w-[150px] uppercase tracking-widest text-gray-500">Thông tin SP</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Tài Khoản (Email/Pass)</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Trạng thái</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Mã Lô & Nguồn</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-right text-gray-500">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center text-sm font-medium text-gray-400">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                            Đang tải dữ liệu kho...
                                        </div>
                                    </td>
                                </tr>
                            ) : displayedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Server className="w-10 h-10 mb-3 text-gray-200" />
                                            <p className="text-sm font-medium">Kho trống hoặc không có kết quả phù hợp</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                displayedItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{item.productId}</span>
                                                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md w-fit mt-1">
                                                    {item.planId}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 max-w-[250px]">
                                            <div className="relative group">
                                                <p className="text-xs font-mono text-gray-600 truncate bg-gray-50 p-2 rounded-lg border border-gray-100 cursor-pointer hover:border-gray-300">
                                                    {item.credentialText.split('\n')[0] || item.credentialText}
                                                    {item.credentialText.includes('\n') && <span className="opacity-50 ml-1">...</span>}
                                                </p>
                                                {/* Tooltip */}
                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-fit min-w-[200px] max-w-[400px] z-10 bg-gray-900 text-white text-xs font-mono p-3 rounded-lg shadow-xl whitespace-pre-wrap">
                                                    {item.credentialText}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase",
                                                item.status === 'AVAILABLE' ? "bg-emerald-100 text-emerald-700" :
                                                    item.status === 'RESERVED' ? "bg-amber-100 text-amber-700" :
                                                        item.status === 'SOLD' ? "bg-blue-100 text-blue-700" :
                                                            "bg-gray-100 text-gray-600"
                                            )}>
                                                {item.status === 'AVAILABLE' && <CheckCircle2 className="w-3 h-3" />}
                                                {item.status === 'RESERVED' && <Clock className="w-3 h-3" />}
                                                {item.status === 'SOLD' && <CheckCircle2 className="w-3 h-3" />}
                                                {item.status === 'DISABLED' && <XCircle className="w-3 h-3" />}
                                                {item.status}
                                            </span>
                                            {(item.soldOrderId || item.reservedOrderId) && (
                                                <p className="text-[9px] text-gray-400 mt-1 font-mono">
                                                    Order: {(item.soldOrderId || item.reservedOrderId)?.slice(-6)}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="font-bold text-gray-700">Lô: {item.batchCode || 'N/A'}</span>
                                                <span className="text-gray-500">Nguồn: {item.supplier?.name || "Không rõ"}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id, item.status)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                {item.status === 'AVAILABLE' ? <ShieldAlert className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Import Modal */}
            {isImportOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-indigo-600" />
                                Nhập Tài Khoản Vào Kho
                            </h3>
                            <button
                                onClick={() => setIsImportOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleImport} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Mã Sản Phẩm *</label>
                                    <input
                                        type="text"
                                        placeholder="VD: netflix-premium, chatgpt..."
                                        value={importData.productId}
                                        onChange={e => setImportData({ ...importData, productId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Từ khóa khớp với đơn hàng, vd: netflix, chatgpt.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Mã Gói (Plan) *</label>
                                    <input
                                        type="text"
                                        placeholder="VD: 1m, 3m, 1y..."
                                        value={importData.planId}
                                        onChange={e => setImportData({ ...importData, planId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Nguồn Hàng</label>
                                    <select
                                        value={importData.supplierId}
                                        onChange={e => setImportData({ ...importData, supplierId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">-- Không xác định --</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Mã Lô Khách Hàng</label>
                                    <input
                                        type="text"
                                        placeholder="VD: BATCH-02-26"
                                        value={importData.batchCode}
                                        onChange={e => setImportData({ ...importData, batchCode: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Danh sách Account (Mỗi dòng 1 Account) *</label>
                                <textarea
                                    required
                                    rows={8}
                                    placeholder="user1@email.com|pass1|profile1&#10;user2@email.com|pass2|profile2"
                                    value={importData.credentialsText}
                                    onChange={e => setImportData({ ...importData, credentialsText: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 resize-none whitespace-pre"
                                ></textarea>
                                <div className="flex items-center gap-2 mt-2 text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
                                    <Zap className="w-4 h-4" />
                                    <p className="text-[10px] font-semibold">Tự động nhận diện mỗi dòng (Line) tương ứng với 1 Account nhập kho hoàn chỉnh.</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsImportOpen(false)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={importing}
                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all disabled:opacity-50"
                                >
                                    {importing ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Key className="w-4 h-4" />
                                    )}
                                    Bắt đầu Lưu Kho
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
