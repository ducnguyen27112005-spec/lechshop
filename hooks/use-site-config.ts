"use client";

import { useState, useEffect } from "react";
import { SiteConfig, defaultSiteConfig } from "@/lib/site-config";

export function useSiteConfig() {
    const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);

    useEffect(() => {
        let mounted = true;
        fetch('/api/site-settings')
            .then(res => res.json())
            .then(data => {
                if (mounted) {
                    setConfig(data);
                }
            })
            .catch(() => {});

        // Listen for changes
        const handleConfigChange = () => {
            fetch('/api/site-settings')
                .then(res => res.json())
                .then(data => {
                    if (mounted) setConfig(data);
                });
        };

        window.addEventListener("site-config-changed", handleConfigChange);
        return () => {
            mounted = false;
            window.removeEventListener("site-config-changed", handleConfigChange);
        };
    }, []);

    return config;
}
