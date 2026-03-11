import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Twitter Services into Database...");

    // Find or create Twitter category
    let category = await prisma.socialCategory.findFirst({
        where: { name: { contains: "Twitter" } }
    });

    if (!category) {
        console.log("Twitter category not found, creating it with slug 'twitter'...");
        category = await prisma.socialCategory.create({
            data: {
                name: "Twitter",
                slug: "twitter",
                sortOrder: 9,
                iconKey: "twitter",
            }
        });
    } else {
        console.log(`Found Twitter category: ${category.name} (Slug: ${category.slug})`);
        if (category.slug !== 'twitter') {
            category = await prisma.socialCategory.update({
                where: { id: category.id },
                data: { slug: "twitter" }
            });
            console.log("Updated category slug to 'twitter'");
        }
    }

    const services = [
        { title: "Tăng Like Twitter", slug: "twitter-like", price: 15, unit: "like", min: 50, max: 10000, desc: "Tăng Like Twitter an toàn" },
        { title: "Tăng Theo Dõi Twitter", slug: "twitter-follow", price: 30, unit: "follow", min: 50, max: 50000, desc: "Tăng Follow Twitter chuẩn auth" },
        { title: "Tăng Comment Twitter", slug: "twitter-comment", price: 40, unit: "comment", min: 10, max: 1000, desc: "Tăng comment nội dung tùy chọn" },
        { title: "Tăng Retweet Twitter", slug: "twitter-retweet", price: 20, unit: "retweet", min: 50, max: 20000, desc: "Tăng Retweet nhanh chóng" },
        { title: "Tăng Lượt Tiếp Cận", slug: "twitter-impression", price: 5, unit: "lượt", min: 1000, max: 1000000, desc: "Tăng lượt tiếp cận (view) bài viết" }
    ];

    for (const svc of services) {
        const existingService = await prisma.socialService.findFirst({
            where: { slug: svc.slug }
        });

        if (existingService) {
            console.log(`Service '${svc.title}' already exists.`);
            // Update title if needed
            if (existingService.title !== svc.title) {
                await prisma.socialService.update({
                    where: { id: existingService.id },
                    data: { title: svc.title, categoryId: category.id }
                });
                console.log(`  -> Updated existing service title to '${svc.title}'`);
            }
            continue;
        }

        const service = await prisma.socialService.create({
            data: {
                categoryId: category.id,
                title: svc.title,
                slug: svc.slug,
                targetType: "uid_or_link",
                unitLabel: svc.unit,
                coverImageUrl: `/images/twitter-service.jpg`,
                plans: {
                    create: [
                        {
                            code: `${svc.slug}-sv1`,
                            name: "Máy Chủ 1 (Placeholder)",
                            pricePerUnit: svc.price,
                            min: svc.min,
                            max: svc.max,
                            description: svc.desc,
                            isActive: true
                        }
                    ]
                }
            }
        });
        console.log(`  - Created service: ${service.title}`);
    }

    console.log("Twitter Seeding Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
