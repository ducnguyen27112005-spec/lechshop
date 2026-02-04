import { routes } from "@/lib/routes";

export const siteConfig = {
    name: "LECHSHOP",
    description: "Hỗ trợ đăng ký Netflix, ChatGPT Plus chính hãng, uy tín",
    phone: "0868.127.491",
    email: "lechshopcskh@gmail.com",
    address: "Số Nhà 20, Ngõ 51, Khu Đô Thị Cầu Bưu, Hà Đông, Hà Nội",

    social: {
        facebook: "https://m.me/binsocial",
        linkedin: "https://linkedin.com/company/techcorp",
        youtube: "https://youtube.com/@techcorp",
        zalo: "https://zalo.me/0868127491",
    },

    menu: [
        { label: "Trang chủ", href: routes.home },
        { label: "Về chúng tôi", href: routes.aboutUs },
        { label: "Sản phẩm", href: "/#premium" },
        { label: "Dịch vụ", href: "/#dich-vu" },
        { label: "Hướng dẫn", href: routes.guides },
        { label: "Tin tức", href: routes.news },
        { label: "Hỗ trợ", href: routes.support },
        { label: "Liên hệ", href: routes.contact },
    ],

    topBar: [
        { label: "Liên hệ", href: routes.contact },
        { label: "Tuyển dụng", href: "#" },
    ],
};
