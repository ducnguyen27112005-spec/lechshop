import { products } from "@/content/products";
import Container from "../shared/Container";
import SectionHeading from "../shared/SectionHeading";
import { routes } from "@/lib/routes";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function FeaturedProducts() {
    return (
        <section className="py-16 bg-gray-50">
            <Container>
                <SectionHeading
                    title="Sản phẩm nổi bật"
                    subtitle="Dịch vụ chất lượng cao, uy tín, được khách hàng tin tưởng"
                    centered
                    className="mb-12"
                />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <Link
                            href={`${routes.products}/${product.slug}`}
                            key={product.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100 relative block"
                        >

                            {/* Image Section */}
                            <div className="aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="p-3">
                                {/* Title */}
                                <h3 className="font-bold text-gray-900 text-sm mb-4 line-clamp-1">
                                    {product.name}
                                </h3>

                                {/* Price & Actions */}
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-base font-bold text-red-700 leading-none mb-1">
                                            {product.pricing[0].price}
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            {Math.floor(Math.random() * 500) + 100} đã bán
                                        </p>
                                    </div>

                                    {/* Add to Cart Button - Visual only since whole card is link */}
                                    <div className="bg-red-700 hover:bg-red-800 text-white rounded-full p-2 shadow-md transition-colors">
                                        <ShoppingCart className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
