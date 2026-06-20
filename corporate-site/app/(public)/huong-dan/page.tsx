import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Image from "next/image";
import { ShoppingCart, FileText, CreditCard, Mail, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        id: 1,
        icon: ShoppingCart,
        title: "Tìm kiếm và truy cập sản phẩm",
        image: "/images/bươc 1.jpg",
        content: (
            <>
                Truy cập trang chủ của{" "}
                <Link href="/" className="text-blue-600 font-bold hover:underline">
                    lechshop.com
                </Link>{" "}
                và tìm sản phẩm bạn muốn mua.
                <br />
                Chọn <strong>&quot;Gói đăng ký&quot;</strong> và chọn{" "}
                <strong>&quot;Thời gian đăng ký&quot;</strong>, sau đó nhấn{" "}
                <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                    Mua Ngay
                </span>{" "}
                hoặc{" "}
                <span className="inline-block bg-gray-700 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                    Thêm vào giỏ
                </span>{" "}
                nếu muốn mua thêm nhiều sản phẩm khác.
            </>
        ),
    },
    {
        id: 2,
        icon: FileText,
        title: "Điền thông tin đơn hàng",
        image: "/images/bươc 2.jpg",
        content: (
            <>
                Sau khi chọn sản phẩm và bấm <strong>Mua Ngay</strong>, bạn sẽ được chuyển tới
                trang thông tin đặt hàng. Nhập đủ thông tin thanh toán bao gồm:
                <ul className="mt-3 space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                        Họ tên người mua hàng
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                        Số điện thoại{" "}
                        <span className="text-red-500 text-xs font-medium">
                            (Lưu ý nhập đúng số Zalo để đơn hàng được xử lý nhanh nhất)
                        </span>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                        Địa chỉ email nhận hàng
                    </li>
                </ul>
                <p className="mt-3 text-sm text-gray-500 italic">
                    Để thanh toán, hãy tick vào ô{" "}
                    <strong>&quot;Tôi đã đọc và đồng ý với Điều khoản &amp; Điều kiện của website&quot;</strong>
                </p>
            </>
        ),
    },
    {
        id: 3,
        icon: CreditCard,
        title: "Thực hiện thanh toán đơn hàng",
        image: "/images/bươc 3.jpg",
        content: (
            <>
                Bạn sẽ có{" "}
                <strong className="text-red-600">15:00 phút</strong> để thanh toán đơn hàng.
                Sau khi quét mã thanh toán xong, giao diện sẽ tự động chuyển sang trang nhận hàng.
            </>
        ),
    },
    {
        id: 4,
        icon: Mail,
        title: "Nhận tài khoản và hướng dẫn đăng nhập qua email",
        image: null,
        content: (
            <>
                Đến bước này nếu bạn gặp khó khăn trong việc nhận tài khoản hoặc đăng nhập,
                hãy liên hệ với chúng tôi để được hỗ trợ ngay nhé!
            </>
        ),
    },
];

export default function GuidesPage() {
    return (
        <div className="py-16">
            <Container>
                <SectionHeading
                    title="Hướng Dẫn Mua Hàng"
                    subtitle="Các bước đơn giản để mua hàng tại LECHSHOP"
                    centered
                    className="mb-12"
                />

                <div className="max-w-4xl mx-auto">
                    {/* Mục lục */}
                    <details className="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200 group">
                        <summary className="font-bold text-lg cursor-pointer text-gray-900 flex items-center justify-between select-none">
                            <span>📑 Mục lục</span>
                            <span className="transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <nav className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                            {steps.map((step) => (
                                <a
                                    key={step.id}
                                    href={`#buoc-${step.id}`}
                                    className="block text-gray-700 hover:text-blue-600 pl-4 border-l-2 border-gray-200 hover:border-blue-600 transition-colors"
                                >
                                    Bước {step.id}: {step.title}
                                </a>
                            ))}
                        </nav>
                    </details>

                    {/* Steps */}
                    <div className="space-y-8">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <section
                                    key={step.id}
                                    id={`buoc-${step.id}`}
                                    className="scroll-mt-24 bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                            {step.id}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <Icon className="h-5 w-5 text-blue-600" />
                                                Bước {step.id}: {step.title}
                                            </h3>
                                            <div className="text-gray-700 leading-relaxed">
                                                {step.content}
                                            </div>

                                            {/* Step image */}
                                            {step.image && (
                                                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                    <Image
                                                        src={step.image}
                                                        alt={`Bước ${step.id}: ${step.title}`}
                                                        width={800}
                                                        height={450}
                                                        className="w-full h-auto"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                    </div>

                    {/* Thank You + Support */}
                    <div className="mt-12 text-center">
                        <p className="text-2xl font-black text-gray-900 mb-2">Thank You So Much! 🙏</p>
                        <p className="text-gray-500 mb-8">Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của LECHSHOP</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Cần hỗ trợ thêm?
                        </h3>
                        <p className="text-gray-700 mb-4">
                            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7:
                        </p>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                                    <Phone className="h-4 w-4 text-red-500" />
                                </span>
                                Hotline:{" "}
                                <a href="tel:0868127491" className="font-bold text-red-600 hover:underline">
                                    0868.127.491
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                </span>
                                Email:{" "}
                                <a href="mailto:lechshop.cskh@gmail.com" className="font-bold text-blue-600 hover:underline">
                                    lechshop.cskh@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <MessageCircle className="h-4 w-4 text-blue-500" />
                                </span>
                                Zalo:{" "}
                                <a
                                    href="https://zalo.me/0868127491"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-blue-600 hover:underline"
                                >
                                    0868.127.491
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </Container>
        </div>
    );
}
