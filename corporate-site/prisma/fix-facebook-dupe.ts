import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    const OLD_CATEGORY_ID = "cmlnhytru000du6zc1mft8hfc"; // slug: "facebook" (original, 2 services)
    const NEW_CATEGORY_ID = "cmm1zalsu0000u6f8wb2jd1ot"; // slug: "facebook-services" (duplicate, 13 services)

    console.log("Moving services from duplicate facebook-services to original facebook...");

    // Move all 13 services from duplicate to original
    const result = await prisma.socialService.updateMany({
        where: { categoryId: NEW_CATEGORY_ID },
        data: { categoryId: OLD_CATEGORY_ID },
    });

    console.log(`  ✅ Moved ${result.count} services to original Facebook category.`);

    // Delete the duplicate category
    await prisma.socialCategory.delete({
        where: { id: NEW_CATEGORY_ID },
    });

    console.log("  ✅ Deleted duplicate 'facebook-services' category.");
    console.log("\n🎉 Done! Facebook now has all services under one category.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
