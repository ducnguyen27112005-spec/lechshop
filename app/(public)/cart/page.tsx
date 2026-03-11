"use client";

import { useCart } from "@/contexts/CartContext";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { products, premiumProducts, socialServices } from "@/content/products";

const getProductImage = (itemName: string, storedImage?: string) => {
    // Try to find in standard products
    const product = products.find(p => p.name === itemName);
    if (product?.image) return product.image;

    // Try to find in premium products
    const premium = premiumProducts.find(p => p.title === itemName);
    if (premium?.image) return premium.image;

    // Try to find in social services
    const social = socialServices.find(s => s.title === itemName);
    if (social?.image) return social.image;

    return storedImage; // Fallback to stored image if not found
};

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <Container className="py-12">
                <div className="text-center max-w-md mx-auto">
                    <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
                    <p className="text-gray-600 mb-8">
                        Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-8">
            <SectionHeading
                title="Giỏ hàng của bạn"
                subtitle={`Bạn có ${items.length} sản phẩm trong giỏ hàng`}
            />

            <div className="grid lg:grid-cols-3 gap-8 mt-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const displayImage = getProductImage(item.name, item.image);
                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex gap-4"
                            >
                                {/* Product Image */}
                                {item.image && (
                                    <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                                        <Image
                                            src={displayImage!}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                    {item.planLabel && (
                                        <p className="text-sm text-gray-600 mb-2">{item.planLabel}</p>
                                    )}
                                    <p className="text-lg font-bold text-blue-600">
                                        {item.price.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col items-end gap-3">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                                        title="Xóa"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>

                                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="px-3 font-semibold min-w-[2rem] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <p className="text-sm font-medium text-gray-700">
                                        Tổng: {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Tạm tính:</span>
                                <span className="font-semibold">{totalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                                <span>Tổng cộng:</span>
                                <span className="text-blue-600">{totalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>

                        <Link
                            href="/thanh-toan"
                            className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
                        >
                            Tiến hành đặt hàng
                        </Link>

                        <Link
                            href="/"
                            className="block w-full text-center text-blue-600 py-2 hover:underline"
                        >
                            Tiếp tục mua sắm
                        </Link>

                        <button
                            onClick={clearCart}
                            className="block w-full text-center text-red-500 text-sm py-2 hover:underline mt-4"
                        >
                            Xóa toàn bộ giỏ hàng
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    );
}
