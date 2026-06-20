"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
    segments: { text: string; className?: string }[];
    typingSpeed?: number; // Duration to type
    deletingSpeed?: number; // Duration to delete
    pauseDuration?: number; // Wait before deleting
}

export default function Typewriter({
    segments,
    typingSpeed = 2000,
    deletingSpeed = 1000,
    pauseDuration = 2000,
}: TypewriterProps) {
    const [status, setStatus] = useState<"typing" | "waiting" | "deleting" | "waiting-start">("waiting-start");

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (status === "waiting-start") {
            // Start typing
            timer = setTimeout(() => setStatus("typing"), 100);
        } else if (status === "typing") {
            // Wait for typing duration then switch to waiting
            timer = setTimeout(() => setStatus("waiting"), typingSpeed);
        } else if (status === "waiting") {
            // Wait for pause duration then switch to deleting
            timer = setTimeout(() => setStatus("deleting"), pauseDuration);
        } else if (status === "deleting") {
            // Wait for deleting duration then switch to waiting-start
            timer = setTimeout(() => setStatus("waiting-start"), deletingSpeed);
        }

        return () => clearTimeout(timer);
    }, [status, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <div className="relative inline-block">
            {/* Ghost content to hold space - add padding right to fix P clipping */}
            <span className="opacity-0 whitespace-nowrap pointer-events-none pr-1">
                {segments.map((segment, index) => (
                    <span key={index} className={segment.className}>
                        {segment.text}
                    </span>
                ))}
            </span>

            {/* Animating container */}
            <div
                className="absolute top-0 left-0 h-full overflow-hidden whitespace-nowrap will-change-[width] pr-1"
                style={{
                    width: status === "typing" || status === "waiting" ? "100%" : "0%",
                    transition: status === "typing"
                        ? `width ${typingSpeed}ms linear`
                        : status === "deleting"
                            ? `width ${deletingSpeed}ms linear`
                            : "none"
                }}
            >
                {segments.map((segment, index) => (
                    <span key={index} className={segment.className}>
                        {segment.text}
                    </span>
                ))}
            </div>
        </div>
    );
}
