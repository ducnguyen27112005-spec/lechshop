"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, FileText, Banknote } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function AffiliateWithdrawsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchRequests = () => {
        setLoading(true);
        fetch(`/api/admin/affiliate/withdraws?status=${statusFilter}`)
            .then(res => res.json())
            .then(data => setRequests(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'mark-paid', promptReason: boolean = false) => {
        let payload = {};
        if (action === 'reject' && promptReason) {
            const reason = prompt("Nhập lý do từ chối (bắt buộc):");
            if (!reason) return;
            payload = { reason };
        } else {
            if (!confirm(`Bạn có chắc chắn muốn thực hiện hành động này?`)) return;
        }

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/affiliate/withdraws/${id}/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: Object.keys(payload).length > 0 ? JSON.stringify(payload) : undefined
            });
            if (res.ok) {
                fetchRequests();
            } else {
                alert("Có lỗi xảy ra: " + await res.text());
            }
        } catch (e) {
            console.error(e);
            alert("Đã xảy ra lỗi hệ thống.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Yêu cầu Rút tiền</h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ xử lý (Pending)</option>
                        <option value="APPROVED">Đã duyệt - Chờ CK (Approved)</option>
                        <option value="REJECTED">Từ chối (Rejected)</option>
                        <option value="PAID">Đã thanh toán (Paid)</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Mã YC</th>
                                <th className="px-6 py-4">CTV (User ID)</th>
                                <th className="px-6 py-4 text-right">Số tiền</th>
                                <th className="px-6 py-4">Thông tin Ngân hàng</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Thời gian tạo</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
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
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <Banknote className="w-12 h-12 text-gray-300 mb-2" />
                                        Không có yêu cầu rút tiền nào.
                                    </td>
                                </tr>
                            ) : requests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-medium text-gray-500">{req.id.slice(-8)}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">{req.userId}</td>
                                    <td className="px-6 py-4 text-right font-bold text-blue-600">{req.amount.toLocaleString()} đ</td>
                                    <td className="px-6 py-4 text-gray-600 text-xs">
                                        <div className="font-semibold text-gray-800">{req.bankName}</div>
                                        <div>STK: {req.bankAccount}</div>
                                        <div>Tên: {req.bankOwner}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.status === "PENDING" && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Chờ duyệt</span>}
                                        {req.status === "APPROVED" && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Đã duyệt, Chờ CK</span>}
                                        {req.status === "REJECTED" && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700" title={req.adminReason}>Từ chối</span>}
                                        {req.status === "PAID" && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Đã thanh toán</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {format(new Date(req.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            {req.status === "PENDING" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={processingId === req.id}
                                                        onClick={() => handleAction(req.id, 'approve')}
                                                        className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                                                    >
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        disabled={processingId === req.id}
                                                        onClick={() => handleAction(req.id, 'reject', true)}
                                                        className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded border border-red-200 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </div>
                                            )}
                                            {req.status === "APPROVED" && (
                                                <button
                                                    disabled={processingId === req.id}
                                                    onClick={() => handleAction(req.id, 'mark-paid')}
                                                    className="w-full px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Đã chuyển khoản
                                                </button>
                                            )}
                                            {req.status !== "PENDING" && req.status !== "APPROVED" && (
                                                <span className="text-gray-400 text-xs italic">Không có hành động</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
