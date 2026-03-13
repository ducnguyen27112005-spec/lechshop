import prisma from "@/lib/db";

// Types matching the existing ServiceData/ServiceServer interfaces
export interface ServiceServer {
    id: string;
    name: string;
    price: number;
    min: number;
    max: number;
    description?: string;
    status: "active" | "maintenance" | "full";
    code?: string;
}

export interface ServiceData {
    id: string;
    name: string;
    category: string;
    slug: string;
    description: string;
    servers: ServiceServer[];
}

export interface ServiceCategoryData {
    name: string;
    icon: string;
    slug: string;
    services: string[]; // slugs
}

/**
 * Get all service categories with their service slugs (for sidebar)
 */
export async function getServiceCategories(): Promise<ServiceCategoryData[]> {
    const categories = await prisma.socialCategory.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
            services: {
                where: { isActive: true },
                orderBy: { sortOrder: "asc" },
                select: { slug: true }
            }
        }
    });

    return categories.map(cat => ({
        name: cat.name,
        icon: cat.iconKey || "FaTiktok",
        slug: cat.slug,
        services: cat.services.map(s => s.slug)
    }));
}

/**
 * Get all services as a config map (keyed by slug) for backward compatibility
 */
export async function getServiceConfigMap(): Promise<Record<string, ServiceData>> {
    const services = await prisma.socialService.findMany({
        where: { isActive: true },
        include: {
            category: true,
            plans: {
                where: { isActive: true },
                orderBy: { pricePerUnit: "asc" }
            }
        }
    });

    const map: Record<string, ServiceData> = {};

    for (const svc of services) {
        map[svc.slug] = {
            id: svc.slug,
            name: svc.title,
            category: svc.category.name,
            slug: svc.slug,
            description: svc.shortDescription || "",
            servers: svc.plans.map((plan, idx) => ({
                id: `sv${idx + 1}`,
                name: plan.name,
                price: plan.pricePerUnit,
                min: plan.min,
                max: plan.max,
                description: plan.description || undefined,
                status: "active" as const,
                code: plan.code
            }))
        };
    }

    return map;
}

/**
 * Get a single service by slug
 */
export async function getServiceBySlug(slug: string): Promise<ServiceData | null> {
    const svc = await prisma.socialService.findUnique({
        where: { slug },
        include: {
            category: true,
            plans: {
                where: { isActive: true },
                orderBy: { pricePerUnit: "asc" }
            }
        }
    });

    if (!svc) return null;

    return {
        id: svc.slug,
        name: svc.title,
        category: svc.category.name,
        slug: svc.slug,
        description: svc.shortDescription || "",
        servers: svc.plans.map((plan, idx) => ({
            id: `sv${idx + 1}`,
            name: plan.name,
            price: plan.pricePerUnit,
            min: plan.min,
            max: plan.max,
            description: plan.description || undefined,
            status: "active" as const,
            code: plan.code
        }))
    };
}
