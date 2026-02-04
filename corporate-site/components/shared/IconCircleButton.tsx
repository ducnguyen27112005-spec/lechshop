import { cn } from "@/lib/utils";
import React from "react";

interface IconCircleButtonProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    className?: string;
}

export default function IconCircleButton({
    icon,
    label,
    href,
    className,
}: IconCircleButtonProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 hover:border-white/60",
                className
            )}
        >
            {icon}
        </a>
    );
}
