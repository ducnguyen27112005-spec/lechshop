import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Reordering and cleaning up TikTok Services...");

    const category = await prisma.socialCategory.findFirst({
        where: { name: { contains: "TikTok" } }
    });

    if (!category) {
        console.log("TikTok category not found.");
        return;
    }

    // 1. Delete duplicates
    const slugsToDelete = ["tiktok-followers", "tiktok-views", "tiktok-likes"];
    for (const slug of slugsToDelete) {
        const svc = await prisma.socialService.findFirst({ where: { slug } });
        if (svc) {
            console.log(`Deleting duplicate service: ${svc.title} (${slug})`);
            await prisma.socialPlan.deleteMany({ where: { serviceId: svc.id } });
            await prisma.socialService.delete({ where: { id: svc.id } });
        }
    }

    // 2. Add missing service "Mua Gói Tim Tháng" if not exists
    let monthlyLike = await prisma.socialService.findFirst({
        where: { slug: "tiktok-like-monthly" }
    });

    if (!monthlyLike) {
        console.log("Creating missing service: Mua Gói Tim Tháng");
        monthlyLike = await prisma.socialService.create({
            data: {
                categoryId: category.id,
                title: "Mua Gói Tim Tháng",
                slug: "tiktok-like-monthly",
                targetType: "uid_or_link",
                unitLabel: "gói",
                coverImageUrl: `/images/tiktok-service.jpg`,
                plans: {
                    create: [
                        {
                            code: `tiktok-like-monthly-sv1`,
                            name: "Gói Cơ Bản",
                            pricePerUnit: 150000,
                            min: 1,
                            max: 10,
                            description: "Mua Gói Tim Tháng Cơ Bản",
                            isActive: true
                        }
                    ]
                }
            }
        });
    }

    // 3. Reorder services
    const orderedSlugs = [
        "tiktok-view", // 1. Tăng Lượt Xem Video
        "tiktok-like", // 2. Tăng Thả Tim Video
        "tiktok-follow", // 3. Tăng Người Theo Dõi
        "tiktok-livestream-eyes", // 4. Tăng Mắt Livestream
        "tiktok-save", // 5. Tăng Lượt Lưu Video
        "tiktok-share", // 6. Tăng Chia Sẻ Video
        "tiktok-comment", // 7. Tăng Bình Luận Video
        "tiktok-seeding", // 8. Seeding Livestream
        "tiktok-like-monthly" // 9. Mua Gói Tim Tháng
    ];

    for (let i = 0; i < orderedSlugs.length; i++) {
        const slug = orderedSlugs[i];
        const svc = await prisma.socialService.findFirst({ where: { slug } });
        if (svc) {
            await prisma.socialService.update({
                where: { id: svc.id },
                data: { sortOrder: i + 1 }
            });
            console.log(`Updated [${i + 1}] ${svc.title}`);
        } else {
            console.log(`Warning: Service with slug ${slug} not found!`);
        }
    }

    console.log("TikTok services cleanup and reorder complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
