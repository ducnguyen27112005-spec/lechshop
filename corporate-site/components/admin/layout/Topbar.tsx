"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut, Bell, User } from "lucide-react";

export function AdminTopbar() {
    const { data: session } = useSession();

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
            <div>
                <h1 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Hệ thống quản trị nội bộ</h1>
            </div>

            <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-blue-600 transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{session?.user?.name || "Admin"}</p>
                        <p className="text-[11px] text-gray-500 font-medium">Tài khoản quản trị</p>
                    </div>

                    <button
                        onClick={() => signOut()}
                        className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-600 transition-all font-bold text-sm flex items-center gap-2"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
