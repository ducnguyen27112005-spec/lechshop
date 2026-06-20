"use client";

import { services } from "@/data/services";
import Container from "@/components/shared/Container";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function DichVuSocialHotPage() {
    // Filter social services based on the requested keywords
    const filterKeywords = ["tiktok", "facebook", "instagram", "youtube", "threads", "shopee"];
    const displayServices = services.filter(s => {
        const slug = s.slug.toLowerCase();
        return filterKeywords.some(kw => slug.includes(kw));
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Container>
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Dịch Vụ <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Social Hot</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Cung cấp các dịch vụ tăng trưởng tự nhiên, an toàn, bảo hành dài hạn cho các nền tảng mạng xã hội phổ biến nhất.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {displayServices.map((service) => (
                        <Link
                            href={`/san-pham/${service.slug}`}
                            key={service.slug}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 relative block hover:-translate-y-1"
                        >
                            <article className="flex flex-col h-full">
                                {/* Service Image — fixed height */}
                                <div className="h-[140px] sm:h-[200px] relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                                    <img
                                        src={service.image || "/images/social-service.jpg"}
                                        alt={`Dịch vụ ${service.title} uy tín – Tăng trưởng tự nhiên`}
                                        title={service.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                        loading="lazy"
                                    />
                                    {/* Bottom gradient overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                                </div>

                                {/* Content */}
                                <div className="p-3 sm:p-5 flex flex-col flex-1">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-medium">
                                        DỊCH VỤ MXH
                                    </p>

                                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 line-clamp-2 leading-snug">
                                        {service.title}
                                    </h3>

                                    {/* Price removed as per user request */}
                                    
                                    <div className="mt-auto">
                                        {/* Full-width CTA Button */}
                                        <div
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 text-white rounded-lg py-2.5 sm:py-3 shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                                            aria-label={`Xem dịch vụ ${service.title}`}
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            <span className="text-xs sm:text-sm font-bold">Mua ngay</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </Container>
        </div>
    );
}
