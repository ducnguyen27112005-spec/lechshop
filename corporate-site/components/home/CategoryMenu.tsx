"use client";

import {
    Bot,
    Palette,
    LayoutTemplate,
    Briefcase,
    GraduationCap,
    HardDrive,
    Image as ImageIcon,
    Gamepad2,
    Search,
    Cloud,
    Cpu,
    PenTool,
    Key,
    Shield,
    Bug,
    Plus,
    ThumbsUp,
    Zap
} from "lucide-react";
import Link from "next/link";

const categories = [
    { name: "Giải trí cao cấp", icon: Gamepad2, href: "/danh-muc/giai-tri" },
    { name: "Công cụ AI thông minh", icon: Bot, href: "/danh-muc/cong-cu-ai" },
    { name: "Thiết kế & Đồ họa", icon: Palette, href: "/danh-muc/sang-tao-noi-dung" },
    { name: "Làm việc & Văn phòng", icon: Briefcase, href: "/danh-muc/lam-viec-van-phong" },
    { name: "Học tập & Nghiên cứu", icon: GraduationCap, href: "/danh-muc/hoc-tap-nghien-cuu" },
    { name: "Kinh doanh & Marketing", icon: LayoutTemplate, href: "/danh-muc/kinh-doanh-marketing" },
    { name: "Tăng tương tác MXH", icon: ThumbsUp, href: "/danh-muc/mxh" },
    { name: "Phần mềm", icon: HardDrive, href: "/danh-muc/phan-mem" },
    { name: "Dịch vụ bán chạy", icon: Zap, href: "/danh-muc/dich-vu-ban-chay" },
];

export default function CategoryMenu() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full py-1.5 overflow-hidden">
            <ul>
                {categories.map((item, index) => (
                    <li key={index} className="group">
                        <Link
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-200"
                        >
                            <item.icon className="w-[18px] h-[18px] text-gray-400 group-hover:text-blue-500 transition-colors duration-200 shrink-0" />
                            <span className="font-medium truncate">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
