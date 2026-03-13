"use client";

import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface DashboardChartsProps {
    revenueByDay: { day: string; revenue: number }[];
    ordersByDay: { day: string; orders: number }[];
    statusBreakdown: { id: string; name: string; value: number; count: number; color: string }[];
}

function formatVND(value: number) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-bold w-[120px]">
            <p className="text-gray-400 mb-1">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color }}>
                    {p.name}: {typeof p.value === "number" && p.value > 1000
                        ? p.value.toLocaleString("vi-VN") + "đ"
                        : p.value}
                </p>
            ))}
        </div>
    );
}

// Tooltip riêng cho biểu đồ tròn (Donut) để hiển thị số lượng đơn
function PieTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-bold border-none">
            <p className="text-white mb-0.5" style={{ color: data.color }}>{data.name}</p>
            <p className="text-gray-300">Tỉ lệ: {data.value}%</p>
            <p className="text-white">Số lượng: {data.count} đơn</p>
        </div>
    )
}

export function DashboardCharts({ revenueByDay, ordersByDay, statusBreakdown }: DashboardChartsProps) {
    const searchParams = useSearchParams();

    // Copy existing search params (from, to, type)
    const getBaseParams = () => {
        const params = new URLSearchParams();
        if (searchParams.get('from')) params.set('from', searchParams.get('from')!);
        if (searchParams.get('to')) params.set('to', searchParams.get('to')!);
        if (searchParams.get('type')) params.set('type', searchParams.get('type')!);
        return params.toString();
    };

    const baseParamsStr = getBaseParams();
    const queryPrefix = baseParamsStr ? `?${baseParamsStr}&` : '?';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Line Chart — Revenue */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-black text-gray-900">Doanh thu</h3>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">Biểu đồ theo thời gian</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={revenueByDay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={formatVND} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            name="Doanh thu"
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 6, fill: "#3b82f6", stroke: "#dbeafe", strokeWidth: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart — Order Status */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-black text-gray-900 mb-1">Trạng thái đơn</h3>
                <p className="text-[11px] text-gray-400 font-medium mb-4">Phân bổ theo trạng thái</p>
                <div className="h-[200px] w-full">
                    {statusBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm text-gray-400 font-medium whitespace-nowrap">Chưa có dữ liệu</span>
                        </div>
                    )}
                </div>

                {/* Custom Clickable Legend */}
                <div className="space-y-2 mt-4">
                    {statusBreakdown.map((item) => {
                        const isClickable = item.id !== 'empty';
                        const href = isClickable ? `/admin/orders${queryPrefix}statusGroup=${item.id}` : '#';

                        const InnerContent = () => (
                            <div className="flex items-center justify-between text-xs w-full group">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className={`font-medium transition-colors ${isClickable ? 'text-gray-600 group-hover:text-blue-600' : 'text-gray-400'}`}>
                                        {item.name}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="font-black text-gray-900">{item.value}%</span>
                                    {isClickable && <span className="text-gray-400 ml-1">({item.count})</span>}
                                </div>
                            </div>
                        );

                        if (isClickable) {
                            return (
                                <Link key={item.id} href={href} className="block hover:bg-gray-50 -mx-2 px-2 py-1 rounded-md transition-colors cursor-pointer">
                                    <InnerContent />
                                </Link>
                            )
                        }

                        return (
                            <div key={item.id || 'empty'} className="block -mx-2 px-2 py-1 cursor-not-allowed opacity-70">
                                <InnerContent />
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Bar Chart — Orders by Day */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-black text-gray-900">Số lượng đơn hàng</h3>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">Phân bổ theo thời gian</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={ordersByDay} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="orders"
                            name="Đơn hàng"
                            fill="#6366f1"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
