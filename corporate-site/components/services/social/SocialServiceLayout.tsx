"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, Box, Star } from "lucide-react";

interface Service {
    title: string;
    slug: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    iconKey?: string | null;
    services: Service[];
}

interface SocialServiceLayoutProps {
    categories: Category[];
    children: React.ReactNode;
}

export function SocialServiceLayout({ categories, children }: SocialServiceLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">

                        <nav className="space-y-1">
                            {categories.filter(cat => {
                                // Only show category if it is active or one of its services is active
                                return pathname.includes(cat.slug) || cat.services.some(s => pathname.includes(s.slug));
                            }).map((cat) => {
                                const isPlatformActive = pathname.includes(cat.slug) || cat.services.some(s => pathname.includes(s.slug));

                                return (
                                    <div key={cat.id} className="space-y-1">
                                        <Link
                                            href={`/san-pham/${cat.slug}`}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                                isPlatformActive
                                                    ? "bg-blue-50 text-blue-700 font-bold"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Box className={cn("w-4 h-4", isPlatformActive ? "text-blue-600" : "")} />
                                                {cat.name}
                                            </div>
                                            {isPlatformActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
                                        </Link>

                                        {/* Sub-services (only if platform is active or expanded) */}
                                        {isPlatformActive && (
                                            <div className="pl-4 space-y-1 border-l-2 border-gray-100 ml-3">
                                                {cat.services.map(service => {
                                                    const isServiceActive = pathname === `/san-pham/${service.slug}`;

                                                    return (
                                                        <Link
                                                            key={service.slug}
                                                            href={`/san-pham/${service.slug}`}
                                                            className={cn(
                                                                "flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors rounded-lg",
                                                                isServiceActive
                                                                    ? "text-blue-600 bg-blue-50 font-bold"
                                                                    : "text-gray-700 hover:text-blue-600"
                                                            )}
                                                        >
                                                            <Star
                                                                className={cn(
                                                                    "w-2.5 h-2.5 flex-shrink-0",
                                                                    isServiceActive ? "text-sky-500 fill-current" : "text-gray-400 fill-current"
                                                                )}
                                                            />
                                                            <span>{service.title}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <main className="md:col-span-3">
                    {children}
                </main>
            </div>
        </div>
    );
}
