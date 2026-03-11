import { cn } from "@/lib/utils";
import React from "react";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
    className?: string;
}

export default function SectionHeading({
    title,
    subtitle,
    centered = false,
    className,
}: SectionHeadingProps) {
    return (
        <div className={cn(centered && "text-center", className)}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-3 text-lg text-gray-600">{subtitle}</p>
            )}
        </div>
    );
}
