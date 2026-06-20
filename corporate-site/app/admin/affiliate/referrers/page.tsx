"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, User } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function AffiliateReferrersPage() {
    const [referrers, setReferrers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchReferrers = () => {
        setLoading(true);
        fetch(`/api/admin/affiliate/referrers?search=${encodeURIComponent(searchTerm)}`)
            .then(res => res.json())
            .then(data => setReferrers(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchReferrers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Danh sách Cộng tác viên</h1>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm UID / Mã giới thiệu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchReferrers()}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <button onClick={fetchReferrers} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Tìm
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/80 text-gray-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">User ID (Cộng tác viên)</th>
                                <th className="px-6 py-4">Mã giới thiệu</th>
                                <th className="px-6 py-4">Stats</th>
                                <th className="px-6 py-4">Ví chờ duyệt</th>
                                <th className="px-6 py-4">Ví khả dụng</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Ngày tham gia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : referrers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                                        <User className="w-12 h-12 text-gray-300 mb-2" />
                                        Không tìm thấy cộng tác viên nào.
                                    </td>
                                </tr>
                            ) : referrers.map(ref => (
                                <tr key={ref.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{ref.userId}</td>
                                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-mono text-xs">{ref.code}</span></td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span>Clicks: <b className="text-gray-900">{ref.stats.clicks}</b></span>
                                            <span>Signups: <b className="text-gray-900">{ref.stats.signups}</b></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-amber-600">
                                        {ref.stats.wallet.balancePending.toLocaleString()} đ
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-green-600">
                                        {ref.stats.wallet.balanceAvailable.toLocaleString()} đ
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ref.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {ref.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500">
                                        {format(new Date(ref.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
