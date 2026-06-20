"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarCategory {
    name: string;
    slug: string;
    services: string[];
}

interface SidebarService {
    name: string;
    slug: string;
}

export default function ServiceSidebar() {
    const pathname = usePathname();
    const [categories, setCategories] = useState<SidebarCategory[]>([]);
    const [serviceMap, setServiceMap] = useState<Record<string, { name: string }>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/services/sidebar")
            .then(res => res.json())
            .then(data => {
                setCategories(data.categories || []);
                setServiceMap(data.serviceMap || {});
            })
            .catch(() => {
                // Fallback: empty
                setCategories([]);
                setServiceMap({});
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24 p-6">
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24 p-6">
                <p className="text-gray-500 text-sm">Chưa có danh mục dịch vụ.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            {categories.map((category) => (
                <div key={category.name} className="border-b border-gray-100 last:border-0">
                    <div className="px-4 py-3 bg-gray-50 flex items-center justify-between font-bold text-gray-800">
                        <div className="flex items-center gap-2">
                            <span>{category.name}</span>
                        </div>
                    </div>
                    <div className="p-2 space-y-1">
                        {category.services.map((slug) => {
                            const service = serviceMap[slug];
                            if (!service) return null;

                            const isActive = pathname === `/dich-vu/${slug}`;

                            return (
                                <Link
                                    key={slug}
                                    href={`/dich-vu/${slug}`}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? "bg-blue-50 text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                                        {service.name}
                                    </span>
                                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
