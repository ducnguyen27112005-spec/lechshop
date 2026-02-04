import type { Metadata } from "next";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import FloatingContactBar from "@/components/shared/FloatingContactBar";

export const metadata: Metadata = {
    title: "TechCorp Services | Netflix & ChatGPT Plus",
    description: "Hỗ trợ đăng ký Netflix, ChatGPT Plus chính hãng, uy tín",
};

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="min-h-screen">{children}</main>
            <FloatingContactBar />
            <Footer />
        </>
    );
}
