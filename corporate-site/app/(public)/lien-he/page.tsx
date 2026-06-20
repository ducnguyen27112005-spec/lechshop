"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/shared/Card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import RequestForm from "@/components/common/RequestForm";
import { siteConfig } from "@/content/site";
import SiteInfo from "@/components/common/SiteInfo";

function ContactFormSection() {
    const searchParams = useSearchParams();
    const prefilledService = searchParams.get("service") || "Tư vấn dịch vụ";
    const prefilledType = (searchParams.get("type") as "premium" | "social") || "social";
    const prefilledSlug = searchParams.get("slug") || "";
    const prefilledPrice = searchParams.get("price") || "";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
                <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">Địa chỉ</h3>
                            <p className="text-gray-600 leading-relaxed">
                                <SiteInfo type="address" fallback={siteConfig.address} />
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 flex-shrink-0">
                            <Phone className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">Điện thoại</h3>
                            <p className="text-gray-600">
                                Hotline: <SiteInfo type="phone" fallback={siteConfig.phone} />
                            </p>
                            <p className="text-sm text-gray-500 mt-1 italic">Hỗ trợ 24/7 qua Zalo & Phone</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 flex-shrink-0">
                            <Mail className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                            <p className="text-gray-600">
                                <SiteInfo type="email" fallback={siteConfig.email} />
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow border-none bg-blue-600 text-white">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white flex-shrink-0">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold mb-1">Giờ làm việc</h3>
                            <p className="text-blue-50 leading-relaxed text-sm">
                                <SiteInfo type="workingHours" fallback="Thứ 2 - Thứ 6: 08:00 - 18:00" />
                                <br />
                                <span className="font-semibold text-white">Hỗ trợ Zalo/Messager: 24/7</span>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Integrated Request Form */}
            <div id="request-form">
                <RequestForm
                    serviceName={prefilledService}
                    serviceType={prefilledType}
                    serviceSlug={prefilledSlug}
                    startingPrice={parseInt(prefilledPrice.replace(/\D/g, '')) || 0}
                    className="h-full border-2 border-blue-100 ring-4 ring-blue-50"
                />
            </div>
        </div>
    );
}

export default function ContactPage() {
    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <Container>
                <SectionHeading
                    title="Liên hệ với chúng tôi"
                    subtitle="Chúng tôi rất mong được phục vụ bạn"
                    centered
                    className="mb-12"
                />

                <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
                    <ContactFormSection />
                </Suspense>
            </Container>
        </div>
    );
}
