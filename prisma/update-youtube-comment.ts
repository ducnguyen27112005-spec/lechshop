import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting YouTube Comment package update...");

    const serviceSlug = "youtube-comment";
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
                name: "Tăng Lượt Comment Video Youtube ~ Siêu Ổn Định ~ Tốc Độ: 500-10000/Ngày ~ Tài Nguyên Tài Khoản Việt Nam VN 🔥🔥🔥",
                pricePerUnit: 245,
                min: 5,
                max: 50000,
                description: "",
                isActive: true
            },
            {
                serviceId: service.id,
                code: "MC-2",
                name: "Tăng Lượt Comment Cho Livestream Youtube ~ Ổn Định ~ Tốc Độ: 100-5000/Ngày ~ Tài Nguyên Việt Nam VN",
                pricePerUnit: 99,
                min: 5,
                max: 20000,
                description: "",
                isActive: true
            },
            {
                serviceId: service.id,
                code: "MC-3",
                name: "Tăng Trả Lời Comments YouTube Tạo Bởi AI | Nội Dung Được Tự Động Viết Dựa Trên Video Content And Video Title ~ Tài Nguyên Việt Nam VN",
                pricePerUnit: 390,
                min: 5,
                max: 20000,
                description: "",
                isActive: true
            }
        ];
        for (const plan of plans) {
            await prisma.socialPlan.create({ data: plan });
        }
        console.log("Updated youtube-comment");
    }

    console.log("Done updating YouTube Comment packages.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
