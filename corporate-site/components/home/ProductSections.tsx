"use client";

import { premiumProducts, socialServices } from "@/content/products";
import Container from "../shared/Container";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function ProductSections() {
    return (
        <section className="py-10 bg-gray-50">
            <Container className="max-w-6xl">
                {/* Premium Accounts Section */}
                <div id="premium" className="mb-10 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Tài khoản Premium</h2>
                    <p className="text-sm text-gray-600 mb-6">Dịch vụ tài khoản cao cấp uy tín</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {premiumProducts.map((product) => (
                            <Link
                                href={`/san-pham/${product.slug}`}
                                key={product.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100 relative block"
                            >

                                {/* Product Image */}
                                <div className="aspect-video relative overflow-hidden bg-gray-900">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    <h3 className="font-bold text-gray-900 text-sm mb-4 line-clamp-1">
                                        {product.title}
                                    </h3>

                                    {/* Price & Actions */}
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-base font-bold text-red-700 leading-none mb-1">
                                                {product.startingPrice}
                                            </p>
                                            <p className="text-[10px] text-gray-500">
                                                500+ đã bán
                                            </p>
                                        </div>

                                        <div className="bg-red-700 hover:bg-red-800 text-white rounded-full p-2 shadow-md transition-colors">
                                            <ShoppingCart className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Social Services Section */}
                <div id="dich-vu" className="scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Dịch vụ mạng xã hội</h2>
                    <p className="text-sm text-gray-600 mb-6">Tăng trưởng tự nhiên, an toàn</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {socialServices.map((service) => (
                            <Link
                                href={`/san-pham/${service.id}`}
                                key={service.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100 relative block"
                            >

                                {/* Service Image */}
                                <div className="aspect-video relative overflow-hidden bg-gray-900">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={service.image || "/images/placeholder.jpg"}
                                        alt={service.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    {/* Category */}
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                                        DỊCH VỤ MXH
                                    </p>

                                    <h3 className="font-bold text-gray-900 text-sm mb-4 line-clamp-1">
                                        {service.title}
                                    </h3>

                                    {/* Price / Contact */}
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-base font-bold text-red-700 leading-none mb-1">
                                                Liên hệ
                                            </p>
                                            <p className="text-[10px] text-gray-500">
                                                300+ đã bán
                                            </p>
                                        </div>

                                        <div className="bg-red-700 hover:bg-red-800 text-white rounded-full p-2 shadow-md transition-colors">
                                            <ShoppingCart className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
