"use client";

import { useEffect, useState } from "react";
import { getSiteConfig, defaultSiteConfig } from "@/lib/site-config";

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
    asLink?: boolean; // If true, renders as <a> for phone/email/social
    label?: string; // Optional label prefix check (not used for logic, just for component)
    children?: React.ReactNode; // If provided, uses children as label inside link? No, keeps simple.
    fallback?: string;
}

export default function SiteInfo({ type, className = "", asLink = false, children, fallback = "" }: SiteInfoProps) {
    const [value, setValue] = useState<string>(fallback);
    // Initial value from default config to avoid mismatch? 
    // Actually defaultValue matching server render is hard if we change it.
    // Better to start empty or with default and accept hydration mismatch (or use useEffect only).
    // Using useEffect only to avoid hydration mismatch.

    useEffect(() => {
        const config = getSiteConfig();
        let val = "";

        // Map type to value
        switch (type) {
            case "name": val = config.name; break;
            case "description": val = config.description; break;
            case "phone": val = config.phone; break;
            case "email": val = config.email; break;
            case "address": val = config.address; break;
            case "workingHours": val = config.workingHours || defaultSiteConfig.workingHours!; break;
            case "copyright": val = config.copyright || defaultSiteConfig.copyright!; break;
            case "facebook": val = config.social.facebook; break;
            case "zalo": val = config.social.zalo; break;
            case "youtube": val = config.social.youtube || ""; break;
            case "tiktok": val = config.social.tiktok || ""; break;
            case "instagram": val = config.social.instagram || ""; break;
            case "linkedin": val = config.social.linkedin || ""; break;
            case "bankName": val = config.bankAccount?.bankName || ""; break;
            case "accountNumber": val = config.bankAccount?.accountNumber || ""; break;
            case "accountHolder": val = config.bankAccount?.accountHolder || ""; break;
        }
        setValue(val);

        // Listen for changes
        const handleConfigChange = () => {
            const newConfig = getSiteConfig();
            // ... same logic ...
            // Redundant to copy-paste. 
            // Ideally extract mapping logic.
            // For now, simpler to just trigger re-render or re-fetch.
            setValue(prev => {
                // Logic to re-fetch
                let newVal = "";
                switch (type) {
                    case "name": newVal = newConfig.name; break;
                    case "description": newVal = newConfig.description; break;
                    case "phone": newVal = newConfig.phone; break;
                    case "email": newVal = newConfig.email; break;
                    case "address": newVal = newConfig.address; break;
                    case "workingHours": newVal = newConfig.workingHours || defaultSiteConfig.workingHours!; break;
                    case "copyright": newVal = newConfig.copyright || defaultSiteConfig.copyright!; break;
                    case "facebook": newVal = newConfig.social.facebook; break;
                    case "zalo": newVal = newConfig.social.zalo; break;
                    case "youtube": newVal = newConfig.social.youtube || ""; break;
                    case "tiktok": newVal = newConfig.social.tiktok || ""; break;
                    case "instagram": newVal = newConfig.social.instagram || ""; break;
                    case "linkedin": newVal = newConfig.social.linkedin || ""; break;
                    case "bankName": newVal = newConfig.bankAccount?.bankName || ""; break;
                    case "accountNumber": newVal = newConfig.bankAccount?.accountNumber || ""; break;
                    case "accountHolder": newVal = newConfig.bankAccount?.accountHolder || ""; break;
                }
                return newVal;
            });
        };

        window.addEventListener("site-config-changed", handleConfigChange);
        return () => window.removeEventListener("site-config-changed", handleConfigChange);

    }, [type]);

    if (!value) return null;

    if (asLink) {
        let href = value;
        if (type === "phone") href = `tel:${value.replace(/[^\d+]/g, "")}`;
        if (type === "email") href = `mailto:${value}`;
        // Social links are already URLs

        return (
            <a href={href} className={className} target={type === "phone" || type === "email" ? undefined : "_blank"} rel="noreferrer">
                {children || value}
            </a>
        );
    }

    return <span className={className}>{value}</span>;
}
