"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-16 sm:py-20 lg:py-24">
            {/* Glow orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[120px] animate-float pointer-events-none" />
            <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/15 blur-[150px] animate-float-delayed pointer-events-none" />
            <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-indigo-400/10 blur-[100px] animate-float pointer-events-none" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                    </span>
                    <span className="text-xs font-medium text-white/80 tracking-wide">
                        Đang hoạt động — Giao hàng tự động 24/7
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                    Nền tảng dịch vụ số{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        #1 Việt Nam
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Cung cấp tài khoản Premium chính hãng, dịch vụ mạng xã hội uy tín.
                    <br className="hidden sm:block" />
                    Giao hàng tự động trong 5 phút — Bảo hành trọn đời.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <Link
                        href="#premium"
                        className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.03] text-sm sm:text-base"
                    >
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                        Mua ngay
                    </Link>
                    <Link
                        href="#premium"
                        className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 text-sm sm:text-base"
                    >
                        Xem sản phẩm
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-12 flex items-center justify-center gap-8 sm:gap-12">
                    {[
                        { value: "10K+", label: "Khách hàng" },
                        { value: "50K+", label: "Đơn thành công" },
                        { value: "4.9★", label: "Đánh giá" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</p>
                            <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
