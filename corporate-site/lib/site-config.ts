"use client";

import { siteConfig as defaultContentConfig } from "@/content/site";

export interface SiteConfig {
    name: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    workingHours?: string;
    copyright?: string;
    social: {
        facebook: string;
        linkedin?: string;
        youtube?: string;
        zalo: string;
        tiktok?: string;
        instagram?: string;
    };
    bankAccount?: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
        qrCode?: string;
    };
}

const SITE_CONFIG_KEY = "site_config";

export const defaultSiteConfig: SiteConfig = {
    name: defaultContentConfig.name,
    description: defaultContentConfig.description,
    phone: defaultContentConfig.phone,
    email: defaultContentConfig.email,
    address: defaultContentConfig.address,
    workingHours: "8:00 - 22:00 (Thứ 2 - Chủ Nhật)",
    copyright: "© 2025 LECHSHOP. All rights reserved.",
    social: {
        facebook: defaultContentConfig.social.facebook,
        linkedin: defaultContentConfig.social.linkedin,
        youtube: defaultContentConfig.social.youtube,
        zalo: defaultContentConfig.social.zalo,
    },
    bankAccount: {
        bankName: "MB Bank",
        accountNumber: "0868127491",
        accountHolder: "LECHSHOP",
    }
};

export function getSiteConfig(): SiteConfig {
    if (typeof window === "undefined") return defaultSiteConfig;

    try {
        const stored = localStorage.getItem(SITE_CONFIG_KEY);
        if (stored) {
            return {
                ...defaultSiteConfig,
                ...JSON.parse(stored),
                social: { ...defaultSiteConfig.social, ...(JSON.parse(stored).social || {}) },
                bankAccount: { ...defaultSiteConfig.bankAccount, ...(JSON.parse(stored).bankAccount || {}) },
            };
        }
    } catch (e) {
        console.error("Failed to load site config", e);
    }
    return defaultSiteConfig;
}

export function saveSiteConfig(config: SiteConfig) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(config));
        // Broadcast change event if needed
        window.dispatchEvent(new Event("site-config-changed"));
    } catch (e) {
        console.error("Failed to save site config", e);
    }
}
