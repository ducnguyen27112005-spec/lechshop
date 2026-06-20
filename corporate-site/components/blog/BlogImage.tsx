"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface BlogImageProps extends Omit<ImageProps, "onError"> {
    fallbackSrc?: string;
}

export default function BlogImage({
    src,
    alt,
    className,
    fallbackSrc = "/images/blog-fallback.jpg",
    ...props
}: BlogImageProps) {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // If no src is provided at all
    if (!src && !error) {
        return (
            <div className={`w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2 ${className}`}>
                <ImageIcon className="h-8 w-8 opacity-20" />
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-30">No Image</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image
                src={error ? fallbackSrc : (src || fallbackSrc)}
                alt={alt}
                className={`object-cover transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setIsLoading(false)}
                onError={() => setError(true)}
                loading="lazy"
                {...props}
            />
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </div>
    );
}
