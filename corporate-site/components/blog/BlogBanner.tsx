import Link from "next/link";
import Container from "@/components/shared/Container";

export default function BlogBanner() {
    return (
        <div className="w-full bg-[#1e2330] text-white py-24 relative overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/images/blog-banner.mp4" type="video/mp4" />
            </video>

            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <Container className="relative z-10">
                <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium text-gray-300 mb-2">
                        <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
                        <span className="mx-2">-</span>
                        <span className="text-white">blog</span>
                    </div>
                    <h1 className="text-4xl font-bold uppercase tracking-wide">blog</h1>
                </div>
            </Container>
        </div>
    );
}
