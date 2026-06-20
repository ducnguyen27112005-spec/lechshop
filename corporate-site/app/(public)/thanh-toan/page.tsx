"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Container from "@/components/shared/Container";
import Link from "next/link";
import Image from "next/image";
import { Check, Loader2, GraduationCap, Copy, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { createCustomerRequest } from "@/lib/strapi";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState("vietqr");

    const [showCoupon, setShowCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [isCooldownError, setIsCooldownError] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState<{
        code: string;
        discountPercent: number;
        type: string;
        maxDiscountAmount: number | null;
        usageLimit: number | null;
        usedCount: number;
    } | null>(null);

    const [debouncedCouponCode] = useDebounceValue(couponCode, 500);

    // Student registration state
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [studentData, setStudentData] = useState({
        name: "",
        email: "",
        studentId: "",
        school: "",
    });
    const [studentLoading, setStudentLoading] = useState(false);
    const [studentError, setStudentError] = useState("");
    const [studentCode, setStudentCode] = useState<{
        code: string;
        discountPercent: number;
        expiresAt: string;
    } | null>(null);
    const [copiedCode, setCopiedCode] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        username: "",
        password: "",
        notes: "",
        createAccount: false,
        agreeTerms: false
    });

    const rawDiscountAmount = appliedDiscount
        ? Math.floor(totalPrice * appliedDiscount.discountPercent / 100)
        : 0;
    const discountAmount = appliedDiscount?.maxDiscountAmount
        ? Math.min(rawDiscountAmount, appliedDiscount.maxDiscountAmount)
        : rawDiscountAmount;

    const finalTotal = totalPrice - discountAmount;

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApplyCoupon = async (codeToValidate: string) => {
        if (!codeToValidate.trim()) {
            setAppliedDiscount(null);
            setCouponError("");
            return;
        }

        setCouponLoading(true);
        setCouponError("");

        try {
            const res = await fetch("/api/discounts/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: codeToValidate.trim(),
                    email: formData.email || undefined,
                    productId: items.length > 0 ? items[0].id : undefined // Lấy sản phẩm đầu tiên để test rules (với giả thiết mua từng nhóm)
                }),
            });
            const result = await res.json();

            if (result.valid) {
                setAppliedDiscount({
                    code: result.code,
                    discountPercent: result.discountPercent,
                    type: result.type,
                    maxDiscountAmount: result.maxDiscountAmount || null,
                    usageLimit: result.usageLimit || null,
                    usedCount: result.usedCount || 0,
                });
                setCouponError("");
                setIsCooldownError(false);
            } else {
                setCouponError(result.message || "Mã không hợp lệ");
                setIsCooldownError(result.errorCode === "STUDENT_BENEFIT_COOLDOWN");
                setAppliedDiscount(null);
            }
        } catch {
            setCouponError("Lỗi hệ thống, vui lòng thử lại");
            setIsCooldownError(false);
            setAppliedDiscount(null);
        } finally {
            setCouponLoading(false);
        }
    };

    // Auto validate when debounced code changes
    useEffect(() => {
        if (debouncedCouponCode && debouncedCouponCode !== appliedDiscount?.code) {
            handleApplyCoupon(debouncedCouponCode);
        } else if (!debouncedCouponCode) {
            setAppliedDiscount(null);
            setCouponError("");
            setIsCooldownError(false);
        }
    }, [debouncedCouponCode, formData.email]);

    const handleRemoveCoupon = () => {
        setAppliedDiscount(null);
        setCouponCode("");
        setCouponError("");
        setIsCooldownError(false);
    };

    // Student registration handler
    const handleStudentRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setStudentLoading(true);
        setStudentError("");

        try {
            const res = await fetch("/api/student/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: studentData.name,
                    email: studentData.email,
                    studentId: studentData.studentId,
                    school: studentData.school
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                if (res.status === 409 && data.existingCode) {
                    // Cũ: Already has active code → show it and auto-apply. 
                    // Nhưng API V2 ta dùng /student/request trả 409 khi duplicate email thôi. 
                    setStudentError(data.error);
                    return;
                }
                setStudentError(data.error || "Có lỗi xảy ra, thử lại sau");
                return;
            }

            // Success -> Show pending message to check email
            alert("Yêu cầu của bạn đã được ghi nhận! Thông tin mã giảm giá sẽ được duyệt và gửi qua email.");
            setShowStudentForm(false); // Hide form
            setStudentData({ name: "", email: "", studentId: "", school: "" });
        } catch (err: any) {
            setStudentError("Không thể kết nối đến máy chủ.");
        } finally {
            setStudentLoading(false);
        }
    };

    const handleCopyStudentCode = () => {
        if (studentCode?.code) {
            navigator.clipboard.writeText(studentCode.code);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const handlePlaceOrder = async () => {
        if (!formData.name || !formData.phone || !formData.email || !formData.agreeTerms) {
            alert("Vui lòng điền đầy đủ thông tin và đồng ý điều khoản!");
            return;
        }

        setIsSubmitting(true);
        const orderCode = `ORD-${Date.now().toString().slice(-6)}`;

        try {
            await createCustomerRequest({
                fullName: formData.name,
                email: formData.email,
                contact: formData.phone,
                serviceType: "premium",
                serviceName: `Đơn hàng ${items.length} sản phẩm`,
                orderCode: orderCode,
                products: items,
                totalAmount: finalTotal,
                paymentMethod: "vietqr",
                note: formData.notes + (appliedDiscount ? ` | Mã giảm giá: ${appliedDiscount.code} (-${appliedDiscount.discountPercent}%)` : ""),
                status: "new"
            });

            // Mark discount code as used after successful order
            if (appliedDiscount) {
                try {
                    await fetch("/api/discounts/use", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code: appliedDiscount.code }),
                    });
                } catch {
                    // Silent fail - order already placed
                }
            }

            clearCart();
            router.push(`/thanh-toan/thanh-cong?code=${orderCode}&amount=${finalTotal}`);
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <section className="py-8 bg-gray-50 min-h-screen">
            <Container>
                {/* Top Coupon Section */}
                <div className="mb-8 space-y-3">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Bạn có mã ưu đãi?</span>
                            <button
                                onClick={() => setShowCoupon(!showCoupon)}
                                className="bg-[#343a40] text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-gray-800 transition-colors"
                            >
                                Ấn vào đây để nhập mã
                            </button>
                        </div>

                        {showCoupon && (
                            <div className="border-2 border-dashed border-gray-300 p-6 rounded-md animate-in fade-in slide-in-from-top-2 duration-200">
                                <p className="text-gray-600 text-sm mb-4">
                                    Nếu bạn có mã giảm giá, vui lòng điền vào phía bên dưới.
                                </p>

                                {appliedDiscount ? (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                        <div className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-600 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-green-800 font-bold text-sm">
                                                    Mã {appliedDiscount.code}
                                                    <span className="font-normal text-green-700 ml-1">
                                                        đã áp dụng thành công
                                                    </span>
                                                </span>
                                                <div className="text-xs text-green-700 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                                                    <span className="font-medium bg-green-200/50 px-2 py-0.5 rounded">
                                                        Giảm {appliedDiscount.discountPercent}%
                                                        {appliedDiscount.maxDiscountAmount ? ` (tối đa ${appliedDiscount.maxDiscountAmount.toLocaleString('vi-VN')}đ)` : ""}
                                                    </span>

                                                    {appliedDiscount.type === "general" && appliedDiscount.usageLimit && (
                                                        <span className="font-medium bg-green-200/50 px-2 py-0.5 rounded">
                                                            Còn lại: {appliedDiscount.usageLimit - appliedDiscount.usedCount} lượt
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-white transition-colors"
                                            title="Bỏ sử dụng"
                                        >
                                            <XCircle className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative flex gap-0">
                                            <input
                                                type="text"
                                                placeholder="Mã ưu đãi (tự động kiểm tra...)"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="flex-1 border border-gray-300 px-4 py-2.5 rounded-l-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-bold uppercase placeholder:normal-case placeholder:font-normal"
                                            />
                                            <button
                                                onClick={() => handleApplyCoupon(couponCode)}
                                                disabled={couponLoading || !couponCode.trim() || isCooldownError}
                                                className="bg-[#111827] text-white px-6 py-2 rounded-r-md font-bold text-sm hover:bg-black transition-colors disabled:bg-gray-400 flex items-center gap-2"
                                            >
                                                {couponLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    "Áp dụng"
                                                )}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-red-500 text-sm mt-2 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                                    {couponError}
                                                </div>
                                                {isCooldownError && (
                                                    <button
                                                        onClick={handleRemoveCoupon}
                                                        className="whitespace-nowrap bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                                                    >
                                                        Mua giá thường
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Student Discount Section */}
                    {!appliedDiscount && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600">Bạn là sinh viên?</span>
                                <button
                                    onClick={() => setShowStudentForm(!showStudentForm)}
                                    className="bg-purple-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                                >
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    Nhận mã giảm giá sinh viên
                                </button>
                            </div>

                            {showStudentForm && (
                                <div className="border-2 border-dashed border-purple-200 bg-purple-50/50 p-6 rounded-md">
                                    {studentCode ? (
                                        /* Success - show code */
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <CheckCircle className="h-5 w-5" />
                                                <span className="font-bold text-sm">Mã giảm giá đã được tạo và áp dụng!</span>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 flex items-center justify-between border border-purple-200">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium mb-1">Mã của bạn</p>
                                                    <code className="text-xl font-black text-purple-600 tracking-wider">{studentCode.code}</code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">
                                                        -{studentCode.discountPercent}%
                                                    </span>
                                                    <button
                                                        onClick={handleCopyStudentCode}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Sao chép"
                                                    >
                                                        {copiedCode ? (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Hết hạn: {new Date(studentCode.expiresAt).toLocaleDateString("vi-VN")}
                                                {" · "}Mã đã được tự động áp dụng vào đơn hàng
                                            </p>
                                        </div>
                                    ) : (
                                        /* Registration form */
                                        <form onSubmit={handleStudentRegister} className="space-y-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <GraduationCap className="h-5 w-5 text-purple-600" />
                                                <h3 className="font-bold text-gray-800 text-sm">Xác nhận thông tin sinh viên</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-3">
                                                Điền thông tin bên dưới để nhận mã giảm giá <strong>15%</strong> dành cho sinh viên
                                            </p>

                                            {studentError && (
                                                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium flex items-center gap-2">
                                                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                                    {studentError}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-600 mb-1">Họ và tên *</label>
                                                    <input
                                                        type="text"
                                                        value={studentData.name}
                                                        onChange={e => setStudentData(p => ({ ...p, name: e.target.value }))}
                                                        placeholder="Nguyễn Văn A"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-600 mb-1">Email *</label>
                                                    <input
                                                        type="email"
                                                        value={studentData.email}
                                                        onChange={e => setStudentData(p => ({ ...p, email: e.target.value }))}
                                                        placeholder="your@email.com"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-600 mb-1">Mã sinh viên (MSSV) *</label>
                                                    <input
                                                        type="text"
                                                        value={studentData.studentId}
                                                        onChange={e => setStudentData(p => ({ ...p, studentId: e.target.value }))}
                                                        placeholder="VD: 20210001"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-600 mb-1">Trường / Đại học *</label>
                                                    <input
                                                        type="text"
                                                        value={studentData.school}
                                                        onChange={e => setStudentData(p => ({ ...p, school: e.target.value }))}
                                                        placeholder="VD: ĐH Bách Khoa HN"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={studentLoading}
                                                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors w-full sm:w-auto"
                                            >
                                                {studentLoading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    <>
                                                        <GraduationCap className="h-4 w-4" />
                                                        Nhận mã giảm giá
                                                    </>
                                                )}
                                            </button>

                                            <p className="text-[11px] text-gray-400">
                                                Mỗi email chỉ nhận được 1 mã. Mã có hiệu lực 30 ngày.
                                            </p>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: Billing Details */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">
                                THÔNG TIN THANH TOÁN
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700">Họ và tên *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Họ và tên"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-gray-700">Số điện thoại *</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số Zalo/Telegram"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 mb-4">
                                <label className="text-sm font-bold text-gray-700">Địa chỉ email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-200 pb-2 mb-4">
                                THÔNG TIN BỔ SUNG
                            </h2>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700">Ghi chú đơn hàng - Yêu cầu giao hàng đặc biệt (tuỳ chọn)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: yêu cầu giao hàng nhanh, giao hàng với người nhận khác, ..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
                            <h2 className="text-lg font-bold text-gray-800 uppercase mb-6">
                                ĐƠN HÀNG CỦA BẠN
                            </h2>

                            <div className="flex justify-between text-sm font-bold text-gray-700 border-b-2 border-gray-100 pb-2 mb-4">
                                <span>SẢN PHẨM</span>
                                <span>TẠM TÍNH</span>
                            </div>

                            <div className="space-y-4 mb-6">
                                {items.length > 0 ? (
                                    items.map(item => (
                                        <div key={item.id} className="flex justify-between items-start text-sm py-2 border-b border-gray-50 last:border-0">
                                            <div className="pr-4">
                                                <span className="text-gray-600 line-clamp-2">
                                                    {item.name} {item.planLabel ? `- ${item.planLabel}` : ''}
                                                </span>
                                                <span className="font-bold text-gray-800 ml-1">x {item.quantity}</span>
                                            </div>
                                            <span className="font-bold text-gray-800 whitespace-nowrap">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500 italic py-2">Chưa có sản phẩm nào</div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 mb-6 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm font-bold text-gray-700">
                                    <span>Tạm tính</span>
                                    <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                                </div>

                                {appliedDiscount && (
                                    <div className="flex justify-between text-sm font-bold text-green-600">
                                        <span>Giảm giá ({appliedDiscount.discountPercent}%)</span>
                                        <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100 mt-2">
                                    <span>Tổng</span>
                                    <span>{finalTotal.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="mb-6">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={true}
                                        readOnly
                                        className="text-red-600 focus:ring-red-500 mr-2"
                                    />
                                    <span className="text-sm font-bold text-gray-800">Chuyển khoản ngân hàng (Quét mã QR)</span>
                                    <Image
                                        src="/images/vietqr-logo.png"
                                        alt="VietQR"
                                        width={150}
                                        height={60}
                                        className="h-16 w-auto object-contain ml-1"
                                    />
                                </label>
                                <div className="mt-2 ml-6 p-3 bg-gray-100 text-gray-900 text-xs rounded border border-gray-300 relative font-bold">
                                    <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-100 border-t border-l border-gray-300 transform rotate-45"></div>
                                    Quét mã để thanh toán đơn hàng thanh toán
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-2 mb-6">
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    checked={formData.agreeTerms}
                                    onChange={handleInputChange}
                                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="agreeTerms" className="text-sm text-gray-700 cursor-pointer text-justify leading-tight">
                                    Tôi đã đọc và đồng ý với <Link href="/dieu-khoan" className="font-bold hover:underline">Điều khoản & Điều kiện</Link> của website *
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting}
                                className="w-full bg-[#6610f2] hover:bg-[#520dc2] disabled:bg-gray-400 text-white font-bold py-3.5 rounded text-lg uppercase transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Đặt hàng"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
