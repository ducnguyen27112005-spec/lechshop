"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users2,
    FileText,
    HelpCircle,
    Settings,
    ChevronRight,
    ChevronDown,
    CreditCard,
    ImagePlus,
    Box,
    MessageSquare,
    Globe,
    Loader2,
    Ticket,
    Share2,
    BarChart3,
    Users,
    BadgeDollarSign,
    Wallet,
    Database,
    GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialCategory {
    id: string;
    name: string;
    slug: string;
    _count?: { services: number };
}

// Platform icon components (inline SVG for branded look)
function PlatformIcon({ slug, size = 16 }: { slug: string; size?: number }) {
    const s = size;
    switch (slug) {
        case "tiktok":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.47a8.21 8.21 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
            );
        case "facebook":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            );
        case "instagram":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            );
        case "youtube":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            );
        case "google-maps":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 6.38 8.5 15.5 8.5 15.5s8.5-9.12 8.5-15.5C20.5 3.81 16.69 0 12 0zm0 12.5a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
            );
        case "threads":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.508 5.47l-3.04.786c-.47-1.711-1.324-3.07-2.54-4.039-1.22-.972-2.81-1.468-4.726-1.49h-.013c-2.532.02-4.476.87-5.78 2.527-1.227 1.56-1.867 3.828-1.904 6.737v.009c.037 2.907.677 5.176 1.904 6.738 1.301 1.654 3.245 2.504 5.78 2.524h.007c2.1-.015 3.704-.573 5.199-1.808l1.888 2.447C17.536 23.258 15.17 23.977 12.186 24zm5.638-7.202c-.306-1.777-1.378-3.19-3.27-3.91a5.505 5.505 0 00-.653-.206 6.974 6.974 0 00-.368-3.211c-.917-2.158-3.16-3.275-5.693-2.64l.768 2.953c1.321-.33 2.267.28 2.66 1.202.194.458.279.96.234 1.457a5.77 5.77 0 00-1.64.093c-2.344.472-3.9 2.092-3.67 3.828l.004.025c.237 1.525 1.602 2.755 3.675 2.587 1.467-.118 2.562-.728 3.295-1.658.298-.379.527-.814.672-1.287a2.946 2.946 0 011.187.884c.556.664.698 1.538.253 2.556l2.783 1.164c.724-1.79.542-3.531-.437-4.837z" />
                </svg>
            );
        case "shopee":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.6 4.2c1.98 0 3.6 1.44 3.6 3.24v.36H9v-.36c0-1.8 1.62-3.24 3.6-3.24zM7.2 9h9.6c.33 0 .6.27.6.6v.6c0 4.14-2.16 7.8-5.4 7.8-3.24 0-5.4-3.66-5.4-7.8v-.6c0-.33.27-.6.6-.6z" />
                </svg>
            );
        case "spotify":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
            );
        case "website-traffic":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
            );
        case "twitter":
            return (
                <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" className="text-white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            );
        default:
            return <Globe className="text-white" style={{ width: s, height: s }} />;
    }
}

// Background colors for each platform
function getPlatformBg(slug: string): string {
    switch (slug) {
        case "tiktok": return "bg-black";
        case "facebook": return "bg-blue-600";
        case "instagram": return "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400";
        case "youtube": return "bg-red-600";
        case "google-maps": return "bg-green-600";
        case "threads": return "bg-gray-800";
        case "shopee": return "bg-orange-500";
        case "spotify": return "bg-green-500";
        case "website-traffic": return "bg-indigo-600";
        case "twitter": return "bg-sky-500";
        default: return "bg-gray-600";
    }
}

const topMenuItems = [
    { label: "Bảng điều khiển", href: "/admin", icon: LayoutDashboard },
    { label: "Lịch sử chuyển tiền", href: "/admin/transactions", icon: CreditCard },
    { label: "Đơn hàng sản phẩm", href: "/admin/orders?type=PREMIUM", icon: ShoppingBag },
    { label: "Đơn hàng Social", href: "/admin/social/orders", icon: Users2 },
    { label: "Kho tài khoản", href: "/admin/inventory", icon: Database },
    { label: "Quản lý sản phẩm", href: "/admin/products", icon: Box },
];

const bottomMenuItems = [
    { label: "Cài đặt & Giao diện", href: "/admin/settings", icon: Settings },
    { label: "Quản lý Banner", href: "/admin/banners", icon: Package },
    { label: "Quản lý mã giảm giá", href: "/admin/discounts", icon: Ticket },
    { label: "Tính năng Sinh viên", href: "/admin/students", icon: GraduationCap },
    { label: "Bài viết và tin tức", href: "/admin/posts", icon: FileText },
    { label: "Quản lý bình luận", href: "/admin/comments", icon: MessageSquare },
    { label: "Câu hỏi thường gặp", href: "/admin/faq", icon: HelpCircle },
];

