"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Search,
    ShoppingBag,
    Users2,
    CheckCircle2,
    Clock,
    XCircle,
    Calendar,
    Send,
    Mail,
    User,
    Phone,
    Package,
    ChevronDown,
    ChevronUp,
    Sparkles,
    RefreshCw,
    Tag,
    CreditCard,
    FileText,
    Receipt,
    ShoppingCart,
    Copy,
    Check,
    Database,
    Plus,
    Loader2
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

// ===== INTERFACES =====
interface OrderProduct {
    name: string;
    planLabel: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    code: string;
    // Customer info from checkout
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    // Order info
    type: "PREMIUM" | "SOCIAL";
    products: OrderProduct[];
    subtotal: number;
    transactionFee: number;
    totalAmount: number;
    couponCode?: string;
    couponDiscount?: number;
    paymentMethod: string;
    paymentStatus: string;
    fulfillStatus: string;
    note?: string;
    accountDelivered?: string;
    deliveredAt?: string;
    createdAt: string;
    targetUrl?: string;

    // Fulfillments
    fulfillments?: any[];
}

// ===== PREMIUM SAMPLE DATA =====
const samplePremiumOrders: Order[] = [
    {
        id: "1",
        code: "ORD-20260213-001",
        customerName: "Nguyễn Văn A",
        customerEmail: "nguyenvana@gmail.com",
        customerPhone: "0901234567",
        type: "PREMIUM",
        products: [
            { name: "ChatGPT Plus", planLabel: "1 Tháng", quantity: 1, price: 99000 },
        ],
        subtotal: 99000,
        transactionFee: 990,
        totalAmount: 99990,
        couponCode: "GIAM10",
        couponDiscount: 9900,
        paymentMethod: "Chuyển khoản ngân hàng (VietQR)",
        paymentStatus: "PAID",
        fulfillStatus: "NEW",
        note: "",
        createdAt: "2026-02-13T14:30:00Z",
    },
    {
        id: "2",
        code: "ORD-20260213-002",
        customerName: "Trần Thị B",
        customerEmail: "tranthib@gmail.com",
        customerPhone: "0912345678",
        type: "PREMIUM",
        products: [
            { name: "Netflix Premium", planLabel: "3 Tháng", quantity: 1, price: 260000 },
        ],
        subtotal: 260000,
        transactionFee: 2600,
        totalAmount: 262600,
        paymentMethod: "Chuyển khoản ngân hàng (VietQR)",
        paymentStatus: "PAID",
        fulfillStatus: "NEW",
        createdAt: "2026-02-13T12:15:00Z",
    },
    {
        id: "3",
        code: "ORD-20260212-003",
        customerName: "Lê Minh C",
        customerEmail: "leminhc@yahoo.com",
        customerPhone: "0987654321",
        type: "PREMIUM",
        products: [
            { name: "YouTube Premium", planLabel: "12 Tháng", quantity: 1, price: 329000 },
        ],
        subtotal: 329000,
        transactionFee: 3290,
        totalAmount: 332290,
        paymentMethod: "Chuyển khoản ngân hàng (VietQR)",
        paymentStatus: "PAID",
        fulfillStatus: "DONE",
        accountDelivered: "Email: ytpremium_user@gmail.com\nMật khẩu: Ytpr3m1um!2026",
        deliveredAt: "2026-02-12T17:30:00Z",
        createdAt: "2026-02-12T16:45:00Z",
    },
    {
        id: "4",
        code: "ORD-20260212-004",
        customerName: "Phạm Thanh D",
        customerEmail: "phamthanhd@outlook.com",
        customerPhone: "0976543210",
        type: "PREMIUM",
        products: [
            { name: "Canva Pro", planLabel: "1 Năm", quantity: 1, price: 49000 },
            { name: "ChatGPT Plus", planLabel: "1 Tháng", quantity: 1, price: 99000 },
        ],
        subtotal: 148000,
        transactionFee: 1480,
        totalAmount: 149480,
        couponCode: "COMBO20",
        couponDiscount: 29600,
        paymentMethod: "Chuyển khoản ngân hàng (VietQR)",
        paymentStatus: "PAID",
        fulfillStatus: "DONE",
        accountDelivered: "Canva Pro:\nEmail: canva_user@gmail.com\nMật khẩu: CanvaPr0_2026\n\nChatGPT Plus:\nEmail: gpt_user@gmail.com\nMật khẩu: GptPl4s_2026",
        deliveredAt: "2026-02-12T15:00:00Z",
        note: "Giao 2 tài khoản cùng lúc giúp em",
        createdAt: "2026-02-12T14:20:00Z",
    },
    {
        id: "5",
        code: "ORD-20260211-005",
        customerName: "Hoàng Thu E",
        customerEmail: "hoangthu.e@gmail.com",
        customerPhone: "0865432109",
        type: "PREMIUM",
        products: [
            { name: "Gemini Pro", planLabel: "1 Tháng", quantity: 1, price: 189000 },
        ],
        subtotal: 189000,
        transactionFee: 1890,
        totalAmount: 190890,
        paymentMethod: "Chuyển khoản ngân hàng (VietQR)",
        paymentStatus: "PAID",
        fulfillStatus: "NEW",
        createdAt: "2026-02-11T11:00:00Z",
    },
];

