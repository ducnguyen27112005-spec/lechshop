"use client";

import Image from "next/image";
import Link from "next/link";

const banners = [
    {
        id: 1,
        image: "/images/gemini-sidebar-2.png",
        alt: "Gemini Advanced",
        href: "/san-pham/google-gemini",
    },
    {
        id: 2,
        image: "/images/chatgpt-sidebar-2.jpg",
        alt: "ChatGPT Plus",
        href: "/san-pham/chatgpt-plus-kham-pha",
    }
];

export default function RightBanners() {
    return (
        <div className="flex flex-col h-full gap-4">
            {banners.map((banner) => (
                <Link
                    key={banner.id}
                    href={banner.href}
                    className="relative flex-1 overflow-hidden rounded-lg group h-1/2 min-h-[140px]"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${banner.image})` }}
                    />
                </Link>
            ))}
        </div>
    );
}
