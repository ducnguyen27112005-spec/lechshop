import Container from "../shared/Container";
import SectionHeading from "../shared/SectionHeading";
import { Shield, Clock, Headphones, Award } from "lucide-react";

const reasons = [
    {
        icon: Shield,
        title: "An toàn & Bảo mật",
        description: "Tất cả giao dịch được mã hóa, bảo vệ thông tin khách hàng tuyệt đối",
    },
    {
        icon: Clock,
        title: "Nhanh chóng",
        description: "Kích hoạt dịch vụ trong vòng 30 phút sau khi thanh toán",
    },
    {
        icon: Headphones,
        title: "Hỗ trợ 24/7",
        description: "Đội ngũ tư vấn viên sẵn sàng hỗ trợ mọi lúc, mọi nơi",
    },
    {
        icon: Award,
        title: "Uy tín hàng đầu",
        description: "Hơn 10,000+ khách hàng tin tưởng và sử dụng dịch vụ",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-16 bg-gray-50">
            <Container>
                <SectionHeading
                    title="Tại sao chọn chúng tôi?"
                    subtitle="Cam kết mang đến trải nghiệm tốt nhất cho khách hàng"
                    centered
                    className="mb-12"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reasons.map((reason) => {
                        const Icon = reason.icon;
                        return (
                            <div
                                key={reason.title}
                                className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {reason.title}
                                </h3>
                                <p className="text-sm text-gray-600">{reason.description}</p>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
