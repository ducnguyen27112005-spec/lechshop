import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching TikTok Services from Database...");

    const category = await prisma.socialCategory.findFirst({
        where: { name: { contains: "Tiktok" } } // or TikTok
    });

    if (!category) {
        console.log("Category not found.");
        return;
    }

    const services = await prisma.socialService.findMany({
        where: { categoryId: category.id },
        orderBy: { sortOrder: 'asc' }
    });

    console.log(`Found ${services.length} services under ${category.name}:`);
    for (const svc of services) {
        console.log(`- [${svc.sortOrder}] ${svc.title} (slug: ${svc.slug})`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
