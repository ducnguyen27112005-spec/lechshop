"use client";

import { useEffect, useState } from "react";
import {
    Search,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    XCircle,
    CreditCard,
    TrendingUp,
    Calendar,
    RefreshCw,
    Link as LinkIcon,
    AlertTriangle,
    Check
} from "lucide-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Transaction {
    id: string;
    code: string;
    orderCode: string | null;
    amount: number;
    senderName: string | null;
    content: string | null;
    status: "pending" | "matched" | "reconciled" | "failed";
    source: "bank_auto" | "admin_manual" | "affiliate" | "refund" | "payment_gateway";
    mismatchAmount: number | null;
    createdAt: string;
}

interface SummaryInfo {
    receivedToday: number;
    reconciledAmount: number;
    pendingAmount: number;
    pendingCount: number;
    failedCount: number;
}

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
    reconciled: { label: "Đã đối soát", icon: CheckCircle2, className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    matched: { label: "Đã khớp đơn", icon: LinkIcon, className: "text-blue-700 bg-blue-50 border-blue-200" },
    pending: { label: "Đang chờ", icon: Clock, className: "text-amber-700 bg-amber-50 border-amber-200" },
    failed: { label: "Thất bại", icon: XCircle, className: "text-red-700 bg-red-50 border-red-200" },
};

const sourceConfig: Record<string, { label: string; className: string }> = {
    bank_auto: { label: "Auto Bank", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    admin_manual: { label: "Thủ công", className: "bg-gray-100 text-gray-700 border-gray-200" },
    affiliate: { label: "Affiliate", className: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
    refund: { label: "Hoàn tiền", className: "bg-orange-50 text-orange-700 border-orange-200" },
    payment_gateway: { label: "Cổng thanh toán", className: "bg-cyan-50 text-cyan-700 border-cyan-200" },
};

function StatusBadge({ status }: { status: string }) {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
        <span className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
            config.className
        )}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </span>
    );
}

