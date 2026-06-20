"use client";

import { useState } from "react";
import { Filter, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, subDays, startOfMonth, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";

export type DatePreset = "7days" | "30days" | "thisMonth" | "thisWeek" | "custom";
export type ChannelType = "all" | "product" | "social";

export interface FilterState {
    from: string;
    to: string;
    type: ChannelType;
    preset: DatePreset;
}

interface DashboardFilterBarProps {
    filter: FilterState;
    onChange: (newFilter: FilterState) => void;
    onRefresh: () => void;
    isLoading: boolean;
    lastUpdated: Date | null;
}

export function DashboardFilterBar({ filter, onChange, onRefresh, isLoading, lastUpdated }: DashboardFilterBarProps) {
    const handlePresetChange = (preset: DatePreset) => {
        const today = new Date();
        let from = new Date();
        let to = today;

        switch (preset) {
            case "7days":
                from = subDays(today, 6); // Includes today
                break;
            case "30days":
                from = subDays(today, 29);
                break;
            case "thisMonth":
                from = startOfMonth(today);
                break;
            case "thisWeek":
                from = startOfWeek(today, { weekStartsOn: 1 }); // Monday
                break;
            case "custom":
                // Don't auto-update dates when selecting custom yet
                onChange({ ...filter, preset });
                return;
        }

        onChange({
            ...filter,
            preset,
            from: format(from, "yyyy-MM-dd"),
            to: format(to, "yyyy-MM-dd"),
        });
    };

    const handleTypeChange = (type: ChannelType) => {
        onChange({ ...filter, type });
    };

    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Time Presets */}
                <div className="flex items-center p-1 bg-gray-50 border border-gray-100 rounded-lg shrink-0">
                    <button
                        onClick={() => handlePresetChange("7days")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                            filter.preset === "7days" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        )}
                    >
                        7 ngày qua
                    </button>
                    <button
                        onClick={() => handlePresetChange("30days")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                            filter.preset === "30days" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        )}
                    >
                        30 ngày qua
                    </button>
                    <button
                        onClick={() => handlePresetChange("thisMonth")}
                        className={cn(
                            "px-3 py-1.5 text-xs font-bold rounded-md transition-all",
                            filter.preset === "thisMonth" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        )}
                    >
                        Tháng này
                    </button>
                </div>

                {/* Date Inputs if Custom */}
                {filter.preset === "custom" && (
                    <div className="flex items-center gap-2 shrink-0">
                        <input
                            type="date"
                            value={filter.from}
                            onChange={(e) => onChange({ ...filter, from: e.target.value })}
                            className="text-xs font-medium px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                        />
                        <span className="text-gray-400 text-xs">-</span>
                        <input
                            type="date"
                            value={filter.to}
                            onChange={(e) => onChange({ ...filter, to: e.target.value })}
                            className="text-xs font-medium px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                        />
                    </div>
                )}
                {/* Custom button to trigger date inputs */}
                {filter.preset !== "custom" && (
                    <button
                        onClick={() => handlePresetChange("custom")}
                        className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Tùy chọn
                    </button>
                )}


                <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

                {/* Channel Filter */}
                <div className="flex items-center gap-2 shrink-0">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={filter.type}
                        onChange={(e) => handleTypeChange(e.target.value as ChannelType)}
                        className="text-xs font-bold text-gray-700 bg-transparent py-1.5 pr-6 focus:outline-none cursor-pointer"
                    >
                        <option value="all">Tất cả kênh</option>
                        <option value="product">Sản phẩm (Web)</option>
                        <option value="social">Dịch vụ (Social)</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-[11px] text-gray-400 font-medium w-32">
                    {lastUpdated && (
                        <>Cập nhật lần cuối: <span className="text-gray-600 font-bold">{format(lastUpdated, "HH:mm:ss", { locale: vi })}</span></>
                    )}
                </div>
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <RefreshCcw className={cn("w-3.5 h-3.5", isLoading && "animate-spin text-blue-600")} />
                    <span>Làm mới</span>
                </button>
            </div>
        </div>
    );
}
