import { AdminSidebar } from "@/components/admin/layout/Sidebar";
import { AdminTopbar } from "@/components/admin/layout/Topbar";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminTopbar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
