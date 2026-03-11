import { PrismaClient } from "../generated/client/index.js";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting final Facebook category and service cleanup...");

    // 1. Get the authoritative category (slug: "facebook")
    let mainCategory = await prisma.socialCategory.findFirst({
        where: { slug: "facebook" }
    });

    if (!mainCategory) {
        // Find by name if slug is missing
        mainCategory = await prisma.socialCategory.findFirst({
            where: { name: "Facebook" }
        });
        if (mainCategory) {
            await prisma.socialCategory.update({
                where: { id: mainCategory.id },
                data: { slug: "facebook" }
            });
        } else {
            mainCategory = await prisma.socialCategory.create({
                data: { name: "Facebook", slug: "facebook", sortOrder: 2, iconKey: "facebook" }
            });
        }
    }

    // 2. Find any duplicate categories (e.g., "facebook-services")
    const categories = await prisma.socialCategory.findMany({
        where: { name: { contains: "Facebook" } }
    });

    for (const cat of categories) {
        if (cat.id !== mainCategory.id) {
            console.log(`Moving services from duplicate category ${cat.slug}...`);
            await prisma.socialService.updateMany({
                where: { categoryId: cat.id },
                data: { categoryId: mainCategory.id }
            });
            console.log(`Deleting duplicate category ${cat.slug}`);
            await prisma.socialCategory.delete({ where: { id: cat.id } });
        }
    }

    // 3. Delete old obsolete duplicated services
    const obsoleteSlugs = ["facebook-followers", "facebook-likes"];
    for (const slug of obsoleteSlugs) {
        const obs = await prisma.socialService.findMany({ where: { slug } });
        for (const o of obs) {
            await prisma.socialPlan.deleteMany({ where: { serviceId: o.id } });
            await prisma.socialService.delete({ where: { id: o.id } });
            console.log(`Deleted obsolete service ${slug}`);
        }
    }

    // 4. Resolve DUPLICATE instances of the same service slug (if seed ran multiple times)
    const allFbServices = await prisma.socialService.findMany({
        where: { categoryId: mainCategory.id }
    });

    const seenSlugs = new Set();
    for (const s of allFbServices) {
        if (seenSlugs.has(s.slug)) {
            console.log(`Deleting duplicate instance of same service slug: ${s.slug}`);
            await prisma.socialPlan.deleteMany({ where: { serviceId: s.id } });
            await prisma.socialService.delete({ where: { id: s.id } });
        } else {
            seenSlugs.add(s.slug);
        }
    }

    // 5. Apply the correct order to the unique remaining services
    const orderedSlugs = [
        "facebook-like-post",
        "facebook-like-monthly",
        "facebook-profile-followers",
        "facebook-like-fanpage",
        "facebook-livestream",
        "facebook-share",
        "facebook-group-member",
        "facebook-page-review",
        "facebook-like-comment",
        "facebook-video-view",
        "facebook-comment",
        "facebook-story-view",
        "facebook-adbreak-view"
    ];

    for (let i = 0; i < orderedSlugs.length; i++) {
        const slug = orderedSlugs[i];
        const count = await prisma.socialService.updateMany({
            where: { slug: slug },
            data: { sortOrder: i + 1 }
        });
        if (count.count > 0) {
            console.log(`Updated [${i + 1}] ${slug}`);
        } else {
            console.log(`Warning: Missing ${slug}`);
        }
    }

    console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