function SourceBadge({ source }: { source: string }) {
    const config = sourceConfig[source] || sourceConfig.admin_manual;
    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
            config.className
        )}>
            {config.label}
        </span>
    );
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<SummaryInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");

    // UI State
    const [assigningId, setAssigningId] = useState<string | null>(null);
    const [orderCodeInput, setOrderCodeInput] = useState("");

    const fetchData = async () => {
        setFetching(true);
        try {
            const [trxRes, sumRes] = await Promise.all([
                fetch(`/api/admin/transactions?status=${filterStatus}`),
                fetch("/api/admin/transactions/summary")
            ]);

            if (trxRes.ok) setTransactions(await trxRes.json());
            if (sumRes.ok) setSummary(await sumRes.json());
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu giao dịch");
        } finally {
            setLoading(false);
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterStatus]);

    const handleReconcile = async (id: string) => {
        const promise = fetch(`/api/admin/transactions/${id}/reconcile`, { method: "PATCH" });
        toast.promise(promise, {
            loading: 'Đang xác nhận đối soát...',
            success: (res) => {
                if (res.ok) {
                    fetchData();
                    return 'Đã đối soát thành công';
                }
                throw new Error('Failed');
            },
            error: 'Lỗi khi đối soát. Vui lòng thử lại.'
        });
    };

    const handleAssign = async (id: string) => {
        if (!orderCodeInput.trim()) {
            toast.error("Vui lòng nhập mã đơn hàng");
            return;
        }

        setAssigningId(null);
        const promise = fetch(`/api/admin/transactions/${id}/assign`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderCode: orderCodeInput.trim().toUpperCase() })
        });

        toast.promise(promise, {
            loading: 'Đang gán đơn hàng...',
            success: (res) => {
                if (res.ok) {
                    fetchData();
                    setOrderCodeInput("");
                    return 'Đã gán đơn hàng, kiểm tra độ lệch tiền!';
                }
                throw new Error('Failed');
            },
            error: 'Mã đơn không tồn tại hoặc lỗi.'
        });
    };

    const filtered = transactions.filter((txn) => {
        if (searchQuery === "") return true;
        return txn.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.orderCode?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title="Trung tâm Đối soát (Reconciliation Center)"
                description="Quản lý dòng tiền thực tế và khớp nối với đơn hàng trên hệ thống"
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-bl from-indigo-500 to-transparent w-full h-full pointer-events-none transition-opacity group-hover:opacity-10" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                            <ArrowDownLeft className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Nhận trong ngày</p>
                            <p className="text-xl font-black text-gray-900 tracking-tight">
                                {summary ? formatCurrency(summary.receivedToday) : "..."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-bl from-emerald-500 to-transparent w-full h-full pointer-events-none transition-opacity group-hover:opacity-10" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Đã chốt (Reconciled)</p>
                            <p className="text-xl font-black text-gray-900 tracking-tight text-emerald-700">
                                {summary ? formatCurrency(summary.reconciledAmount) : "..."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-bl from-amber-500 to-transparent w-full h-full pointer-events-none transition-opacity group-hover:opacity-10" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                            <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Chờ xử lý</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-xl font-black text-gray-900 tracking-tight text-amber-700">
                                    {summary ? formatCurrency(summary.pendingAmount) : "..."}
                                </p>
                                <span className="text-xs font-bold text-amber-600/60 bg-amber-100/50 px-1.5 py-0.5 rounded">
                                    {summary?.pendingCount || 0} GD
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-bl from-red-500 to-transparent w-full h-full pointer-events-none transition-opacity group-hover:opacity-10" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 rounded-2xl bg-red-50 border border-red-100">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Cảnh báo / Lỗi</p>
                            <p className="text-xl font-black text-gray-900 tracking-tight text-red-700">
                                {summary ? summary.failedCount : "..."} <span className="text-sm font-bold text-red-600/60">Giao dịch</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Mã GD, STK, Mã đơn..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-700 transition-colors"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {["ALL", "pending", "matched", "reconciled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                filterStatus === status
                                    ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            {status === "ALL" ? "Tất cả" : statusConfig[status]?.label}
                        </button>
                    ))}
                    <button
                        onClick={() => fetchData()}
                        disabled={fetching}
                        className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100 disabled:opacity-50"
                    >
                        <RefreshCw className={cn("h-4 w-4", fetching && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Reconciliation Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 gap-4">
                        <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-medium text-gray-500 animate-pulse">Đang đồng bộ giao dịch...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Thời gian</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nguồn / Mã GD</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nội dung chuyển</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Số tiền GD</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Đơn hàng / Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                                                    <CreditCard className="h-8 w-8 text-gray-300" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-500">Sổ cái trống</p>
                                                <p className="text-xs text-gray-400 max-w-[200px]">Không tìm thấy giao dịch nào khớp với bộ lọc của bạn.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-bold text-gray-900">{formatDate(txn.createdAt).split(' ')[0]}</span>
                                                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDate(txn.createdAt).split(' ')[1]}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <SourceBadge source={txn.source as string} />
                                                    <span className="text-xs font-black text-gray-600 font-mono tracking-tight bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                                        {txn.code}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-sm font-bold text-gray-900">{txn.senderName || "Ẩn danh"}</p>
                                                    <p className="text-xs text-gray-600 font-medium max-w-[220px] line-clamp-2" title={txn.content || ""}>
                                                        {txn.content || "—"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <span className="text-[15px] font-black text-gray-900 font-mono">
                                                        {formatCurrency(txn.amount)}
                                                    </span>
                                                    {txn.mismatchAmount !== null && txn.mismatchAmount !== 0 && (
                                                        <span className={cn(
                                                            "text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider",
                                                            txn.mismatchAmount > 0 ? "bg-red-50 text-red-600 border border-red-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                                                        )}>
                                                            Lệch: {txn.mismatchAmount > 0 ? '+' : ''}{formatCurrency(txn.mismatchAmount)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge status={txn.status} />
                                                {txn.status === "pending" && !txn.orderCode && (
                                                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded w-fit border border-amber-100/50">
                                                        <AlertTriangle className="h-3 w-3" /> Lơ lửng
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-2">
                                                    {txn.orderCode ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100" title="Mã đơn hàng liên kết">
                                                                {txn.orderCode}
                                                            </span>
                                                            {txn.status !== 'reconciled' && (
                                                                <button
                                                                    title="Đổi mã"
                                                                    onClick={() => { setAssigningId(txn.id); setOrderCodeInput(txn.orderCode!); }}
                                                                    className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 underline underline-offset-2 transition-colors"
                                                                >
                                                                    Sửa
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 font-medium italic">Chưa nối đơn</span>
                                                    )}

                                                    {/* Row Actions */}
                                                    {txn.status !== 'reconciled' && (
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            {assigningId === txn.id ? (
                                                                <div className="flex gap-1.5 items-center bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                                                                    <input
                                                                        type="text"
                                                                        className="w-24 px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 uppercase font-mono"
                                                                        placeholder="Mã đơn"
                                                                        value={orderCodeInput}
                                                                        onChange={e => setOrderCodeInput(e.target.value)}
                                                                        autoFocus
                                                                    />
                                                                    <button onClick={() => handleAssign(txn.id)} className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                                                                        <Check className="h-3 w-3" />
                                                                    </button>
                                                                    <button onClick={() => setAssigningId(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition">
                                                                        <XCircle className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {!txn.orderCode && (
                                                                        <button
                                                                            onClick={() => { setAssigningId(txn.id); setOrderCodeInput(""); }}
                                                                            className="text-[10px] font-bold px-2.5 py-1 rounded bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                                                        >
                                                                            Gán Đơn
                                                                        </button>
                                                                    )}
                                                                    {txn.orderCode && (
                                                                        <button
                                                                            onClick={() => handleReconcile(txn.id)}
                                                                            className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm flex items-center gap-1"
                                                                        >
                                                                            <CheckCircle2 className="h-3 w-3" /> Chốt sổ
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer Info */}
                {!loading && (
                    <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">
                            Hiển thị <span className="font-bold text-gray-900 bg-white border border-gray-200 px-1.5 py-0.5 rounded mx-1">{filtered.length}</span> giao dịch trên tổng số
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
