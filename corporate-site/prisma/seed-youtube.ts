import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding YouTube Services into Database...");

    let category = await prisma.socialCategory.findFirst({
        where: { name: { contains: "YouTube" } }
    });

    if (!category) {
        console.log("YouTube category not found, creating it with slug 'youtube'...");
        category = await prisma.socialCategory.create({
            data: {
                name: "YouTube",
                slug: "youtube",
                sortOrder: 4,
                iconKey: "youtube",
            }
        });
    } else {
        console.log(`Found YouTube category: ${category.name} (Slug: ${category.slug})`);
        if (category.slug === 'youtube-services') {
            category = await prisma.socialCategory.update({
                where: { id: category.id },
                data: { slug: "youtube" }
            });
            console.log("Updated category slug to 'youtube'");
        }
    }

    const services = [
        { title: "Tăng View Video", slug: "youtube-view", price: 25, unit: "view", min: 1000, max: 1000000, desc: "Tăng View YouTube ~ An Toàn ~ Tốc Độ Nhanh" },
        { title: "Tăng Đăng Ký Kênh", slug: "youtube-subscribers", price: 50, unit: "sub", min: 100, max: 10000, desc: "Tăng Subscribe YouTube ~ Uy Tín ~ An Toàn Kênh" },
        { title: "Tăng Bình Luận Video", slug: "youtube-comment", price: 100, unit: "comment", min: 10, max: 1000, desc: "Tăng Comment YouTube ~ Nội Dung Tuỳ Chọn" },
        { title: "Tăng Chia Sẻ Video", slug: "youtube-share", price: 15, unit: "share", min: 50, max: 50000, desc: "Tăng Share YouTube ~ Tài Nguyên Ngoại" },
        { title: "Tăng Lượt Like Video", slug: "youtube-like", price: 10, unit: "like", min: 100, max: 100000, desc: "Tăng Like YouTube ~ Lên Nhanh" },
        { title: "Tăng Mắt Livestream", slug: "youtube-livestream", price: 30, unit: "mắt", min: 50, max: 10000, desc: "Tăng Mắt Live YouTube ~ Ổn Định" },
        { title: "Tăng 4000H Xem", slug: "youtube-4000h", price: 1500, unit: "gói", min: 1, max: 10, desc: "Gói 4000 Giờ Xem YouTube ~ An Toàn Tuyệt Đối" }
    ];

    for (const svc of services) {
        // Find existing service so we don't duplicate
        const existingService = await prisma.socialService.findFirst({
            where: { slug: svc.slug }
        });

        if (existingService) {
            console.log(`Service '${svc.title}' already exists.`);
            // Optionally, update it if the title was slightly off before (like "Tăng Subscribe Youtube" -> "Tăng Đăng Ký Kênh")
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
                coverImageUrl: `/images/youtube-service.jpg`,
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

    console.log("YouTube Seeding Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
