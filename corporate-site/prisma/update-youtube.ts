import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting YouTube package update...");

    // 1. Update YouTube View
    const viewServiceSlug = "youtube-view";
    const viewService = await prisma.socialService.findUnique({
        where: { slug: viewServiceSlug }
    });

    if (viewService) {
        await prisma.socialPlan.deleteMany({
            where: { serviceId: viewService.id }
        });
        const viewPlans = [
            {
                serviceId: viewService.id,
                code: "MC-1",
                name: "Tăng Lượt Xem Video ~ Tối Thiểu Mua 1.000~ Tốc Độ: 30.000-50.000Ngày ~ Tỉ Lệ Tụt Cực Kì Thấp ~ Bảo Hành 30 Ngày 🔥🔥🔥",
                pricePerUnit: 33.8,
                min: 1000,
                max: 1000000,
                description: "",
                isActive: true
            },
            {
                serviceId: viewService.id,
                code: "MC-2",
                name: "Tăng Lượt Xem Video ~ Tối Thiểu Mua 5.000~ Tốc Độ: 30.000-50.000/Ngày ~ Tỉ Lệ Tụt Cực Kì Thấp ~ Bảo Hành 30 Ngày 🔥🔥🔥",
                pricePerUnit: 27.8,
                min: 5000,
                max: 5000000,
                description: "",
                isActive: true
            },
            {
                serviceId: viewService.id,
                code: "MC-3",
                name: "Tăng Lượt Xem Video ~ Tối Thiểu Mua 100.000~ Tốc Độ: 30.000-50.000/Ngày ~ Tỉ Lệ Tụt Cực Kì Thấp ~ Bảo Hành 30 Ngày 🔥🔥🔥",
                pricePerUnit: 20.8,
                min: 100000,
                max: 50000000,
                description: "",
                isActive: true
            }
        ];
        for (const plan of viewPlans) {
            await prisma.socialPlan.create({ data: plan });
        }
        console.log("Updated youtube-view");
    }

    // 2. Update YouTube Subscribers
    const subServiceSlug = "youtube-subscribers";
    const subService = await prisma.socialService.findUnique({
        where: { slug: subServiceSlug }
    });

    if (subService) {
        await prisma.socialPlan.deleteMany({
            where: { serviceId: subService.id }
        });
        const subPlans = [
            {
                serviceId: subService.id,
                code: "MC-1",
                name: "Tăng Lượt Đăng Ký Kênh [ Max 50K ] | Chất Lượng Cao | 30 Ngày Bảo Hành | Tốc Độ Nhanh: 1.00-1.000/Ngày",
                pricePerUnit: 790,
                min: 50,
                max: 50000,
                description: "",
                isActive: true
            },
            {
                serviceId: subService.id,
                code: "MC-2",
                name: "Tăng Lượt Đăng Ký Kênh [ Tối Đa 20K ] | Không Bảo Hành | Tốc Độ: 20K/Ngày",
                pricePerUnit: 4.9,
                min: 50,
                max: 20000,
                description: "",
                isActive: true
            },
            {
                serviceId: subService.id,
                code: "MC-3",
                name: "Tăng Lượt Đăng Ký Kênh [ Tối Đa 100K ] | Không Bảo Hành | Tốc Độ: 100K/Ngày",
                pricePerUnit: 5.9,
                min: 50,
                max: 100000,
                description: "",
                isActive: true
            },
            {
                serviceId: subService.id,
                code: "MC-4",
                name: "Tăng Lượt Đăng Ký Kênh [ Max 100K ] | Chất Lượng Cao | Vĩnh Viễn Bảo Hành | Ngày 1500-3000",
                pricePerUnit: 99,
                min: 50,
                max: 100000,
                description: "",
                isActive: true
            },
            {
                serviceId: subService.id,
                code: "MC-5",
                name: "Tăng Lượt Đăng Ký Kênh [ Max 40K ] | Chất Lượng Cao | Vĩnh Viễn Bảo Hành | Ngày: 800-1500",
                pricePerUnit: 89,
                min: 50,
                max: 40000,
                description: "",
                isActive: true
            }
        ];
        for (const plan of subPlans) {
            await prisma.socialPlan.create({ data: plan });
        }
        console.log("Updated youtube-subscribers");
    }

    console.log("Done updating YouTube packages.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
