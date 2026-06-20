const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Syncing all existing posts to PUBLISHED as requested...');
    const result = await prisma.post.updateMany({
        data: {
            status: 'PUBLISHED',
        },
    });
    console.log(`Updated ${result.count} posts to PUBLISHED.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
