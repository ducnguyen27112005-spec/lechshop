"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Plus, Minus, FileText, AlertTriangle, ChevronRight, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Modal, Input, Timeline, Tag, Tooltip, message } from "antd";

export default function AffiliateCommissionsPage() {
    const [commissions, setCommissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [expandedRowKeys, setExpandedRowKeys] = useState<Set<string>>(new Set());
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectCommissionId, setRejectCommissionId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchCommissions = () => {
        setLoading(true);
        fetch(`/api/admin/affiliate/commissions?status=${statusFilter}`)
            .then(res => res.json())
            .then(data => setCommissions(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCommissions();
    }, [statusFilter]);

    const handleAction = async (id: string, action: 'approve') => {
        if (!confirm('Bạn có chắc chắn muốn DUYỆT hoa hồng này?')) return;

        setProcessingId(id);
        try {
            const res = await fetch(`/api/admin/affiliate/commissions/${id}/${action}`, {
                method: 'POST'
            });
            if (res.ok) {
                message.success('Đã duyệt hoa hồng thành công.');
                fetchCommissions(); // refresh
            } else {
                message.error("Có lỗi xảy ra: " + await res.text());
            }
        } catch (e) {
            console.error(e);
            message.error("Đã xảy ra lỗi hệ thống.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleOpenRejectModal = (id: string) => {
        setRejectCommissionId(id);
        setRejectReason("");
        setRejectModalOpen(true);
    };

    const submitReject = async () => {
        if (!rejectCommissionId) return;
        if (!rejectReason.trim()) {
            message.error("Vui lòng nhập lý do từ chối");
            return;
        }

        setProcessingId(rejectCommissionId);
        try {
            const res = await fetch(`/api/admin/affiliate/commissions/${rejectCommissionId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminReason: rejectReason })
            });

            if (res.ok) {
                message.success('Đã từ chối hoa hồng.');
                setRejectModalOpen(false);
                fetchCommissions();
            } else {
                message.error("Có lỗi xảy ra: " + await res.text());
            }
        } catch (e) {
            console.error(e);
            message.error("Đã xảy ra lỗi hệ thống.");
        } finally {
            setProcessingId(null);
        }
    };

    const toggleRow = (id: string) => {
        const newSet = new Set(expandedRowKeys);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedRowKeys(newSet);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Hoa hồng</h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING">Chờ duyệt (Pending)</option>
                        <option value="APPROVED">Đã duyệt (Approved)</option>
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
                                <th className="w-10 px-4 py-4"></th>
                                <th className="px-6 py-4">Mã tham chiếu (Đơn)</th>
                                <th className="px-6 py-4">Người giới thiệu</th>
                                <th className="px-6 py-4">Khách mua</th>
                                <th className="px-6 py-4 text-right">Giá trị đơn</th>
                                <th className="px-6 py-4 text-right">Hoa hồng</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4">Ngày hết hold</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : commissions.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <FileText className="w-12 h-12 text-gray-300 mb-2" />
                                        Không tìm thấy dữ liệu hoa hồng.
                                    </td>
                                </tr>
                            ) : commissions.map(comm => (
                                <React.Fragment key={comm.id}>
                                    <tr className={`transition-colors ${expandedRowKeys.has(comm.id) ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                                        <td className="px-4 py-4 text-center cursor-pointer" onClick={() => toggleRow(comm.id)}>
                                            {expandedRowKeys.has(comm.id) ?
                                                <ChevronDown className="w-4 h-4 text-gray-400 mx-auto" /> :
                                                <ChevronRight className="w-4 h-4 text-gray-400 mx-auto" />
                                            }
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs font-medium text-gray-700">
                                            {comm.orderId}
                                            {comm.isSuspicious && (
                                                <Tooltip title={`Cảnh báo gian lận: ${comm.suspiciousReason}`}>
                                                    <AlertTriangle className="w-4 h-4 text-red-500 inline-block ml-2 mb-0.5" />
                                                </Tooltip>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{comm.referrerUserId}</td>
                                        <td className="px-6 py-4 text-gray-600">{comm.referredUserId}</td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-700">{comm.baseAmount.toLocaleString()} đ</td>
                                        <td className="px-6 py-4 text-right font-bold text-green-600">+{comm.commissionAmount.toLocaleString()} đ</td>
                                        <td className="px-6 py-4 text-center">
                                            {comm.status === "PENDING" && <Tag color="gold">Pending</Tag>}
                                            {comm.status === "APPROVED" && <Tag color="blue">Approved</Tag>}
                                            {comm.status === "REJECTED" && <Tag color="red">Rejected</Tag>}
                                            {comm.status === "PAID" && <Tag color="green">Paid</Tag>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {comm.holdUntil ? format(new Date(comm.holdUntil), "dd/MM/yyyy", { locale: vi }) : "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {comm.status === "PENDING" ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        disabled={processingId === comm.id}
                                                        onClick={() => handleAction(comm.id, 'approve')}
                                                        className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-200 hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50" title="Duyệt"
                                                    >
                                                        {processingId === comm.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        disabled={processingId === comm.id}
                                                        onClick={() => handleOpenRejectModal(comm.id)}
                                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50" title="Từ chối"
                                                    >
                                                        {processingId === comm.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Đã xử lý</span>
                                            )}
                                        </td>
                                    </tr>
                                    {expandedRowKeys.has(comm.id) && (
                                        <tr>
                                            <td colSpan={9} className="px-0 py-0 border-b border-gray-100 bg-gray-50/20">
                                                <div className="p-6">
                                                    <h4 className="text-sm font-semibold text-gray-800 mb-4">Lịch sử xử lý hoa hồng</h4>
                                                    {comm.logs && comm.logs.length > 0 ? (
                                                        <Timeline
                                                            items={comm.logs.map((log: any) => ({
                                                                color: log.action === 'rejected' ? 'red' : log.action === 'approved' || log.action === 'paid' ? 'green' : 'blue',
                                                                children: (
                                                                    <div className="text-sm">
                                                                        <div className="font-semibold text-gray-700 capitalize">{log.action}</div>
                                                                        <div className="text-gray-500">{format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss")} - Bởi: {log.adminId || 'Hệ thống'}</div>
                                                                        {log.note && <div className="text-gray-600 mt-1 italic break-words">Ghi chú: {log.note}</div>}
                                                                    </div>
                                                                ),
                                                            }))}
                                                        />
                                                    ) : (
                                                        <div className="text-sm text-gray-500 italic">Chưa có lịch sử xử lý.</div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                title="Từ chối Hoa hồng"
                open={rejectModalOpen}
                onCancel={() => setRejectModalOpen(false)}
                onOk={submitReject}
                confirmLoading={!!processingId}
                okText="Xác nhận từ chối"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <div className="pt-4">
                    <p className="mb-2 text-sm text-gray-700 font-medium">Vui lòng nhập lý do từ chối <span className="text-red-500">*</span></p>
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập lý do chi tiết..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        autoFocus
                    />
                </div>
            </Modal>
        </div>
    );
}
