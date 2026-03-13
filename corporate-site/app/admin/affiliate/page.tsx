"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, BadgeDollarSign, Wallet, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList } from "recharts";

export default function AffiliateDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [topReferrers, setTopReferrers] = useState<any[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [funnelData, setFunnelData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/affiliate/overview")
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.error("API Error:", data.error);
                } else {
                    setStats(data.stats);
                    setTopReferrers(data.topReferrers || []);
                    setMonthlyData(data.monthlyData || []);
                    setFunnelData(data.funnelData || []);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Tổng quan Tiếp thị liên kết</h1>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <BarChart3 className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-medium">Lượt Clicks</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">{stats.totalClicks}</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Users className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-medium">Signups</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">{stats.totalSignups}</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <BadgeDollarSign className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-medium">Đơn hàng</span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">{stats.totalOrders}</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <Wallet className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-medium">Chờ duyệt</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{stats.pendingCommission?.toLocaleString()} đ</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-teal-500" />
                            <span className="text-xs font-medium">Đã trả (Paid)</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">{stats.paidCommission?.toLocaleString()} đ</div>
                    </div>
                    <div className="bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm flex flex-col">
                        <div className="flex items-center gap-2 text-red-600 mb-2">
                            <XCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Từ chối</span>
                        </div>
                        <div className="text-lg font-bold text-red-700">{stats.rejectedCommission?.toLocaleString() || 0} đ</div>
                    </div>
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="font-semibold text-gray-800 mb-6">Hoa hồng theo tháng (6 tháng gần đây)</h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <RechartsTooltip
                                    formatter={(value: any, name: any) => {
                                        if (name === "commission") return [value.toLocaleString() + ' đ', 'Hoa hồng'];
                                        return [value, 'Đơn hàng'];
                                    }}
                                    labelStyle={{ fontWeight: "bold", color: "#333" }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="commission" name="commission" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="right" dataKey="orders" name="orders" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h2 className="font-semibold text-gray-800 mb-6">Phễu chuyển đổi (Funnel)</h2>
                    <div className="h-72 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <FunnelChart>
                                <RechartsTooltip />
                                <Funnel
                                    dataKey="count"
                                    data={funnelData}
                                    isAnimationActive
                                >
                                    <LabelList position="right" fill="#000" stroke="none" dataKey="stage" />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-800">Cộng tác viên nổi bật</h2>
                        <button className="text-blue-600 text-sm font-medium hover:underline">Xem tất cả</button>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Cộng tác viên (User ID)</th>
                                    <th className="px-4 py-3 font-semibold">Mã giới thiệu</th>
                                    <th className="px-4 py-3 font-semibold text-right">Lượt click</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {topReferrers.map(ref => (
                                    <tr key={ref.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{ref.userId}</td>
                                        <td className="px-4 py-3 text-gray-600">{ref.code}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-blue-600">{ref.clicks}</td>
                                    </tr>
                                ))}
                                {topReferrers.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="font-semibold text-gray-800 mb-4">Tổng quan hoa hồng</h2>
                    {stats && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-600 text-sm">Chờ duyệt (Pending)</span>
                                <span className="font-semibold text-amber-600">{stats.pendingCommission.toLocaleString()} đ</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-600 text-sm">Đã duyệt (Available)</span>
                                <span className="font-semibold text-green-600">{stats.approvedCommission.toLocaleString()} đ</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 text-sm">Đã thanh toán (Paid)</span>
                                <span className="font-semibold text-purple-600">{stats.paidCommission.toLocaleString()} đ</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
