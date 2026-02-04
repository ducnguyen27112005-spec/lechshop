"use client";

import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";
import { Phone, ShoppingCart, ChevronDown } from "lucide-react";
import Typewriter from "../shared/Typewriter";
import SearchBar from "./SearchBar";
import { useCart } from "@/contexts/CartContext";
import MegaMenu from "./MegaMenu";

export default function Header() {
    const { totalItems } = useCart();

    return (
        <header
            className="text-white relative"
            style={{
                backgroundColor: '#8A1E1C',
                // boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
        >

            {/* Top Header */}
            <div className="mx-auto max-w-[1400px] px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                {/* Mobile & Tablet: 2 rows */}
                <div className="lg:hidden space-y-3">
                    {/* Row 1: Logo + Actions */}
                    <div className="flex items-center justify-between gap-2">
                        {/* Logo - Smaller on mobile */}
                        <Link href={routes.home} className="flex items-center">
                            <Image
                                src="/images/lechshop-logo-final.png"
                                alt="LECHSHOP Logo"
                                width={180}
                                height={32}
                                priority
                                className="h-8 sm:h-10 w-auto"
                            />
                        </Link>

                        {/* Right Actions - Icon only on mobile, with text on tablet */}
                        <div className="flex items-center gap-2">
                            {/* Hotline - Icon only on mobile */}
                            <a
                                href="https://zalo.me/0868127491"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Hotline"
                                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all shadow-md hover:shadow-lg cursor-pointer"
                            >
                                <Phone className="h-5 w-5 text-red-600 flex-shrink-0" />
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-xs text-gray-600 font-medium leading-tight">Hotline</span>
                                    <span className="font-bold text-red-600 text-xs leading-tight">0868.127.491</span>
                                </div>
                            </a>

                            {/* Cart - Icon only on mobile */}
                            <Link
                                href="/cart"
                                aria-label="Giỏ hàng"
                                className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold shadow-md hover:shadow-lg relative"
                            >
                                <ShoppingCart className="h-5 w-5 flex-shrink-0" />
                                <span className="hidden sm:inline text-sm">Giỏ hàng</span>
                                {totalItems > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-800 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-md">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Row 2: Search Bar - Full width */}
                    <div className="w-full">
                        <SearchBar />
                    </div>
                </div>

                {/* Desktop: 1 row with centered search */}
                <div className="hidden lg:flex items-center justify-between gap-6">
                    {/* Left Spacer - Takes up space to center search */}
                    <div className="flex-1 flex justify-start">
                        <Link href={routes.home} className="flex items-center">
                            <Image
                                src="/images/lechshop-logo-final.png"
                                alt="LECHSHOP Logo"
                                width={200}
                                height={36}
                                priority
                                className="h-9 w-auto"
                            />
                        </Link>
                    </div>

                    {/* Search Bar - Centered */}
                    <div className="flex-shrink-0 w-full max-w-xl">
                        <SearchBar />
                    </div>

                    {/* Right Actions - Takes up space balancing left, content aligned right */}
                    <div className="flex-1 flex justify-end items-center gap-3">
                        {/* Hotline */}
                        <a
                            href="https://zalo.me/0868127491"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all shadow-md hover:shadow-lg cursor-pointer"
                        >
                            <Phone className="h-5 w-5 text-red-600" />
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-600 font-medium leading-tight">Hotline</span>
                                <span className="font-bold text-red-600 text-sm leading-tight">0868.127.491</span>
                            </div>
                        </a>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-bold shadow-md hover:shadow-lg relative"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="text-sm">Giỏ hàng</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-800 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div >

            {/* Bottom Nav - Hide on mobile, show on tablet+ */}
            <div className="border-t border-white/20 hidden md:block relative z-50" >
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-center gap-4 md:gap-5 lg:gap-6 h-12 text-sm font-bold uppercase overflow-x-auto">
                        <Link href="/" className="flex items-center gap-1 border-b-2 border-white text-white whitespace-nowrap">
                            Trang chủ
                        </Link>
                        <Link href="/gioi-thieu" className="hover:text-red-100 transition-colors whitespace-nowrap">
                            Giới Thiệu
                        </Link>
                        <MegaMenu />
                        <Link href="/huong-dan" className="hover:text-gray-200 transition-colors whitespace-nowrap">
                            Hướng dẫn
                        </Link>
                        <Link href="/blog" className="hover:text-gray-200 transition-colors whitespace-nowrap">
                            Blog
                        </Link>
                        <Link href="/lien-he" className="hover:text-gray-200 transition-colors whitespace-nowrap">
                            Liên hệ
                        </Link>
                    </nav>
                </div>
            </div >


        </header >
    );
}