// ===== SOCIAL SAMPLE DATA =====
const sampleSocialOrders: Order[] = [
    {
        id: "6",
        code: "SOC-20260213-001",
        customerName: "Vũ Đức F",
        customerEmail: "vuducf@gmail.com",
        customerPhone: "0854321098",
        type: "SOCIAL",
        products: [
            { name: "Tăng follow TikTok", planLabel: "1.000 follow", quantity: 1, price: 150000 },
        ],
        subtotal: 150000,
        transactionFee: 1500,
        totalAmount: 151500,
        paymentMethod: "Chuyển khoản ngân hàng (VietQR)",
        paymentStatus: "PAID",
        fulfillStatus: "NEW",
        note: "Link: https://tiktok.com/@user123",
        createdAt: "2026-02-13T10:30:00Z",
    },
    {
        id: "7",
        code: "SOC-20260213-002",
        customerName: "Đỗ Minh G",
        customerEmail: "dominh.g@gmail.com",
        customerPhone: "0743210987",
        type: "SOCIAL",
        products: [
            { name: "Tăng follow Facebook", planLabel: "500 follow", quantity: 1, price: 100000 },
        ],
        subtotal: 100000,
        transactionFee: 1000,
        totalAmount: 101000,
        paymentMethod: "Chuyển khoản ngân hàng (VietQR)",
        paymentStatus: "PAID",
        fulfillStatus: "DONE",
        deliveredAt: "2026-02-13T10:00:00Z",
        note: "Link: https://facebook.com/user456",
        createdAt: "2026-02-13T09:00:00Z",
    },
    {
        id: "8",
        code: "SOC-20260212-003",
        customerName: "Ngô Thanh H",
        customerEmail: "ngothanh.h@gmail.com",
        customerPhone: "0632109876",
        type: "SOCIAL",
        products: [
            { name: "Tăng follow Instagram", planLabel: "2.000 follow", quantity: 1, price: 280000 },
        ],
        subtotal: 280000,
        transactionFee: 2800,
        totalAmount: 282800,
        paymentMethod: "Chuyển khoản ngân hàng (VietQR)",
        paymentStatus: "PAID",
        fulfillStatus: "NEW",
        note: "Link: https://instagram.com/user789",
        createdAt: "2026-02-12T15:00:00Z",
    },
];

// ===== COPY BUTTON =====
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "p-1.5 rounded-lg transition-all flex-shrink-0",
                copied
                    ? "bg-emerald-100 text-emerald-600"
                    : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"
            )}
            title="Sao chép"
        >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
    );
}

