"use client";

import { Plan } from "@/data/services";
import { formatCurrency } from "@/lib/money";
import { CheckCircle2, Flame, Shield, Zap } from "lucide-react";

interface PlanCardProps {
    plan: Plan;
    isSelected: boolean;
    onSelect: () => void;
}

export default function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
    return (
        <div
            onClick={onSelect}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                    ? "border-blue-500 bg-blue-50/50 shadow-sm"
                    : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                }`}
        >
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Checkbox Visual */}
                <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${isSelected ? "border-blue-600" : "border-gray-300"
                        }`}
                >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{plan.name}</span>
                        {plan.badge && (
                            <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${plan.badge === "HOT"
                                        ? "bg-red-100 text-red-600"
                                        : plan.badge === "AN TOÀN"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-blue-100 text-blue-600"
                                    }`}
                            >
                                {plan.badge}
                            </span>
                        )}
                        <span className="ml-auto text-sm font-bold text-red-600">
                            {formatCurrency(plan.pricePerUnit)} / {plan.unitLabel}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mt-2">
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-orange-500" />
                            <span>Tốc độ: {plan.speed}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-green-500" />
                            <span>Bảo hành: {plan.dropRate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                            <span>{plan.resource}</span>
                        </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>
                            Min: <b>{plan.min}</b>
                        </span>
                        <span>
                            Max: <b>{plan.max}</b>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
