"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Package, XCircle, FileText, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

export interface DashboardAlert {
    key: string;
    type?: "warning" | "danger" | "info"; // Legacy support if needed
    severity: "warning" | "danger" | "info";
    title: string;
    description: string;
    count: number;
    actionUrl: string;
    meta?: any;
}

const severityOrder = {
    danger: 3,
    warning: 2,
    info: 1
};

const iconMap: Record<string, any> = {
    "overdue-paid": Clock,
    "overdue-unpaid": Clock,
    "social-notes": FileText,
    "low-stock": Package,
    "cancelled-today": XCircle,
};
const typeStyles = {
    danger: {
        bg: "bg-red-50 border-red-100",
        icon: "text-red-500 bg-red-100",
        badge: "bg-red-500 text-white",
        title: "text-red-900",
        desc: "text-red-600",
    },
    warning: {
        bg: "bg-amber-50 border-amber-100",
        icon: "text-amber-500 bg-amber-100",
        badge: "bg-amber-500 text-white",
        title: "text-amber-900",
        desc: "text-amber-600",
    },
    info: {
        bg: "bg-blue-50 border-blue-100",
        icon: "text-blue-500 bg-blue-100",
        badge: "bg-blue-500 text-white",
        title: "text-blue-900",
        desc: "text-blue-600",
    },
};

interface DashboardAlertsProps {
    alerts: DashboardAlert[];
}

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
    const [readAlerts, setReadAlerts] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load read alerts from local storage (keyed by date to expire them next day)
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const storageKey = `alerts_read_${todayStr}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                setReadAlerts(JSON.parse(stored));
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    const markAsRead = (key: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if wrapped in a link
        e.stopPropagation();

        const todayStr = format(new Date(), 'yyyy-MM-dd');
        const storageKey = `alerts_read_${todayStr}`;

        const newRead = [...readAlerts, key];
        setReadAlerts(newRead);
        localStorage.setItem(storageKey, JSON.stringify(newRead));
    };

    if (!mounted) return null; // Prevent hydration errors with localstorage

    // Filter, Sort, and Map alerts
    const activeAlerts = alerts
        .filter(a => a.count > 0 && !readAlerts.includes(a.key))
        .sort((a, b) => {
            const diff = severityOrder[b.severity] - severityOrder[a.severity];
            if (diff !== 0) return diff;
            return b.count - a.count;
        });

    if (activeAlerts.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-sm font-black text-gray-900">Thông báo nhanh</h3>
                </div>
                <p className="text-xs text-gray-500 font-medium">Bạn đã xử lý hết các cảnh báo vận hành. Hệ thống đang hoạt động ổn định!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-black text-gray-900">Thông báo nhanh</h3>
                </div>
                <div className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    {activeAlerts.reduce((acc, a) => acc + a.count, 0)} cảnh báo
                </div>
            </div>

            <div className="space-y-3">
                {activeAlerts.map((alert) => {
                    const styles = typeStyles[alert.severity];
                    const IconComponent = iconMap[alert.key] || AlertTriangle;
                    return (
                        <Link
                            href={alert.actionUrl}
                            key={alert.key}
                            className={cn(
                                "flex items-start gap-3 p-3 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 group",
                                styles.bg
                            )}
                        >
                            <div className={cn("p-2 rounded-lg flex-shrink-0 mt-0.5", styles.icon)}>
                                <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={cn("text-sm font-bold flex items-center justify-between", styles.title)}>
                                    {alert.title}
                                    <div className={cn(
                                        "flex-shrink-0 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-black",
                                        styles.badge
                                    )}>
                                        {alert.count}
                                    </div>
                                </div>
                                <p className={cn("text-[11px] font-medium mt-1 pr-6", styles.desc)}>
                                    {alert.description}
                                </p>

                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        onClick={(e) => markAsRead(alert.key, e)}
                                        className="text-[10px] font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
                                    >
                                        <Check className="w-3 h-3" /> Đã xử lý
                                    </button>
                                </div>
                            </div>
                            <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className={cn("h-4 w-4", styles.title)} />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
