"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { Phone, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import Typewriter from "../shared/Typewriter";
import SearchBar from "./SearchBar";
import { useCart } from "@/contexts/CartContext";
import MegaMenu from "./MegaMenu";
import MobileSubMenu from "./MobileSubMenu";
import { useSiteConfig } from "@/hooks/use-site-config";


export default function Header() {
    const { totalItems } = useCart();
    const config = useSiteConfig();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header
            className="text-white relative"
            style={{
                backgroundColor: '#8A1E1C',
                // boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
        >

            {/* Top Header */}
            <div className="mx-auto max-w-[1400px] px-3 sm:px-4 lg:px-8 py-3 sm:py-4 relative z-50">


                {/* Mobile & Tablet: 2 rows */}
                <div className="mobile-header-section lg:hidden space-y-3">
                    {/* Row 1: Logo + Menu Toggle */}
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

                        {/* Right Actions: Cart + Menu */}
                        <div className="flex items-center gap-1">
                            {/* Cart Icon */}
                            <Link
                                href="/cart"
                                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors relative"
                            >
                                <ShoppingCart className="h-6 w-6" />
                                {totalItems > 0 && (
                                    <span className="absolute top-1 right-0 bg-yellow-400 text-red-800 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Row 2: Search Bar - Removed */}
                    {/* <div className="w-full">
                    <SearchBar />
                </div> */}
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />

                        {/* Drawer */}
                        <div className="absolute left-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-white text-gray-900 shadow-xl flex flex-col h-full animate-slide-in-left">
                            {/* Header: Logo + Close */}
                            <div className="p-4 flex items-center justify-between border-b border-gray-100">
                                <Link href={routes.home} onClick={() => setIsMobileMenuOpen(false)}>
                                    <Image
                                        src="/images/lechshop-blue-white.png"
                                        alt="LECHSHOP"
                                        width={160}
                                        height={45}
                                        className="h-10 w-auto"
                                    />
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Search Bar */}
                                <div className="p-4 pb-2">
                                    <SearchBar placeholder="Tìm kiếm sản phẩm..." />
                                </div>

                                {/* Navigation Links */}
                                <div className="flex flex-col text-sm font-medium uppercase text-gray-600">
                                    <Link
                                        href="/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-5 py-4 border-b border-gray-50 hover:text-red-600 hover:bg-gray-50 flex items-center justify-between"
                                    >
                                        Trang chủ
                                    </Link>

                                    <MobileSubMenu
                                        title={<span className="flex items-center gap-2">Danh mục sản phẩm <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold normal-case">HOT</span></span>}
                                        onClose={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className="bg-gray-100/50 py-1">
                                            {/* Level 2: Tài khoản Premium */}
                                            <div className="pl-4 border-l-2 border-transparent">
                                                <MobileSubMenu
                                                    title={<span className="text-sm font-bold text-gray-700 tracking-wide">TÀI KHOẢN PREMIUM</span>}
                                                    onClose={() => setIsMobileMenuOpen(false)}
                                                    href="/#premium"
                                                >
                                                    <div className="bg-white py-1">
                                                        {/* Tài khoản AI */}
                                                        <div className="px-5 py-3 border-b border-gray-50 last:border-0">
                                                            <Link href="/danh-muc/cong-cu-ai" onClick={() => setIsMobileMenuOpen(false)} className="block text-[10px] font-extrabold text-gray-400 mb-3 uppercase tracking-[0.1em]">Tài khoản AI</Link>
                                                            <div className="space-y-4">
                                                                <Link href="/san-pham/chatgpt-plus" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">CHATGPT PLUS</Link>
                                                                <Link href="/san-pham/gemini-pro" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">GEMINI PRO</Link>
                                                            </div>
                                                        </div>

                                                        {/* Giải trí */}
                                                        <div className="px-5 py-3 border-b border-gray-50 last:border-0">
                                                            <Link href="/danh-muc/giai-tri" onClick={() => setIsMobileMenuOpen(false)} className="block text-[10px] font-extrabold text-gray-400 mb-3 uppercase tracking-[0.1em] flex items-center justify-between">
                                                                GIẢI TRÍ
                                                                <span className="text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded font-bold">PHỔ BIẾN</span>
                                                            </Link>
                                                            <div className="space-y-4">
                                                                <Link href="/san-pham/youtube-premium" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">YOUTUBE PREMIUM</Link>
                                                                <Link href="/san-pham/netflix-premium" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">NETFLIX PREMIUM</Link>
                                                            </div>
                                                        </div>

                                                        {/* Thiết kế */}
                                                        <div className="px-5 py-3 border-b border-gray-50 last:border-0">
                                                            <Link href="/danh-muc/sang-tao-noi-dung" onClick={() => setIsMobileMenuOpen(false)} className="block text-[10px] font-extrabold text-gray-400 mb-3 uppercase tracking-[0.1em]">THIẾT KẾ & ĐỒ HỌA</Link>
                                                            <div className="space-y-4">
                                                                <Link href="/san-pham/canva-pro" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">CANVA PRO</Link>
                                                                <Link href="/san-pham/capcut-pro" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">CAPCUT PRO</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </MobileSubMenu>
                                            </div>

                                            {/* Level 2: Dịch vụ MXH */}
                                            <div className="pl-4 border-l-2 border-transparent">
                                                <MobileSubMenu
                                                    title={<span className="text-sm font-bold text-gray-700 tracking-wide flex items-center gap-2">DỊCH VỤ MXH <span className="text-[9px] bg-orange-600 text-white px-1.5 py-0.5 rounded font-bold">MỚI</span></span>}
                                                    onClose={() => setIsMobileMenuOpen(false)}
                                                    href="/danh-muc/mxh"
                                                >
                                                    <div className="bg-white py-1">
                                                        <div className="px-5 py-3">
                                                            <div className="space-y-4">
                                                                <Link href="/san-pham/tiktok" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">TIKTOK</Link>
                                                                <Link href="/san-pham/facebook" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">FACEBOOK</Link>
                                                                <Link href="/san-pham/instagram" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">INSTAGRAM</Link>
                                                                <Link href="/san-pham/youtube" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">YOUTUBE</Link>
                                                                <Link href="/san-pham/threads" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">THREADS</Link>
                                                                <Link href="/san-pham/twitter" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">TWITTER (X)</Link>
                                                                <Link href="/san-pham/shopee" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">SHOPEE</Link>
                                                                <Link href="/san-pham/spotify" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">SPOTIFY</Link>
                                                                <Link href="/san-pham/website-traffic" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">WEBSITE TRAFFIC</Link>
                                                                <Link href="/san-pham/google-maps" onClick={() => setIsMobileMenuOpen(false)} className="block pl-3 text-sm font-semibold text-gray-700 border-l-2 border-gray-100 hover:border-red-500 hover:text-red-600 transition-colors tracking-wide">GOOGLE MAPS</Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </MobileSubMenu>
                                            </div>
                                        </div>
                                    </MobileSubMenu>

                                    <Link
                                        href="/huong-dan"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-5 py-4 border-b border-gray-50 hover:text-red-600 hover:bg-gray-50"
                                    >
                                        Hướng dẫn mua hàng
                                    </Link>

                                    <Link
                                        href={routes.news}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-5 py-4 border-b border-gray-50 hover:text-red-600 hover:bg-gray-50"
                                    >
                                        Blog <span className="ml-2 text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold normal-case">NEW</span>
                                    </Link>

                                    <Link
                                        href="/gioi-thieu"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-5 py-4 border-b border-gray-50 hover:text-red-600 hover:bg-gray-50"
                                    >
                                        Giới thiệu
                                    </Link>

                                    {/* Hợp Tác Mobile Submenu */}
                                    <MobileSubMenu
                                        title={<span className="flex items-center gap-2">Hợp tác</span>}
                                        onClose={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className="bg-gray-50 py-2">
                                            <div className="px-5 py-2">
                                                <Link href="/chinh-sach-doi-tac" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 pl-3 border-l-2 border-gray-200 hover:border-red-500 hover:text-red-600 transition-colors font-medium text-gray-600">Chính sách đối tác</Link>
                                                <Link href="/gioi-thieu-ban-be" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 pl-3 border-l-2 border-gray-200 hover:border-red-500 hover:text-red-600 transition-colors font-medium text-gray-600">Giới thiệu bạn bè</Link>
                                            </div>
                                        </div>
                                    </MobileSubMenu>
                                </div>
                            </div>

                            {/* Footer: Cart & User Info */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                                <Link
                                    href="/cart"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-50 p-2 rounded-full">
                                            <ShoppingCart className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-gray-800">Giỏ hàng của bạn</span>
                                            <span className="text-xs text-gray-500">{totalItems} sản phẩm</span>
                                        </div>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-400 -rotate-90" />
                                </Link>

                                <a
                                    href={config.social.zalo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white text-sm font-bold uppercase rounded-lg shadow hover:bg-red-700 transition-colors"
                                >
                                    <Phone className="h-4 w-4" />
                                    Tư vấn ngay
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop: 1 row with centered search */}
                <div className="desktop-header-section hidden lg:flex items-center justify-between gap-6">
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
                            href={`tel:${config.phone}`}
                            className="flex items-center gap-2 px-4 py-2.5 text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                        >
                            <Phone className="h-5 w-5 text-white" />
                            <div className="flex flex-col">
                                <span className="text-xs text-white/80 font-medium leading-tight">Hotline</span>
                                <span className="font-bold text-white text-sm leading-tight">{config.phone}</span>
                            </div>
                        </a>

                        {/* Divider */}
                        <div className="w-px h-8 bg-white/20 mx-2"></div>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="flex items-center gap-2 px-4 py-2.5 text-white hover:bg-white/10 rounded-lg transition-all font-bold relative"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="text-sm">Giỏ hàng</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-red-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div >

            {/* Bottom Nav - Hide on mobile, show on tablet+ */}
            <div className="border-t border-white/20 hidden md:block relative z-40" >
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-center gap-4 md:gap-5 lg:gap-6 h-12 text-sm font-bold uppercase">
                        <Link href="/" className="flex items-center gap-1 border-b-2 border-white text-white whitespace-nowrap">
                            Trang chủ
                        </Link>
                        <Link href="/gioi-thieu" className="hover:text-red-100 transition-colors whitespace-nowrap">
                            Giới Thiệu
                        </Link>
                        <MegaMenu />
                        <Link href="/huong-dan" className="hover:text-gray-200 transition-colors whitespace-nowrap">
                            Hướng dẫn mua hàng
                        </Link>
                        <Link href={routes.news} className="hover:text-gray-200 transition-colors whitespace-nowrap">
                            Blog
                        </Link>
                        {/* Hợp Tác Dropdown */}
                        <div className="relative group/hoptac h-full flex items-center">
                            <Link href="/lien-he" className="flex items-center gap-1 hover:text-gray-200 transition-colors whitespace-nowrap pb-2 pt-2">
                                Hợp tác
                                <ChevronDown className="h-4 w-4" />
                            </Link>

                            <div className="absolute top-[80%] left-0 mt-0 w-60 opacity-0 invisible group-hover/hoptac:opacity-100 group-hover/hoptac:visible transition-all duration-200 bg-white text-gray-800 shadow-xl rounded-lg border border-gray-100 py-2 z-50">
                                {/* Bridge to prevent hover gap */}
                                <div className="absolute -top-4 left-0 w-full h-4 bg-transparent" />
                                <Link href="/chinh-sach-doi-tac" className="block px-5 py-3 text-sm font-semibold hover:bg-gray-50 hover:text-red-600 transition-colors border-b border-gray-50">
                                    Chính sách đối tác
                                </Link>
                                <Link href="/gioi-thieu-ban-be" className="block px-5 py-3 text-sm font-semibold hover:bg-gray-50 hover:text-red-600 transition-colors">
                                    Giới thiệu bạn bè
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </div >


        </header >
    );
}
