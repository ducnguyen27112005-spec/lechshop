import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const updated = await prisma.socialService.update({
        where: { id: "cmm2xwf1s0001u6yoz4gydjfu" }, // using the id from previous query
        data: { slug: "google-maps-review" }
    });

    console.log("Updated slug to:", updated.slug);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