function MenuItem({ item, pathname }: { item: { label: string; href: string; icon: any }; pathname: string }) {
    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
    return (
        <Link
            href={item.href}
            className={cn(
                "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                isActive
                    ? "bg-blue-600/10 text-blue-400 shadow-sm"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
        >
            <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "text-blue-400" : "text-gray-400")} />
                {item.label}
            </div>
            {isActive && <ChevronRight className="h-4 w-4" />}
        </Link>
    );
}

function SocialServicesSection({ pathname }: { pathname: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<SocialCategory[]>([]);
    const [loading, setLoading] = useState(false);

    const isSocialActive = pathname.startsWith("/admin/social") && !pathname.includes("/admin/social/orders");

    useEffect(() => {
        if (isSocialActive) setIsOpen(true);
    }, [isSocialActive]);

    useEffect(() => {
        if (isOpen && categories.length === 0) {
            setLoading(true);
            fetch("/api/admin/social/categories")
                .then(res => res.json())
                .then(data => setCategories(Array.isArray(data) ? data : []))
                .catch(() => setCategories([]))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                    isSocialActive
                        ? "bg-blue-600/10 text-blue-400 shadow-sm"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
            >
                <div className="flex items-center gap-3">
                    <Globe className={cn("h-5 w-5", isSocialActive ? "text-blue-400" : "text-gray-400")} />
                    <span>Quản lý dịch vụ MXH</span>
                </div>
                {isOpen
                    ? <ChevronDown className="h-4 w-4 transition-transform" />
                    : <ChevronRight className="h-4 w-4 transition-transform" />
                }
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="ml-3 mt-1 space-y-0.5 pl-3">
                    {loading && (
                        <div className="flex items-center gap-2 px-3 py-2 text-gray-500 text-xs">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Đang tải...
                        </div>
                    )}

                    {categories.map(cat => (
                        <PlatformItem
                            key={cat.id}
                            category={cat}
                            pathname={pathname}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PlatformItem({ category, pathname }: { category: SocialCategory; pathname: string }) {
    const href = `/admin/social/platform/${category.slug}`;
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center justify-between px-2.5 py-2 text-sm font-medium rounded-xl transition-all group",
                isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
        >
            <div className="flex items-center gap-2.5">
                <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                    getPlatformBg(category.slug)
                )}>
                    <PlatformIcon slug={category.slug} size={14} />
                </div>
                <span className="truncate">{category.name}</span>
            </div>
            <ChevronRight className={cn(
                "h-3.5 w-3.5 shrink-0 transition-colors",
                isActive ? "text-blue-400" : "text-gray-600 group-hover:text-gray-400"
            )} />
        </Link>
    );
}

function AffiliateSection({ pathname }: { pathname: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const isAffiliateActive = pathname.startsWith("/admin/affiliate");

    useEffect(() => {
        if (isAffiliateActive) setIsOpen(true);
    }, [isAffiliateActive]);

    const links = [
        { label: "Tổng quan", href: "/admin/affiliate", icon: BarChart3 },
        { label: "Cộng tác viên", href: "/admin/affiliate/referrers", icon: Users },
        { label: "Hoa hồng", href: "/admin/affiliate/commissions", icon: BadgeDollarSign },
        { label: "Rút tiền", href: "/admin/affiliate/withdraws", icon: Wallet },
        { label: "Cài đặt", href: "/admin/affiliate/settings", icon: Settings },
    ];

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                    isAffiliateActive
                        ? "bg-purple-600/10 text-purple-400 shadow-sm"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
            >
                <div className="flex items-center gap-3">
                    <Share2 className={cn("h-5 w-5", isAffiliateActive ? "text-purple-400" : "text-gray-400")} />
                    <span>Tiếp thị liên kết</span>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 transition-transform" /> : <ChevronRight className="h-4 w-4 transition-transform" />}
            </button>

            <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="ml-3 mt-1 space-y-0.5 pl-3 border-l border-gray-800">
                    {links.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center justify-between px-2.5 py-2 text-sm font-medium rounded-xl transition-all group",
                                    isActive
                                        ? "bg-purple-600/10 text-purple-400"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-2.5">
                                    <link.icon className="w-4 h-4" />
                                    <span>{link.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-gray-900 text-white flex flex-col h-full border-r border-gray-800">
            <div className="p-6">
                <div className="text-xl font-black tracking-tighter text-blue-400">
                    QUẢN TRỊ VIÊN
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {topMenuItems.map((item) => (
                    <MenuItem key={item.href} item={item} pathname={pathname} />
                ))}

                <SocialServicesSection pathname={pathname} />
                <AffiliateSection pathname={pathname} />

                {bottomMenuItems.map((item) => (
                    <MenuItem key={item.href} item={item} pathname={pathname} />
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                    <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center font-black">A</div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">Quản trị viên</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Quyền Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
