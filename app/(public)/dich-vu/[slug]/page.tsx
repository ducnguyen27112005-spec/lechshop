import { notFound } from "next/navigation";
import Container from "@/components/shared/Container";
import ServiceSidebar from "@/components/service/ServiceSidebar";
import ServiceOrderForm from "@/components/service/ServiceOrderForm";
import { getServiceBySlug } from "@/lib/serviceData";

// Always fetch fresh data from DB (no caching)
export const dynamic = "force-dynamic";

interface ServicePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ServicePageProps) {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);
    if (!service) return { title: "Dịch vụ không tồn tại" };
    return {
        title: `${service.name} - LechShop`,
        description: service.description,
    };
}

export default async function ServicePage({ params }: ServicePageProps) {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);

    if (!service) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* SIDEBAR */}
                    <div className="lg:col-span-3">
                        <ServiceSidebar />
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-9">
                        <ServiceOrderForm service={service} />

                        {/* GUIDE / INFO SECTION */}
                        <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Lưu ý khi sử dụng dịch vụ</h3>
                            <ul className="space-y-2 text-gray-600 text-sm list-disc pl-5">
                                <li>Vui lòng kiểm tra kỹ đường dẫn (Link) trước khi đặt hàng. Chúng tôi không hoàn tiền nếu bạn điền sai link.</li>
                                <li>Hệ thống xử lý tự động 100%, đơn hàng sẽ được bắt đầu sau vài phút.</li>
                                <li>Không đổi User/URL trong quá trình chạy, nếu lỗi sẽ không được bảo hành.</li>
                                <li>Nếu cần hỗ trợ, vui lòng liên hệ CSKH qua Zalo hoặc Fanpage.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
