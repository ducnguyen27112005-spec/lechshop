"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function MegaMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        // Add a delay before closing to allow user to move mouse to menu
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300); // 300ms delay
    };

    return (
        <div
            className="flex items-center gap-1 cursor-pointer hover:text-gray-200 h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <span className="flex items-center gap-1 h-full">Danh mục sản phẩm</span>
            <ChevronDown className="h-4 w-4" />

            {isOpen && (
                <div
                    className="absolute left-0 right-0 top-full mt-0 w-full bg-white shadow-2xl z-50 pt-4"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="mx-auto max-w-[1200px] px-8 py-6">
                        <div className="grid grid-cols-3 gap-12">
                            {/* Tài khoản AI */}
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm mb-3 pb-2 border-b-2 border-red-600 block">
                                    Tài khoản AI
                                </h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700 transition-colors">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        <Link href="/san-pham/chatgpt-plus">ChatGPT Plus</Link>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700 transition-colors">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        <Link href="/san-pham/gemini-pro">Gemini Pro</Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Tài khoản giải trí */}
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm mb-3 pb-2 border-b-2 border-red-600 block">
                                    Tài khoản giải trí
                                </h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700 transition-colors">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        <Link href="/san-pham/youtube-premium">YouTube Premium</Link>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700 transition-colors">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        <Link href="/san-pham/netflix-premium">Netflix Premium</Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Tài khoản Thiết Kế & Đồ Họa */}
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm mb-3 pb-2 border-b-2 border-red-600 block">
                                    Thiết Kế & Đồ Họa
                                </h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700 transition-colors">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        <Link href="/san-pham/canva-pro">Canva Pro</Link>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700 transition-colors">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        <Link href="/san-pham/capcut-pro">CapCut Pro</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-6 border-t border-gray-200"></div>

                        {/* Dịch vụ MXH */}
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm mb-3 pb-2 border-b-2 border-red-600 block">
                                Dịch vụ MXH
                            </h3>
                            <div className="grid grid-cols-3 gap-12 mt-3">
                                <div>
                                    <Link href="/san-pham/tiktok-followers" className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700 transition-colors">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        Tăng follow TikTok
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/san-pham/facebook-followers" className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700 transition-colors">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        Tăng follow Facebook
                                    </Link>
                                </div>
                                <div>
                                    <Link href="/san-pham/instagram-followers" className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-700 transition-colors">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        Tăng follow Instagram
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
