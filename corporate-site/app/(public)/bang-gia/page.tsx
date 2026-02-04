import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/shared/Card";
import { products } from "@/content/products";
import ButtonLink from "@/components/shared/ButtonLink";
import { routes } from "@/lib/routes";

export default function PricingPage() {
    return (
        <div className="py-16">
            <Container>
                <SectionHeading
                    title="Bảng giá dịch vụ"
                    subtitle="Chọn gói phù hợp với nhu cầu của bạn"
                    centered
                    className="mb-12"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {products.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                                <p className="text-blue-100">{product.shortDesc}</p>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4 mb-6">
                                    {product.pricing.map((plan, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <span className="font-medium text-gray-900">
                                                {plan.duration}
                                            </span>
                                            <span className="text-xl font-bold text-blue-600">
                                                {plan.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <ButtonLink
                                    href={`${routes.products}/${product.slug}`}
                                    className="w-full text-center"
                                >
                                    Chi tiết sản phẩm
                                </ButtonLink>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        * Giá trên đã bao gồm VAT. Liên hệ chúng tôi để được tư vấn chi tiết.
                    </p>
                </div>
            </Container>
        </div>
    );
}
