import type { Metadata } from "next";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import FloatingContactBar from "@/components/shared/FloatingContactBar";

export const metadata: Metadata = {
    title: "LechShop - Mua Netflix, ChatGPT Plus, Canva Pro, Gemini Pro Giá Rẻ",
    description: "Chuyên cung cấp tài khoản Netflix, ChatGPT Plus, Canva Pro, Google Gemini, Microsoft 365 giá rẻ. Giao nhanh, hỗ trợ 24/7, bảo hành uy tín.",
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
