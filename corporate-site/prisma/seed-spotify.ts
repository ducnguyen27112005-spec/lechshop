import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Spotify Services into Database...");

    // Find or create Spotify category
    let category = await prisma.socialCategory.findFirst({
        where: { name: { contains: "Spotify" } }
    });

    if (!category) {
        console.log("Spotify category not found, creating it with slug 'spotify'...");
        category = await prisma.socialCategory.create({
            data: {
                name: "Spotify",
                slug: "spotify",
                sortOrder: 7,
                iconKey: "spotify",
            }
        });
    } else {
        console.log(`Found Spotify category: ${category.name} (Slug: ${category.slug})`);
        if (category.slug !== 'spotify') {
            category = await prisma.socialCategory.update({
                where: { id: category.id },
                data: { slug: "spotify" }
            });
            console.log("Updated category slug to 'spotify'");
        }
    }

    const services = [
        { title: "Tăng Lượt Nghe Bài Hát", slug: "spotify-play", price: 50, unit: "play", min: 1000, max: 1000000, desc: "Tăng Play bài hát Spotify an toàn, tốc độ ổn định" },
        { title: "Tăng Người Nghe Hàng Tháng Nghệ Sĩ", slug: "spotify-monthly", price: 60, unit: "lượt", min: 1000, max: 500000, desc: "Tăng người nghe hàng tháng chuẩn chỉnh" },
        { title: "Tăng Người Theo Dõi", slug: "spotify-follow", price: 100, unit: "follow", min: 100, max: 50000, desc: "Tăng Follow tài khoản, podcast hoặc playlist Spotify" }
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
                coverImageUrl: `/images/spotify-service.jpg`,
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

    console.log("Spotify Seeding Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
