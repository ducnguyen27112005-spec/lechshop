"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ButtonLink from "../shared/ButtonLink";
import HeroContactIcons from "./HeroContactIcons";
import { routes } from "@/lib/routes";

const slides = [
    {
        id: 1,
        title: "",
        subtitle: "",
        image: "/images/banner-khai-truong-2026.jpg",
        cta: "Khám phá ngay",
        href: "/#premium",
        isFullImage: true
    },
    {
        id: 2,
        title: "",
        subtitle: "",
        image: "/images/banner-bao-hanh-2026.jpg",
        cta: "Xem chính sách",
        href: "/#warranty",
        isFullImage: true
    },
    {
        id: 3,
        title: "",
        subtitle: "",
        image: "/images/banner-mua-hang-2026.jpg",
        cta: "Hướng dẫn mua hàng",
        href: "/#guide",
        isFullImage: true
    }
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="relative w-full h-full min-h-[250px] md:min-h-[300px] lg:min-h-[350px] rounded-lg overflow-hidden bg-gray-100">
            {/* Slides */}
            <div className="absolute inset-0">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />

                        {/* Shine Effect */}
                        <div className="animate-shine" />

                        {/* Background overlay - only for non-full-image slides */}
                        {!(slide as any).isFullImage && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70 z-10" />
                        )}

                        {/* Content */}
                        <div className="relative z-20 h-full flex items-center">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                                <div className="max-w-2xl text-white">
                                    {(slide.title || slide.subtitle) && (
                                        <>
                                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                                {slide.title}
                                            </h1>
                                            <p className="text-lg md:text-xl mb-6 text-blue-100">
                                                {slide.subtitle}
                                            </p>
                                        </>
                                    )}

                                    {/* Optional CTA button overlay */}
                                    {!(slide as any).isFullImage && slide.cta && (
                                        <ButtonLink
                                            href={slide.href}
                                            variant="primary"
                                            className="bg-white text-blue-600 hover:bg-gray-100"
                                        >
                                            {slide.cta}
                                        </ButtonLink>
                                    )}

                                    {/* Invisible link for full-image slides */}
                                    {(slide as any).isFullImage && (
                                        <ButtonLink
                                            href={slide.href}
                                            className="opacity-0 w-[180px] h-[50px]"
                                        >
                                            {slide.cta}
                                        </ButtonLink>
                                    )}
                                </div>
                            </div>
                        </div>
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

            {/* Hero Contact Icons - REMOVED since it might not overlap well in grid. 
                 If needed, can place it back or move to page layout. 
                 For now, keeping it commented out or removed to match clean reference. 
             */}
        </div>
    );
}
