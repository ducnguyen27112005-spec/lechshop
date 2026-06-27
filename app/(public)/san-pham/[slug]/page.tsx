import { redirect } from "next/navigation";
import ProductDetailClientLoader from "@/components/product/ProductDetailClientLoader";
import { getAllSocialCategories, getSocialCategoryBySlug, getSocialServiceBySlug } from "@/lib/data";
import { SocialServiceLayout } from "@/components/services/social/SocialServiceLayout";
import { SocialServiceDetail } from "@/components/services/social/SocialServiceDetail";
import { SocialPlatformView } from "@/components/services/social/SocialPlatformView";
import { services as localServicesData } from "@/data/services";
import { readMultipliersFromDisk } from "@/lib/price-multipliers-storage";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

function getPlatformMap(localSlug: string) {
    if (localSlug === "tiktok") return "tiktok";
    if (localSlug === "facebook") return "facebook";
    if (localSlug === "instagram") return "instagram";
    if (localSlug === "youtube") return "youtube";
    if (localSlug === "threads") return "threads";
    if (localSlug === "shopee") return "shopee";
    if (localSlug === "spotify") return "spotify";
    if (localSlug === "twitter") return "twitter";
    if (localSlug === "google-maps") return "googe maps"; // Matches API typo
    if (localSlug === "website-traffic") return "website traffic";
    return localSlug;
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
        .replace(/[èéẹẻẽêềếệểễ]/g, "e")
        .replace(/[ìíịỉĩ]/g, "i")
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
        .replace(/[ùúụủũưừứựửữ]/g, "u")
        .replace(/[ỳýỵỷỹ]/g, "y")
        .replace(/đ/g, "d")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function getApiSocialData() {
    try {
        const apiKey = process.env.THATIM_API_KEY || "OhIyzlL01GrKyyKzHBMsiXtgNbCvgt";
        const res = await fetch("https://thatim.vn/api/v2", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `key=${apiKey}&action=services`,
            next: { revalidate: 60 } // cache
        });
        const apiServices = await res.json();
        
        if (!Array.isArray(apiServices)) return [];

        return localServicesData.map(localCat => {
            const mappedPlatform = getPlatformMap(localCat.slug);
            const platformServices = apiServices.filter((s: any) => 
                s.platform && s.platform.toLowerCase().includes(mappedPlatform)
            );

            // Group by category (e.g. "Tăng Lượt Xem Video")
            const categoriesMap: Record<string, any[]> = {};
            platformServices.forEach((s: any) => {
                let apiCategory = s.category || "Dịch vụ khác";

                // Map specific English categories to Vietnamese to match screenshot
                if (apiCategory === 'Twitter Retweet ♻️') apiCategory = 'Tăng Retweet Twitter';
                if (apiCategory === 'Twitter Comments' || apiCategory === 'Twitter Comment') apiCategory = 'Tăng Comment Twitter';
                if (apiCategory === 'Twitter Likes ♻️') apiCategory = 'Tăng Like Twitter';
                if (apiCategory === 'Twitter Followers') apiCategory = 'Tăng Theo Dõi Twitter';
                if (apiCategory === 'Twitter Views') apiCategory = 'Tăng Lượt Xem Video';
                if (apiCategory === 'Twitter Impressions') apiCategory = 'Tăng Lượt Tiếp Cận';

                if (apiCategory === 'Spotify Monthly Listeners') apiCategory = 'Tăng Người Nghe Hàng Tháng Nghệ Sĩ';

                // Bỏ qua các danh mục gốc tiếng Anh của server (vd: TikTok Video Views)
                if (apiCategory.toLowerCase().startsWith(mappedPlatform.toLowerCase())) return;

                // Ẩn "Tăng Lượt Xem Video" của Twitter theo yêu cầu để giống hệt menu gốc
                if (mappedPlatform === 'twitter' && apiCategory === 'Tăng Lượt Xem Video') return;

                if (!categoriesMap[apiCategory]) categoriesMap[apiCategory] = [];
                categoriesMap[apiCategory].push(s);
            });

            let groupedServices = Object.keys(categoriesMap).map((catName, index) => {
                const servicesInCategory = categoriesMap[catName];
                let generatedSlug = slugify(`${localCat.slug}-${catName}`);
                
                // Map generated slugs to existing local DB slugs for compatibility
                if (mappedPlatform === 'twitter') {
                    if (catName === 'Tăng Lượt Tiếp Cận') generatedSlug = 'twitter-impression';
                    else if (catName === 'Tăng Like Twitter') generatedSlug = 'twitter-like';
                    else if (catName === 'Tăng Theo Dõi Twitter') generatedSlug = 'twitter-follow';
                    else if (catName === 'Tăng Comment Twitter') generatedSlug = 'twitter-comment';
                    else if (catName === 'Tăng Retweet Twitter') generatedSlug = 'twitter-retweet';
                    else if (catName === 'Tăng Lượt Xem Video') generatedSlug = 'twitter-view';
                }

                return {
                    id: `cat_${localCat.slug}_${index}`,
                    title: catName,
                    slug: generatedSlug,
                    shortDescription: `${servicesInCategory.length} máy chủ hoạt động`,
                    coverImageUrl: localCat.image || null,
                    apiRawList: servicesInCategory
                };
            });

            let sortOrder: string[] = [];

            if (mappedPlatform === 'facebook') {
                sortOrder = [
                    "tăng like bài viết",
                    "mua gói like tháng",
                    "tăng người theo dõi",
                    "tăng like fanpage",
                    "tăng mắt livestream",
                    "tăng lượt chia sẻ",
                    "tăng member nhóm",
                    "tăng đánh giá page",
                    "facebook page review",
                    "tăng đánh giá / khuyên dùng",
                    "tăng like bình luận",
                    "tăng view video/reel",
                    "facebook views",
                    "tăng bình luận",
                    "tăng view story",
                    "facebook story",
                    "tăng mắt live vip + ổn định"
                ];
            } else if (mappedPlatform === 'instagram') {
                sortOrder = [
                    "tăng tim bài viết",
                    "tăng người theo dõi",
                    "tăng bình luận bài",
                    "tăng member kênh",
                    "mua gói like tháng",
                    "tăng lượt xem video",
                    "tăng mắt livestream",
                    "instagram likes",
                    "instagram followers",
                    "instagram comments",
                    "instagram video views",
                    "instagram story views",
                    "instagram save",
                    "instagram channel member [ targeted ]"
                ];
            } else if (mappedPlatform === 'tiktok') {
                sortOrder = [
                    "tăng lượt xem video",
                    "tăng thả tim video",
                    "tăng người theo dõi",
                    "tăng mắt livestream",
                    "tăng lượt lưu video",
                    "tăng chia sẻ video",
                    "tăng bình luận video",
                    "seeding livestream",
                    "mua gói tim tháng"
                ];
            } else if (mappedPlatform === 'twitter') {
                sortOrder = [
                    "tăng like twitter",
                    "tăng theo dõi twitter",
                    "tăng comment twitter",
                    "tăng retweet twitter",
                    "tăng lượt tiếp cận",
                    "tăng lượt xem video"
                ];
            } else if (mappedPlatform === 'spotify') {
                sortOrder = [
                    "tăng lượt nghe bài hát",
                    "tăng người nghe hàng tháng nghệ sĩ",
                    "tăng người theo dõi"
                ];
            } else {
                // Unified fallback for others
                sortOrder = [
                    "tăng lượt xem video",
                    "tăng thả tim video",
                    "tăng tim bài viết",
                    "tăng like twitter",
                    "tăng lượt thích sản phẩm",
                    "tăng người theo dõi",
                    "tăng theo dõi gian hàng",
                    "tăng đăng ký kênh",
                    "tăng theo dõi twitter",
                    "tăng member kênh",
                    "tăng mắt livestream",
                    "tăng mắt live vip + ổn định",
                    "tăng 4000h xem",
                    "tăng lượt tiếp cận",
                    "tăng lượt lưu video",
                    "tăng chia sẻ video",
                    "tăng bình luận video",
                    "tăng bình luận bài",
                    "tăng like bình luận",
                    "seeding livestream",
                    "tăng đánh giá / khuyên dùng",
                    "tăng đánh giá google maps",
                    "mua gói tim tháng"
                ];
            }
            
            if (mappedPlatform === 'twitter') {
                const hasComment = groupedServices.find(g => g.title === 'Tăng Comment Twitter');
                if (!hasComment) {
                    groupedServices.push({
                        id: 'twitter-comment-fallback',
                        title: 'Tăng Comment Twitter',
                        slug: 'twitter-comment',
                        shortDescription: 'Đang hoạt động',
                        coverImageUrl: localCat.image || null,
                        apiRawList: []
                    });
                }
            }

            groupedServices.sort((a, b) => {
                const idxA = sortOrder.indexOf(a.title.toLowerCase());
                const idxB = sortOrder.indexOf(b.title.toLowerCase());
                if (idxA === -1 && idxB === -1) return a.title.localeCompare(b.title);
                if (idxA === -1) return 1;
                if (idxB === -1) return -1;
                return idxA - idxB;
            });

            return {
                id: localCat.slug,
                name: localCat.title,
                slug: localCat.slug,
                iconKey: null,
                services: groupedServices
            };
        });
    } catch (e) {
        console.error("Error fetching social API:", e);
        return [];
    }
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;

    const allApiCategories = await getApiSocialData();
    const multipliers = await readMultipliersFromDisk();

    // 1. Kiểm tra xem có phải là 1 nhóm dịch vụ cụ thể (vd: "Tăng lượt xem Tiktok") không?
    let foundPlatform = null;
    let foundCategoryService = null;

    for (const platform of allApiCategories) {
        const s = platform.services.find(s => s.slug === slug);
        if (s) {
            foundPlatform = platform;
            foundCategoryService = s;
            break;
        }
    }

    if (foundCategoryService && foundPlatform && foundCategoryService.apiRawList.length > 0) {
        // Use platform slug directly as key for categoryModifiers (simpler, no DB needed)
        const platformSlug = foundPlatform.slug as string;
        let pct = multipliers.categoryModifiers[platformSlug];
        if (pct === undefined) {
            pct = multipliers.thatimGlobalPercent ?? 0;
        }
        const multiplierFactor = 1 + (pct / 100);

        const allPlans = foundCategoryService.apiRawList.map((apiService: any) => {
            const rate = parseFloat(apiService.rate) || 0;
            const pricePerUnit = ((rate * 26000) / 1000) * multiplierFactor;
            return {
                id: apiService.service.toString(),
                code: apiService.service.toString(),
                name: apiService.name,
                pricePerUnit: Number(pricePerUnit.toFixed(2)),
                currency: "VND",
                min: parseInt(apiService.min) || 100,
                max: parseInt(apiService.max) || 10000,
                description: apiService.description || null,
                tags: apiService.type || null,
                isActive: true
            };
        });

        // Chỉ giữ 1 gói rẻ nhất (rate thấp nhất) để tránh trùng lặp
        const cheapest = allPlans.reduce((min: any, p: any) => 
            p.pricePerUnit < min.pricePerUnit ? p : min, allPlans[0]);
        const plans = cheapest ? [cheapest] : allPlans;

        let dynamicUnit = "lượt";
        if (foundCategoryService.title.toLowerCase().includes("tiếp cận") || foundCategoryService.title.toLowerCase().includes("impression")) {
            dynamicUnit = "Impressions";
        } else if (foundCategoryService.title.toLowerCase().includes("like")) {
            dynamicUnit = "like";
        } else if (foundCategoryService.title.toLowerCase().includes("comment") || foundCategoryService.title.toLowerCase().includes("bình luận")) {
            dynamicUnit = "comment";
        } else if (foundCategoryService.title.toLowerCase().includes("retweet")) {
            dynamicUnit = "retweet";
        } else if (foundCategoryService.title.toLowerCase().includes("theo dõi") || foundCategoryService.title.toLowerCase().includes("follow")) {
            dynamicUnit = "follow";
        }

        const mappedDetailService = {
            id: foundCategoryService.id,
            title: foundCategoryService.title,
            slug: slug,
            category: { name: foundPlatform.name, slug: foundPlatform.slug },
            targetType: "link",
            unitLabel: dynamicUnit,
            coverImageUrl: foundCategoryService.coverImageUrl,
            plans: plans
        };

        return (
            <SocialServiceLayout categories={allApiCategories}>
                <SocialServiceDetail service={mappedDetailService as any} />
            </SocialServiceLayout>
        );
    }

    // 2. Kiểm tra xem có phải là trang nền tảng dịch vụ (vd: "Tiktok") không?
    const foundApiCategory = allApiCategories.find(cat => cat.slug === slug);
    if (foundApiCategory) {
        if (foundApiCategory.services && foundApiCategory.services.length > 0) {
            redirect(`/san-pham/${foundApiCategory.services[0].slug}`);
        }
        
        return (
            <SocialServiceLayout categories={allApiCategories}>
                <SocialPlatformView category={foundApiCategory as any} />
            </SocialServiceLayout>
        );
    }

    // 3. Fallback to Local DB
    const socialService = await getSocialServiceBySlug(slug);
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
        if (socialCategory.services && socialCategory.services.length > 0) {
            redirect(`/san-pham/${socialCategory.services[0].slug}`);
        }

        const allCategories = await getAllSocialCategories();
        return (
            <SocialServiceLayout categories={allCategories}>
                <SocialPlatformView category={socialCategory} />
            </SocialServiceLayout>
        );
    }

    return <ProductDetailClientLoader slug={slug} />;
}
