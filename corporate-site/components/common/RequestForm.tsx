"use client";

import { useEffect, useState } from "react";
import { createCustomerRequest } from "@/lib/strapi";
import { Loader2, Send, Check } from "lucide-react";
import { getPlansForProduct, Plan } from "@/content/productPlans";
import { useSiteConfig } from "@/hooks/use-site-config";

interface RequestFormProps {
    serviceName: string;
    serviceType: "premium" | "social";
    serviceSlug?: string;
    startingPrice?: number;
    className?: string;
}

export default function RequestForm({
    serviceName,
    serviceType,
    serviceSlug,
    startingPrice,
    className = "",
}: RequestFormProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        contact: "",
        note: "",
    });

    const config = useSiteConfig();

    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    // Load plans
    useEffect(() => {
        if (serviceType === "premium" && serviceSlug) {
            const productPlans = getPlansForProduct(serviceSlug, startingPrice);
            setPlans(productPlans);
            setSelectedPlan(productPlans[0] || null);
        } else {
            setPlans([]);
            setSelectedPlan(null);
        }
    }, [serviceType, serviceSlug, startingPrice]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (serviceType === "premium" && !selectedPlan) {
            setErrorMessage("Vui lòng chọn một gói dịch vụ.");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        // Build Zalo message
        const planInfo = selectedPlan
            ? `\n- Gói: ${selectedPlan.label} - ${selectedPlan.price.toLocaleString("vi-VN")}đ`
            : "";
        const noteInfo = formData.note ? `\n- Ghi chú: ${formData.note}` : "";
        const zaloMessage = `Xin chào LECHSHOP! 🛒\n- Họ tên: ${formData.fullName}\n- Liên hệ: ${formData.contact}\n- Dịch vụ: ${serviceName}${planInfo}${noteInfo}`;

        // Try saving to Strapi (optional, don't block if it fails)
        try {
            await createCustomerRequest({
                ...formData,
                serviceType,
                serviceName,
                note: formData.note,
                status: "new",
                orderCode: `REQ-${Date.now()}`,
                products: selectedPlan
                    ? [{ name: serviceName, plan: selectedPlan.label, price: selectedPlan.price, quantity: 1 }]
                    : [{ name: serviceName, plan: "", price: 0, quantity: 1 }],
                totalAmount: selectedPlan?.price ?? 0,
                paymentMethod: "zalo",
            });
        } catch {
            // Silently continue - Zalo is the primary channel
        }

        // Open Zalo with pre-filled message
        const zaloPhone = config.phone.replace(/\./g, "");
        const zaloUrl = `https://zalo.me/${zaloPhone}?text=${encodeURIComponent(zaloMessage)}`;
        window.open(zaloUrl, "_blank");

        setStatus("success");
        setFormData({ fullName: "", contact: "", note: "" });
    };

    if (status === "success") {
        return (
            <div className={`p-8 bg-green-50 border border-green-200 rounded-xl text-center ${className}`}>
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <Check className="h-6 w-6" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gửi yêu cầu thành công!</h3>
                <p className="text-gray-600 mb-6">
                    Hệ thống đã chuyển bạn đến Zalo để xác nhận đơn hàng với nhân viên hỗ trợ.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="text-blue-600 font-bold hover:underline"
                >
                    Gửi yêu cầu khác
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`bg-white p-6 rounded-2xl shadow-sm border border-blue-100 ${className}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
                Đăng ký dịch vụ
            </h3>
            <p className="text-sm text-gray-500 mb-6">
                Điền thông tin để được tư vấn và kích hoạt ngay lập tức
            </p>

            <div className="space-y-4">
                {/* Plan Selection (Only for Premium) */}
                {serviceType === "premium" && plans.length > 0 && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Chọn gói dịch vụ</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {plans.map((plan) => (
                                <button
                                    key={plan.label}
                                    type="button"
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`relative flex flex-col items-start p-3 rounded-xl border-2 transition-all ${selectedPlan?.label === plan.label
                                        ? "border-blue-600 bg-blue-50 text-blue-700"
                                        : "border-gray-200 hover:border-blue-200 text-gray-600"
                                        }`}
                                >
                                    <span className="text-sm font-bold">{plan.label}</span>
                                    <span className="text-xs">{plan.price.toLocaleString("vi-VN")}đ</span>
                                    {plan.inStock === false && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px] rounded-xl">
                                            <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Hết hàng</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                        placeholder="Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại / Zalo</label>
                    <input
                        type="tel"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                        placeholder="0912xxx..."
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Ghi chú thêm (nếu có)</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium resize-none"
                        placeholder="Yêu cầu đặc biệt..."
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                </div>

                {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === "loading" || (serviceType === "premium" && selectedPlan?.inStock === false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {status === "loading" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            Gửi yêu cầu ngay
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
