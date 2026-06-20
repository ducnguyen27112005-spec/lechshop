import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Website Traffic Services into Database...");

    // Find or create Website Traffic category
    let category = await prisma.socialCategory.findFirst({
        where: { name: { contains: "Website" } }
    });

    if (!category) {
        console.log("Website Traffic category not found, creating it with slug 'website-traffic'...");
        category = await prisma.socialCategory.create({
            data: {
                name: "Website Traffic",
                slug: "website-traffic",
                sortOrder: 8,
                iconKey: "globe",
            }
        });
    } else {
        console.log(`Found Website Traffic category: ${category.name} (Slug: ${category.slug})`);
        if (category.slug !== 'website-traffic') {
            category = await prisma.socialCategory.update({
                where: { id: category.id },
                data: { slug: "website-traffic" }
            });
            console.log("Updated category slug to 'website-traffic'");
        }
    }

    const services = [
        { title: "Tăng Truy Cập Website Nhiều Nguồn", slug: "traffic-multi-source", price: 5, unit: "view", min: 1000, max: 1000000, desc: "Tăng truy cập website đa nguồn: Direct, Social, Search" },
        { title: "Tăng Truy Cập Website Iphone 14", slug: "traffic-iphone14", price: 15, unit: "view", min: 1000, max: 100000, desc: "Tăng truy cập website từ user agent Iphone 14" }
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
                coverImageUrl: `/images/website-traffic-service.jpg`,
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

    console.log("Website Traffic Seeding Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
