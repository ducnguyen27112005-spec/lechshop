import { PrismaClient } from "../generated/client/index.js";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Facebook Services...");

    // Find the Facebook category
    const fbCategory = await prisma.socialCategory.findFirst({
        where: { slug: "facebook-services" }
    });

    if (!fbCategory) {
        // Create the category if it doesn't exist
        console.log("Facebook category not found, creating...");
        const created = await prisma.socialCategory.create({
            data: {
                name: "Facebook",
                slug: "facebook-services",
                sortOrder: 2,
                iconKey: "facebook",
            }
        });
        return seedServices(created.id);
    }

    return seedServices(fbCategory.id);
}

async function seedServices(categoryId: string) {
    const facebookServices = [
        {
            title: "Tăng Like Bài Viết",
            slug: "facebook-like-post",
            shortDescription: "Tăng like bài viết Facebook nhanh chóng, chất lượng cao.",
            targetType: "uid_or_link",
            unitLabel: "like",
            sortOrder: 1,
            plans: [
                {
                    code: "fb-like-post-sv1",
                    name: "Tăng Like Bài Viết ~ Lên Nhanh ~ Tốc Độ: 500-5.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥",
                    pricePerUnit: 8,
                    min: 50,
                    max: 50000,
                    description: "Tăng Like Bài Viết ~ Lên Nhanh ~ Tốc Độ: 500-5.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥\nMáy Chủ Không Hỗ Trợ Hủy Hoàn ID Đã Mua",
                },
                {
                    code: "fb-like-post-sv2",
                    name: "Tăng Like Bài Viết ~ Tốc Độ: 1.000-10.000/Ngày ~ Tài Nguyên Ngoại Cổ ~ Giá Rẻ 🔥🔥🔥",
                    pricePerUnit: 5,
                    min: 100,
                    max: 100000,
                    description: "Tăng Like Bài Viết ~ Tốc Độ: 1.000-10.000/Ngày ~ Tài Nguyên Ngoại Cổ ~ Giá Rẻ 🔥🔥🔥\nPhù hợp cho bài viết cần số lượng lớn",
                },
            ],
        },
        {
            title: "Mua Gói Like Tháng",
            slug: "facebook-like-monthly",
            shortDescription: "Gói like tháng Facebook, tự động like bài viết mới hàng ngày.",
            targetType: "profile",
            unitLabel: "like/bài",
            sortOrder: 2,
            plans: [
                {
                    code: "fb-like-monthly-sv1",
                    name: "Gói Like Tháng ~ 50-100 Like/Bài ~ Tự Động Like Bài Mới ~ 30 Ngày 🔥🔥",
                    pricePerUnit: 500,
                    min: 1,
                    max: 10,
                    description: "Gói Like Tháng ~ 50-100 Like/Bài ~ Tự Động Nhận Diện Bài Viết Mới Và Like ~ Thời Hạn 30 Ngày 🔥🔥\nGói sẽ tự động like bài viết mới của bạn hàng ngày",
                },
                {
                    code: "fb-like-monthly-sv2",
                    name: "Gói Like Tháng ~ 200-500 Like/Bài ~ VIP ~ 30 Ngày 🔥🔥🔥",
                    pricePerUnit: 1500,
                    min: 1,
                    max: 5,
                    description: "Gói Like Tháng VIP ~ 200-500 Like/Bài ~ Tự Động Nhận Diện Bài Viết Mới Và Like ~ Thời Hạn 30 Ngày 🔥🔥🔥",
                },
            ],
        },
        {
            title: "Tăng Người Theo Dõi",
            slug: "facebook-profile-followers",
            shortDescription: "Tăng người theo dõi trang cá nhân Facebook.",
            targetType: "profile",
            unitLabel: "follow",
            sortOrder: 3,
            plans: [
                {
                    code: "fb-follow-sv1",
                    name: "Tăng Người Theo Dõi Profile ~ Tốc Độ: 500-2.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥",
                    pricePerUnit: 25,
                    min: 100,
                    max: 50000,
                    description: "Tăng Người Theo Dõi Profile Facebook ~ Tốc Độ: 500-2.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥\nHỗ trợ bảo hành 30 ngày",
                },
                {
                    code: "fb-follow-sv2",
                    name: "Tăng Người Theo Dõi Profile ~ Tốc Độ: 1.000-5.000/Ngày ~ Ngoại Cổ ~ Giá Rẻ 🔥🔥🔥",
                    pricePerUnit: 15,
                    min: 100,
                    max: 100000,
                    description: "Tăng Người Theo Dõi Profile Facebook ~ Tốc Độ: 1.000-5.000/Ngày ~ Tài Nguyên Ngoại Cổ ~ Giá Rẻ 🔥🔥🔥",
                },
            ],
        },
        {
            title: "Tăng Like Fanpage",
            slug: "facebook-like-fanpage",
            shortDescription: "Tăng lượt thích Fanpage Facebook, tạo uy tín cho thương hiệu.",
            targetType: "uid_or_link",
            unitLabel: "like",
            sortOrder: 4,
            plans: [
                {
                    code: "fb-like-fanpage-sv1",
                    name: "Tăng Like Fanpage ~ Tốc Độ: 500-3.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥",
                    pricePerUnit: 30,
                    min: 100,
                    max: 50000,
                    description: "Tăng Like Fanpage Facebook ~ Tốc Độ: 500-3.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥\nBảo hành 30 ngày, bù tụt tự động",
                },
                {
                    code: "fb-like-fanpage-sv2",
                    name: "Tăng Like Fanpage ~ Tốc Độ: 1.000-5.000/Ngày ~ Ngoại Cổ 🔥🔥🔥",
                    pricePerUnit: 18,
                    min: 100,
                    max: 100000,
                    description: "Tăng Like Fanpage Facebook ~ Tốc Độ: 1.000-5.000/Ngày ~ Tài Nguyên Ngoại Cổ Giá Rẻ 🔥🔥🔥",
                },
            ],
        },
        {
            title: "Tăng Mắt Livestream",
            slug: "facebook-livestream",
            shortDescription: "Tăng mắt xem livestream Facebook, hỗ trợ bán hàng trực tuyến.",
            targetType: "livestream",
            unitLabel: "mắt",
            sortOrder: 5,
            plans: [
                {
                    code: "fb-live-sv1",
                    name: "Tăng Mắt Livestream Facebook ~ Lên Ngay ~ Ổn Định 60 Phút 🔥🔥",
                    pricePerUnit: 5,
                    min: 50,
                    max: 5000,
                    description: "Tăng Mắt Xem Livestream Facebook ~ Lên Ngay Sau Mua ~ Ổn Định 60 Phút 🔥🔥\nPhù hợp cho bán hàng livestream",
                },
                {
                    code: "fb-live-sv2",
                    name: "Tăng Mắt Livestream Facebook ~ VIP ~ Ổn Định 120 Phút 🔥🔥🔥",
                    pricePerUnit: 10,
                    min: 50,
                    max: 3000,
                    description: "Tăng Mắt Xem Livestream Facebook VIP ~ Ổn Định 120 Phút ~ Tài Nguyên Việt Nam 🔥🔥🔥",
                },
            ],
        },
        {
            title: "Tăng Lượt Chia Sẻ",
            slug: "facebook-share",
            shortDescription: "Tăng lượt chia sẻ bài viết Facebook, lan tỏa nội dung.",
            targetType: "uid_or_link",
            unitLabel: "share",
            sortOrder: 6,
            plans: [
                {
                    code: "fb-share-sv1",
                    name: "Tăng Lượt Chia Sẻ Bài Viết ~ Tốc Độ: 200-1.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥",
                    pricePerUnit: 20,
                    min: 50,
                    max: 10000,
                    description: "Tăng Lượt Chia Sẻ Bài Viết Facebook ~ Tốc Độ: 200-1.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥",
                },
                {
                    code: "fb-share-sv2",
                    name: "Tăng Lượt Chia Sẻ Bài Viết ~ Chia Sẻ Công Khai ~ Ngoại 🔥🔥🔥",
                    pricePerUnit: 12,
                    min: 100,
                    max: 50000,
                    description: "Tăng Lượt Chia Sẻ Bài Viết Facebook ~ Chia Sẻ Công Khai ~ Tài Nguyên Ngoại 🔥🔥🔥\nCác share đều để chế độ công khai",
                },
            ],
        },
        {
            title: "Tăng Member Nhóm",
            slug: "facebook-group-member",
            shortDescription: "Tăng thành viên nhóm Facebook, phát triển cộng đồng.",
            targetType: "uid_or_link",
            unitLabel: "member",
            sortOrder: 7,
            plans: [
                {
                    code: "fb-group-sv1",
                    name: "Tăng Member Nhóm ~ Tốc Độ: 200-1.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥",
                    pricePerUnit: 35,
                    min: 100,
                    max: 50000,
                    description: "Tăng Member Nhóm Facebook ~ Tốc Độ: 200-1.000/Ngày ~ Tài Nguyên Việt Nam 🔥🔥\nNhóm phải để chế độ công khai",
                },
                {
                    code: "fb-group-sv2",
                    name: "Tăng Member Nhóm ~ Tốc Độ: 500-3.000/Ngày ~ Ngoại Giá Rẻ 🔥🔥🔥",
                    pricePerUnit: 20,
                    min: 100,
                    max: 100000,
                    description: "Tăng Member Nhóm Facebook ~ Tốc Độ: 500-3.000/Ngày ~ Tài Nguyên Ngoại Giá Rẻ 🔥🔥🔥",
                },
            ],
        },
        {
            title: "Tăng Đánh Giá Page",
            slug: "facebook-page-review",
            shortDescription: "Tăng đánh giá 5 sao cho Fanpage Facebook.",
            targetType: "uid_or_link",
            unitLabel: "đánh giá",
            sortOrder: 8,
            plans: [
                {
                    code: "fb-review-sv1",
                    name: "Tăng Đánh Giá 5 Sao Page ~ Kèm Nội Dung ~ Tài Nguyên Việt Nam 🔥🔥🔥",
                    pricePerUnit: 500,
                    min: 5,
                    max: 500,
                    description: "Tăng Đánh Giá 5 Sao Cho Fanpage Facebook ~ Kèm Nội Dung Đánh Giá ~ Tài Nguyên Việt Nam 🔥🔥🔥\nĐánh giá kèm nội dung tùy chỉnh",
                },
            ],
        },
        {
            title: "Tăng Like Bình Luận",
            slug: "facebook-like-comment",
            shortDescription: "Tăng like cho bình luận trên bài viết Facebook.",
            targetType: "uid_or_link",
            unitLabel: "like",
            sortOrder: 9,
            plans: [
                {
                    code: "fb-like-cmt-sv1",
                    name: "Tăng Like Bình Luận Facebook ~ Tốc Độ Nhanh: 500-3.000/Ngày 🔥🔥",
                    pricePerUnit: 10,
                    min: 50,
                    max: 10000,
                    description: "Tăng Like Bình Luận Facebook ~ Tốc Độ Nhanh: 500-3.000/Ngày ~ Tài Nguyên Việt Nam + Ngoại 🔥🔥",
                },
            ],
        },
        {
            title: "Tăng View Video/Reel",
            slug: "facebook-video-view",
            shortDescription: "Tăng lượt xem video và reel Facebook.",
            targetType: "video",
            unitLabel: "view",
            sortOrder: 10,
            plans: [
                {
                    code: "fb-view-sv1",
                    name: "Tăng View Video Facebook ~ Tốc Độ: 10.000-100.000/Ngày ~ Giá Rẻ 🔥🔥🔥",
                    pricePerUnit: 0.5,
                    min: 500,
                    max: 1000000,
                    description: "Tăng Lượt Xem Video Facebook ~ Tốc Độ: 10.000-100.000/Ngày ~ Giá Rẻ Nhất 🔥🔥🔥",
                },
                {
                    code: "fb-view-sv2",
                    name: "Tăng View Reel Facebook ~ Tốc Độ: 5.000-50.000/Ngày ~ Ổn Định 🔥🔥",
                    pricePerUnit: 1,
                    min: 500,
                    max: 500000,
                    description: "Tăng Lượt Xem Reel Facebook ~ Tốc Độ: 5.000-50.000/Ngày ~ Ổn Định 🔥🔥",
                },
            ],
        },
        {
            title: "Tăng Bình Luận",
            slug: "facebook-comment",
            shortDescription: "Tăng bình luận bài viết Facebook, tạo tương tác tự nhiên.",
            targetType: "uid_or_link",
            unitLabel: "comment",
            sortOrder: 11,
            plans: [
                {
                    code: "fb-cmt-sv1",
                    name: "Tăng Bình Luận Facebook ~ Nội Dung Tùy Chỉnh ~ Tốc Độ: 50-500/Ngày ~ Việt Nam 🔥🔥🔥",
                    pricePerUnit: 200,
                    min: 10,
                    max: 5000,
                    description: "Tăng Bình Luận Facebook ~ Nội Dung Tùy Chỉnh ~ Tốc Độ: 50-500/Ngày ~ Tài Nguyên Việt Nam 🔥🔥🔥\nGửi kèm nội dung bình luận mong muốn",
                },
                {
                    code: "fb-cmt-sv2",
                    name: "Tăng Bình Luận Facebook ~ Bình Luận Cảm Xúc Ngẫu Nhiên ~ Ngoại 🔥🔥",
                    pricePerUnit: 30,
                    min: 10,
                    max: 10000,
                    description: "Tăng Bình Luận Facebook ~ Bình Luận Ngẫu Nhiên Cảm Xúc 😍❤️👍🔥 ~ Tài Nguyên Ngoại 🔥🔥",
                },
            ],
        },
        {
            title: "Tăng View Story",
            slug: "facebook-story-view",
            shortDescription: "Tăng lượt xem story Facebook.",
            targetType: "uid_or_link",
            unitLabel: "view",
            sortOrder: 12,
            plans: [
                {
                    code: "fb-story-sv1",
                    name: "Tăng View Story Facebook ~ Tốc Độ Nhanh ~ Tài Nguyên Việt Nam 🔥🔥",
                    pricePerUnit: 2,
                    min: 100,
                    max: 50000,
                    description: "Tăng Lượt Xem Story Facebook ~ Tốc Độ Nhanh ~ Tài Nguyên Việt Nam 🔥🔥",
                },
            ],
        },
        {
            title: "Tăng View Ad Break",
            slug: "facebook-adbreak-view",
            shortDescription: "Tăng giờ xem Ad Break Facebook, hỗ trợ bật kiếm tiền.",
            targetType: "video",
            unitLabel: "giờ xem",
            sortOrder: 13,
            plans: [
                {
                    code: "fb-adbreak-sv1",
                    name: "Tăng 60.000 Phút Xem Ad Break ~ Hỗ Trợ Bật Kiếm Tiền Facebook 🔥🔥🔥",
                    pricePerUnit: 3,
                    min: 1000,
                    max: 100000,
                    description: "Tăng Giờ Xem Video Ad Break Facebook ~ Hỗ Trợ Bật Kiếm Tiền ~ Tốc Độ Ổn Định 🔥🔥🔥\nPhù hợp cho các page muốn bật tính năng kiếm tiền từ video",
                },
            ],
        },
    ];

    for (const svc of facebookServices) {
        // Check if service already exists
        const existing = await prisma.socialService.findFirst({
            where: { slug: svc.slug }
        });

        if (existing) {
            console.log(`  ⏭ Service already exists: ${svc.title} (${svc.slug})`);
            continue;
        }

        const service = await prisma.socialService.create({
            data: {
                categoryId,
                title: svc.title,
                slug: svc.slug,
                shortDescription: svc.shortDescription,
                targetType: svc.targetType,
                unitLabel: svc.unitLabel,
                sortOrder: svc.sortOrder,
                coverImageUrl: "/images/facebook-service.jpg",
                plans: {
                    create: svc.plans.map((p) => ({
                        code: p.code,
                        name: p.name,
                        pricePerUnit: p.pricePerUnit,
                        min: p.min,
                        max: p.max,
                        description: p.description,
                        isActive: true,
                    })),
                },
            },
        });
        console.log(`  ✅ Created service: ${service.title} (${svc.plans.length} plans)`);
    }

    console.log("\n🎉 Facebook services seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
