import { PrismaClient } from "../generated/client/index.js";

const prisma = new PrismaClient();

async function main() {
    console.log("Reordering and cleaning up Facebook Services...");

    // 1. Delete duplicates
    const slugsToDelete = ["facebook-followers", "facebook-likes"];
    for (const slug of slugsToDelete) {
        const svc = await prisma.socialService.findFirst({ where: { slug } });
        if (svc) {
            console.log(`Deleting duplicate service: ${svc.title} (${slug})`);
            await prisma.socialPlan.deleteMany({ where: { serviceId: svc.id } });
            await prisma.socialService.delete({ where: { id: svc.id } });
        }
    }

    // 2. Reorder services
    const orderedSlugs = [
        "facebook-like-post", // 1. Tăng Like Bài Viết
        "facebook-like-monthly", // 2. Mua Gói Like Tháng
        "facebook-profile-followers", // 3. Tăng Người Theo Dõi
        "facebook-like-fanpage", // 4. Tăng Like Fanpage
        "facebook-livestream", // 5. Tăng Mắt Livestream
        "facebook-share", // 6. Tăng Lượt Chia Sẻ
        "facebook-group-member", // 7. Tăng Member Nhóm
        "facebook-page-review", // 8. Tăng Đánh Giá Page
        "facebook-like-comment", // 9. Tăng Like Bình Luận
        "facebook-video-view", // 10. Tăng View Video/Reel
        "facebook-comment", // 11. Tăng Bình Luận
        "facebook-story-view", // 12. Tăng View Story
        "facebook-adbreak-view", // 13. Tăng View Ad Break
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

    console.log("Facebook services cleanup and reorder complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
