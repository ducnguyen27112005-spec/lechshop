import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/shared/Card";
import { MessageCircle, Mail, Phone } from "lucide-react";

const faqItems = [
    {
        question: "Dịch vụ của bạn có an toàn không?",
        answer: "Hoàn toàn an toàn! Chúng tôi chỉ cung cấp gift code chính hãng và hỗ trợ thanh toán qua các cổng thanh toán uy tín.",
    },
    {
        question: "Tôi có thể hoàn tiền không?",
        answer: "Có, chúng tôi có chính sách hoàn tiền trong vòng 7 ngày nếu dịch vụ không hoạt động như cam kết.",
    },
    {
        question: "Mất bao lâu để kích hoạt?",
        answer: "Thông thường chỉ mất từ 15-30 phút sau khi thanh toán thành công.",
    },
    {
        question: "Tôi có thể gia hạn không?",
        answer: "Có, bạn có thể gia hạn bất kỳ lúc nào trước khi dịch vụ hết hạn.",
    },
];

export default function SupportPage() {
    return (
        <div className="py-16">
            <Container>
                <SectionHeading
                    title="Hỗ trợ khách hàng"
                    subtitle="Chúng tôi luôn sẵn sàng giúp đỡ bạn"
                    centered
                    className="mb-12"
                />

                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <Card className="p-6 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                            <Phone className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Hotline</h3>
                        <a
                            href="tel:0868127491"
                            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                        >
                            0868.127.491
                        </a>
                        <p className="text-sm text-gray-500 mt-2">24/7 Support</p>
                    </Card>

                    <Card className="p-6 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                            <Mail className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                        <a
                            href="mailto:lechshopcskh@gmail.com"
                            className="text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            lechshopcskh@gmail.com
                        </a>
                        <p className="text-sm text-gray-500 mt-2">Reply in 2 hours</p>
                    </Card>

                    <Card className="p-6 text-center">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                            <MessageCircle className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                        <a
                            href="https://zalo.me/0868127491"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                        >
                            Chat qua Zalo
                        </a>
                        <p className="text-sm text-gray-500 mt-2">Instant response</p>
                    </Card>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Câu hỏi thường gặp (FAQ)
                    </h2>
                    <div className="space-y-4">
                        {faqItems.map((item, idx) => (
                            <Card key={idx} className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {item.question}
                                </h3>
                                <p className="text-gray-600">{item.answer}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
