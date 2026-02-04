"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Globe, Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/admin/shared/PageHeader";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        hotline: "",
        email: "",
        address: "",
        footerText: "",
        socialLinks: { facebook: "", tiktok: "", zalo: "" }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            if (data.id) {
                setSettings({
                    ...data,
                    socialLinks: data.socialLinks || { facebook: "", tiktok: "", zalo: "" }
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setMessage("Cập nhật cài đặt thành công!");
            }
        } catch (error) {
            setMessage("Đã có lỗi xảy ra.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center font-bold text-gray-500">Đang tải cài đặt...</div>;

    return (
        <div className="max-w-4xl space-y-8">
            <PageHeader
                title="Cài đặt trang web"
                description="Cấu hình thông tin liên hệ và các cài đặt chung của website."
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-gray-900 border-b border-gray-50 pb-4">Thông tin liên hệ</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Phone className="h-4 w-4 text-blue-500" /> Hotline
                            </label>
                            <input
                                value={settings.hotline}
                                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Mail className="h-4 w-4 text-blue-500" /> Email hỗ trợ
                            </label>
                            <input
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" /> Địa chỉ văn phòng
                        </label>
                        <textarea
                            rows={2}
                            value={settings.address}
                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold resize-none"
                        />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-gray-900 border-b border-gray-50 pb-4">Chân trang & Mạng xã hội</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Link Facebook</label>
                            <input
                                value={settings.socialLinks?.facebook || ""}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })}
                                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Link TikTok</label>
                            <input
                                value={settings.socialLinks?.tiktok || ""}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, tiktok: e.target.value } })}
                                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Link Zalo</label>
                            <input
                                value={settings.socialLinks?.zalo || ""}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, zalo: e.target.value } })}
                                className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Văn bản bản quyền (Footer)</label>
                        <input
                            value={settings.footerText}
                            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                        />
                    </div>
                </div>

                {message && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 font-bold text-center">
                        {message}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Lưu cài đặt</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
