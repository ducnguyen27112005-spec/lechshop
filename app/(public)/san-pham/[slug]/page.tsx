import { redirect } from "next/navigation";
import ProductDetailClientLoader from "@/components/product/ProductDetailClientLoader";
import { getAllSocialCategories, getSocialCategoryBySlug, getSocialServiceBySlug } from "@/lib/data";
import { SocialServiceLayout } from "@/components/services/social/SocialServiceLayout";
import { SocialServiceDetail } from "@/components/services/social/SocialServiceDetail";
import { SocialPlatformView } from "@/components/services/social/SocialPlatformView";

// Always fetch fresh data from DB (no caching)
export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;

    // 1. Try to fetch as Social Service
    const socialService = await getSocialServiceBySlug(slug);

    // 2. Try to fetch as Social Category (Platform)
    const socialCategory = await getSocialCategoryBySlug(slug);

    if (socialService) {
        const allCategories = await getAllSocialCategories();
        return (
            <SocialServiceLayout categories={allCategories}>
                <SocialServiceDetail service={socialService} />
            </SocialServiceLayout>
        );
    }

    if (socialCategory) {
        // Redirect to the first service if available
        if (socialCategory.services && socialCategory.services.length > 0) {
            const firstService = socialCategory.services[0];
            redirect(`/san-pham/${firstService.slug}`);
        }

        // Fallback (though ideally shouldn't be reached if data is correct)
        const allCategories = await getAllSocialCategories();
        return (
            <SocialServiceLayout categories={allCategories}>
                <SocialPlatformView category={socialCategory} />
            </SocialServiceLayout>
        );
    }

    // 3. Product Config → always use client loader to reflect admin changes from localStorage
    return <ProductDetailClientLoader slug={slug} />;
}
