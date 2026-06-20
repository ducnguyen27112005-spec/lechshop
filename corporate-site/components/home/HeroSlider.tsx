"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ButtonLink from "../shared/ButtonLink";
import { getBannerConfig, BannerItem } from "@/lib/banner-config";

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<BannerItem[]>([]);

    useEffect(() => {
        const config = getBannerConfig();
        setSlides(config.mainBanners);

        const handleUpdate = () => {
            const updated = getBannerConfig();
            setSlides(updated.mainBanners);
        };
        window.addEventListener("banner-config-updated", handleUpdate);
        return () => window.removeEventListener("banner-config-updated", handleUpdate);
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const isVideo = slides[currentSlide]?.image?.endsWith(".mp4");
        const duration = isVideo ? 6000 : 3000;
        const timer = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, duration);
        return () => clearTimeout(timer);
    }, [currentSlide, slides]);

    const goToSlide = (index: number) => setCurrentSlide(index);
    const goToPrevious = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

    if (slides.length === 0) return null;

    return (
        <div className="relative w-full h-full min-h-[250px] md:min-h-[320px] lg:min-h-[370px] rounded-xl overflow-hidden bg-gray-200 shadow-sm ring-1 ring-black/5">
            {/* Slides */}
            <div className="absolute inset-0">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        {slide.image.endsWith(".mp4") ? (
                            <video
                                className="absolute inset-0 w-full h-full object-cover"
                                src={slide.image}
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            />
                        )}

                        {/* Shine Effect */}
                        <div className="animate-shine" />

                        {/* Clickable link */}
                        {slide.link && (
                            <a
                                href={slide.link}
                                className="absolute inset-0 z-20"
                                aria-label={slide.title || `Banner ${index + 1}`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40"
                aria-label="Next slide"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                            ? "w-6 bg-white"
                            : "w-2 bg-white/50 hover:bg-white/75"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
