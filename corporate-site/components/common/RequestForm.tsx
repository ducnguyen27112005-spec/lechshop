"use client";

import { useEffect, useState } from "react";
import { createCustomerRequest } from "@/lib/strapi";
import { Loader2, Send, Check } from "lucide-react";
import { getPlansForProduct, Plan } from "@/content/productPlans";

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

        const success = await createCustomerRequest({
            ...formData,
            serviceType,
            serviceName,
            note: formData.note,
            status: "new",
        });

        if (success) {
            setStatus("success");
            setFormData({ fullName: "", contact: "", note: "" });
        } else {
            setStatus("error");
            setErrorMessage("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
        }
    };

    if (status === "success") {
        return (
            <div className={`p-8 bg-green-50 border border-green-200 rounded-xl text-center ${className}`}>
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <Check className="h-6 w-6" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Gửi yêu cầu thành công!</h3>
                <p className="text-green-700">
                    Cảm ơn bạn đã quan tâm. Shop đã nhận được yêu cầu và sẽ liên hệ sớm nhất để hỗ trợ thanh toán & kích hoạt.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-green-700 font-semibold hover:underline"
                >
                    Gửi yêu cầu khác
                </button>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 ${className}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Gửi yêu cầu tư vấn</h3>
            <p className="text-gray-600 mb-6">Chúng tôi sẽ liên hệ trong vòng 5–10 phút</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            required
                            placeholder="VD: Nguyễn Văn A"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                            SĐT hoặc Zalo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="contact"
                            required
                            placeholder="VD: 0901234567"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dịch vụ quan tâm
                    </label>
                    <input
                        type="text"
                        readOnly
                        className="w-full px-4 py-3 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"
                        value={serviceName}
                    />
                </div>

                {serviceType === "premium" && plans.length > 0 && (
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Chọn gói dịch vụ <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {plans.map((plan) => (
                                <button
                                    key={plan.id}
                                    type="button"
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${selectedPlan?.id === plan.id
                                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                                        : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedPlan?.id === plan.id ? "border-blue-600" : "border-gray-300"
                                            }`}>
                                            {selectedPlan?.id === plan.id && (
                                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                            )}
                                        </div>
                                        <span className="font-bold text-xs">{plan.label}</span>
                                    </div>
                                    <span className="font-bold text-xs text-blue-600">
                                        {plan.price > 0 ? plan.price.toLocaleString("vi-VN") + "đ" : "Liên hệ"}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                        Ghi chú (nếu có)
                    </label>
                    <textarea
                        id="note"
                        placeholder="Ví dụ: Tôi muốn tư vấn về gói 12 tháng..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-medium"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    ></textarea>
                </div>

                {status === "error" && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100 font-bold">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                >
                    {status === "loading" ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Gửi yêu cầu ngay
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
