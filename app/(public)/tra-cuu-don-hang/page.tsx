"use client";

import { useState } from "react";
import { Search, Package, CheckCircle, Clock, XCircle, ChevronLeft, MessageCircle, CreditCard, Copy, Check } from "lucide-react";

interface OrderTimeline {
    label: string;
    time: string | null;
    done: boolean;
}

interface Fulfillment {
    id: string;
    action: string;
    note: string | null;
    credentialText: string;
    createdAt: string;
}

interface OrderData {
    id: string;
    code: string;
    customerName: string;
    customerEmail: string;
    type: string;
    amount: number;
    paymentStatus: string;
    fulfillStatus: string;
    statusInfo: { label: string; color: string };
    adminNote: string | null;
    createdAt: string;
    deliveredAt: string | null;
    timeline: OrderTimeline[];
    credentialText: string | null;
    fulfillments: Fulfillment[];
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())} - ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function StatusBadge({ status, label }: { status: string; label: string }) {
    const colors: Record<string, string> = {
        green: "bg-green-100 text-green-700 border border-green-200",
        orange: "bg-orange-100 text-orange-700 border border-orange-200",
        blue: "bg-blue-100 text-blue-700 border border-blue-200",
        red: "bg-red-100 text-red-700 border border-red-200",
        gray: "bg-gray-100 text-gray-700 border border-gray-200",
    };
    const dots: Record<string, string> = {
        green: "bg-green-500",
        orange: "bg-orange-500",
        blue: "bg-blue-500",
        red: "bg-red-500",
        gray: "bg-gray-500",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colors[status] ?? colors.gray}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? dots.gray}`} />
            {label}
        </span>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="ml-2 p-1 text-gray-400 hover:text-[#00b4d8] transition-colors"
            title="Sao chép"
        >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
    );
}

import { useSiteConfig } from "@/hooks/use-site-config";

export default function TraCuuDonHangPage() {
    const config = useSiteConfig();
    const [searchCode, setSearchCode] = useState("");
    const [order, setOrder] = useState<OrderData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [view, setView] = useState<"list" | "detail">("list");
    const [filterStatus, setFilterStatus] = useState("ALL");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchCode.trim()) return;
        setLoading(true);
        setError("");
        setOrder(null);
        setView("list");

        try {
            const res = await fetch(`/api/tra-cuu-don-hang?code=${encodeURIComponent(searchCode.trim())}`);
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Không tìm thấy đơn hàng.");
            } else {
                setOrder(data.order);
                setView("list");
            }
        } catch {
            setError("Lỗi kết nối. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const filterButtons = [
        { key: "ALL", label: "Tất cả" },
        { key: "PROCESSING", label: "Chờ xử lý" },
        { key: "DONE", label: "Đã giao" },
        { key: "CANCELLED", label: "Đã hủy" },
    ];

    const matchesFilter =
        !order ||
        filterStatus === "ALL" ||
        (filterStatus === "PROCESSING" && (order.fulfillStatus === "NEW" || order.fulfillStatus === "PROCESSING")) ||
        order.fulfillStatus === filterStatus;

    return (
        <div className="min-h-screen bg-[#f0f7ff]">
            {/* Hero search section */}
            <div className="bg-gradient-to-br from-[#00b4d8] to-[#0077b6] py-10 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Tra cứu đơn hàng</h1>
                    <p className="text-white/80 text-sm mb-6">
                        Nhập <strong>mã nội dung chuyển khoản</strong> để tra cứu trạng thái đơn hàng của bạn
                    </p>
                    <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                id="order-search-input"
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                placeholder="VD: LECH123456..."
                                className="w-full pl-10 pr-4 py-3.5 rounded-xl border-0 shadow-md text-gray-800 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                            />
                        </div>
                        <button
                            id="order-search-btn"
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3.5 bg-white text-[#00b4d8] font-bold rounded-xl shadow-md hover:bg-gray-50 transition-all disabled:opacity-60 flex items-center gap-2 whitespace-nowrap text-sm"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-[#00b4d8] border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            Tra cứu
                        </button>
                    </form>
                    <p className="text-white/60 text-xs mt-3">
                        Mã đơn hàng là nội dung bạn đã điền khi chuyển khoản thanh toán
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-700">
                        <XCircle className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* No search yet */}
                {!order && !error && !loading && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Package className="w-10 h-10 text-[#00b4d8]" />
                        </div>
                        <h3 className="text-gray-600 font-semibold text-lg mb-1">Nhập mã đơn hàng để tra cứu</h3>
                        <p className="text-gray-400 text-sm">Mã đơn hàng được ghi trong nội dung chuyển khoản của bạn</p>
                    </div>
                )}

                {/* Order found - LIST VIEW */}
                {order && view === "list" && (
                    <div>
                        {/* Filter tabs */}
                        <div className="flex gap-2 mb-5 flex-wrap">
                            {filterButtons.map((btn) => (
                                <button
                                    key={btn.key}
                                    id={`filter-${btn.key.toLowerCase()}`}
                                    onClick={() => setFilterStatus(btn.key)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                                        filterStatus === btn.key
                                            ? "bg-[#00b4d8] text-white border-[#00b4d8] shadow-sm"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-[#00b4d8] hover:text-[#00b4d8]"
                                    }`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>

                        {/* Order card */}
                        {matchesFilter ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Order header */}
                                <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-dashed border-gray-100">
                                    <div>
                                        <span className="font-bold text-gray-800 text-base">#{order.code}</span>
                                        <StatusBadge status={order.statusInfo.color} label={order.statusInfo.label} />
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(order.createdAt).toLocaleString("vi-VN")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-0.5">Tổng tiền</p>
                                        <p className="font-bold text-[#00b4d8] text-lg">{formatCurrency(order.amount)}</p>
                                    </div>
                                </div>

                                {/* Product row */}
                                <div className="flex items-center justify-between px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                            <Package className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{order.customerName}</p>
                                            <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                        </div>
                                    </div>
                                    <button
                                        id="view-detail-btn"
                                        onClick={() => setView("detail")}
                                        className="px-4 py-2 bg-[#00b4d8] text-white text-sm font-semibold rounded-lg hover:bg-[#0096c7] transition-colors"
                                    >
                                        Chi tiết
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">
                                <Package className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                                <p>Không có đơn hàng nào phù hợp với bộ lọc này.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* DETAIL VIEW */}
                {order && view === "detail" && (
                    <div>
                        <button
                            id="back-to-list-btn"
                            onClick={() => setView("list")}
                            className="flex items-center gap-1.5 text-[#00b4d8] font-medium text-sm mb-5 hover:underline"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Quay lại danh sách
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Left: Timeline + Products */}
                            <div className="lg:col-span-2 space-y-5">
                                {/* Order status card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="font-bold text-gray-800 text-base">Đơn hàng #{order.code}</h2>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Đặt lúc: {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <StatusBadge status={order.statusInfo.color} label={order.statusInfo.label} />
                                    </div>

                                    {/* Timeline */}
                                    <div className="space-y-4 mt-5">
                                        {order.timeline.map((step, idx) => {
                                            const icons = [
                                                <Package key="0" className="w-4 h-4" />,
                                                <Clock key="1" className="w-4 h-4" />,
                                                <CheckCircle key="2" className="w-4 h-4" />,
                                            ];
                                            const colors = ["text-yellow-500", "text-blue-500", "text-green-500"];
                                            return (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div
                                                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                                            step.done ? "bg-opacity-100" : "bg-gray-100 text-gray-300"
                                                        } ${step.done ? `${colors[idx]} bg-opacity-10` : ""}`}
                                                        style={step.done ? { backgroundColor: `var(--timeline-bg-${idx})` } : {}}
                                                    >
                                                        <span
                                                            className={step.done ? colors[idx] : "text-gray-300"}
                                                        >
                                                            {icons[idx]}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-semibold ${step.done ? "text-gray-800" : "text-gray-300"}`}>
                                                            {step.label}
                                                        </p>
                                                        {step.time && (
                                                            <p className="text-xs text-gray-400">{formatDate(step.time)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Products & credentials */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                    <h3 className="font-bold text-gray-800 mb-4 text-sm">Sản phẩm đã mua</h3>
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-dashed border-gray-100">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                            <Package className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">{order.customerName}</p>
                                            <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                        </div>
                                    </div>

                                    {/* Admin note = customer's provided info */}
                                    {order.adminNote && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                                                👤 Thông tin bạn đã cung cấp
                                            </p>
                                            <p className="text-sm text-gray-700">Ghi chú: {order.adminNote}</p>
                                        </div>
                                    )}

                                    {/* Credentials */}
                                    {order.credentialText ? (
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <p className="text-xs font-semibold text-[#00b4d8] mb-2 flex items-center gap-1.5">
                                                🔑 Thông tin tài khoản:
                                            </p>
                                            <div className="relative">
                                                <textarea
                                                    id="credential-textarea"
                                                    readOnly
                                                    value={order.credentialText}
                                                    rows={5}
                                                    className="w-full bg-white border border-blue-100 rounded-lg p-3 text-sm text-gray-700 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-[#00b4d8]"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <CopyButton text={order.credentialText} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        order.fulfillStatus === "DONE" ? null : (
                                            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 text-sm text-orange-700 flex items-center gap-2">
                                                <Clock className="w-4 h-4 shrink-0" />
                                                Thông tin tài khoản sẽ được gửi sau khi đơn hàng được xử lý.
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Right: Order info */}
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                    <h3 className="font-bold text-gray-800 mb-4 text-sm">Thông tin đơn hàng</h3>

                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 mb-1">Giá thanh toán</p>
                                        <p className="text-2xl font-bold text-[#00b4d8]">{formatCurrency(order.amount)}</p>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-lg mb-4">
                                        <p className="text-xs text-gray-400 mb-1">Phương thức thanh toán</p>
                                        <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                            Chuyển khoản ngân hàng
                                        </p>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-lg mb-4">
                                        <p className="text-xs text-gray-400 mb-1">Trạng thái thanh toán</p>
                                        <p className="text-sm font-semibold">
                                            {order.paymentStatus === "PAID" ? (
                                                <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Đã thanh toán</span>
                                            ) : order.paymentStatus === "PENDING" ? (
                                                <span className="text-orange-500 flex items-center gap-1"><Clock className="w-4 h-4" /> Chờ thanh toán</span>
                                            ) : (
                                                <span className="text-gray-600">{order.paymentStatus}</span>
                                            )}
                                        </p>
                                    </div>

                                    <a
                                        id="contact-support-btn"
                                        href={config.social.zalo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#00b4d8] to-[#0096c7] text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Liên hệ hỗ trợ
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
