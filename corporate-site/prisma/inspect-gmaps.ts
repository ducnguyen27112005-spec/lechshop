import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const services = await prisma.socialService.findMany({
        where: {
            category: {
                slug: {
                    contains: "google"
                }
            }
        },
        include: {
            category: true
        }
    });

    console.log(JSON.stringify(services, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
