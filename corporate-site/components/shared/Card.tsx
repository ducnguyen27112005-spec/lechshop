import { cn } from "@/lib/utils";
import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({
    children,
    className,
    hover = false,
}: CardProps) {
    return (
        <div
            className={cn(
                "rounded-lg bg-white border border-gray-200 shadow-sm",
                hover && "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                className
            )}
        >
            {children}
        </div>
    );
}
