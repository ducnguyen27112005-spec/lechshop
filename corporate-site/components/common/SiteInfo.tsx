"use client";

import { useSiteConfig } from "@/hooks/use-site-config";
import { defaultSiteConfig } from "@/lib/site-config";

type InfoType =
    | "name"
    | "description"
    | "phone"
    | "email"
    | "address"
    | "workingHours"
    | "copyright"
    | "facebook"
    | "zalo"
    | "youtube"
    | "tiktok"
    | "instagram"
    | "linkedin"
    | "bankName"
    | "accountNumber"
    | "accountHolder";

interface SiteInfoProps {
    type: InfoType;
    className?: string;
    asLink?: boolean;
    label?: string;
    children?: React.ReactNode;
    fallback?: string;
}

export default function SiteInfo({ type, className = "", asLink = false, children, fallback = "" }: SiteInfoProps) {
    const config = useSiteConfig();
    let value = fallback;

    if (config) {
        switch (type) {
            case "name": value = config.name; break;
            case "description": value = config.description; break;
            case "phone": value = config.phone; break;
            case "email": value = config.email; break;
            case "address": value = config.address; break;
            case "workingHours": value = config.workingHours || defaultSiteConfig.workingHours!; break;
            case "copyright": value = config.copyright || defaultSiteConfig.copyright!; break;
            case "facebook": value = config.social.facebook; break;
            case "zalo": value = config.social.zalo; break;
            case "youtube": value = config.social.youtube || ""; break;
            case "tiktok": value = config.social.tiktok || ""; break;
            case "instagram": value = config.social.instagram || ""; break;
            case "linkedin": value = config.social.linkedin || ""; break;
            case "bankName": value = config.bankAccount?.bankName || ""; break;
            case "accountNumber": value = config.bankAccount?.accountNumber || ""; break;
            case "accountHolder": value = config.bankAccount?.accountHolder || ""; break;
        }
    }

    if (!value) return null;

    if (asLink) {
        let href = value;
        if (type === "phone") href = `tel:${value.replace(/[^\d+]/g, "")}`;
        if (type === "email") href = `mailto:${value}`;

        return (
            <a href={href} className={className} target={type === "phone" || type === "email" ? undefined : "_blank"} rel="noreferrer">
                {children || value}
            </a>
        );
    }

    return <span className={className}>{value}</span>;
}
