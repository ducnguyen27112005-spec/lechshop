"use client";

import { useSiteConfig } from "@/hooks/use-site-config";
import { Facebook, Linkedin, Youtube, Mail, Phone, MessageCircle } from "lucide-react";
import React from "react";

export default function HeroContactIcons() {
    const config = useSiteConfig();

    const icons = [
        {
            icon: <Facebook className="h-5 w-5" />,
            label: "Facebook",
            href: config.social.facebook,
        },
        {
            icon: <Phone className="h-5 w-5" />,
            label: "Hotline",
            href: `tel:${config.phone}`,
        },
        {
            icon: <MessageCircle className="h-5 w-5" />,
            label: "Zalo",
            href: config.social.zalo,
        },
    ];
    return (
        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-3">
            {icons.map((item, index) => (
                <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/20 hover:border-white shadow-lg"
                >
                    {item.icon}
                </a>
            ))}
        </div>
    );
}
