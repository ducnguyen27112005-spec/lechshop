"use client";

import { useState, useEffect } from "react";
import { Service, Plan } from "@/data/services";
import { useCart } from "@/contexts/CartContext";
import PlanCard from "./PlanCard";
import { formatCurrency } from "@/lib/money";
import { ShoppingCart, Plus, AlertCircle, Info, CheckCircle2 } from "lucide-react";

interface ServiceOrderFormProps {
    service: Service;
}

export default function ServiceOrderForm({ service }: ServiceOrderFormProps) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>(service.plans[0]);
    const [inputValue, setInputValue] = useState("");
    const [quantity, setQuantity] = useState<number>(100);
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    const { addItem } = useCart();

    // Reset state when service changes
    useEffect(() => {
        if (service.plans.length > 0) {
            setSelectedPlan(service.plans[0]);
            setQuantity(service.plans[0].min);
        } else {
            // No plans (Contact mode)
            setQuantity(0);
        }
        setInputValue("");
        setError("");
    }, [service]);

    // Update quantity min/max when plan changes
    useEffect(() => {
        if (!selectedPlan) return;
        if (quantity < selectedPlan.min) setQuantity(selectedPlan.min);
    }, [selectedPlan]);

    const totalPrice = selectedPlan ? quantity * selectedPlan.pricePerUnit : 0;

    const validate = () => {
        if (!inputValue.trim()) return "Vui lòng nhập Link hoặc UID.";
        if (selectedPlan) {
            if (quantity < selectedPlan.min) return `Số lượng tối thiểu là ${selectedPlan.min}.`;
            if (quantity > selectedPlan.max) return `Số lượng tối đa là ${selectedPlan.max}.`;
        }
        return "";
    };

    const handleAddToCart = () => {
        if (service.plans.length === 0) return; // Prevention
        const err = validate();
        if (err) {
            setError(err);
            return;
        }
        if (!selectedPlan) return;

        setError("");

        addItem({
            id: `${service.slug}-${selectedPlan.id}-${Date.now()}`,
            name: `${service.title} - ${selectedPlan.name}`,
            price: totalPrice,
            // Custom fields matching CartItem interface in types/cart.ts
            slug: service.slug,
            title: service.title,
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            unitPrice: selectedPlan.pricePerUnit,
            totalPrice: totalPrice,
            inputValue: inputValue,
            note: note,
            planLabel: `SL: ${quantity} | ${selectedPlan.name}`,
            image: service.image || "/images/social-service.jpg"
        });

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleBuyNow = () => {
        if (service.plans.length === 0) return;
        const err = validate();
        if (err) {
            setError(err);
            return;
        }
        // Add to cart then redirect
        handleAddToCart();
        // Allow state update to propagate before redirect (simple timeout or just redirect)
        setTimeout(() => {
            window.location.href = "/cart"; // Redirect to cart or checkout
        }, 100);
    };

    const isContactMode = service.plans.length === 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
                    <p className="text-gray-500 text-sm">{service.description}</p>
                </div>

                {/* Input Link */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                        {service.inputLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={service.inputPlaceholder}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                    />
                </div>

                {/* Plan Selection */}
                {!isContactMode && selectedPlan && (
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            Chọn gói dịch vụ (Server)
                        </label>
                        <div className="space-y-3">
                            {service.plans.map((plan) => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    isSelected={selectedPlan.id === plan.id}
                                    onSelect={() => setSelectedPlan(plan)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Info Panel / Contact Note */}
                {!isContactMode && selectedPlan && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 flex gap-3 text-sm text-blue-800">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p>
                                <span className="font-bold">Lưu ý:</span>{" "}
                                {selectedPlan.notes?.join(". ") || "Chế độ bảo hành và tốc độ phụ thuộc vào gói bạn chọn."}
                            </p>
                        </div>
                    </div>
                )}

                {isContactMode && (
                    <div className="bg-orange-50 rounded-xl p-4 mb-6 flex gap-3 text-sm text-orange-800 border border-orange-100">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p>
                                <span className="font-bold">Thông báo:</span>{" "}
                                Dịch vụ này hiện đang cập nhật bảng giá. Vui lòng liên hệ để được tư vấn và báo giá chi tiết.
                            </p>
                        </div>
                    </div>
                )}

                {/* Quantity & Calculation */}
                {!isContactMode && selectedPlan && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                                Số lượng cần mua
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min={selectedPlan.min}
                                max={selectedPlan.max}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-lg"
                            />
                            <p className="text-xs text-gray-500 mt-1 text-right">
                                {selectedPlan.min} - {selectedPlan.max}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                                Ghi chú đơn hàng
                            </label>
                            <textarea
                                rows={1}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ghi chú thêm (không bắt buộc)"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                )}

                {/* Summary & Action */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    {!isContactMode ? (
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-medium">Tổng thanh toán:</span>
                            <span className="text-3xl font-extrabold text-red-600">
                                {formatCurrency(totalPrice)}
                            </span>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-medium">Trạng thái:</span>
                            <span className="text-xl font-bold text-orange-600">
                                Liên hệ nhân viên
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="font-medium text-sm">{error}</span>
                        </div>
                    )}

                    {!isContactMode ? (
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="py-3.5 rounded-xl border-2 border-red-600 text-red-600 font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Thêm vào giỏ
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Mua Ngay
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            <a
                                href="https://zalo.me"
                                target="_blank"
                                rel="noreferrer"
                                className="py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Liên hệ tư vấn ngay
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-slide-up">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Đã thêm vào giỏ hàng!</span>
                </div>
            )}
        </div>
    );
}
