"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

export default function AffiliateSettingsPage() {
    const [config, setConfig] = useState({
        defaultRate: 10,
        holdDays: 7,
        minWithdraw: 100000,
        maxWithdraw: 1000000
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch(`/api/admin/affiliate/settings`)
            .then(res => res.json())
            .then(data => setConfig({
                defaultRate: data.defaultRate || 10,
                holdDays: data.holdDays || 7,
                minWithdraw: data.minWithdraw || 100000,
                maxWithdraw: data.maxWithdraw || 1000000
            }))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/affiliate/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config)
            });
            if (res.ok) {
                alert("Lưu cài đặt thành công!");
            } else {
                alert("Lỗi khi lưu cài đặt");
            }
        } catch (error) {
            console.error(error);
            alert("Đã xảy ra lỗi");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;

    return (
        <div className="max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt Cấu hình Affiliate</h1>

            <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Tỷ lệ hoa hồng mặc định (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={config.defaultRate}
                                onChange={(e) => setConfig({ ...config, defaultRate: Number(e.target.value) })}
                                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                                min={0} max={100} required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                        </div>
                        <p className="text-xs text-gray-500">Mức hoa hồng cơ bản áp dụng cho mọi đơn hàng giới thiệu thành công.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Thời gian giam hoa hồng (Hold days)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={config.holdDays}
                                onChange={(e) => setConfig({ ...config, holdDays: Number(e.target.value) })}
                                className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                                min={0} required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">ngày</span>
                        </div>
                        <p className="text-xs text-gray-500">Số ngày hoa hồng nằm ở trạng thái Pending phòng trường hợp hoàn tiền.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Mức rút tối thiểu</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={config.minWithdraw}
                                onChange={(e) => setConfig({ ...config, minWithdraw: Number(e.target.value) })}
                                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                                min={0} required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">đ</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Mức rút tối đa</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={config.maxWithdraw}
                                onChange={(e) => setConfig({ ...config, maxWithdraw: Number(e.target.value) })}
                                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                                min={0} required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">đ</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Lưu Cấu Hình
                    </button>
                </div>
            </form>
        </div>
    );
}
