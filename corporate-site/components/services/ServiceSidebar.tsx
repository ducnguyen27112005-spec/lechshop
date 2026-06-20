"use client";

import Link from "next/link";
import { getServicesByCategory } from "@/data/services";
import { ChevronRight, Layers } from "lucide-react";

interface ServiceSidebarProps {
    currentSlug: string;
}

export default function ServiceSidebar({ currentSlug }: ServiceSidebarProps) {
    const groupedServices = getServicesByCategory();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            {Object.entries(groupedServices).map(([category, services]) => (
                <div key={category} className="border-b border-gray-100 last:border-0">
                    <div className="px-4 py-3 bg-gray-50 flex items-center gap-2 font-bold text-gray-800">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>{category}</span>
                    </div>
                    <div className="p-2 space-y-1">
                        {services.map((s) => {
                            const isActive = s.slug === currentSlug;
                            return (
                                <Link
                                    key={s.slug}
                                    href={`/san-pham/${s.slug}`}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? "bg-blue-50 text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-blue-500" : "bg-gray-300"
                                                }`}
                                        ></span>
                                        {s.title}
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
