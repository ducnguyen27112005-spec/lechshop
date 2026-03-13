import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Shopee Services into Database...");

    // Find or create Shopee category
    let category = await prisma.socialCategory.findFirst({
        where: { name: { contains: "Shopee" } }
    });

    if (!category) {
        console.log("Shopee category not found, creating it with slug 'shopee'...");
        category = await prisma.socialCategory.create({
            data: {
                name: "Shopee",
                slug: "shopee",
                sortOrder: 6,
                iconKey: "shopee",
            }
        });
    } else {
        console.log(`Found Shopee category: ${category.name} (Slug: ${category.slug})`);
        if (category.slug !== 'shopee') {
            category = await prisma.socialCategory.update({
                where: { id: category.id },
                data: { slug: "shopee" }
            });
            console.log("Updated category slug to 'shopee'");
        }
    }

    const services = [
        { title: "Tăng Lượt Thích Sản Phẩm", slug: "shopee-like", price: 20, unit: "like", min: 50, max: 10000, desc: "Tăng lượt thích sản phẩm Shopee an toàn" },
        { title: "Tăng Theo Dõi Gian Hàng", slug: "shopee-follow", price: 35, unit: "follow", min: 50, max: 50000, desc: "Tăng Follow Shop chuẩn SEO" },
        { title: "Tăng Người Xem Livestream", slug: "shopee-livestream", price: 40, unit: "mắt", min: 50, max: 5000, desc: "Tăng mắt xem live Shopee duy trì suốt phiên" }
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
                coverImageUrl: `/images/shopee-service.jpg`,
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

    console.log("Shopee Seeding Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
