"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBannerConfig, BannerItem } from "@/lib/banner-config";

export default function RightBanners() {
    const [banners, setBanners] = useState<BannerItem[]>([]);

    useEffect(() => {
        const config = getBannerConfig();
        setBanners(config.sideBanners);

        const handleUpdate = () => {
            const updated = getBannerConfig();
            setBanners(updated.sideBanners);
        };
        window.addEventListener("banner-config-updated", handleUpdate);
        return () => window.removeEventListener("banner-config-updated", handleUpdate);
    }, []);

    if (banners.length === 0) return null;

    return (
        <div className="flex flex-col h-full gap-3">
            {banners.map((banner, index) => (
                <Link
                    key={index}
                    href={banner.link || "#"}
                    className="relative flex-1 overflow-hidden rounded-xl group h-1/2 min-h-[140px] shadow-sm border border-gray-100"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${banner.image})` }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </Link>
            ))}
        </div>
    );
}
