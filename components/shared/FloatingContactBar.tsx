"use client";

import { useSiteConfig } from "@/hooks/use-site-config";
import { useEffect, useState } from "react";

export default function FloatingContactBar() {
    const config = useSiteConfig();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed right-4 bottom-8 z-50 flex flex-col gap-6">
            {/* Messenger Button */}
            <a
                href={config.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-blue-500 text-white shadow-xl transition-transform hover:scale-110 animate-wiggle"
            >
                {/* Halo Ring */}
                <span className="absolute -inset-3 bg-blue-500/30 rounded-full animate-ring-pulse -z-10"></span>
                <span className="absolute -inset-1 bg-blue-500/50 rounded-full -z-10"></span>

                {/* Messenger Icon SVG */}
                <svg viewBox="0 0 28 28" fill="currentColor" className="w-5 h-5 relative z-10">
                    <path d="M14 0C6.268 0 0 5.96 0 13.314c0 4.192 2.056 7.857 5.297 10.33v5.103c0 .548.625.864 1.077.545l4.37-3.088c1.05.29 2.164.446 3.32.446 7.732 0 14-5.96 14-13.314C28.064 5.96 21.797 0 14 0zm1.886 17.53l-3.32-3.535-6.484 3.535 7.125-7.568 3.385 3.535 6.42-3.535-7.126 7.568z" />
                </svg>
            </a>

            {/* Zalo Button */}
            <a
                href={config.social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-[#0068FF] text-white shadow-xl transition-transform hover:scale-110 animate-wiggle"
                style={{ animationDelay: "0.2s" }}
            >
                {/* Halo Ring */}
                <span className="absolute -inset-3 bg-[#0068FF]/30 rounded-full animate-ring-pulse -z-10" style={{ animationDelay: "0.2s" }}></span>
                <span className="absolute -inset-1 bg-[#0068FF]/50 rounded-full -z-10"></span>

                {/* Zalo Icon Text */}
                <div className="font-black text-[10px] uppercase leading-none relative z-10 flex flex-col items-center">
                    <span className="font-bold tracking-tighter text-white">Zalo</span>
                </div>
            </a>

            {/* Phone Button */}
            <a
                href={`tel:${config.phone}`}
                className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-red-600 text-white shadow-xl transition-transform hover:scale-110 animate-wiggle"
                style={{ animationDelay: "0.4s" }}
            >
                {/* Halo Ring */}
                <span className="absolute -inset-3 bg-red-600/30 rounded-full animate-ring-pulse -z-10" style={{ animationDelay: "0.4s" }}></span>
                <span className="absolute -inset-1 bg-red-600/50 rounded-full -z-10"></span>

                {/* Phone Icon SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 relative z-10">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.49-5.15-3.8-6.62-6.63l1.97-1.57c.23-.29.3-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3.28 3 3.93 3 4.75c0 10.36 8.35 18.72 18.75 18.75.82 0 1.47-.65 1.47-1.19v-3.92c-.01-.55-.46-1.01-1.01-1.01h-.2z" />
                </svg>
            </a>
        </div>
    );
}
