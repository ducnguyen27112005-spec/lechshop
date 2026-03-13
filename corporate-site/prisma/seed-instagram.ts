import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Instagram Services into Database...");

    // Find the Instagram category. It might be 'instagram' or 'instagram-services'
    let category = await prisma.socialCategory.findFirst({
        where: { name: { contains: "Instagram" } }
    });

    if (!category) {
        console.log("Instagram category not found, creating it with slug 'instagram'...");
        category = await prisma.socialCategory.create({
            data: {
                name: "Instagram",
                slug: "instagram",
                sortOrder: 3,
                iconKey: "instagram",
            }
        });
    } else {
        console.log(`Found Instagram category: ${category.name} (Slug: ${category.slug})`);
        // If slug is 'instagram-services', let's update it to 'instagram' to match the sidebar URL in the screenshot
        if (category.slug === 'instagram-services') {
            category = await prisma.socialCategory.update({
                where: { id: category.id },
                data: { slug: "instagram" }
            });
            console.log("Updated category slug to 'instagram'");
        }
    }

    const services = [
        { title: "Tăng Tim Bài Viết", slug: "instagram-like", price: 5, unit: "like", min: 50, max: 50000, desc: "Tăng Tim Bài Viết Instagram ~ Tốc Độ Nhanh" },
        { title: "Tăng Người Theo Dõi", slug: "instagram-follow", price: 20, unit: "follow", min: 100, max: 100000, desc: "Tăng Người Theo Dõi Instagram uy tín" },
        { title: "Tăng Bình Luận Bài", slug: "instagram-comment", price: 30, unit: "comment", min: 10, max: 5000, desc: "Tăng Bình Luận Bài Viết Instagram" },
        { title: "Tăng Member Kênh", slug: "instagram-member", price: 15, unit: "member", min: 100, max: 50000, desc: "Tăng Member Kênh Instagram" },
        { title: "Mua Gói Like Tháng", slug: "instagram-like-monthly", price: 100, unit: "gói", min: 100, max: 10000, desc: "Gói Likelike bài viết tháng Instagram" },
        { title: "Tăng Lượt Xem Video", slug: "instagram-view", price: 1, unit: "view", min: 100, max: 1000000, desc: "Tăng Lượt Xem Video/Reels Instagram" },
        { title: "Tăng Mắt Livestream", slug: "instagram-livestream", price: 5, unit: "mắt", min: 50, max: 5000, desc: "Tăng Mắt Xem Livestream Instagram" }
    ];

    for (const svc of services) {
        const existingService = await prisma.socialService.findUnique({
            where: { slug: svc.slug }
        });

        if (existingService) {
            console.log(`Service '${svc.title}' already exists.`);
            continue;
        }

        const service = await prisma.socialService.create({
            data: {
                categoryId: category.id,
                title: svc.title,
                slug: svc.slug,
                targetType: "uid_or_link",
                unitLabel: svc.unit,
                coverImageUrl: `/images/instagram-service.jpg`,
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

    console.log("Instagram Seeding Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
