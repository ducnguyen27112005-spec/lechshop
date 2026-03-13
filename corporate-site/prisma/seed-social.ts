import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Social Services...");

    // 1. Create Categories
    const categories = [
        {
            name: "TikTok Global",
            slug: "tiktok-services", // Matches legacy slug
            sortOrder: 1,
            iconKey: "tiktok",
            services: [
                { title: "Tăng Follow TikTok", slug: "tiktok-followers", price: 25, unit: "follow" },
                { title: "Tăng View Video", slug: "tiktok-views", price: 10, unit: "view" },
                { title: "Tăng Tim Video", slug: "tiktok-likes", price: 15, unit: "like" },
            ]
        },
        {
            name: "Facebook",
            slug: "facebook-services",
            sortOrder: 2,
            iconKey: "facebook",
            services: [
                { title: "Tăng Follow Facebook", slug: "facebook-followers", price: 30, unit: "follow" },
                { title: "Tăng Like Page", slug: "facebook-likes", price: 35, unit: "like" },
            ]
        },
        {
            name: "Instagram",
            slug: "instagram-services",
            sortOrder: 3,
            iconKey: "instagram",
            services: [
                { title: "Tăng Follow Instagram", slug: "instagram-followers", price: 28, unit: "follow" },
            ]
        },
        {
            name: "YouTube",
            slug: "youtube-services",
            sortOrder: 4,
            iconKey: "youtube",
            services: [
                { title: "Tăng Subscribe Youtube", slug: "youtube-subscribers", price: 50, unit: "sub" },
            ]
        }
    ];

    for (const cat of categories) {
        const category = await prisma.socialCategory.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                sortOrder: cat.sortOrder,
                iconKey: cat.iconKey,
            }
        });

        console.log(`Created category: ${category.name}`);

        for (const svc of cat.services) {
            const service = await prisma.socialService.upsert({
                where: { slug: svc.slug },
                update: {},
                create: {
                    categoryId: category.id,
                    title: svc.title,
                    slug: svc.slug,
                    targetType: "uid_or_link",
                    unitLabel: svc.unit,
                    coverImageUrl: `/images/${cat.iconKey}-service.jpg`, // Placeholder
                    plans: {
                        create: [
                            {
                                code: `${svc.slug}-fast`,
                                name: "Gói Nhanh",
                                pricePerUnit: svc.price,
                                min: 100,
                                max: 10000,
                                description: "Lên đơn ngay lập tức, tốc độ ổn định.",
                                isActive: true
                            },
                            {
                                code: `${svc.slug}-slow`,
                                name: "Gói Từ Từ",
                                pricePerUnit: svc.price * 0.8,
                                min: 100,
                                max: 5000,
                                description: "Tăng tự nhiên, an toàn cho tài khoản.",
                                isActive: true
                            }
                        ]
                    }
                }
            });
            console.log(`  - Created service: ${service.title}`);
        }
    }
    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
