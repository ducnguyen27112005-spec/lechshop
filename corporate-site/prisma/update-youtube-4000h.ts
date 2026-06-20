import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting YouTube 4000H package update...");

    const serviceSlug = "youtube-4000h";
    const service = await prisma.socialService.findUnique({
        where: { slug: serviceSlug }
    });

    if (service) {
        await prisma.socialPlan.deleteMany({
            where: { serviceId: service.id }
        });
        const plans = [
            {
                serviceId: service.id,
                code: "MC-1",
                name: "Tăng Thời Gian Xem Video (4000H) ~ Xem Video 60 Phút + | Tốc Độ: 100 Giờ/ 1 Ngày |Bảo Hành: 30 Ngày",
                pricePerUnit: 540,
                min: 5,
                max: 4000,
                description: "",
                isActive: true
            },
            {
                serviceId: service.id,
                code: "MC-2",
                name: "Tăng Thời Gian Xem Video (4000H) ~ Xem Video 60 Phút + | Tốc Độ: 300 Giờ/ 1 Ngày |Bảo Hành: 30 Ngày",
                pricePerUnit: 640,
                min: 5,
                max: 4000,
                description: "",
                isActive: true
            }
        ];

        for (const plan of plans) {
            await prisma.socialPlan.create({ data: plan });
        }
        console.log("Updated youtube-4000h");
    }

    console.log("Done updating YouTube 4000H packages.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
