/**
 * Seed script: migrate data from serviceConfig.ts into the database
 * Run: npx tsx prisma/seed-services.ts
 */
import { PrismaClient } from "../generated/client";
import { serviceConfig, serviceCategories } from "../content/serviceConfig";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding social services...");

    // 1. Create categories
    for (const cat of serviceCategories) {
        const existing = await prisma.socialCategory.findUnique({ where: { slug: cat.slug } });
        if (existing) {
            console.log(`  ⏭️  Category "${cat.name}" already exists, skipping.`);
            continue;
        }

        const category = await prisma.socialCategory.create({
            data: {
                name: cat.name,
                slug: cat.slug,
                iconKey: cat.icon,
                sortOrder: serviceCategories.indexOf(cat),
                isActive: true,
            }
        });
        console.log(`  ✅ Created category: ${category.name} (${category.id})`);

        // 2. Create services for this category
        for (let i = 0; i < cat.services.length; i++) {
            const serviceSlug = cat.services[i];
            const svcData = serviceConfig[serviceSlug];
            if (!svcData) {
                console.log(`    ⚠️  Service "${serviceSlug}" not found in serviceConfig, skipping.`);
                continue;
            }

            const existingSvc = await prisma.socialService.findUnique({ where: { slug: serviceSlug } });
            if (existingSvc) {
                console.log(`    ⏭️  Service "${svcData.name}" already exists, skipping.`);
                continue;
            }

            const service = await prisma.socialService.create({
                data: {
                    categoryId: category.id,
                    title: svcData.name,
                    slug: serviceSlug,
                    shortDescription: svcData.description,
                    targetType: "video",
                    unitLabel: "lượt",
                    sortOrder: i,
                    isActive: true,
                }
            });
            console.log(`    ✅ Created service: ${service.title}`);

            // 3. Create plans (servers) for this service
            for (const server of svcData.servers) {
                await prisma.socialPlan.create({
                    data: {
                        serviceId: service.id,
                        code: server.code || server.id,
                        name: server.name,
                        pricePerUnit: server.price,
                        currency: "VND",
                        min: server.min,
                        max: server.max,
                        description: server.description || null,
                        isActive: server.status === "active",
                    }
                });
            }
            console.log(`      📦 Created ${svcData.servers.length} plans`);
        }
    }

    console.log("\n🎉 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
