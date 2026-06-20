import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const totalOrders = await prisma.order.count();
    console.log('Total Orders:', totalOrders);

    if (totalOrders > 0) {
        const ordersByType = await prisma.order.groupBy({
            by: ['type'],
            _count: {
                id: true,
            },
        });
        console.log('Orders by Type:', ordersByType);

        const ordersByStatus = await prisma.order.groupBy({
            by: ['paymentStatus', 'fulfillStatus'],
            _count: {
                id: true,
            },
        });
        console.log('Orders by Status:', ordersByStatus);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
