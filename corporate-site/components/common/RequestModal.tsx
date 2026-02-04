"use client";

import { useState, useEffect, useRef } from "react";
import { createCustomerRequest } from "@/lib/strapi";
import { Loader2, Send, X, CheckCircle2, Check, ChevronDown } from "lucide-react";
import { getPlansForProduct, Plan } from "@/content/productPlans";

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceType: "premium" | "social";
    serviceName: string;
    serviceSlug?: string;
    startingPrice?: number;
    productImage?: string;
    bullets?: string[];
}

export default function RequestModal({
    isOpen,
    onClose,
    serviceType,
    serviceName,
    serviceSlug,
    startingPrice,
    productImage,
    bullets = [],
}: RequestModalProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        contact: "",
        note: "",
    });

    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const rightColRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setStatus("idle");
            setErrorMessage("");
            if (serviceType === "premium" && serviceSlug) {
                const productPlans = getPlansForProduct(serviceSlug, startingPrice);
                setPlans(productPlans);
                setSelectedPlan(productPlans[0] || null);
            } else {
                setPlans([]);
                setSelectedPlan(null);
            }
        }
    }, [isOpen, serviceType, serviceSlug, startingPrice]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (serviceType === "premium" && !selectedPlan) {
            setErrorMessage("Vui lòng chọn một gói dịch vụ.");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        const payload = {
            ...formData,
            serviceType,
            serviceName,
            note: formData.note,
            status: "new" as const,
        };

        const createdRecord = await createCustomerRequest(payload);

        if (createdRecord) {
            setStatus("success");
            if (rightColRef.current) {
                rightColRef.current.scrollTo({ top: 0, behavior: "smooth" });
            }
        } else {
            setStatus("error");
            setErrorMessage("Không thể tạo yêu cầu. Vui lòng kiểm tra kết nối với server.");
        }
    };

    const clearSelectedPlan = () => {
        setSelectedPlan(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-[1100px] bg-white rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row h-full max-h-[95vh] md:max-h-[85vh]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-all"
                >
                    <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>

                {/* Column Left (40%) - Product Image */}
                <div className="w-full md:w-[40%] bg-gray-900 relative h-[200px] md:h-auto overflow-hidden">
                    <img
                        src={productImage || "/images/placeholder.jpg"}
                        alt={serviceName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">
                            Tài khoản Premium
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black leading-tight">{serviceName}</h2>
                    </div>
                </div>

                {/* Column Right (60%) - Product Details */}
                <div
                    ref={rightColRef}
                    className="w-full md:w-[60%] flex flex-col overflow-y-auto bg-white"
                >
                    {status === "success" ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
                            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
                                <CheckCircle2 className="h-12 w-12" />
                            </div>
                            <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">Gửi thông tin thành công!</h4>
                            <p className="text-gray-600 mb-8 max-w-sm">
                                Shop đã lưu yêu cầu của bạn. Kỹ thuật sẽ sớm liên hệ qua Zalo để hỗ trợ.
                            </p>
                            <button
                                onClick={onClose}
                                className="px-10 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all"
                            >
                                Đóng cửa sổ
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 md:p-8 space-y-6">
                            {/* Product Title & Price */}
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                                    Tài khoản {serviceName}
                                </h3>
                                {selectedPlan && (
                                    <div className="flex items-baseline gap-2">
                                        {selectedPlan.originalPrice && (
                                            <span className="text-gray-400 line-through text-sm">
                                                {selectedPlan.originalPrice.toLocaleString("vi-VN")}đ
                                            </span>
                                        )}
                                        <span className="text-2xl font-black text-blue-600">
                                            {selectedPlan.price.toLocaleString("vi-VN")}
                                            <sup className="text-sm">đ</sup>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Features with checkmarks */}
                            {bullets.length > 0 && (
                                <div className="space-y-3">
                                    {bullets.map((bullet, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 text-sm">{bullet}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">
                                            <strong>Bảo hành</strong> trong toàn bộ thời gian của gói
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Plan Selection Section */}
                            {serviceType === "premium" && plans.length > 0 && (
                                <div className="space-y-3 pt-4 border-t">
                                    <label className="text-sm font-bold text-gray-700">Gói Đăng Ký:</label>

                                    {/* Selected Plan Tag */}
                                    {selectedPlan && (
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                                                <span className="font-medium">
                                                    {selectedPlan.label} ({selectedPlan.price.toLocaleString("vi-VN")}đ)
                                                </span>
                                                <button
                                                    onClick={clearSelectedPlan}
                                                    className="text-blue-500 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </span>
                                        </div>
                                    )}

                                    {/* Dropdown Selector */}
                                    <div ref={dropdownRef} className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors text-left"
                                        >
                                            <span className="text-gray-600">
                                                {selectedPlan
                                                    ? `Đổi gói khác...`
                                                    : "Chọn gói dịch vụ..."
                                                }
                                            </span>
                                            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                                {plans.map((plan) => (
                                                    <button
                                                        key={plan.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedPlan(plan);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors text-left ${selectedPlan?.id === plan.id ? 'bg-blue-50' : ''
                                                            }`}
                                                    >
                                                        <div>
                                                            <span className="font-medium text-gray-900">{plan.label}</span>
                                                            {plan.bonus && (
                                                                <span className="ml-2 text-xs text-green-600">{plan.bonus}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-blue-600">
                                                                {plan.price.toLocaleString("vi-VN")}đ
                                                            </span>
                                                            {plan.discount && (
                                                                <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                                                                    -{plan.discount}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Customer Info Form */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="text-sm font-bold text-gray-700">Thông tin khách hàng</h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Họ và tên *</label>
                                            <input
                                                required
                                                placeholder="VD: Nguyễn Văn A"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">SĐT / Zalo *</label>
                                            <input
                                                required
                                                placeholder="VD: 0901234567"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium"
                                                value={formData.contact}
                                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Ghi chú thêm</label>
                                        <textarea
                                            rows={2}
                                            placeholder="Để lại lời nhắn cho shop nếu có yêu cầu riêng..."
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all resize-none font-medium"
                                            value={formData.note}
                                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                        />
                                    </div>

                                    {errorMessage && <p className="text-sm font-bold text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">{errorMessage}</p>}

                                    <button
                                        type="submit"
                                        disabled={status === "loading" || !selectedPlan}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {status === "loading" ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Gửi yêu cầu ngay <Send className="h-5 w-5" /></>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
