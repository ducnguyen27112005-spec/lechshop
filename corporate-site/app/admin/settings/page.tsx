"use client";

import { useEffect, useState } from "react";
import {
    Save,
    Globe,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Youtube,
    Loader2,
    Clock,
    CreditCard
} from "lucide-react";
import { getSiteConfig, saveSiteConfig, SiteConfig, defaultSiteConfig } from "@/lib/site-config";

export default function SiteSettingsPage() {
    const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Load config from localStorage
        const loaded = getSiteConfig();
        setConfig(loaded);
        setLoading(false);
    }, []);

    const handleChange = (field: keyof SiteConfig, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (field: string, value: string) => {
        setConfig(prev => ({
            ...prev,
            social: { ...prev.social, [field]: value }
        }));
    };

    const handleSave = () => {
        setSaving(true);
        saveSiteConfig(config);
        // Simulate API delay
        setTimeout(() => {
            setSaving(false);
            alert("Đã lưu cấu hình thành công!");
        }, 800);
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Cấu hình chung</h1>
                    <p className="text-gray-500 mt-1">Quản lý thông tin website, liên hệ và mạng xã hội</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Lưu thay đổi
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Info */}
                {/* General Info - Removed per user request */}
                {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Globe className="h-5 w-5 text-blue-600" /> Thông tin chung
                    </h2>
                    ... (removed)
                </div> */}

                {/* Contact Info */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Phone className="h-5 w-5 text-green-600" /> Liên hệ
                    </h2>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hotline / Zalo</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                value={config.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg font-bold text-gray-900 border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email CSKH</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                value={config.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg font-bold text-gray-900 border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <textarea
                                value={config.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                rows={2}
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg font-medium text-gray-900 border-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thời gian làm việc</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                value={config.workingHours || ""}
                                onChange={(e) => handleChange("workingHours", e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg font-medium text-gray-900 border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 md:col-span-2">
                    <h2 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Facebook className="h-5 w-5 text-blue-700" /> Mạng xã hội
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Facebook Fanpage</label>
                            <input
                                value={config.social.facebook}
                                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 rounded-lg font-medium text-gray-900 border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zalo Link</label>
                            <input
                                value={config.social.zalo}
                                onChange={(e) => handleSocialChange("zalo", e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 rounded-lg font-medium text-gray-900 border-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    {/* YouTube and LinkedIn removed per user request */}
                </div>
            </div>
        </div>
    );
}
