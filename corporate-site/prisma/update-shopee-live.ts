import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Shopee Livestream View package update...");

    // Find the Shopee service for Livestream view
    const serviceSlug = "shopee-livestream";
    const service = await prisma.socialService.findUnique({
        where: { slug: serviceSlug }
    });

    if (!service) {
        console.error(`Service ${serviceSlug} not found!`);
        return;
    }

    // Delete existing plans
    await prisma.socialPlan.deleteMany({
        where: { serviceId: service.id }
    });

    // Create new plans based on screenshot
    const plansToCreate = [
        {
            serviceId: service.id,
            code: "MC-1",
            name: "Tăng Người Xem Livestream Shopee | Xem Live 30 Phút",
            pricePerUnit: 82.555,
            min: 10,
            max: 50000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-2",
            name: "Tăng Người Xem Livestream Shopee | Xem Live 60 Phút",
            pricePerUnit: 165.11,
            min: 10,
            max: 50000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-3",
            name: "Tăng Người Xem Livestream Shopee | Xem Live 90 Phút",
            pricePerUnit: 247.666,
            min: 10,
            max: 50000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-4",
            name: "Tăng Người Xem Livestream Shopee | Xem Live 120 Phút",
            pricePerUnit: 330.221,
            min: 10,
            max: 50000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-5",
            name: "Tăng Người Xem Livestream Shopee | Xem Live 180 Phút",
            pricePerUnit: 495.331,
            min: 10,
            max: 50000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-6",
            name: "Tăng Người Xem Livestream Shopee | Xem Live 240 Phút",
            pricePerUnit: 660.442,
            min: 10,
            max: 50000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-7",
            name: "Tăng Người Xem Livestream Shopee | Xem Live 360 Phút",
            pricePerUnit: 990.662,
            min: 10,
            max: 50000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-8",
            name: "Tăng Người Xem Livestream Shopee | Xem Live 480 Phút",
            pricePerUnit: 1320.883,
            min: 10,
            max: 50000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-9",
            name: "Tăng Người Xem Livestream Shopee | Xem Live 720 Phút",
            pricePerUnit: 1981.325,
            min: 10,
            max: 50000,
            description: "",
            isActive: true
        }
    ];

    for (const plan of plansToCreate) {
        await prisma.socialPlan.create({
            data: plan
        });
        console.log(`Created plan: ${plan.code} - ${plan.name}`);
    }

    console.log("Done updating Shopee Livestream View packages.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
