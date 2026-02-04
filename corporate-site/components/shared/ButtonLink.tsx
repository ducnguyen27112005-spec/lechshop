import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface ButtonLinkProps {
    href: string;
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
}

export default function ButtonLink({
    href,
    children,
    variant = "primary",
    className,
}: ButtonLinkProps) {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md transition-all duration-200";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    };

    return (
        <Link
            href={href}
            className={cn(baseStyles, variants[variant], className)}
        >
            {children}
        </Link>
    );
}
