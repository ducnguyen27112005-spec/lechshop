import { routes } from "@/lib/routes";
import Link from "next/link";

export default function TopBar() {
    return (
        <div className="bg-gray-100 border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-8 items-center justify-end gap-6 text-[11px] font-medium tracking-tight uppercase text-gray-600">
                    <Link
                        href={routes.contact}
                        className="hover:text-blue-700 transition-colors"
                    >
                        Liên hệ
                    </Link>
                    <Link
                        href="#"
                        className="hover:text-blue-700 transition-colors"
                    >
                        Tuyển dụng
                    </Link>
                    <div className="flex items-center gap-1">
                        <button className="text-gray-900 font-bold">
                            VI
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-gray-400 hover:text-blue-700 transition-colors">
                            EN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
