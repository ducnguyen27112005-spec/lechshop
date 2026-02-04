import { notFound } from "next/navigation";
import { products, premiumProducts, socialServices } from "@/content/products";
import Container from "@/components/shared/Container";
import { siteConfig } from "@/content/site";
import { Check, MessageCircle } from "lucide-react";
import Card from "@/components/shared/Card";
import ProductOrderSection from "@/components/common/ProductOrderSection";
import { getPlansForProduct } from "@/content/productPlans";
import Link from "next/link";

export async function generateStaticParams() {
    const allSlugs = [
        ...products.map((p) => ({ slug: p.slug })),
        ...premiumProducts.map((p) => ({ slug: p.slug })),
        ...socialServices.map((s) => ({ slug: s.id })),
    ];
    return allSlugs;
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const product = products.find((p) => p.slug === slug);
    const premiumProduct = premiumProducts.find((p) => p.slug === slug);
    const socialService = socialServices.find((s) => s.id === slug);

    if (!product && !premiumProduct && !socialService) {
        notFound();
    }

    const productData = product
        ? {
            name: product.name,
            slug: product.slug,
            image: product.image,
            description: product.description,
            features: product.features,
            type: "premium" as const,
            category: "Tài khoản Premium",
        }
        : premiumProduct
            ? {
                name: premiumProduct.title,
                slug: premiumProduct.slug,
                image: premiumProduct.image,
                description: "",
                features: premiumProduct.bullets,
                type: "premium" as const,
                category: "Tài khoản Premium",
            }
            : {
                name: socialService!.title,
                slug: socialService!.id,
                image: socialService!.image || "/images/placeholder.jpg",
                description: "",
                features: socialService!.bullets,
                type: "social" as const,
                category: "Dịch vụ MXH",
            };

    const plans = getPlansForProduct(productData.slug, 0);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Top Section */}
            <div className="bg-white py-8 border-b">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Product Image */}
                        <div className="lg:col-span-5">
                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-lg">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={productData.image}
                                    alt={productData.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Right: Product Info & Order */}
                        <div className="lg:col-span-7">
                            {/* Category Badge */}
                            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md mb-3">
                                {productData.category}
                            </span>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
                                {productData.name}
                            </h1>

                            {/* Description */}
                            <p className="text-gray-600 mb-4">
                                Tài Khoản {productData.name} Chính Chủ Đăng Ký Gmail Của Bạn + Tặng Kèm Canva Pro 1 Năm
                            </p>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check className="h-4 w-4 text-green-600" />
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                    Còn hàng
                                </span>
                            </div>

                            {/* Plan Selection & Order */}
                            <ProductOrderSection
                                productName={productData.name}
                                productSlug={productData.slug}
                                serviceType={productData.type}
                                plans={plans}
                            />
                        </div>
                    </div>
                </Container>
            </div>

            {/* Product Info Tabs */}
            <div className="bg-white mt-4">
                <Container>
                    <div className="border-b">
                        <button className="px-6 py-3 text-blue-600 font-semibold border-b-2 border-blue-600">
                            Thông tin sản phẩm
                        </button>
                    </div>
                </Container>
            </div>

            {/* Product Content Sections */}
            <div className="py-8">
                <Container>
                    <div className="bg-white rounded-xl p-8 shadow-sm space-y-8">
                        {/* Section 1: Benefits */}
                        <section>
                            <h2 className="text-xl font-bold text-blue-800 mb-4">
                                Nâng cấp tài khoản {productData.name} chính chủ – Không quảng cáo, giá rẻ chỉ bằng 1/5 mua trực tiếp
                            </h2>
                            <p className="text-gray-700 mb-4">
                                Chúng tôi cung cấp dịch vụ nâng cấp tài khoản {productData.name} chính chủ với mức <strong>giá rẻ chỉ bằng khoảng 1/5</strong> so với đăng ký trực tiếp từ nhà cung cấp, giúp người dùng tận hưởng trọn vẹn trải nghiệm giải trí cao cấp mà vẫn <strong>tiết kiệm chi phí tối đa</strong>.
                            </p>
                            <p className="text-gray-700">
                                Sau khi nâng cấp, tài khoản Google của bạn sẽ được kích hoạt <strong>{productData.name} bản quyền</strong>, cho phép xem video <strong>không quảng cáo</strong>, phát nhạc nền khi tắt màn hình, tải video xem offline và sử dụng với đầy đủ tính năng cao cấp.
                            </p>
                        </section>

                        {/* Section 2: Why choose us */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Lợi ích khi nâng cấp {productData.name} chính chủ
                            </h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Xem YouTube <strong>không quảng cáo</strong> trên mọi video</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span><strong>Phát video & nhạc</strong> khi tắt màn hình trên điện thoại</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span><strong>Tải video offline</strong>, xem mọi lúc mọi nơi</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Truy cập <strong>YouTube Music Premium</strong> miễn phí</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Hỗ trợ trên <strong>nhiều thiết bị</strong> cùng lúc</span>
                                </li>
                            </ul>
                        </section>

                        {/* Section 3: Why choose our service */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Vì sao nên chọn dịch vụ của chúng tôi?
                            </h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Tài khoản <strong>chính chủ 100%</strong>, sử dụng ổn định</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span><strong>Kích hoạt nhanh</strong>, hoàn tất trong thời gian ngắn</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Không cần cung cấp thông tin nhạy cảm, <strong>đảm bảo bảo mật</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span><strong>Bảo hành trong suốt thời gian sử dụng</strong> theo gói đăng ký</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Hỗ trợ kỹ thuật <strong>24/7</strong>, xử lý nhanh khi có phát sinh</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Quy trình rõ ràng, <strong>uy tín</strong>, phù hợp sử dụng lâu dài</span>
                                </li>
                            </ul>
                            <p className="text-gray-700 mt-4">
                                Chúng tôi luôn ưu tiên <strong>trải nghiệm người dùng</strong>, đảm bảo tài khoản sau khi nâng cấp hoạt động ổn định, không gián đoạn và không ảnh hưởng đến thói quen sử dụng hàng ngày.
                            </p>
                        </section>

                        {/* Section 4: Suitable for */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Phù hợp với nhiều đối tượng người dùng
                            </h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Người xem YouTube thường xuyên, khó chịu vì quảng cáo</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Người nghe nhạc, podcast trên YouTube Music</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Sinh viên, người đi làm muốn <strong>tiết kiệm chi phí</strong> giải trí</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Gia đình sử dụng YouTube trên nhiều thiết bị</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600">•</span>
                                    <span>Người sáng tạo nội dung cần trải nghiệm YouTube không gián đoạn</span>
                                </li>
                            </ul>
                        </section>

                        {/* Section 5: Commitment */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Cam kết dịch vụ
                            </h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Nâng cấp <strong>{productData.name} chính chủ</strong>, đảm bảo an toàn tài khoản</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span><strong>Bảo hành 1-1</strong> trong toàn bộ thời gian của gói</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Hỗ trợ <strong>nhanh chóng và tận tình</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Giá cả <strong>minh bạch</strong>, không phát sinh thêm</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                </Container>
            </div>

        </div>
    );
}
