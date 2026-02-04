import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/shared/Card";

const guides = [
    {
        id: 1,
        title: "Hướng dẫn đăng ký Netflix",
        steps: [
            "Chọn gói Netflix Premium phù hợp",
            "Thanh toán qua các phương thức được hỗ trợ",
            "Nhận gift code hợp lệ qua email",
            "Kích hoạt tài khoản Netflix của bạn",
            "Bắt đầu trải nghiệm giải trí đỉnh cao",
        ],
    },
    {
        id: 2,
        title: "Hướng dẫn nâng cấp ChatGPT Plus",
        steps: [
            "Chọn gói ChatGPT Plus",
            "Cung cấp thông tin tài khoản ChatGPT",
            "Thanh toán an toàn qua VNPay/Momo",
            "Đợi kích hoạt trong vòng 30 phút",
            "Truy cập GPT-4 và các tính năng cao cấp",
        ],
    },
];

export default function GuidesPage() {
    return (
        <div className="py-16">
            <Container>
                <SectionHeading
                    title="Hướng dẫn sử dụng"
                    subtitle="Các bước đơn giản để sử dụng dịch vụ"
                    centered
                    className="mb-12"
                />

                <div className="max-w-4xl mx-auto space-y-8">
                    {guides.map((guide) => (
                        <Card key={guide.id} className="p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                {guide.title}
                            </h3>
                            <ol className="space-y-4">
                                {guide.steps.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                                            {idx + 1}
                                        </span>
                                        <span className="pt-1 text-gray-700">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </Card>
                    ))}

                    <Card className="p-8 bg-blue-50 border-blue-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Cần hỗ trợ thêm?
                        </h3>
                        <p className="text-gray-700 mb-4">
                            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7. Hãy liên hệ với chúng tôi qua:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li>📞 Hotline: 0868.127.491</li>
                            <li>📧 Email: lechshopcskh@gmail.com</li>
                            <li>💬 Zalo/Facebook Messenger</li>
                        </ul>
                    </Card>
                </div>
            </Container>
        </div>
    );
}
