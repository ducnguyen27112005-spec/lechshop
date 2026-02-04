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
    { name: "Sáng tạo nội dung", icon: Palette, href: "/danh-muc/sang-tao" },
    { name: "Làm việc & Văn phòng", icon: Briefcase, href: "/danh-muc/lam-viec" },
    { name: "Học tập & Nghiên cứu", icon: GraduationCap, href: "/danh-muc/hoc-tap" },
    { name: "Kinh doanh & Marketing", icon: LayoutTemplate, href: "/danh-muc/marketing" },
    { name: "Tăng tương tác MXH", icon: ThumbsUp, href: "/danh-muc/mxh" },
    { name: "Phần mềm", icon: HardDrive, href: "/danh-muc/phan-mem" },
    { name: "Dịch vụ bán chạy", icon: Zap, href: "/danh-muc/ban-chay" },
    { name: "Các sản phẩm khác", icon: Plus, href: "/danh-muc/khac" },
];

export default function CategoryMenu() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full py-2">
            <ul className="space-y-1">
                {categories.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
