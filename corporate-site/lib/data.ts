import prisma from "./db";

export async function getSiteSettings() {
    try {
        const settings = await prisma.setting.findUnique({
            where: { id: "site-settings" }
        });
        return settings;
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return null;
    }
}

export async function getActiveBanners() {
    try {
        const banners = await prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" }
        });
        return banners;
    } catch (error) {
        console.error("Error fetching banners:", error);
        return [];
    }
}

export async function getPremiumProducts() {
    try {
        const products = await prisma.premiumProduct.findMany({
            where: { isActive: true }
        });
        return products;
    } catch (error) {
        console.error("Error fetching premium products:", error);
        return [];
    }
}

export async function getSocialServices() {
    try {
        const services = await prisma.socialService.findMany({
            where: { isActive: true }
        });
        return services;
    } catch (error) {
        console.error("Error fetching social services:", error);
        return [];
    }
}

export async function getPublishedPosts() {
    try {
        const posts = await prisma.post.findMany({
            where: { status: "PUBLISHED" },
            orderBy: { publishedAt: "desc" }
        });
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getActiveFAQ() {
    try {
        const faqs = await prisma.fAQ.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" }
        });
        return faqs;
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return [];
    }
}
