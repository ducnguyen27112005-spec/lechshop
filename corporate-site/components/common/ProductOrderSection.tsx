"use client";

import { useState } from "react";
import { ShoppingCart, Plus } from "lucide-react";
import { Plan } from "@/content/productPlans";
import { useCart } from "@/contexts/CartContext";

interface ProductOrderSectionProps {
    productName: string;
    productSlug: string;
    serviceType: "premium" | "social";
    plans: Plan[];
    imageUrl?: string;
}

export default function ProductOrderSection({
    productName,
    productSlug,
    serviceType,
    plans,
    imageUrl,
}: ProductOrderSectionProps) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(plans[0] || null);
    const { addItem } = useCart();
    const [showToast, setShowToast] = useState(false);


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
            image: imageUrl || `/images/${productSlug}.jpg`,
        });

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleBuyNow = () => {
        if (!selectedPlan) {
            setErrorMessage("Vui lòng chọn một gói dịch vụ.");
            return;
        }

        addItem({
            id: `${productSlug}-${selectedPlan.id}`,
            name: productName,
            price: selectedPlan.price,
            planLabel: selectedPlan.label,
            image: imageUrl || `/images/${productSlug}.jpg`,
        });

        window.location.href = "/thanh-toan";
    };

    return (
        <div className="space-y-5">
            {/* Plan Selection */}
            <div>
                <label className="text-sm font-bold text-gray-700 mb-3 block">
                    Chọn gói dịch vụ
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {plans.map((plan) => {
                        const outOfStock = (plan as any).inStock === false;
                        return (
                            <button
                                key={plan.id}
                                type="button"
                                onClick={() => !outOfStock && setSelectedPlan(plan)}
                                disabled={outOfStock}
                                className={`relative px-3 py-3 rounded-xl border-2 transition-all text-center ${outOfStock
                                    ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                                    : selectedPlan?.id === plan.id
                                        ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                                    }`}
                            >
                                {outOfStock && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200/60 rounded-xl z-10">
                                        <span className="bg-red-500 text-white text-[11px] font-black px-3 py-1 rounded-full">
                                            Hết hàng
                                        </span>
                                    </div>
                                )}
                                {!outOfStock && plan.discount && plan.discount > 0 && (
                                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                        -{plan.discount}%
                                    </span>
                                )}
                                <p className="font-bold text-sm text-gray-900">
                                    {plan.label}
                                </p>
                                <p className={`text-base font-extrabold mt-1 ${outOfStock ? "text-gray-400" : selectedPlan?.id === plan.id ? "text-blue-600" : "text-red-600"
                                    }`}>
                                    {plan.price.toLocaleString("vi-VN")}đ
                                </p>
                                {plan.originalPrice && (
                                    <p className="text-[11px] text-gray-400 line-through mt-0.5">
                                        {plan.originalPrice.toLocaleString("vi-VN")}đ
                                    </p>
                                )}
                                {(plan as any).description && (
                                    <p className="text-[11px] text-teal-700 font-medium mt-1.5 leading-snug text-center">
                                        {(plan as any).description}
                                    </p>
                                )}
                                {plan.bonus && (
                                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                                        {plan.bonus}
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>


            {/* Total & Submit */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-700">Tổng thanh toán</span>
                    <span className="text-2xl font-extrabold text-red-600">
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
                        className="bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-300 text-red-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Thêm vào giỏ
                    </button>

                    <button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={!selectedPlan}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 hover:shadow-red-300 transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        Mua Ngay
                    </button>
                </div>
            </div>

            {/* Toast */}
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-slide-up">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="font-semibold">Đã thêm vào giỏ hàng!</span>
                </div>
            )}
        </div>
    );
}
