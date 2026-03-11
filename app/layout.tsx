import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/admin/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tài khoản ChatGPT Plus & Premium giá rẻ 2025 | LECHSHOP",
  description: "Mua ChatGPT Plus, YouTube Premium, Netflix chính hãng giá tốt. Giao tài khoản 1–5 phút, hỗ trợ 24/7, bảo hành uy tín.",
  keywords: "mua tài khoản ChatGPT Plus, YouTube Premium giá rẻ, Netflix Premium 4K, Canva Pro bản quyền, CapCut Pro, nâng cấp tài khoản AI, giao tài khoản nhanh, LechShop",
  icons: {
    icon: '/logo-ls.png',
    shortcut: '/logo-ls.png',
    apple: '/logo-ls.png',
  },
  openGraph: {
    title: "Tài khoản ChatGPT Plus & Premium giá rẻ 2025 | LECHSHOP",
    description: "Mua ChatGPT Plus, YouTube Premium, Netflix chính hãng giá tốt. Giao tài khoản 1–5 phút, hỗ trợ 24/7, bảo hành uy tín.",
    type: "website",
    locale: "vi_VN",
    siteName: "LechShop",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
