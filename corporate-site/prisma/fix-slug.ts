import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning up invalid slugs...");

    // Find any service with spaces in the slug and delete it
    const badServices = await prisma.socialService.findMany({
        where: {
            slug: {
                contains: " "
            }
        }
    });

    for (const bs of badServices) {
        console.log(`Deleting invalid service: ${bs.title} (slug: ${bs.slug})`);
        // We first need to delete associated plans
        await prisma.socialPlan.deleteMany({
            where: { serviceId: bs.id }
        });
        await prisma.socialService.delete({
            where: { id: bs.id }
        });
    }

    console.log("Cleanup complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
