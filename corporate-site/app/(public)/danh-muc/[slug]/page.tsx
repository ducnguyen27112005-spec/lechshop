import { products, socialServices } from "@/content/products";
import Container from "@/components/shared/Container";
import { routes } from "@/lib/routes";
import { Lock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryProductGrid from "@/components/category/CategoryProductGrid";
import { categoryMap } from "@/lib/categories";

// Define category mapping with rich content


interface PageProps {
    params: Promise<{
        slug: string;
    }>
}

export default async function CategoryPage(props: PageProps) {
    const params = await props.params;
    const category = categoryMap[params.slug];

    if (!category) {
        return notFound();
    }

    // Normalize social services to product shape
    const normalizedSocialServices = socialServices.map(s => ({
        id: s.id,
        // Since these don't have a product detail page, we might want to link to /lien-he
        // But the loop below constructs a link. We will handle the link href in the render loop.
        slug: s.ctaLink.startsWith("/") ? s.ctaLink.substring(1) : s.ctaLink,
        name: s.title,
        description: s.bullets.join(", "),
        image: s.image || "",
        pricing: [],
        isSocial: true,
        ctaLink: s.ctaLink
    }));

    // Merge all products
    const allProducts = [...products, ...normalizedSocialServices];

    // Filter products
    const categoryProducts = allProducts.filter(p => category.productIds.includes(p.id));

    // Helper to extract numeric price and calculate fake discount for display
    const getPricingDisplay = (product: any) => {
        if (product.isSocial) {
            return { price: "Liên hệ", discount: 0 };
        }
        if (!product.pricing || product.pricing.length === 0) return { price: "Liên hệ", discount: 0 };

        const priceStr = product.pricing[0].price;

        let discount = 30;
        if (product.id.includes("netflix")) discount = 85;
        if (product.id.includes("youtube")) discount = 92;
        if (product.id.includes("spotify")) discount = 54;
        if (product.id.includes("chatgpt")) discount = 45;

        return { price: priceStr, discount };
    };

    return (
        <section className="py-12 bg-gray-50 min-h-screen">
            <Container>
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {category.title}
                    </h1>
                    {category.description && (
                        <p className="text-gray-500 text-sm max-w-3xl">
                            {category.description}
                        </p>
                    )}
                </div>

                <CategoryProductGrid
                    products={categoryProducts}
                    categorySlug={params.slug}
                />
            </Container>
        </section>
    );
}
