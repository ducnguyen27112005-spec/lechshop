import prisma from "./db";
import { PrismaClient } from "@/generated/client"; // Ensure types are correct if used explicitly

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

// Social Services Data Fetching (from database)
export async function getSocialCategoryBySlug(slug: string) {
    try {
        const category = await prisma.socialCategory.findFirst({
            where: { slug, isActive: true },
            include: {
                services: {
                    where: { isActive: true },
                    orderBy: { sortOrder: "asc" },
                    select: { id: true, title: true, slug: true, shortDescription: true, coverImageUrl: true }
                }
            }
        });
        if (!category) return null;
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            iconKey: category.iconKey,
            services: category.services
        };
    } catch (error) {
        console.error("Error fetching social category:", error);
        return null;
    }
}

export async function getSocialServiceBySlug(slug: string) {
    try {
        const service = await prisma.socialService.findUnique({
            where: { slug },
            include: {
                category: { select: { name: true, slug: true } },
                plans: {
                    orderBy: { createdAt: "asc" }
                }
            }
        });
        if (!service) return null;
        return {
            id: service.id,
            title: service.title,
            slug: service.slug,
            category: {
                name: service.category.name,
                slug: service.category.slug
            },
            targetType: service.targetType,
            unitLabel: service.unitLabel,
            coverImageUrl: service.coverImageUrl,
            plans: service.plans.map(p => ({
                id: p.id,
                code: p.code,
                name: p.name,
                pricePerUnit: p.pricePerUnit,
                currency: p.currency,
                min: p.min,
                max: p.max,
                description: p.description,
                tags: p.tags,
                isActive: p.isActive
            }))
        };
    } catch (error) {
        console.error("Error fetching social service:", error);
        return null;
    }
}

export async function getAllSocialCategories() {
    try {
        const categories = await prisma.socialCategory.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            include: {
                services: {
                    where: { isActive: true },
                    orderBy: { sortOrder: "asc" },
                    select: { id: true, title: true, slug: true, shortDescription: true, coverImageUrl: true }
                }
            }
        });
        return categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            iconKey: cat.iconKey,
            services: cat.services
        }));
    } catch (error) {
        console.error("Error fetching all social categories:", error);
        return [];
    }
}

