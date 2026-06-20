"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, User, Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function AffiliateAccountsPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        password: "",
        referralCode: "",
        isActive: true
    });
    const [saving, setSaving] = useState(false);

    const fetchAccounts = () => {
        setLoading(true);
        fetch(`/api/admin/affiliate/accounts?search=${encodeURIComponent(searchTerm)}`)
            .then(res => res.json())
            .then(data => setAccounts(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleOpenModal = (account?: any) => {
        if (account) {
            setEditingAccount(account);
            setFormData({
                fullName: account.fullName,
                phone: account.phone,
                password: "", // Don't populate password on edit
                referralCode: account.referralCode,
                isActive: account.isActive
            });
        } else {
            setEditingAccount(null);
            setFormData({
                fullName: "",
                phone: "",
                password: "",
                referralCode: "",
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const url = editingAccount 
                ? `/api/admin/affiliate/accounts/${editingAccount.id}`
                : `/api/admin/affiliate/accounts`;
                
            const method = editingAccount ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Lưu thất bại");
            }
            
            setIsModalOpen(false);
            fetchAccounts();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.")) return;
        
        try {
            const res = await fetch(`/api/admin/affiliate/accounts/${id}`, {
                method: "DELETE"
            });
            
            if (!res.ok) throw new Error("Xóa thất bại");
            
            fetchAccounts();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản Đối tác</h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm SĐT / Mã giới thiệu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchAccounts()}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <button onClick={fetchAccounts} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Tìm
                    </button>
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                        <Plus className="w-4 h-4" />
                        Thêm mới
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Tên đối tác</th>
                                <th className="px-6 py-4">Số điện thoại</th>
                                <th className="px-6 py-4">Mã giới thiệu</th>
                                <th className="px-6 py-4">Ví khả dụng</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Ngày tạo</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <User className="w-12 h-12 text-gray-300 mb-2" />
                                        Không có tài khoản đối tác nào.
                                    </td>
                                </tr>
                            ) : accounts.map(acc => (
                                <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{acc.fullName}</td>
                                    <td className="px-6 py-4">{acc.phone}</td>
                                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-mono text-xs font-bold">{acc.referralCode}</span></td>
                                    <td className="px-6 py-4 font-semibold text-green-600">
                                        {acc.wallet ? acc.wallet.balanceAvailable.toLocaleString() : 0} đ
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase ${acc.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {acc.isActive ? 'Hoạt động' : 'Bị khóa'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {format(new Date(acc.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(acc)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Sửa"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(acc.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Edit/Create */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => !saving && setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {editingAccount ? "Sửa tài khoản đối tác" : "Thêm tài khoản đối tác"}
                        </h2>
                        
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại (Tài khoản đăng nhập)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Mật khẩu {editingAccount && <span className="text-gray-400 font-normal">(để trống nếu không đổi)</span>}
                                </label>
                                <input
                                    type="text"
                                    required={!editingAccount}
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã giới thiệu (Mã Coupon)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.referralCode}
                                    onChange={e => setFormData({...formData, referralCode: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
                                />
                                <p className="text-xs text-gray-500 mt-1">Nên dùng viết hoa không dấu, ví dụ: NGUYENVANA</p>
                            </div>

                            {editingAccount && (
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Tài khoản đang hoạt động</label>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={saving}
                                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Lưu lại
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