// ===== PENDING ORDER CARD =====
function PendingOrderCard({
    order,
    isPremium,
    suppliers,
    onSend,
    expanded,
    onToggleExpand,
    recentBatchCodes,
}: {
    order: Order;
    isPremium: boolean;
    suppliers: any[];
    onSend: (id: string, accountInfo: string, supplierName: string, batchCode: string, action: string) => void;
    expanded?: boolean;
    onToggleExpand?: () => void;
    recentBatchCodes?: Record<string, string>;
}) {
    const [accountInfo, setAccountInfo] = useState("");
    const [supplierName, setSupplierName] = useState("");
    const [batchCode, setBatchCode] = useState("");
    const [action, setAction] = useState("DELIVER");
    const [sending, setSending] = useState(false);

    // Dropdown state for searchable combo
    const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
    const [searchSupplierTerm, setSearchSupplierTerm] = useState("");
    const supplierDropdownRef = useRef<HTMLDivElement>(null);

    // Auto-focus ref
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (supplierDropdownRef.current && !supplierDropdownRef.current.contains(event.target as Node)) {
                setIsSupplierDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allSuppliers = [
        { id: 'n1', name: 'N1' },
        { id: 'n2', name: 'N2' },
        { id: 'n3', name: 'N3' },
        ...suppliers.filter(s => !['N1', 'N2', 'N3'].includes(s.name))
    ];

    const filteredSuppliers = allSuppliers.filter(s =>
        s.name.toLowerCase().includes(searchSupplierTerm.toLowerCase()) ||
        (s.contact && s.contact.toLowerCase().includes(searchSupplierTerm.toLowerCase()))
    );

    // Default local expand toggle (fallback if parent doesn't control)
    const [localExpanded, setLocalExpanded] = useState(false);
    const isExpanded = expanded !== undefined ? expanded : localExpanded;
    const toggleExpand = onToggleExpand || (() => setLocalExpanded(!localExpanded));

    // Handle initial expansion: get template and focus
    useEffect(() => {
        if (isExpanded) {
            // Auto focus
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);

            // Auto-fill template if empty
            if (!accountInfo && isPremium && order.products && order.products.length > 0) {
                // Since `order.products` doesn't strictly carry `slug`, we mock a mapping
                // or just rely on the fact that if it's premium, they might be using explicit slugs.
                // In actual DB, you might need product slug.
                // Here we perform a simple keyword heuristic or just fetch `accountTemplate` if it was sent by API.
                // For demonstration, let's extract known keywords.
                const firstProductName = order.products[0]?.name?.toLowerCase() || "";
                let template = "";
                if (firstProductName.includes("chatgpt")) template = "Email: \nMật khẩu: \nProfile: \nMã PIN: \nHạn sử dụng: ";
                else if (firstProductName.includes("netflix")) template = "Tài khoản Netflix Premium\nEmail: \nMật khẩu: \nProfile số: \nMã PIN: \nHạn sử dụng: ";
                else if (firstProductName.includes("youtube")) template = "Mời bạn bấm vào link sau để tham gia Family: \n\nEmail của bạn đã được add Premium tới ngày: ";
                else if (firstProductName.includes("capcut")) template = "Tài khoản CapCut Pro\nEmail đăng nhập: \nMật khẩu: \nHạn sử dụng: ";
                else if (firstProductName.includes("canva")) template = "Link tham gia Nhóm Canva Pro:\n\nTrạng thái: Đã add Email của bạn";
                else if (firstProductName.includes("gemini")) template = "Link tham gia Family (Gemini Advanced):\n\nTrạng thái: Đã gửi lời mời, bạn vui lòng check mail";

                if (template) {
                    setAccountInfo(template);
                }
            }
        }
    }, [isExpanded, isPremium, order.products]);

    // Handle auto-suggest batch code when supplier changes
    useEffect(() => {
        if (supplierName && recentBatchCodes && recentBatchCodes[supplierName]) {
            setBatchCode(recentBatchCodes[supplierName]);
        }
    }, [supplierName, recentBatchCodes]);

    // Keyboard Shortcuts
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (accountInfo.trim() && !sending) {
                setAction("DELIVER");
                handleSend("DELIVER");
            }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (!sending) {
                setAction("NOTE");
                handleSend("NOTE");
            }
        }
    };

    const handleSend = async (currentAction: string = action) => {
        if (!accountInfo.trim() && currentAction !== 'NOTE') return;
        setSending(true);
        // await new Promise((r) => setTimeout(r, 800)); // remove fake delay for real fast exp
        onSend(order.id, accountInfo, supplierName, batchCode, currentAction);
        setSending(false);
    };

    const [picking, setPicking] = useState(false);

    const handleAutoPick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPicking(true);
        try {
            const res = await fetch(`/api/admin/orders/${order.id}/inventory-pick`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                if (data.inventoryItem) {
                    setAccountInfo(data.inventoryItem.credentialText);
                    setSupplierName(data.inventoryItem.supplier?.name || "");
                    setBatchCode(data.inventoryItem.batchCode || "");
                }
            } else {
                toast.error(data.error || "Kho không có tài khoản phù hợp");
            }
        } catch (error) {
            toast.error("Gặp sự cố kết nối tới kho.");
        } finally {
            setPicking(false);
        }
    };

    const productSummary = (order.products || []).map((p) => p.name).join(", ");

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Collapsed header */}
            <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={toggleExpand}
            >
                <div className="flex items-center gap-4 min-w-0">
                    <div className="p-2 rounded-xl bg-amber-50 flex-shrink-0">
                        <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-blue-600 font-mono">#{order.code}</span>
                            <span className="text-[10px] font-bold text-gray-400">•</span>
                            <span className="text-xs font-bold text-gray-800 truncate">{productSummary}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                                <User className="h-3 w-3" /> {order.customerName}
                            </span>
                            <span className="text-sm font-black text-gray-900">{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] text-gray-400 font-medium hidden sm:block">{formatDate(order.createdAt)}</span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-50">
                    {/* ==================== THÔNG TIN KHÁCH HÀNG ==================== */}
                    <div className="mt-4 mb-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                            <User className="h-3 w-3" /> Thông tin khách hàng
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-xl">
                                <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Họ tên</p>
                                    <p className="text-xs font-bold text-gray-900 truncate">{order.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-xl">
                                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
                                    <p className="text-xs font-bold text-gray-900 truncate">{order.customerEmail}</p>
                                </div>
                                <CopyButton text={order.customerEmail} />
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-xl">
                                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SĐT / Zalo</p>
                                    <p className="text-xs font-bold text-gray-900">{order.customerPhone}</p>
                                </div>
                                <CopyButton text={order.customerPhone} />
                            </div>
                        </div>
                    </div>

                    {/* ==================== LINK / USERNAME (SOCIAL) ==================== */}
                    {!isPremium && order.targetUrl && (
                        <div className="mb-4">
                            <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                                <Users2 className="h-3 w-3" /> Link / Username cần tăng
                            </h4>
                            <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 flex items-center justify-between">
                                <a href={order.targetUrl.startsWith('http') ? order.targetUrl : `https://${order.targetUrl}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-pink-700 hover:underline truncate mr-2">
                                    {order.targetUrl}
                                </a>
                                <CopyButton text={order.targetUrl} />
                            </div>
                        </div>
                    )}

                    {/* ==================== CHI TIẾT ĐƠN HÀNG ==================== */}
                    <div className="mb-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                            <ShoppingCart className="h-3 w-3" /> Chi tiết đơn hàng
                        </h4>
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-200/50">
                                        <th className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                                        <th className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Gói</th>
                                        <th className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">SL</th>
                                        <th className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(order.products || []).map((p, i) => (
                                        <tr key={i} className="border-b border-gray-200/30 last:border-0">
                                            <td className="px-3 py-2 text-xs font-bold text-gray-800">{p.name}</td>
                                            <td className="px-3 py-2 text-xs text-gray-600">{p.planLabel}</td>
                                            <td className="px-3 py-2 text-xs text-gray-600 text-center">x{p.quantity}</td>
                                            <td className="px-3 py-2 text-xs font-bold text-gray-900 text-right">{formatCurrency(p.price * p.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ==================== THANH TOÁN ==================== */}
                    <div className="mb-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                            <Receipt className="h-3 w-3" /> Thanh toán
                        </h4>
                        <div className="bg-gray-50 rounded-xl px-3 py-3 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500 font-medium">Tạm tính</span>
                                <span className="font-bold text-gray-800">{formatCurrency(order.subtotal)}</span>
                            </div>

                            {order.couponCode && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                                        <Tag className="h-3 w-3" />
                                        Mã ưu đãi: {order.couponCode}
                                    </span>
                                    <span className="font-bold text-emerald-600">-{formatCurrency(order.couponDiscount || 0)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm pt-2 border-t border-gray-200/50">
                                <span className="font-black text-gray-900">Tổng cộng</span>
                                <span className="font-black text-gray-900">{formatCurrency(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-xs pt-1">
                                <span className="text-gray-500 font-medium flex items-center gap-1">
                                    <CreditCard className="h-3 w-3" /> Phương thức
                                </span>
                                <span className="font-bold text-gray-700">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500 font-medium">Trạng thái</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border text-emerald-700 bg-emerald-50 border-emerald-200">
                                    <CheckCircle2 className="h-3 w-3" /> Đã thanh toán
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ==================== GHI CHÚ ==================== */}
                    <div className={`mb-4 px-3 py-2.5 rounded-xl border ${order.note ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1 ${order.note ? "text-blue-400" : "text-gray-400"}`}>
                            <FileText className="h-3 w-3" /> Ghi chú của khách
                        </p>
                        <p className={`text-xs font-medium ${order.note ? "text-blue-800" : "text-gray-400 italic"}`}>
                            {order.note || "Không có ghi chú"}
                        </p>
                    </div>

                    {/* ==================== GỬI TÀI KHOẢN / CẬP NHẬT NGUỒN ==================== */}
                    {isPremium && (
                        <div className="space-y-4 pt-4 border-t border-gray-100 mt-4">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5 text-blue-600" />
                                Giao tài khoản & Nguồn hàng
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-700 uppercase mb-2">Nguồn lấy tài khoản</label>
                                    <div className="relative" ref={supplierDropdownRef}>
                                        <div
                                            onClick={() => setIsSupplierDropdownOpen(!isSupplierDropdownOpen)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm cursor-pointer flex items-center justify-between hover:border-gray-400 transition-all"
                                        >
                                            <span className={supplierName ? "text-gray-900 font-medium" : "text-gray-400 font-medium"}>
                                                {supplierName || "Chọn hoặc nhập nguồn..."}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isSupplierDropdownOpen ? 'rotate-180' : ''}`} />
                                        </div>

                                        {isSupplierDropdownOpen && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                                                <div className="p-2 border-b border-gray-100 flex items-center gap-2">
                                                    <Search className="w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Tìm kiếm hoặc nhập mới..."
                                                        className="w-full text-sm outline-none bg-transparent"
                                                        value={searchSupplierTerm}
                                                        onChange={(e) => setSearchSupplierTerm(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && searchSupplierTerm) {
                                                                e.preventDefault();
                                                                setSupplierName(searchSupplierTerm);
                                                                setIsSupplierDropdownOpen(false);
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="max-h-48 overflow-y-auto p-1">
                                                    {filteredSuppliers.map((sup) => (
                                                        <div
                                                            key={sup.id}
                                                            onClick={() => {
                                                                setSupplierName(sup.name);
                                                                setIsSupplierDropdownOpen(false);
                                                            }}
                                                            className={`px-3 py-2 text-sm rounded-sm cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors ${supplierName === sup.name ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                                        >
                                                            <span>{sup.name} <span className="text-gray-400 text-xs ml-1">{sup.contact ? `(${sup.contact})` : ''}</span></span>
                                                            {supplierName === sup.name && <Check className="w-4 h-4" />}
                                                        </div>
                                                    ))}
                                                    {searchSupplierTerm && !filteredSuppliers.some(s => s.name.toLowerCase() === searchSupplierTerm.toLowerCase()) && (
                                                        <div
                                                            className="px-3 py-3 text-sm text-blue-600 cursor-pointer hover:bg-blue-50 rounded-sm font-medium flex items-center gap-2"
                                                            onClick={() => {
                                                                setSupplierName(searchSupplierTerm);
                                                                setIsSupplierDropdownOpen(false);
                                                            }}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                            Sử dụng "{searchSupplierTerm}"
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-gray-700 uppercase mb-2">Mã đơn gốc</label>
                                    <input
                                        type="text"
                                        value={batchCode}
                                        onChange={(e) => setBatchCode(e.target.value)}
                                        placeholder="Ví dụ: DH_12345..."
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                                    <span>Thông tin tài khoản (Gửi cho khách qua Email)</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleAutoPick}
                                            disabled={picking || sending}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase transition-colors"
                                            title="Tìm kho tự động thẻ rảnh rỗi dựa vào Sản phẩm Order"
                                        >
                                            {picking ? <div className="h-3 w-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /> : <Database className="h-3 w-3" />}
                                            Chọn từ Kho
                                        </button>
                                        <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded">Ctrl + Enter để Gửi | Ctrl + S để Lưu</span>
                                    </div>
                                </label>
                                <textarea
                                    ref={textareaRef}
                                    value={accountInfo}
                                    onChange={(e) => setAccountInfo(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Ví dụ:\nEmail: user@example.com\nMật khẩu: password123\nHạn sử dụng: 13/03/2026`}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={() => handleSend("DELIVER")}
                                    disabled={!accountInfo.trim() || sending}
                                    className={cn(
                                        "inline-flex flex-1 items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                                        accountInfo.trim() && !sending
                                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    {sending && action === "DELIVER" ? (
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    Lưu & Gửi Email (Hoàn tất)
                                </button>

                                <button
                                    onClick={() => handleSend("NOTE")}
                                    disabled={sending}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                                >
                                    {sending && action === "NOTE" ? (
                                        <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <FileText className="h-4 w-4" />
                                    )}
                                    Chỉ lưu nháp (Không gửi email)
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Social: mark done */}
                    {!isPremium && (
                        <div className="pt-2 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setSending(true);
                                    setTimeout(() => onSend(order.id, "done", "", "", "DELIVER"), 500);
                                }}
                                disabled={sending}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 transition-all"
                            >
                                {sending ? (
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                )}
                                Đánh dấu hoàn tất
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ===== COMPLETED ORDER ROW =====
function CompletedOrderRow({
    order,
    isPremium,
    suppliers,
    onResend,
}: {
    order: Order;
    isPremium: boolean;
    suppliers: any[];
    onResend: (id: string, newAccountInfo: string, supplierName: string, batchCode: string) => void;
}) {
    const [showDetails, setShowDetails] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Set default value based on first fulfillment or empty
    const firstDeliveryInfo = order.fulfillments?.find(f => f.action === 'DELIVER' || f.action === 'REPLACE')?.credentialText || order.accountDelivered || "";

    const [editedAccount, setEditedAccount] = useState(firstDeliveryInfo);
    const [supplierName, setSupplierName] = useState("");
    const [batchCode, setBatchCode] = useState("");
    const [sending, setSending] = useState(false);

    // Dropdown state for searchable combo
    const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
    const [searchSupplierTerm, setSearchSupplierTerm] = useState("");
    const supplierDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (supplierDropdownRef.current && !supplierDropdownRef.current.contains(event.target as Node)) {
                setIsSupplierDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allSuppliers = [
        { id: 'n1', name: 'N1' },
        { id: 'n2', name: 'N2' },
        { id: 'n3', name: 'N3' },
        ...suppliers.filter(s => !['N1', 'N2', 'N3'].includes(s.name))
    ];

    const filteredSuppliers = allSuppliers.filter(s =>
        s.name.toLowerCase().includes(searchSupplierTerm.toLowerCase()) ||
        (s.contact && s.contact.toLowerCase().includes(searchSupplierTerm.toLowerCase()))
    );
    const productSummary = (order.products || []).map((p) => p.name).join(", ");

    const handleResend = async () => {
        if (!editedAccount.trim()) return;
        setSending(true);
        // await new Promise((r) => setTimeout(r, 800));
        onResend(order.id, editedAccount, supplierName, batchCode);
        setSending(false);
        setIsEditing(false);
    };

    const [picking, setPicking] = useState(false);

    const handleAutoPick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPicking(true);
        try {
            const res = await fetch(`/api/admin/orders/${order.id}/inventory-pick`, { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                if (data.inventoryItem) {
                    setEditedAccount(data.inventoryItem.credentialText);
                    setSupplierName(data.inventoryItem.supplier?.name || "");
                    setBatchCode(data.inventoryItem.batchCode || "");
                }
            } else {
                toast.error(data.error || "Kho không có tài khoản phù hợp");
            }
        } catch (error) {
            toast.error("Gặp sự cố kết nối tới kho.");
        } finally {
            setPicking(false);
        }
    };

    return (
        <>
            <tr
                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
            >
                <td className="px-5 py-3.5">
                    <span className="text-xs font-black text-blue-600 font-mono">#{order.code}</span>
                </td>
                <td className="px-5 py-3.5">
                    <p className="text-xs font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                </td>
                <td className="px-5 py-3.5">
                    <p className="text-xs font-bold text-gray-800">{productSummary}</p>
                </td>
                <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-black text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </td>
                <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border text-emerald-700 bg-emerald-50 border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Hoàn tất
                    </span>
                </td>
                <td className="px-5 py-3.5">
                    <div className="text-[11px] text-gray-400 font-medium">{formatDate(order.deliveredAt || order.createdAt)}</div>
                </td>
            </tr>
            {showDetails && (
                <tr>
                    <td colSpan={6} className="px-5 pb-4 pt-0">
                        <div className="space-y-3">
                            {/* Link / Username cho Social */}
                            {!isPremium && order.targetUrl && (
                                <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 max-w-[80%]">
                                        <p className="text-[10px] text-pink-500 font-bold uppercase shrink-0">Link gốc:</p>
                                        <a href={order.targetUrl.startsWith('http') ? order.targetUrl : `https://${order.targetUrl}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-pink-700 hover:underline truncate">
                                            {order.targetUrl}
                                        </a>
                                    </div>
                                    <CopyButton text={order.targetUrl} />
                                </div>
                            )}

                            {/* Customer info */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
                                    <p className="font-bold text-gray-800">{order.customerEmail}</p>
                                </div>
                                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">SĐT</p>
                                    <p className="font-bold text-gray-800">{order.customerPhone}</p>
                                </div>
                                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Thanh toán</p>
                                    <p className="font-bold text-gray-800">{formatCurrency(order.totalAmount)}</p>
                                </div>
                            </div>
                            {order.couponCode && (
                                <div className="bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg text-xs flex items-center gap-1.5">
                                    <Tag className="h-3 w-3 text-emerald-600" />
                                    <span className="font-bold text-emerald-700">Mã ưu đãi: {order.couponCode}</span>
                                    <span className="text-emerald-600 font-medium ml-1">(-{formatCurrency(order.couponDiscount || 0)})</span>
                                </div>
                            )}
                            {/* Account sent + Resend */}
                            {isPremium && !isEditing && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-gray-800 flex items-center gap-1.5 text-xs">
                                            <Package className="h-4 w-4 text-emerald-600" /> Lịch sử Giao tài khoản & Bảo hành
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditing(true);
                                                setEditedAccount(firstDeliveryInfo);
                                            }}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-sm"
                                        >
                                            <RefreshCw className="h-3 w-3" />
                                            Đổi trả / Bảo hành
                                        </button>
                                    </div>

                                    {order.fulfillments?.length ? (
                                        <div className="space-y-2">
                                            {order.fulfillments.map((f, i) => (
                                                <div key={f.id} className={`rounded-xl px-4 py-3 text-xs border ${f.action === 'NOTE' ? 'bg-gray-50 border-gray-100' : f.action === 'REPLACE' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${f.action === 'NOTE' ? 'bg-gray-200 text-gray-600' : f.action === 'REPLACE' ? 'bg-amber-200 text-amber-700' : 'bg-emerald-200 text-emerald-700'}`}>
                                                                {f.action}
                                                            </span>
                                                            <span className="text-gray-500 font-medium">{formatDate(f.createdAt)}</span>
                                                        </div>
                                                        {f.supplierNameSnapshot && (
                                                            <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600 font-bold">
                                                                Nguồn: {f.supplierNameSnapshot} {f.batchCode ? `(${f.batchCode})` : ''}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {f.credentialText && (
                                                        <pre className={`whitespace-pre-wrap font-mono font-medium mt-2 pt-2 border-t ${f.action === 'REPLACE' ? 'text-amber-800 border-amber-200/50' : 'text-emerald-800 border-emerald-200/50'}`}>
                                                            {f.credentialText}
                                                        </pre>
                                                    )}
                                                    {f.note && (
                                                        <p className="mt-2 text-gray-600 italic">Ghi chú: {f.note}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // Legacy fallback for orders that don't have fulfillments yet
                                        order.accountDelivered && (
                                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-xs">
                                                <pre className="whitespace-pre-wrap text-emerald-700 font-mono font-medium">
                                                    {order.accountDelivered}
                                                </pre>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Editing mode for resend */}
                            {isPremium && isEditing && (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 space-y-4">
                                    <p className="text-sm font-black text-amber-800 flex items-center gap-1.5 uppercase tracking-wide">
                                        <RefreshCw className="h-4 w-4" /> Đổi acc / Gửi lại tài khoản (REPLACE)
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-amber-900 mb-2 uppercase tracking-widest">Nguồn lấy tài khoản mới</label>
                                            <div className="relative" ref={supplierDropdownRef}>
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); setIsSupplierDropdownOpen(!isSupplierDropdownOpen); }}
                                                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm cursor-pointer flex items-center justify-between hover:border-amber-400 transition-all font-medium text-amber-900"
                                                >
                                                    <span className={supplierName ? "text-amber-900" : "text-amber-500"}>
                                                        {supplierName || "Chọn hoặc nhập nguồn..."}
                                                    </span>
                                                    <ChevronDown className={`w-4 h-4 text-amber-500 transition-transform ${isSupplierDropdownOpen ? 'rotate-180' : ''}`} />
                                                </div>

                                                {isSupplierDropdownOpen && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-amber-200 rounded-md shadow-lg" onClick={(e) => e.stopPropagation()}>
                                                        <div className="p-2 border-b border-amber-100 flex items-center gap-2 bg-amber-50 rounded-t-md">
                                                            <Search className="w-4 h-4 text-amber-600" />
                                                            <input
                                                                type="text"
                                                                placeholder="Tìm kiếm hoặc nhập mới..."
                                                                className="w-full text-sm outline-none bg-transparent text-amber-900 placeholder-amber-400"
                                                                value={searchSupplierTerm}
                                                                onChange={(e) => setSearchSupplierTerm(e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && searchSupplierTerm) {
                                                                        e.preventDefault();
                                                                        setSupplierName(searchSupplierTerm);
                                                                        setIsSupplierDropdownOpen(false);
                                                                    }
                                                                }}
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="max-h-48 overflow-y-auto p-1 bg-white rounded-b-md">
                                                            {filteredSuppliers.map((sup) => (
                                                                <div
                                                                    key={sup.id}
                                                                    onClick={() => {
                                                                        setSupplierName(sup.name);
                                                                        setIsSupplierDropdownOpen(false);
                                                                    }}
                                                                    className={`px-3 py-2 text-sm rounded-sm cursor-pointer flex items-center justify-between hover:bg-amber-50 transition-colors ${supplierName === sup.name ? 'bg-amber-100 text-amber-900 font-bold' : 'text-amber-800 font-medium'}`}
                                                                >
                                                                    <span>{sup.name} <span className="text-amber-600/60 text-xs ml-1 font-normal">{sup.contact ? `(${sup.contact})` : ''}</span></span>
                                                                    {supplierName === sup.name && <Check className="w-4 h-4 text-amber-600" />}
                                                                </div>
                                                            ))}
                                                            {searchSupplierTerm && !filteredSuppliers.some(s => s.name.toLowerCase() === searchSupplierTerm.toLowerCase()) && (
                                                                <div
                                                                    className="px-3 py-3 text-sm text-amber-700 cursor-pointer hover:bg-amber-50 rounded-sm font-bold flex items-center gap-2"
                                                                    onClick={() => {
                                                                        setSupplierName(searchSupplierTerm);
                                                                        setIsSupplierDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                    Sử dụng "{searchSupplierTerm}"
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-amber-900 mb-2 uppercase tracking-widest">Mã đơn gốc mới</label>
                                            <input
                                                onClick={(e) => e.stopPropagation()}
                                                type="text"
                                                value={batchCode}
                                                onChange={(e) => setBatchCode(e.target.value)}
                                                placeholder="VD: Lô lỗi đền bù..."
                                                className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm font-medium text-amber-900 focus:ring-2 focus:ring-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-amber-900 mb-1.5 uppercase tracking-widest flex items-center justify-between">
                                            <span>Tài khoản đền bù / gửi lại</span>
                                            <button
                                                onClick={handleAutoPick}
                                                disabled={picking || sending}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-[10px] font-black uppercase transition-colors"
                                                title="Tìm kho tự động thẻ rảnh rỗi dựa vào Sản phẩm Order để Bảo hành"
                                            >
                                                {picking ? <div className="h-3 w-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /> : <Database className="h-3 w-3" />}
                                                Bảo hành bằng Kho
                                            </button>
                                        </label>
                                        <textarea
                                            value={editedAccount}
                                            onChange={(e) => setEditedAccount(e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm font-medium text-amber-900 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 resize-none transition-all font-mono"
                                            rows={4}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleResend();
                                            }}
                                            disabled={!editedAccount.trim() || sending}
                                            className={cn(
                                                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all",
                                                editedAccount.trim() && !sending
                                                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                                                    : "bg-amber-200 text-amber-100 cursor-not-allowed"
                                            )}
                                        >
                                            {sending ? (
                                                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Send className="h-3.5 w-3.5" />
                                            )}
                                            {sending ? "Đang gửi..." : "Đổi Acc & Gửi Email"}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditing(false);
                                            }}
                                            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all"
                                        >
                                            Hủy bỏ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

// ===== MAIN COMPONENT =====
function OrdersPageContent() {
    const searchParams = useSearchParams();
    const orderType = searchParams.get("type") || "PREMIUM";
    const isPremium = orderType === "PREMIUM";

    const [orders, setOrders] = useState<Order[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    // Record of recent batch codes used per supplier
    const getRecentBatchCodes = () => {
        const map: Record<string, string> = {};
        // orders are presumably sorted by date desc
        orders.forEach(o => {
            o.fulfillments?.forEach(f => {
                if (f.supplierNameSnapshot && f.batchCode && !map[f.supplierNameSnapshot]) {
                    map[f.supplierNameSnapshot] = f.batchCode;
                }
            });
        });
        return map;
    };
    const recentBatchCodes = getRecentBatchCodes();

    const fetchData = async () => {
        setLoading(true);
        try {
            const apiEndpoint = isPremium ? "/api/admin/product-orders" : "/api/admin/social-orders";
            const [ordersRes, suppliersRes] = await Promise.all([
                fetch(apiEndpoint),
                fetch("/api/admin/suppliers"),
            ]);
            if (ordersRes.ok && suppliersRes.ok) {
                const ordersData = await ordersRes.json();
                const suppliersData = await suppliersRes.json();
                setOrders(ordersData);
                setSuppliers(suppliersData);
                console.log(`Fetched ${ordersData.length} records from ${apiEndpoint}`);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isPremium]);

    const handleSendAccount = async (orderId: string, accountInfo: string, supplierName: string, batchCode: string, action: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/fulfillments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    supplierName,
                    batchCode,
                    credentialText: accountInfo,
                    action,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                fetchData(); // refresh to get new fulfillments & status

                toast.success(data.message, {
                    duration: 10000,
                    action: {
                        label: 'Hoàn tác (Undo)',
                        onClick: () => handleUndoFulfillment(orderId, data.fulfillment.id)
                    }
                });

                // Auto-expand next pending order if completed
                if (action === 'DELIVER' || action === 'REPLACE' || (!isPremium && action === 'done')) {
                    const currentIndex = pendingOrders.findIndex(o => o.id === orderId);
                    if (currentIndex >= 0 && currentIndex + 1 < pendingOrders.length) {
                        setExpandedOrderId(pendingOrders[currentIndex + 1].id);
                    } else {
                        setExpandedOrderId(null);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to post fulfillment:", error);
            toast.error("Lỗi cập nhật đơn hàng");
        }
    };

    const handleUndoFulfillment = async (orderId: string, fulfillmentId: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/fulfillments/${fulfillmentId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success("Đã hoàn tác thao tác vừa rồi.");
                fetchData();
            } else {
                toast.error("Không thể hoàn tác. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Undo error", error);
            toast.error("Lỗi kết nối khi hoàn tác.");
        }
    }

    const handleResendAccount = async (orderId: string, newAccountInfo: string, supplierId: string, batchCode: string) => {
        handleSendAccount(orderId, newAccountInfo, supplierId, batchCode, 'REPLACE');
    };

    const allFiltered = orders.filter((o) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            o.code.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerEmail.toLowerCase().includes(q) ||
            o.customerPhone.includes(q) ||
            (o.products || []).some((p) => p.name.toLowerCase().includes(q))
        );
    });

    const pendingOrders = allFiltered.filter((o) => o.fulfillStatus !== "DONE");
    const completedOrders = allFiltered.filter((o) => o.fulfillStatus === "DONE");

    const pageConfig = isPremium
        ? {
            title: "Đơn hàng sản phẩm",
            description: "Nhận đơn, điền tài khoản, gửi cho khách qua Email",
            icon: ShoppingBag,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-50",
        }
        : {
            title: "Đơn hàng Social",
            description: "Quản lý đơn tăng tương tác mạng xã hội",
            icon: Users2,
            iconColor: "text-pink-600",
            iconBg: "bg-pink-50",
        };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className={cn("p-3 rounded-xl", pageConfig.iconBg)}>
                    <pageConfig.icon className={cn("h-6 w-6", pageConfig.iconColor)} />
                </div>
                <div>
                    <h1 className="text-xl font-black text-gray-900">{pageConfig.title}</h1>
                    <p className="text-sm text-gray-500 font-medium">{pageConfig.description}</p>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50">
                        <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Đang chờ</p>
                        <p className="text-xl font-black text-gray-900">{pendingOrders.length} <span className="text-sm font-bold text-gray-400">đơn</span></p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Đã hoàn thiện</p>
                        <p className="text-xl font-black text-gray-900">{completedOrders.length} <span className="text-sm font-bold text-gray-400">đơn</span></p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tổng doanh thu</p>
                        <p className="text-xl font-black text-gray-900">{formatCurrency(orders.filter((o) => o.paymentStatus === "PAID").reduce((s, o) => s + o.totalAmount, 0))}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm mã đơn, tên khách, email, sản phẩm..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-sm text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* ===== PENDING ===== */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Đang chờ xử lý</h2>
                    {pendingOrders.length > 0 && (
                        <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {pendingOrders.length}
                        </span>
                    )}
                </div>
                {pendingOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-sm font-bold text-gray-400">Tất cả đơn đã được xử lý! 🎉</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingOrders.map((order) => (
                            <PendingOrderCard
                                key={order.id}
                                order={order}
                                isPremium={isPremium}
                                suppliers={suppliers}
                                onSend={handleSendAccount}
                                expanded={expandedOrderId === order.id}
                                onToggleExpand={() => setExpandedOrderId(prev => prev === order.id ? null : order.id)}
                                recentBatchCodes={recentBatchCodes}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ===== COMPLETED ===== */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Đã hoàn thiện</h2>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {completedOrders.length}
                    </span>
                </div>
                {completedOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-gray-400">Chưa có đơn hoàn tất</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã đơn</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">{isPremium ? "Sản phẩm" : "Dịch vụ"}</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Tổng</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                                        <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Gửi lúc</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {completedOrders.map((order) => (
                                        <CompletedOrderRow key={order.id} order={order} isPremium={isPremium} suppliers={suppliers} onResend={handleResendAccount} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-5 py-3 bg-gray-50/30 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-medium">
                                Hiển thị <span className="font-bold text-gray-700">{completedOrders.length}</span> đơn hoàn tất
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <React.Suspense fallback={
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <OrdersPageContent />
        </React.Suspense>
    );
}
