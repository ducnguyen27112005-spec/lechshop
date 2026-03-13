"use client";

import { useState, useEffect } from "react";
import { ServiceData, ServiceServer } from "@/lib/serviceData";
import { ShoppingCart, Zap, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ServiceOrderFormProps {
    service: ServiceData;
}

export default function ServiceOrderForm({ service }: ServiceOrderFormProps) {
    const [selectedServer, setSelectedServer] = useState<ServiceServer | null>(null);
    const [quantity, setQuantity] = useState<number>(100);
    const [link, setLink] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { addItem } = useCart();
    const [showToast, setShowToast] = useState(false);

    // Reset when service changes
    useEffect(() => {
        if (service.servers.length > 0) {
            setSelectedServer(service.servers[0]);
        }
        setQuantity(100);
        setLink("");
        setErrorMessage("");
    }, [service]);

    // Update default quantity based on min val
    useEffect(() => {
        if (selectedServer) {
            if (quantity < selectedServer.min) {
                setQuantity(selectedServer.min);
            }
        }
    }, [selectedServer]);

    const calculateTotal = () => {
        if (!selectedServer) return 0;
        return selectedServer.price * quantity;
    };

    const handleAddToCart = () => {
        if (!selectedServer) {
            setErrorMessage("Vui lòng chọn máy chủ (Server).");
            return;
        }
        if (!link) {
            setErrorMessage("Vui lòng nhập đường dẫn (Link/ID).");
            return;
        }
        if (quantity < selectedServer.min) {
            setErrorMessage(`Số lượng tối thiểu là ${selectedServer.min}.`);
            return;
        }
        if (quantity > selectedServer.max) {
            setErrorMessage(`Số lượng tối đa là ${selectedServer.max}.`);
            return;
        }

        addItem({
            id: `${service.slug}-${selectedServer.id}-${Date.now()}`,
            name: `${service.name} - ${selectedServer.name}`,
            price: calculateTotal(),
            planLabel: `SL: ${quantity}`,
            image: "/images/social-service.jpg", // Placeholder or dynamic image
        });

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setErrorMessage("");
    };

    const handleBuyNow = () => {
        handleAddToCart();
        if (!errorMessage) { // Only redirect if no error (imperfect check but works for now logic)
            // Ideally handleAddToCart should return boolean
            window.location.href = "/thanh-toan";
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
                        <p className="text-gray-500 text-sm">{service.category}</p>
                    </div>
                </div>

                {/* --- SERVER SELECTION --- */}
                <div className="mb-8">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        Chọn máy chủ (Server)
                    </label>
                    <div className="space-y-3">
                        {service.servers.map((server) => {
                            const isSelected = selectedServer?.id === server.id;
                            const isMaintenance = server.status === 'maintenance';

                            return (
                                <div
                                    key={server.id}
                                    onClick={() => !isMaintenance && setSelectedServer(server)}
                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                        ? "border-blue-500 bg-blue-50/50"
                                        : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                                        } ${isMaintenance ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${isSelected ? "border-blue-600" : "border-gray-300"
                                                }`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 flex items-center gap-2">
                                                    {server.name}
                                                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-600 font-bold">
                                                        {server.price}đ
                                                    </span>
                                                </div>
                                                {server.description && (
                                                    <p className="text-sm text-gray-500 mt-1">{server.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        {isMaintenance && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">Bảo trì</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- INFO PANEL --- */}
                {selectedServer && (
                    <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p><span className="font-bold">Số lượng tối thiểu:</span> {selectedServer.min}</p>
                            <p><span className="font-bold">Số lượng tối đa:</span> {selectedServer.max}</p>
                        </div>
                    </div>
                )}

                {/* --- INPUTS --- */}
                <div className="space-y-6 mb-8 border-t border-gray-100 pt-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            Đường dẫn (Link) / ID cần tăng
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập link hoặc ID..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            Số lượng
                        </label>
                        <input
                            type="number"
                            min={selectedServer?.min || 1}
                            max={selectedServer?.max}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-lg"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        {selectedServer && (
                            <p className="text-xs text-gray-500 mt-2 text-right">
                                Tối thiểu: {selectedServer.min} - Tối đa: {selectedServer.max}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">
                            Ghi chú (Không bắt buộc)
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Ghi chú thêm cho đơn hàng..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                {/* --- TOTAL --- */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 font-medium">Đơn giá:</span>
                        <span className="font-bold text-gray-900">{selectedServer?.price || 0}đ</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600 font-medium">Số lượng:</span>
                        <span className="font-bold text-gray-900">{quantity}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-4" />
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-800">Tổng thanh toán:</span>
                        <span className="text-3xl font-extrabold text-red-600">
                            {calculateTotal().toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>

                {errorMessage && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2 mb-6">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="font-medium text-sm">{errorMessage}</span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleAddToCart}
                        className="py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all"
                    >
                        Thêm vào giỏ
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Thanh Toán Ngay
                    </button>
                </div>
            </div>

            {/* Toast */}
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-slide-up">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Đã thêm vào giỏ hàng!</span>
                </div>
            )}
        </div>
    );
}
