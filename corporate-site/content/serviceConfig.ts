export interface ServiceServer {
    id: string;
    name: string;
    price: number;
    min: number;
    max: number;
    description?: string;
    status: "active" | "maintenance" | "full";
    code?: string;
}

export interface ServiceData {
    id: string;
    name: string;
    category: string;
    slug: string;
    description: string;
    servers: ServiceServer[];
}

export const serviceConfig: Record<string, ServiceData> = {
    "tiktok-follow": {
        id: "tiktok-follow",
        name: "Tăng Người Theo Dõi",
        category: "TikTok Việt Nam",
        slug: "tiktok-follow",
        description: "Dịch vụ tăng follow TikTok nhanh chóng, an toàn, bảo hành uy tín.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Người Theo Dõi Người Dùng ~ Lên Ngay ~ Tốc Độ: 1.000-5.000/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥",
                price: 20,
                min: 100,
                max: 100000,
                description: "Tăng Người Theo Dõi Người Dùng ~ Lên Ngay ~ Tỉ Lệ Tụt Khá Cao ~ Tốc Độ: 1000-5000/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥 ~ Mua dồn nhiều đơn cùng 1 nick 1 lúc để nhanh hơn\nMáy Chủ Có Tỉ Lệ Tụt Theo Dõi Khá Cao, Không Hỗ Trợ Bảo Hành Cho Máy Chủ Này\nMua bằng link các định dạng sau: https://www.tiktok.com/@user_name hoặc https://vm.tiktok.com/TTPdMUTxmj/\nTỉ Lệ Tụt Cao: Khi Tiktok Quét Có Thể Lên Tới 30-50%",
                status: "active",
                code: "2444"
            },
            {
                id: "sv2",
                name: "Tăng Người Theo Dõi Người Dùng ~ Tốc Độ: 5.00-2.000/Ngày ~ Tài Nguyên Việt Nam Có Tỉ Lệ Video Cao🔥🔥",
                price: 19,
                min: 100,
                max: 100000,
                description: "Tăng Người Theo Dõi Người Dùng ~ Tốc Độ: 1.000-10.000/Ngày ~ Tài Nguyên Việt Nam Có Tỉ Lệ Video Cao🔥🔥",
                status: "active",
                code: "77290"
            },
            {
                id: "sv3",
                name: "Tăng Người Theo Dõi Người Dùng ~ Tốc Độ : 1.000-5.000/Ngày ~ Tỉ Lệ Tụt Trung Bình ~ Tài Nguyên Việt Nam VN🔥🔥🔥",
                price: 35,
                min: 100,
                max: 100000,
                description: "Tăng Người Theo Dõi ~ Tốc Độ : Ngày 1000-5000 ~ Tỉ Lệ Tụt Trung Bình ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nTài Khoản Tiktok Trung Bình Trên 2 Tuần Bấm Theo Dõi",
                status: "active",
                code: "48016"
            },
            {
                id: "sv4",
                name: "Tăng Người Theo Dõi Người Dùng ~ Tốc Độ: 1.000-4.000/Ngày ~ Bắt Đầu Chậm ~ Tỉ Lệ Tụt Thấp ~ Tài Nguyên Ngoại Cổ 🔥🔥",
                price: 30,
                min: 100,
                max: 1000000,
                description: "Tăng Người Theo Dõi Người Dùng ~ Tốc Độ: 1.000-4.000/Ngày ~ Tỉ Lệ Tụt Thấp ~ Tài Nguyên Ngoại Cổ 🔥🔥Có Nhiều Video 🔥🔥\nBắt Đầu Chậm : Bắt Đầu Sau 3-12 Giờ Sau Mua",
                status: "active",
                code: "162181"
            },
            {
                id: "sv5",
                name: "Tăng Người Theo Dõi ~ Tốc Độ Nhanh: 2.000-5.000/Ngày ~ Tỉ Lệ Tụt Thấp ~ Tài Nguyên Ngoại Cổ Giá Rẻ 🔥🔥🔥",
                price: 25,
                min: 100,
                max: 200000,
                description: "Tăng Người Theo Dõi ~ Tốc Độ Nhanh: 2.000-5.000/Ngày ~ Tỉ Lệ Tụt Thấp ~ Tài Nguyên Ngoại Cổ Giá Rẻ 🔥🔥🔥\nTỉ Lệ Tụt Thấp Vì Chạy Theo Dõi Bằng Nick Tiktok Cổ Tạo Lâu Và Có Nhiều Video",
                status: "active",
                code: "100847"
            }
        ]
    },
    "tiktok-like": {
        id: "tiktok-like",
        name: "Tăng Thả Tim Video",
        category: "TikTok Việt Nam",
        slug: "tiktok-like",
        description: "Tăng tim video TikTok giúp video dễ lên xu hướng.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Thả Tim Video Người Dùng Bấm Tay ~ Tốc Độ Nhanh: 1.000-10.000/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 7,
                min: 50,
                max: 50000,
                description: "Tăng Thả Tim Video Người Dùng Bấm Tay ~ Tốc Độ Nhanh: 1.000-10.000/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nMáy Chủ Không Hỗ Trợ Hủy Hoàn ID Đã Mua ~ Vui Lòng Lưu Ý",
                status: "active",
                code: "100848"
            },
            {
                id: "sv2",
                name: "Tăng Lượt Thả Tim Video Người Dùng Bấm Tay ~ Lên Nhanh: 2.000-10.000/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 9,
                min: 50,
                max: 50000,
                description: "Máy Chủ Sử Dụng Nguồn Tài Khoản Việt Nam VN - Người Dùng Bấm Tay\nTốc Độ: 3-20K/ Ngày\nMáy Chủ Không Hỗ Trợ Hủy Đơn Khi Đang Chạy",
                status: "active",
                code: "2438"
            },
            {
                id: "sv4",
                name: "Tăng Thả Tim Video ~ Tốc Độ: 5.000-20.000/Ngày ~ Ẩn Người Thả Tim ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 2,
                min: 10,
                max: 200000,
                description: "Tăng Thả Tim Video ~ Tốc Độ: 5.000-20.000/Ngày ~ Ẩn Người Thả Tim ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                status: "active",
                code: "30479"
            },
            {
                id: "sv5",
                name: "Tăng Thả Tim Video ~ Tốc Độ: 5.000-20.000/Ngày ~ Bảo Hành: 30 Ngày ~ Ẩn Người Thả Tim ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 5,
                min: 10,
                max: 1000000,
                description: "Tăng Thả Tim Video ~ Tốc Độ: 5.000-20.000/Ngày ~ Không Tụt ~ Bảo Hành: 30 Ngày ~ Ẩn Người Thả Tim ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                status: "active",
                code: "158895"
            },
            {
                id: "sv7",
                name: "Tăng Thả Tim Video ~ Người Dùng ~ Lên Nhanh: 5.000-20.000/Ngày ~ Dành Cho Video Cần Tim Lớn ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 26,
                min: 50,
                max: 50000,
                description: "Máy Chủ Sử Dụng Nguồn Tài Khoản Việt Nam VN - Người Dùng Thật ~ Lên Ngay Lập Tức ~ Phù Hợp Cho Chiến Dịch Seeding Lớn",
                status: "active",
                code: "2439"
            }
        ]
    },
    "tiktok-view": {
        id: "tiktok-view",
        name: "Tăng Lượt Xem Video",
        category: "TikTok Việt Nam",
        slug: "tiktok-view",
        description: "Tăng view video TikTok số lượng lớn.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Lượt Xem Video Tiktok ~ Lên Ngay ~ Tốc Độ: 1.000.000-2000.000/Ngày ~ Tài Nguyên Việt Nam",
                price: 0.2,
                min: 500,
                max: 2147483647,
                description: "Tăng Lượt Xem Video Tiktok ~ Lên Ngay ~ Tốc Độ: 1.000.000-2000.000/Ngày ~ Tài Nguyên Việt Nam.\nĐể Giảm Tỉ Lệ Tụt Vui Lòng Chia Nhỏ Đơn Ra Và Đặt Tính Năng Đơn Hàng Lặp Lại Ví Dụ Mua 100K View Order 10K View Số Vòng Lặp Là 9 ( Thời Gian Lặp 30 Phút)",
                status: "active",
                code: "39939"
            },
            {
                id: "sv2",
                name: "Tăng Lượt Xem Video Tiktok ~ Ít Tụt Nhất ~ Tốc Độ: 1.000.000-10.000.000/Ngày ~ Tài Nguyên Việt Nam",
                price: 0.45,
                min: 100,
                max: 2147483647,
                description: "Tăng Lượt Xem Video Tiktok ~ Ít Tụt Nhất ~ Tốc Độ: 1-10M/Ngày ~ Tài Nguyên Việt Nam.\nHệ Thống Tự Động Quét View Nếu Tụt Trong Vòng 24 Giờ Một, Nếu Tụt Sẽ Tự Động Lên Lại View Cho Bạn",
                status: "active",
                code: "87858"
            },
            {
                id: "sv3",
                name: "Tăng Lượt Xem Video Tiktok ~ Nguồn: Xu Hướng ~ Tốt Nhất Để Đưa Video Lên Xu Hướng ~ Xem Video Trong 30 Giây ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 15,
                min: 1000,
                max: 100000,
                description: "Máy Chủ Có Lượt Xem Từ Nguồn Đề Xuất Xu Hướng Của Tiktok, Các Lượt Xem Đều Là Tự Nhiên Nhằm Mục Đích Đẩy Video Của Bạn Lên Bảng Xu Hướng ~ Không Hỗ Trợ Mua Đè Đơn 1 Video Nhiều ID 1 Lúc\nXem Video Trong 30s Phù Hợp Với Việc Cho Nền Tảng Biết Mọi Người Đang Muốn Xem Video Của Bạn Lâu Hơn\nPhù Hợp Cho Các Nhãn Hàng, KOL, KOC, Hay Những Video Muốn Có Người Xem Tự Nhiên Để Lên Xu Hướng ~ Người Xem Xem Video Trong 30 Giây ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nĐơn Xu Hướng Đã Lên Không Hỗ Trợ Hủy Đơn Giữa Chừng ~ Cảm Ơn Các Shop",
                status: "active",
                code: "47993"
            },
            {
                id: "sv4",
                name: "Tăng Lượt Xem Video Tiktok ~ Lên Ngay ~ Ít Tụt ~ Tốc Độ: 10.000.000/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 0.35,
                min: 500,
                max: 1000000000,
                description: "Tăng Lượt Xem Video Tiktok ~ Lên Ngay ~ Ít Tụt ~ Tốc Độ: 10.000.000/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                status: "active",
                code: "47994"
            },
            {
                id: "sv5",
                name: "Tăng Lượt Xem Video Tiktok ~ Nguồn: Xu Hướng ~ Dùng Đưa Video Lên Xu Hướng ~ Xem Video 60 Giây ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 35,
                min: 1000,
                max: 100000000,
                description: "Máy Chủ Có Lượt Xem Từ Nguồn Đề Xuất Xu Hướng Của Tiktok, Các Lượt Xem Đều Là Tự Nhiên Nhằm Mục Đích Đẩy Video Của Bạn Lên Bảng Xu Hướng ~ Không Hỗ Trợ Mua Đè Đơn 1 Video Nhiều ID 1 Lúc\nXem Video Trong 60s Phù Hợp Với Việc Cho Nền Tảng Biết Mọi Người Đang Muốn Xem Video Của Bạn Lâu Hơn\nPhù Hợp Cho Các Nhãn Hàng, KOL, KOC, Hay Những Video Muốn Có Người Xem Tự Nhiên Để Lên Xu Hướng ~ Người Xem Xem Video Trong 60 Giây ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nĐơn Xu Hướng Đã Lên Không Hỗ Trợ Hủy Đơn Giữa Chừng ~ Cảm Ơn Các Shop",
                status: "active",
                code: "2437"
            }
        ]
    },
    "tiktok-livestream-eyes": {
        id: "tiktok-livestream-eyes",
        name: "Tăng Mắt Livestream",
        category: "TikTok Việt Nam",
        slug: "tiktok-livestream-eyes",
        description: "Tăng mắt livestream TikTok.",
        servers: [
            {
                id: "kenh1",
                name: "Kênh 1 (Tăng Mắt Xem Live ~ Lên Siêu Nhanh ~ Tài Nguyên Việt Nam VN ~ Máy Chủ Siêu Ổn Định)",
                price: 3.5,
                min: 50,
                max: 5000,
                description: "Tăng Mắt Xem Live ~ Lên Siêu Nhanh ~ Tài Nguyên Việt Nam VN ~ Máy Chủ Siêu Ổn Định",
                status: "maintenance"
            },
            {
                id: "kenh2",
                name: "Kênh 2 (Tăng Lượt Xem Livestream | Ngoại | Lên Nhanh | Có Tỉ Lệ Lên Thiếu: Không Bảo Hành | Vui Lòng Đọc Mô Tả ~ Máy Chủ Ổn Định)",
                price: 1.2,
                min: 50,
                max: 5000,
                description: "Tăng Lượt Xem Livestream | Ngoại | Lên Nhanh | Có Tỉ Lệ Lên Thiếu: Không Bảo Hành | Vui Lòng Đọc Mô Tả ~ Máy Chủ Ổn Định",
                status: "maintenance"
            },
            {
                id: "kenh3",
                name: "Kênh 3 (Tăng Lượt Xem Livestream | Việt | Lên Nhanh | Bắt Đầu Chậm | Không Bảo Hành)",
                price: 1.0,
                min: 50,
                max: 5000,
                description: "Tăng Lượt Xem Livestream | Việt | Lên Nhanh | Bắt Đầu Chậm | Không Bảo Hành",
                status: "maintenance"
            }
        ]
    },
    "tiktok-save": {
        id: "tiktok-save",
        name: "Tăng Lượt Lưu Video",
        category: "TikTok Việt Nam",
        slug: "tiktok-save",
        description: "Tăng lượt lưu video TikTok.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Lượt Yêu Thích Video ( Lượt Lưu Video ) Người Dùng ~ Tốc Độ Nhanh: 500-5.000 ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 12,
                min: 50,
                max: 1000000,
                description: "Tăng Lượt Yêu Thích Video ( Lượt Lưu Video ) Người Dùng ~ Tốc Độ Nhanh: 500-5.000 ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                status: "active",
                code: "169852"
            },
            {
                id: "sv2",
                name: "Tăng Lượt Yêu Thích Video ( Lượt Lưu Video ) Người Dùng ~ Tốc Độ Nhanh ~ Tài Nguyên Việt Nam VN 🔥🔥",
                price: 3,
                min: 100,
                max: 50000,
                description: "Tăng Lượt Yêu Thích Video ( Lượt Lưu Video ) Người Dùng ~ Tốc Độ Nhanh ~ Tài Nguyên Việt Nam VN 🔥🔥",
                status: "active",
                code: "92797"
            },
            {
                id: "sv3",
                name: "Tăng Lượt Yêu Thích Video ( Lượt Lưu Video ) ~ Tốc Độ Nhanh ~ Tài Nguyên Ngẫu Nhiên 🔥🔥",
                price: 1,
                min: 50,
                max: 100000,
                description: "Tăng Lượt Yêu Thích Video ( Lượt Lưu Video ) ~ Tốc Độ Nhanh ~ Tài Nguyên Ngẫu Nhiên 🔥🔥",
                status: "active",
                code: "62189"
            }
        ]
    },
    "tiktok-share": {
        id: "tiktok-share",
        name: "Tăng Chia Sẻ Video",
        category: "TikTok Việt Nam",
        slug: "tiktok-share",
        description: "Tăng lượt chia sẻ video TikTok.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Lượt Share Video Người Dùng ~ Tốc Độ Nhanh: 500-5.000/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥",
                price: 15,
                min: 50,
                max: 1000000,
                description: "Tăng Lượt Share Video Người Dùng ~ Tốc Độ Nhanh: 500-5.000/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥\nMã Gói: 62190\n- Min - Max: 50 - 1.000.000\n- THÔNG TIN MÁY CHỦ -\nTăng Lượt Share Video ~ Tốc Độ Nhanh ~ Tài Nguyên Việt Nam VN",
                status: "active",
                code: "62190"
            },
            {
                id: "sv2",
                name: "Tăng Lượt Chia Sẻ Video ~ Bắt Đầu Nhanh ~ Tốc Độ: 100K-1M/ Ngày ~ Người Dùng ~ Tài Nguyên Việt Nam + Ngoại 🔥🔥🔥",
                price: 1.5,
                min: 100,
                max: 100000,
                description: "Tăng Lượt Chia Sẻ Video ~ Bắt Đầu Nhanh ~ Tốc Độ: 100K-1M/ Ngày ~ Người Dùng ~ Tài Nguyên Việt Nam + Ngoại 🔥🔥🔥\nMã Gói: 10708\n- Min - Max: 100 - 100.000\n- THÔNG TIN MÁY CHỦ -\nTăng Lượt Chia Sẻ Video ~ Bắt Đầu Nhanh ~ Người Dùng ~ Tài Nguyên Việt Nam + Ngoại 🔥🔥🔥",
                status: "active",
                code: "10708"
            },
            {
                id: "sv3",
                name: "Tăng Lượt Chia Sẻ Video Bắt Đầu Nhanh ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 5,
                min: 1000,
                max: 100000,
                description: "Tăng Lượt Chia Sẻ Video Bắt Đầu Nhanh ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nMã Gói: 2460\n- Min - Max: 1.000 - 100.000\n- THÔNG TIN MÁY CHỦ -\nMáy Chủ Sử Dụng Nguồn Tài Khoản Việt Nam VN - Người Dùng Bấm Tay",
                status: "active",
                code: "2460"
            }
        ]
    },
    "tiktok-comment": {
        id: "tiktok-comment",
        name: "Tăng Bình Luận Video",
        category: "TikTok Việt Nam",
        slug: "tiktok-comment",
        description: "Tăng bình luận video TikTok.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Bình Luận (Comment) Tiktok ~ Lên Siêu Nhanh: 20-200 Cmt/Ngày ~ Giá Rẻ ~ Ổn Định ~ Tài Nguyên Việt Nam VN 🔥🔥🔥🔥",
                price: 179.25,
                min: 10,
                max: 300,
                description: "Tăng Bình Luận (Comment) Tiktok ~ Lên Siêu Nhanh: 20-200 Cmt/Ngày ~ Giá Rẻ ~ Ổn Định ~ Tài Nguyên Việt Nam VN 🔥🔥🔥🔥\nMã Gói: 166022\n- Min - Max: 10 - 300\n- THÔNG TIN MÁY CHỦ -\nTăng Bình Luận (Comment) Tiktok ~ Lên Siêu Nhanh: 20-200 Cmt/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥🔥\nLưu Ý: Để Hoạt Động Hiệu Quả Nhất Vui Lòng Tắt Bộ Lọc Nội Dung Bình Luận, Viết Nội Dung Dài Và Khác Nhau Để Tránh Nội Dung Bình Luận Bị Tiktok Ẩn Đi",
                status: "active",
                code: "166022"
            },
            {
                id: "sv2",
                name: "Tăng Bình Luận Video TikTok - Ổn Định ~ Tốc Độ Nhanh:20-500/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 500,
                min: 10,
                max: 10000,
                description: "Tăng Bình Luận Video TikTok - Ổn Định ~ Tốc Độ Nhanh:20-500/Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nMã Gói: 158859\n- Min - Max: 10 - 10.000\n- THÔNG TIN MÁY CHỦ -\nTăng Bình Luận Video TikTok - Ổn Định ~ Tốc Độ Nhanh:20-500/Ngày ~ Tài Nguyên Việt Nam VN",
                status: "active",
                code: "158859"
            },
            {
                id: "sv3",
                name: "Tăng Bình Luận (Comment) Tiktok ~ Bình Luận Ngẫu Nhiên Cảm Xúc 😍❤️👍🔥🥳 ~ Tốc Độ Nhanh: 1000-10000/Ngày ~ Tài Nguyên Ngoại🔥🔥🔥",
                price: 28,
                min: 10,
                max: 10000,
                description: "Tăng Bình Luận (Comment) Tiktok ~ Bình Luận Ngẫu Nhiên Cảm Xúc 😍❤️👍🔥🥳 ~ Tốc Độ Nhanh: 1000-10000/Ngày ~ Tài Nguyên Ngoại🔥🔥🔥\nMã Gói: 128108\n- Min - Max: 10 - 10.000\n- THÔNG TIN MÁY CHỦ -\nTăng Bình Luận (Comment) Tiktok ~ Bình Luận Ngẫu Nhiên Cảm Xúc 😍❤️👍🔥🥳 ~ Tốc Độ Nhanh: 1000-10000/Ngày ~ Tài Nguyên Ngoại🔥🔥🔥\nKhông Hủy Đơn Khi Đang Chạy, Không Dùng Các Kí Tự Đặc Biệt Trong Nội Dung\nVui Lòng Không Bật Lọc Nội Dung Comment Để Tránh Ẩn Comment Trong Video",
                status: "active",
                code: "128108"
            },
            {
                id: "sv4",
                name: "Tăng Bình Luận (Comment) Tiktok ~ Lên Siêu Nhanh: 50-2000 Cmt/Ngày ~ Tài Nguyên Ngoại🔥🔥",
                price: 15,
                min: 5,
                max: 10000,
                description: "Tăng Bình Luận (Comment) Tiktok ~ Lên Siêu Nhanh: 50-2000 Cmt/Ngày ~ Tài Nguyên Ngoại🔥🔥\nMã Gói: 158823\n- Min - Max: 5 - 10.000\n- THÔNG TIN MÁY CHỦ -\nTăng Bình Luận (Comment) Tiktok ~ Lên Siêu Nhanh: 50-2000 Cmt/Ngày ~ Tài Nguyên Ngoại🔥🔥🔥🔥",
                status: "active",
                code: "158823"
            }
        ]
    },
    "tiktok-seeding": {
        id: "tiktok-seeding",
        name: "Seeding Livestream",
        category: "TikTok Việt Nam",
        slug: "tiktok-seeding",
        description: "Seeding livestream TikTok.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Lượt Like (Thả Tim) Cho Live Stream ~ Lên Luôn Sau Mua ~ Tốc Độ 500K/Ngày 🔥🔥🔥",
                price: 0.4,
                min: 100,
                max: 2147483647,
                description: "Tăng Lượt Like (Thả Tim) Cho Live Stream ~ Lên Luôn Sau Mua ~ Tốc Độ 500K/Ngày 🔥🔥🔥\nMã Gói: 48036\n- Min - Max: 100 - 2.147.483.647\n- THÔNG TIN MÁY CHỦ -\nTăng Lượt Like (Thả Tim) Cho Live Stream ~ Lên Luôn Sau Mua ~ Tốc Độ 500K/Ngày 🔥🔥🔥",
                status: "active",
                code: "48036"
            },
            {
                id: "sv2",
                name: "Tăng Lượt Like (Thả Tim) Cho Live Stream ~ Lên Luôn Sau Mua 🔥🔥🔥",
                price: 0.9,
                min: 100,
                max: 1000000,
                description: "Tăng Lượt Like (Thả Tim) Cho Live Stream ~ Lên Luôn Sau Mua 🔥🔥🔥\nMã Gói: 10722\n- Min - Max: 100 - 1.000.000\n- THÔNG TIN MÁY CHỦ -\nMáy Chủ Chạy Bằng Link : https://www.tiktok.com/@zet.chung98/live\nTốc Độ Lên Nhanh: Bắt Đầu Sau 0-5 Phút",
                status: "active",
                code: "10722"
            }
        ]
    },
    "instagram-like": {
        id: "instagram-like",
        name: "Tăng Tim Bài Viết",
        category: "Instagram",
        slug: "instagram-like",
        description: "Dịch vụ tăng tim (like) bài viết Instagram nhanh chóng, an toàn.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Tim Bài Viết Instagram ~ Tốc Độ Nhanh ~ Tài Nguyên Ngoại 🔥🔥",
                price: 5,
                min: 50,
                max: 50000,
                description: "Tăng Tim Bài Viết Instagram ~ Tốc Độ Nhanh ~ Tài Nguyên Ngoại 🔥🔥\nBắt Đầu: 0-5 Phút\nTốc Độ: 5.000-20.000/Ngày",
                status: "active",
                code: "placeholder"
            },
            {
                id: "sv2",
                name: "Tăng Tim Bài Viết Instagram ~ Chất Lượng Cao ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 12,
                min: 50,
                max: 30000,
                description: "Tăng Tim Bài Viết Instagram ~ Chất Lượng Cao ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nBảo Hành: 30 Ngày\nTốc Độ: 1.000-5.000/Ngày",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "instagram-follow": {
        id: "instagram-follow",
        name: "Tăng Người Theo Dõi",
        category: "Instagram",
        slug: "instagram-follow",
        description: "Dịch vụ tăng người theo dõi Instagram uy tín, bảo hành.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Người Theo Dõi Instagram ~ Tốc Độ: 1.000-5.000/Ngày ~ Tài Nguyên Ngoại 🔥🔥",
                price: 20,
                min: 100,
                max: 100000,
                description: "Tăng Người Theo Dõi Instagram ~ Tốc Độ: 1.000-5.000/Ngày ~ Tài Nguyên Ngoại 🔥🔥\nBắt Đầu: 0-15 Phút\nTỉ Lệ Tụt: Thấp",
                status: "active",
                code: "placeholder"
            },
            {
                id: "sv2",
                name: "Tăng Người Theo Dõi Instagram ~ Chất Lượng Cao ~ Bảo Hành 30 Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 35,
                min: 100,
                max: 50000,
                description: "Tăng Người Theo Dõi Instagram ~ Chất Lượng Cao ~ Bảo Hành 30 Ngày ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nTốc Độ: 500-2.000/Ngày\nTỉ Lệ Tụt: Rất Thấp",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "instagram-comment": {
        id: "instagram-comment",
        name: "Tăng Bình Luận Bài",
        category: "Instagram",
        slug: "instagram-comment",
        description: "Dịch vụ tăng bình luận bài viết Instagram.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Bình Luận Instagram ~ Bình Luận Ngẫu Nhiên ~ Tốc Độ Nhanh ~ Tài Nguyên Ngoại 🔥🔥",
                price: 30,
                min: 10,
                max: 5000,
                description: "Tăng Bình Luận Instagram ~ Bình Luận Ngẫu Nhiên ~ Tốc Độ Nhanh ~ Tài Nguyên Ngoại 🔥🔥\nTốc Độ: 50-500/Ngày",
                status: "active",
                code: "placeholder"
            },
            {
                id: "sv2",
                name: "Tăng Bình Luận Instagram ~ Tùy Chỉnh Nội Dung ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 200,
                min: 10,
                max: 1000,
                description: "Tăng Bình Luận Instagram ~ Tùy Chỉnh Nội Dung ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nTốc Độ: 20-100/Ngày\nViết Nội Dung Theo Yêu Cầu",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "instagram-member": {
        id: "instagram-member",
        name: "Tăng Member Kênh",
        category: "Instagram",
        slug: "instagram-member",
        description: "Dịch vụ tăng member kênh Instagram (member group/channel).",
        servers: [
            {
                id: "sv1",
                name: "Tăng Member Kênh Instagram ~ Tốc Độ Nhanh ~ Tài Nguyên Ngoại 🔥🔥",
                price: 15,
                min: 100,
                max: 50000,
                description: "Tăng Member Kênh Instagram ~ Tốc Độ Nhanh ~ Tài Nguyên Ngoại 🔥🔥\nBắt Đầu: 0-30 Phút\nTốc Độ: 1.000-5.000/Ngày",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "instagram-like-monthly": {
        id: "instagram-like-monthly",
        name: "Mua Gói Like Tháng",
        category: "Instagram",
        slug: "instagram-like-monthly",
        description: "Gói like hàng tháng cho bài viết Instagram, tự động like bài mới.",
        servers: [
            {
                id: "sv1",
                name: "Gói Like Tháng Instagram ~ Tự Động Like Bài Mới ~ 30 Ngày 🔥🔥",
                price: 100,
                min: 100,
                max: 10000,
                description: "Gói Like Tháng Instagram ~ Tự Động Like Bài Mới ~ 30 Ngày 🔥🔥\nTự Động Like Cho Mỗi Bài Viết Mới Trong 30 Ngày\nSố Lượng Like Đặt Là Số Like Cho Mỗi Bài",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "instagram-view": {
        id: "instagram-view",
        name: "Tăng Lượt Xem Video",
        category: "Instagram",
        slug: "instagram-view",
        description: "Dịch vụ tăng lượt xem video/reels Instagram.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Lượt Xem Video/Reels Instagram ~ Tốc Độ Nhanh ~ Tài Nguyên Ngoại 🔥🔥",
                price: 1,
                min: 100,
                max: 1000000,
                description: "Tăng Lượt Xem Video/Reels Instagram ~ Tốc Độ Nhanh ~ Tài Nguyên Ngoại 🔥🔥\nTốc Độ: 10.000-100.000/Ngày\nBắt Đầu: 0-5 Phút",
                status: "active",
                code: "placeholder"
            },
            {
                id: "sv2",
                name: "Tăng Lượt Xem Reels Instagram ~ Chất Lượng Cao ~ Tài Nguyên Việt Nam VN 🔥🔥🔥",
                price: 5,
                min: 500,
                max: 500000,
                description: "Tăng Lượt Xem Reels Instagram ~ Chất Lượng Cao ~ Tài Nguyên Việt Nam VN 🔥🔥🔥\nTốc Độ: 5.000-50.000/Ngày\nXem Video Trong 30 Giây",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "instagram-livestream": {
        id: "instagram-livestream",
        name: "Tăng Mắt Livestream",
        category: "Instagram",
        slug: "instagram-livestream",
        description: "Dịch vụ tăng mắt xem livestream Instagram.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Mắt Xem Livestream Instagram ~ Lên Nhanh ~ Ổn Định 🔥🔥",
                price: 5,
                min: 50,
                max: 5000,
                description: "Tăng Mắt Xem Livestream Instagram ~ Lên Nhanh ~ Ổn Định 🔥🔥\nBắt Đầu: 0-5 Phút\nDuy Trì Suốt Phiên Live",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "youtube-view": {
        id: "youtube-view",
        name: "Tăng View Video",
        category: "YouTube",
        slug: "youtube-view",
        description: "Dịch vụ tăng lượt xem (view) video YouTube.",
        servers: [
            {
                id: "sv1",
                name: "Tăng View YouTube ~ An Toàn ~ Tốc Độ Nhanh",
                price: 25,
                min: 1000,
                max: 1000000,
                description: "Tăng View YouTube ~ An Toàn ~ Tốc Độ Nhanh\nCó Thể Dùng Đề Xuất",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "youtube-subscribers": {
        id: "youtube-subscribers",
        name: "Tăng Đăng Ký Kênh",
        category: "YouTube",
        slug: "youtube-subscribers",
        description: "Dịch vụ tăng lượt đăng ký (subscribe) kênh YouTube.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Subscribe YouTube ~ Uy Tín ~ An Toàn Kênh",
                price: 50,
                min: 100,
                max: 10000,
                description: "Tăng Subscribe YouTube ~ Uy Tín ~ An Toàn Kênh\nBảo hành 30 ngày!",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "youtube-comment": {
        id: "youtube-comment",
        name: "Tăng Bình Luận Video",
        category: "YouTube",
        slug: "youtube-comment",
        description: "Dịch vụ tăng bình luận (comment) video YouTube.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Comment YouTube ~ Nội Dung Tuỳ Chọn",
                price: 100,
                min: 10,
                max: 1000,
                description: "Tăng Comment YouTube ~ Nội Dung Tuỳ Chọn\nBình luận từ người dùng thực.",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "youtube-share": {
        id: "youtube-share",
        name: "Tăng Chia Sẻ Video",
        category: "YouTube",
        slug: "youtube-share",
        description: "Dịch vụ tăng lượt chia sẻ (share) video YouTube.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Share YouTube ~ Tài Nguyên Ngoại",
                price: 15,
                min: 50,
                max: 50000,
                description: "Tăng Share YouTube ~ Tài Nguyên Ngoại",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "youtube-like": {
        id: "youtube-like",
        name: "Tăng Lượt Like Video",
        category: "YouTube",
        slug: "youtube-like",
        description: "Dịch vụ tăng lượt thích (like) video YouTube.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Like YouTube ~ Lên Nhanh",
                price: 10,
                min: 100,
                max: 100000,
                description: "Tăng Like YouTube ~ Lên Nhanh\nNguồn thực tế.",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "youtube-livestream": {
        id: "youtube-livestream",
        name: "Tăng Mắt Livestream",
        category: "YouTube",
        slug: "youtube-livestream",
        description: "Dịch vụ tăng mắt xem trực tiếp (livestream) YouTube.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Mắt Live YouTube ~ Ổn Định",
                price: 30,
                min: 50,
                max: 10000,
                description: "Tăng Mắt Live YouTube ~ Ổn Định\nDuy trì trong suốt live.",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "youtube-4000h": {
        id: "youtube-4000h",
        name: "Tăng 4000H Xem",
        category: "YouTube",
        slug: "youtube-4000h",
        description: "Gói dịch vụ tăng 4000 giờ xem cho kênh YouTube để bật kiếm tiền.",
        servers: [
            {
                id: "sv1",
                name: "Gói 4000 Giờ Xem YouTube ~ An Toàn Tuyệt Đối",
                price: 1500,
                min: 1,
                max: 10,
                description: "Gói 4000 Giờ Xem YouTube ~ An Toàn Tuyệt Đối\nThích hợp cho kênh chờ xét duyệt bật kiếm tiền.",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "threads-like": {
        id: "threads-like",
        name: "Tăng Like Bài Viết",
        category: "Threads",
        slug: "threads-like",
        description: "Dịch vụ tăng lượt thích (like) bài viết Threads.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Like Threads ~ Ổn Định",
                price: 15,
                min: 50,
                max: 10000,
                description: "Tăng Like Threads ~ Lên Nhanh",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "threads-follow": {
        id: "threads-follow",
        name: "Tăng Người Theo Dõi",
        category: "Threads",
        slug: "threads-follow",
        description: "Dịch vụ tăng người theo dõi (follower) Threads.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Follow Threads ~ An Toàn",
                price: 25,
                min: 50,
                max: 50000,
                description: "Tăng Follow Threads an toàn cho tài khoản",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "threads-comment": {
        id: "threads-comment",
        name: "Tăng Bình Luận",
        category: "Threads",
        slug: "threads-comment",
        description: "Dịch vụ tăng bình luận bài viết Threads.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Comment Threads ~ Tùy Chỉnh",
                price: 50,
                min: 10,
                max: 1000,
                description: "Tăng Comment Threads nội dung tùy chọn",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "shopee-like": {
        id: "shopee-like",
        name: "Tăng Lượt Thích Sản Phẩm",
        category: "Shopee",
        slug: "shopee-like",
        description: "Dịch vụ tăng lượt thích (like) cho sản phẩm trên Shopee.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Like Shopee ~ Lên Nhanh",
                price: 20,
                min: 50,
                max: 10000,
                description: "Tăng lượt thích sản phẩm Shopee an toàn",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "shopee-follow": {
        id: "shopee-follow",
        name: "Tăng Theo Dõi Gian Hàng",
        category: "Shopee",
        slug: "shopee-follow",
        description: "Dịch vụ tăng người theo dõi (follower) gian hàng Shopee.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Follow Shopee ~ Uy Tín",
                price: 35,
                min: 50,
                max: 50000,
                description: "Tăng Follow Shop chuẩn SEO",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "shopee-livestream": {
        id: "shopee-livestream",
        name: "Tăng Người Xem Livestream",
        category: "Shopee",
        slug: "shopee-livestream",
        description: "Dịch vụ tăng người xem trực tiếp (livestream) Shopee.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Mắt Live Shopee ~ Ổn Định",
                price: 40,
                min: 50,
                max: 5000,
                description: "Tăng mắt xem live Shopee duy trì suốt phiên",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "spotify-play": {
        id: "spotify-play",
        name: "Tăng Lượt Nghe Bài Hát",
        category: "Spotify",
        slug: "spotify-play",
        description: "Dịch vụ tăng lượt nghe (play) bài hát trên Spotify.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Nghe Bài Hát Spotify ~ Tương Tác Thật",
                price: 50,
                min: 1000,
                max: 1000000,
                description: "Tăng Play bài hát Spotify an toàn, tốc độ ổn định",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "spotify-monthly": {
        id: "spotify-monthly",
        name: "Tăng Người Nghe Hàng Tháng Nghệ Sĩ",
        category: "Spotify",
        slug: "spotify-monthly",
        description: "Dịch vụ tăng người nghe hàng tháng cho tài khoản nghệ sĩ Spotify.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Monthly Listeners ~ Uy Tín",
                price: 60,
                min: 1000,
                max: 500000,
                description: "Tăng người nghe hàng tháng chuẩn chỉnh",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "spotify-follow": {
        id: "spotify-follow",
        name: "Tăng Người Theo Dõi",
        category: "Spotify",
        slug: "spotify-follow",
        description: "Dịch vụ tăng người theo dõi kênh nghệ sĩ hoặc playlist Spotify.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Follow Spotify ~ An Toàn",
                price: 100,
                min: 100,
                max: 50000,
                description: "Tăng Follow tài khoản, podcast hoặc playlist Spotify",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "traffic-multi-source": {
        id: "traffic-multi-source",
        name: "Tăng Truy Cập Website Nhiều Nguồn",
        category: "Website Traffic",
        slug: "traffic-multi-source",
        description: "Dịch vụ tăng lượng truy cập (traffic) vào website từ nhiều nguồn khác nhau.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Traffic Website ~ Theo Ngành Nghề",
                price: 5,
                min: 1000,
                max: 1000000,
                description: "Tăng truy cập website đa nguồn: Direct, Social, Search",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "traffic-iphone14": {
        id: "traffic-iphone14",
        name: "Tăng Truy Cập Website Iphone 14",
        category: "Website Traffic",
        slug: "traffic-iphone14",
        description: "Dịch vụ tăng lượng truy cập (traffic) vào website từ thiết bị Iphone 14.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Traffic Website ~ Thiết Bị Iphone 14",
                price: 15,
                min: 1000,
                max: 100000,
                description: "Tăng truy cập website từ user agent Iphone 14",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "twitter-like": {
        id: "twitter-like",
        name: "Tăng Like Twitter",
        category: "Twitter",
        slug: "twitter-like",
        description: "Dịch vụ tăng lượt thích (like) bài viết Twitter/X.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Like Twitter ~ Lên Nhanh",
                price: 15,
                min: 50,
                max: 10000,
                description: "Tăng Like Twitter an toàn",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "twitter-follow": {
        id: "twitter-follow",
        name: "Tăng Theo Dõi Twitter",
        category: "Twitter",
        slug: "twitter-follow",
        description: "Dịch vụ tăng người theo dõi (follower) tài khoản Twitter/X.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Follow Twitter ~ Uy Tín",
                price: 30,
                min: 50,
                max: 50000,
                description: "Tăng Follow Twitter chuẩn auth",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "twitter-comment": {
        id: "twitter-comment",
        name: "Tăng Comment Twitter",
        category: "Twitter",
        slug: "twitter-comment",
        description: "Dịch vụ tăng bình luận bài viết Twitter/X.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Comment Twitter ~ Tự Chọn",
                price: 40,
                min: 10,
                max: 1000,
                description: "Tăng comment nội dung tùy chọn",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "twitter-retweet": {
        id: "twitter-retweet",
        name: "Tăng Retweet Twitter",
        category: "Twitter",
        slug: "twitter-retweet",
        description: "Dịch vụ tăng lượt retweet bài viết Twitter/X.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Retweet Twitter ~ Lan Truyền Mạnh",
                price: 20,
                min: 50,
                max: 20000,
                description: "Tăng Retweet nhanh chóng",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "twitter-impression": {
        id: "twitter-impression",
        name: "Tăng Lượt Tiếp Cận",
        category: "Twitter",
        slug: "twitter-impression",
        description: "Dịch vụ tăng lượt tiếp cận (impression) bài viết Twitter/X.",
        servers: [
            {
                id: "sv1",
                name: "Tăng Impression Twitter",
                price: 5,
                min: 1000,
                max: 1000000,
                description: "Tăng lượt tiếp cận (view) bài viết",
                status: "active",
                code: "placeholder"
            }
        ]
    },
    "tiktok-like-monthly": {
        id: "tiktok-like-monthly",
        name: "Mua Gói Tim Tháng",
        category: "TikTok Việt Nam",
        slug: "tiktok-like-monthly",
        description: "Gói dịch vụ tăng lượt thích (tim) bài viết tự động theo tháng trên TikTok.",
        servers: [
            {
                id: "sv1",
                name: "Gói Cơ Bản",
                price: 150000,
                min: 1,
                max: 10,
                description: "Mua Gói Tim Tháng Cơ Bản",
                status: "active",
                code: "placeholder"
            }
        ]
    }
};

export const serviceCategories = [
    {
        name: "TikTok Việt Nam",
        icon: "FaTiktok",
        slug: "tiktok-global",
        services: [
            "tiktok-view",
            "tiktok-like",
            "tiktok-follow",
            "tiktok-livestream-eyes",
            "tiktok-save",
            "tiktok-share",
            "tiktok-comment",
            "tiktok-seeding",
            "tiktok-like-monthly"
        ]
    },
    {
        name: "Facebook",
        icon: "FaFacebook",
        slug: "facebook",
        services: ["fb-like", "fb-follow", "fb-comment"]
    },
    {
        name: "Instagram",
        icon: "FaInstagram",
        slug: "instagram",
        services: [
            "instagram-like",
            "instagram-follow",
            "instagram-comment",
            "instagram-member",
            "instagram-like-monthly",
            "instagram-view",
            "instagram-livestream"
        ]
    },
    {
        name: "YouTube",
        icon: "FaYoutube",
        slug: "youtube",
        services: [
            "youtube-view",
            "youtube-subscribers",
            "youtube-comment",
            "youtube-share",
            "youtube-like",
            "youtube-livestream",
            "youtube-4000h"
        ]
    },
    {
        name: "Threads",
        icon: "FaAt",
        slug: "threads",
        services: [
            "threads-like",
            "threads-follow",
            "threads-comment"
        ]
    },
    {
        name: "Shopee",
        icon: "FaShoppingBag",
        slug: "shopee",
        services: [
            "shopee-like",
            "shopee-follow",
            "shopee-livestream"
        ]
    },
    {
        name: "Spotify",
        icon: "FaSpotify",
        slug: "spotify",
        services: [
            "spotify-play",
            "spotify-monthly",
            "spotify-follow"
        ]
    },
    {
        name: "Website Traffic",
        icon: "FaGlobe",
        slug: "website-traffic",
        services: [
            "traffic-multi-source",
            "traffic-iphone14"
        ]
    },
    {
        name: "Twitter",
        icon: "FaTwitter",
        slug: "twitter",
        services: [
            "twitter-like",
            "twitter-follow",
            "twitter-comment",
            "twitter-retweet",
            "twitter-impression"
        ]
    }
];
