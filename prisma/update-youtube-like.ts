import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting YouTube Like package update...");

    const serviceSlug = "youtube-like";
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
                name: "Tăng Lượt Thích(Like) Cho Video Youtube ~ Có Hỗ Trợ Cho Livestream 🔥🔥🔥",
                pricePerUnit: 14.8,
                min: 10,
                max: 50000,
                description: "",
                isActive: true
            },
            {
                serviceId: service.id,
                code: "MC-2",
                name: "Tăng Lượt Thích(Like) Cho Video Youtube/Livestream Video ~ Tốc Độ Nhanh 🔥🔥🔥",
                pricePerUnit: 11.8,
                min: 10,
                max: 50000,
                description: "",
                isActive: true
            }
        ];

        // Wait, did I miss MC-3? The image cuts off at "Số lượng: (10 - 50.000)". There's no MC-3 visible.
        // It looks like only MC-1 and MC-2. I'll stick to 2.

        for (const plan of plans) {
            await prisma.socialPlan.create({ data: plan });
        }
        console.log("Updated youtube-like");
    }

    console.log("Done updating YouTube Like packages.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
