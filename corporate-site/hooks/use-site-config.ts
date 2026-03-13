"use client";

import { useState, useEffect } from "react";
import { SiteConfig, defaultSiteConfig, getSiteConfig } from "@/lib/site-config";

export function useSiteConfig() {
    const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);

    useEffect(() => {
        // Initial load
        setConfig(getSiteConfig());

        // Listen for changes
        const handleChange = () => {
            setConfig(getSiteConfig());
        };

        window.addEventListener("site-config-changed", handleChange);
        return () => window.removeEventListener("site-config-changed", handleChange);
    }, []);

    return config;
}
