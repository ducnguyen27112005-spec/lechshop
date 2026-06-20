const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting categorization migration...');

    // 1. Create default category
    const defaultCategory = await prisma.category.upsert({
        where: { slug: 'tin-tuc' },
        update: {},
        create: {
            name: 'Tin tức',
            slug: 'tin-tuc',
            status: 'active'
        }
    });

    console.log(`Default category ensured: ${defaultCategory.name} (${defaultCategory.id})`);

    // 2. Update all posts that don't have a category
    const result = await prisma.post.updateMany({
        where: {
            categoryId: null
        },
        data: {
            categoryId: defaultCategory.id
        }
    });

    console.log(`Updated ${result.count} posts with default category.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
