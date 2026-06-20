"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SocialOrderForm } from "./SocialOrderForm";
import { SocialOrderHistory } from "./SocialOrderHistory";
import { ServiceInstructions } from "./ServiceInstructions";

interface Plan {
    id: string;
    code: string;
    name: string;
    pricePerUnit: number;
    currency: string;
    min: number;
    max: number;
    description: string | null;
    tags: string | null;
}

interface Service {
    id: string;
    title: string;
    slug: string;
    category: { name: string; slug: string };
    targetType: string;
    unitLabel: string;
    coverImageUrl: string | null;
    plans: Plan[];
}

const PLATFORM_ICONS: Record<string, string> = {
    'facebook': 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg',
    'instagram': 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
    'tiktok': 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
    'youtube': 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    'threads': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/threads-app-icon.png',
    'telegram': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
    'shopee': 'https://img.icons8.com/color/512/shopee.png',
    'twitter': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg',
    'spotify': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    'google-maps': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg',
    'website-traffic': 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png',
    'traffic': 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png'
};

export function SocialServiceDetail({ service }: { service: Service }) {
    const [activeTab, setActiveTab] = useState("create");

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold uppercase mb-4 text-gray-800">
                {/* Icon based on category */}
                <img
                    src={PLATFORM_ICONS[service.category.slug.toLowerCase().replace('-services', '')] || PLATFORM_ICONS[Object.keys(PLATFORM_ICONS).find(k => service.category.slug.toLowerCase().includes(k)) || 'tiktok']}
                    alt={service.category.name}
                    className="w-6 h-6 object-contain rounded-lg p-0.5"
                />
                <span>{service.category.name}</span>
                <span>»</span>
                <span>{service.title}</span>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                {/* Tabs List - Full Width */}
                <TabsList className="grid w-full grid-cols-2 h-12 bg-transparent gap-4">
                    <TabsTrigger
                        value="create"
                        className="h-full data-[state=active]:bg-[#5bc0de] data-[state=active]:text-white bg-white border border-gray-200 uppercase font-bold text-gray-500"
                    >
                        <span className="uppercase font-bold">Khởi tạo đơn hàng</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="h-full data-[state=active]:bg-[#5bc0de] data-[state=active]:text-white bg-white border border-gray-200 uppercase font-bold text-gray-500"
                    >
                        <span className="uppercase font-bold">Lịch sử đơn hàng</span>
                    </TabsTrigger>
                </TabsList>

                {/* Dynamic Layout based on Tab */}
                <div className={activeTab === 'history' ? "block" : "grid grid-cols-1 lg:grid-cols-10 gap-8"}>
                    {/* Main Content */}
                    <div className={activeTab === 'history' ? "w-full" : "lg:col-span-7 space-y-6"}>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <TabsContent value="create" className="mt-0">
                                <SocialOrderForm service={service} onSuccess={() => setActiveTab("history")} />
                            </TabsContent>
                            <TabsContent value="history" className="mt-0">
                                <SocialOrderHistory serviceSlug={service.slug} />
                            </TabsContent>
                        </div>
                    </div>

                    {/* Right Column: Instructions (Only show for 'create' tab) */}
                    {activeTab === 'create' && (
                        <div className="lg:col-span-3">
                            <ServiceInstructions categorySlug={service.category.slug} />
                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
