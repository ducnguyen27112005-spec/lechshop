"use client";

import Container from "@/components/shared/Container";
import ProductOrderWrapper from "@/components/common/ProductOrderWrapper";
import ProductArticleSection from "@/components/common/ProductArticleSection";
import {
    CheckCircle2,
    Shield,
    Zap,
    Clock,
    Flame,
    BadgeCheck,
} from "lucide-react";
import ProductShortDesc from "@/components/common/ProductShortDesc";
import DynamicPrice from "@/components/common/DynamicPrice";
import Link from "next/link";

export interface ProductData {
    name: string;
    slug: string;
    image: string;
    description: string;
    shortDesc: string;
    features: string[];
    type: "premium" | "social";
    category: string;
    seoTitle?: string;
    seoDescription?: string;
    metaDescription?: string;
    altText?: string;
    badges?: string[];
    originalPrice?: string;
    pricing: { price: string; duration: string }[];
}

interface ProductDetailViewProps {
    productData: ProductData;
}

export default function ProductDetailView({ productData }: ProductDetailViewProps) {
    const seoTitle =
        productData.seoTitle ||
        `Mua Tài Khoản ${productData.name} Chính Hãng – Giá Tốt Nhất 2025`;
    const seoDescription =
        productData.seoDescription ||
        `Nâng cấp tài khoản ${productData.name} chính chủ với giá ưu đãi. Sử dụng ổn định lâu dài, bảo hành trọn đời gói. Kích hoạt nhanh, hỗ trợ kỹ thuật 24/7. Dịch vụ uy tín, đáng tin cậy.`;
    const altText =
        productData.altText ||
        `Tài khoản ${productData.name} chính hãng – giá rẻ uy tín`;
    const badges = productData.badges || ["Uy tín", "Bảo hành"];

    const trustItems = [
        { icon: Shield, label: "Bảo hành 1 đổi 1" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ===== HERO SECTION ===== */}
            <section className="bg-white border-b border-gray-200">
                <Container>
                    <div className="py-8 lg:py-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                            {/* LEFT: Product Image */}
                            <div className="lg:col-span-6">
                                {/* Badges */}
                                <div className="flex items-center gap-2 mb-4">
                                    {badges.map((badge, i) => (
                                        <span
                                            key={i}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${i === 0
                                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/20"
                                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                }`}
                                        >
                                            {i === 0 ? (
                                                <Flame className="h-3.5 w-3.5" />
                                            ) : (
                                                <BadgeCheck className="h-3.5 w-3.5" />
                                            )}
                                            {badge}
                                        </span>
                                    ))}
                                </div>

                                {/* Product Image */}
                                <div className="relative group">
                                    <div className="aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-xl ring-1 ring-gray-200">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={productData.image}
                                            alt={altText}
                                            className="w-full h-full object-cover"
                                            loading="eager"
                                        />
                                    </div>
                                </div>

                                {/* Trust Signals */}
                                <div className="flex flex-wrap gap-3 mt-5">
                                    {trustItems.map((item, i) => (
                                        <Link
                                            href="/chinh-sach-bao-hanh"
                                            key={i}
                                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                                        >
                                            <item.icon className="h-4 w-4 text-blue-600 shrink-0" />
                                            <span className="text-xs text-gray-700 font-medium leading-tight whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT: Product Info & Order */}
                            <div className="lg:col-span-6">
                                {/* Category + Status */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                                        {productData.category}
                                    </span>
                                    <span className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Còn hàng
                                    </span>
                                </div>

                                {/* H1 Title - SEO */}
                                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                                    {seoTitle}
                                </h1>

                                {/* Short Description (Editable) */}
                                <ProductShortDesc
                                    slug={productData.slug}
                                    fallback={productData.shortDesc || seoDescription}
                                    className="leading-relaxed mb-5"
                                />

                                {/* Price Display */}
                                {productData.pricing && productData.pricing.length > 0 && (
                                    <div className="flex items-baseline gap-3 mb-5 p-4 rounded-xl bg-red-50 border border-red-100">
                                        <span className="text-sm text-gray-500">Giá chỉ từ</span>
                                        <DynamicPrice
                                            slug={productData.slug}
                                            fallback={productData.pricing[0].price}
                                            className="text-3xl font-extrabold text-red-600"
                                        />
                                        {productData.originalPrice && (
                                            <span className="text-lg text-gray-400 line-through">
                                                {productData.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Order Section */}
                                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                                    <ProductOrderWrapper
                                        productName={productData.name}
                                        productSlug={productData.slug}
                                        serviceType={productData.type}
                                        imageUrl={productData.image}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ===== PRODUCT INFO TAB ===== */}
            <section className="bg-white mt-3">
                <Container>
                    <div className="border-b border-gray-200 text-center">
                        <button className="px-6 py-4 text-blue-600 font-bold border-b-2 border-blue-600 text-sm uppercase tracking-wider">
                            Thông tin sản phẩm
                        </button>
                    </div>
                </Container>
            </section>

            {/* ===== BENEFITS SECTION ===== */}
            <section className="py-10">
                <Container>
                    <div className="max-w-4xl mx-auto space-y-10">
                        {/* Product Article (HTML content from admin) */}
                        <ProductArticleSection
                            productSlug={productData.slug}
                            productName={productData.name}
                            fallbackContent={`
                                <h2>Giới thiệu ${productData.name}</h2>
                                <p>${productData.description}</p>
                                <h3>Tính năng nổi bật</h3>
                                <ul>
                                    ${productData.features?.map(f => `<li>${f}</li>`).join('')}
                                </ul>
                                <h3>Cam kết dịch vụ</h3>
                                <ul>
                                    <li>Bảo hành 1-1 trong suốt thời gian sử dụng</li>
                                    <li>Hỗ trợ kỹ thuật 24/7</li>
                                    <li>Giá cả minh bạch, không phát sinh chi phí</li>
                                </ul>
                            `}
                        />
                    </div>
                </Container>
            </section>
        </div>
    );
}
