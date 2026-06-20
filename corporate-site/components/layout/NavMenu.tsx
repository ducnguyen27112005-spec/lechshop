"use client";

import { siteConfig } from "@/content/site";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/lib/routes";

const menuItems = [
    { label: "VỀ CHÚNG TÔI", href: routes.aboutUs },
    { label: "SẢN PHẨM", href: "/#premium" },
    { label: "DỊCH VỤ", href: "/#dich-vu" },
    { label: "TIN TỨC", href: routes.news },
    { label: "HỖ TRỢ", href: routes.support },
];

export default function NavMenu() {
    return (
        <nav className="hidden lg:flex items-center gap-10">
            {menuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="text-[13px] font-bold uppercase tracking-wider text-gray-800 hover:text-blue-700 transition-colors"
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className="lg:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                <span className="block h-0.5 w-6 bg-gray-700"></span>
                <span className="block h-0.5 w-6 bg-gray-700"></span>
                <span className="block h-0.5 w-6 bg-gray-700"></span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg lg:hidden z-50">
                    <nav className="flex flex-col">
                        {siteConfig.menu.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="px-4 py-3 text-sm font-medium uppercase text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
}
