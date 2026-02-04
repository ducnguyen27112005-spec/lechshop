"use client";

import { useState } from "react";
import { Send, Loader2, ShoppingCart, Plus, MessageCircle } from "lucide-react";
import { createCustomerRequest } from "@/lib/strapi";
import { Plan } from "@/content/productPlans";
import { useCart } from "@/contexts/CartContext";

interface ProductOrderSectionProps {
    productName: string;
    productSlug: string;
    serviceType: "premium" | "social";
    plans: Plan[];
}

export default function ProductOrderSection({
    productName,
    productSlug,
    serviceType,
    plans,
}: ProductOrderSectionProps) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plans[0] || null);
    const { addItem } = useCart();
    const [showToast, setShowToast] = useState(false);

    const [formData, setFormData] = useState({
        note: "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleAddToCart = () => {
        if (!selectedPlan) {
            setErrorMessage("Vui lòng chọn một gói dịch vụ.");
            return;
        }

        addItem({
            id: `${productSlug}-${selectedPlan.id}`,
            name: productName,
            price: selectedPlan.price,
            planLabel: selectedPlan.label,
            image: `/images/${productSlug}.jpg`,
        });

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPlan) {
            setErrorMessage("Vui lòng chọn một gói dịch vụ.");
            return;
        }

        setStatus("loading");
        setErrorMessage("");

        const payload = {
            fullName: "Khách hàng",
            contact: "",
            serviceType,
            serviceName: productName,
            note: `Gói: ${selectedPlan.label} - ${selectedPlan.price.toLocaleString("vi-VN")}đ${formData.note ? `\nGhi chú: ${formData.note}` : ""}`,
            status: "new" as const,
        };

        const createdRecord = await createCustomerRequest(payload);

        if (createdRecord) {
            setStatus("success");
        } else {
            setStatus("error");
            setErrorMessage("Không thể tạo yêu cầu. Vui lòng thử lại.");
        }
    };

    if (status === "success") {
        return (
            <div className="text-center py-8 bg-green-50 rounded-xl border border-green-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h3>
                <p className="text-gray-600 mb-4">Shop sẽ liên hệ bạn qua Zalo trong ít phút.</p>
                <div className="flex flex-col gap-3 items-center">
                    <a
                        href="https://zalo.me/0868127491"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            e.preventDefault();
                            window.open('https://zalo.me/0868127491', '_blank', 'noopener,noreferrer');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-all inline-flex items-center gap-2"
                    >
                        <MessageCircle className="h-5 w-5" />
                        Liên hệ Zalo ngay
                    </a>
                    <button
                        onClick={() => setStatus("idle")}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Đặt thêm gói khác
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Plan Selection - Grid Cards */}
            <div>
                <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Chu kỳ (Tháng)
                </label>

                <div className="grid grid-cols-3 gap-2 max-w-md">
                    {plans.map((plan) => (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(plan)}
                            className={`px-1 h-12 rounded-2xl border-2 transition-all text-center flex items-center justify-center ${selectedPlan?.id === plan.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-blue-300"
                                }`}
                        >
                            <p className="text-gray-900 text-xs">
                                <span className="font-semibold">{plan.label}</span>
                                <span> - </span>
                                <span className="text-blue-600 font-bold">{plan.price.toLocaleString("vi-VN")}đ</span>
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Note Input */}
            <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Ghi chú
                </label>
                <textarea
                    rows={3}
                    placeholder="Nhập Gmail Cần Đăng Ký Gói Youtube Premium của bạn (Không yêu cầu Password) - Gia Hạn Vui Lòng Note Mail + Gia Hạn Để Tránh Bị Lỗi Mail - Ví Dụ: aaa@gmail.com gia hạn"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all resize-none text-sm"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
            </div>

            {/* Total & Submit */}
            <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700 font-bold">Tổng thanh toán</span>
                    <span className="text-2xl font-bold text-red-500">
                        {selectedPlan ? selectedPlan.price.toLocaleString("vi-VN") : 0}đ
                    </span>
                </div>

                {errorMessage && (
                    <p className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 mb-4">
                        {errorMessage}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!selectedPlan}
                        className="bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 text-red-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Thêm vào giỏ
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={status === "loading" || !selectedPlan}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        {status === "loading" ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart className="h-5 w-5" />
                                Thanh Toán
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-up">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-semibold">Đã thêm vào giỏ hàng!</span>
                </div>
            )}
        </div>
    );
}
