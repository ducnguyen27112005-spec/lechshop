import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Website Traffic package update...");

    const serviceSlug = "traffic-multi-source";
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
            name: "Vietnam Traffic Đến Từ Google [Bảo Hành: No] [Tốc Độ: 10K/Ngày] [Tốc Độ: 0-12 Giờ]",
            pricePerUnit: 17,
            min: 500,
            max: 1000000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-2",
            name: "Vietnam Traffic Đến Từ Twitter [Bảo Hành: No] [Tốc Độ: 10K/Ngày] [Tốc Độ: 0-12 Giờ]",
            pricePerUnit: 17,
            min: 500,
            max: 1000000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-3",
            name: "Vietnam Traffic Đến Từ YouTube [Bảo Hành: No] [Tốc Độ: 10K/Ngày] [Tốc Độ: 0-12 Giờ]",
            pricePerUnit: 17,
            min: 500,
            max: 1000000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-4",
            name: "Vietnam Traffic Đến Từ Facebook [Bảo Hành: No] [Tốc Độ: 10K/Ngày] [Tốc Độ: 0-12 Giờ]",
            pricePerUnit: 17,
            min: 500,
            max: 1000000,
            description: "",
            isActive: true
        },
        {
            serviceId: service.id,
            code: "MC-5",
            name: "Vietnam Traffic Đến Từ Instagram [Bảo Hành: No] [Tốc Độ: 10K/Ngày] [Tốc Độ: 0-12 Giờ]",
            pricePerUnit: 17,
            min: 500,
            max: 1000000,
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

    console.log("Done updating Website Traffic packages.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
