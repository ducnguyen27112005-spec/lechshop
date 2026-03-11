import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.order.create({
        data: {
            code: 'PREMIUM-001',
            customerName: 'Test Premium User',
            customerEmail: 'test@example.com',
            type: 'PREMIUM',
            amount: 100000,
            paymentStatus: 'PAID',
            fulfillStatus: 'NEW'
        }
    });

    await prisma.socialOrder.create({
        data: {
            code: 'SOCIAL-001',
            platformSlug: 'tiktok',
            serviceSlug: 'follow',
            serviceName: 'TikTok Follow',
            targetUrl: 'tiktok.com/@test',
            totalPrice: 50000,
            status: 'received'
        }
    });

    console.log('Created dummy orders');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
