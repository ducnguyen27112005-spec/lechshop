import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting YouTube Livestream View package update...");

    const serviceSlug = "youtube-livestream";
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
                code: "Kênh 1",
                name: "Tăng Người Xem Livestream ~ Lên Nhanh ~ Ổn Định: Phù Hợp Cho Các Live Người Xem Lớn ~ Tối Đa: 100K Mắt 🔥🔥🔥",
                pricePerUnit: 0.10,
                min: 100,
                max: 100000,
                description: "",
                isActive: true
            },
            {
                serviceId: service.id,
                code: "Kênh 2",
                name: "Tăng Người Xem Livestream ~ Lên Nhanh ~ Ổn Định: Máy Chủ 2 ~ Tối Đa: 300K Mắt 🔥🔥🔥",
                pricePerUnit: 0.11,
                min: 100,
                max: 300000,
                description: "",
                isActive: true
            }
        ];

        for (const plan of plans) {
            await prisma.socialPlan.create({ data: plan });
        }
        console.log("Updated youtube-livestream");
    }

    console.log("Done updating YouTube Livestream View packages.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
