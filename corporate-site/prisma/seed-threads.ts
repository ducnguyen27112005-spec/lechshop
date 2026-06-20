import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Threads Services into Database...");

    // Find or create Threads category
    let category = await prisma.socialCategory.findFirst({
        where: { name: { contains: "Threads" } }
    });

    if (!category) {
        console.log("Threads category not found, creating it with slug 'threads'...");
        category = await prisma.socialCategory.create({
            data: {
                name: "Threads",
                slug: "threads",
                sortOrder: 5,
                iconKey: "threads",
            }
        });
    } else {
        console.log(`Found Threads category: ${category.name} (Slug: ${category.slug})`);
        if (category.slug !== 'threads') {
            category = await prisma.socialCategory.update({
                where: { id: category.id },
                data: { slug: "threads" }
            });
            console.log("Updated category slug to 'threads'");
        }
    }

    const services = [
        { title: "Tăng Like Bài Viết", slug: "threads-like", price: 15, unit: "like", min: 50, max: 10000, desc: "Tăng Like Threads ~ Ổn Định" },
        { title: "Tăng Người Theo Dõi", slug: "threads-follow", price: 25, unit: "follow", min: 50, max: 50000, desc: "Tăng Follow Threads ~ An Toàn" },
        { title: "Tăng Bình Luận", slug: "threads-comment", price: 50, unit: "comment", min: 10, max: 1000, desc: "Tăng Comment Threads ~ Tùy Chỉnh" }
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
                coverImageUrl: `/images/threads-service.jpg`,
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

    console.log("Threads Seeding Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
