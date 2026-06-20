import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import { siteConfig } from "@/content/site";
import Link from "next/link";
import {
    CheckCircle,
    ShieldCheck,
    Users,
    Clock,
    Globe,
    Zap,
    Gift,
    Layers,
    Wrench,
    Calendar,
    Activity
} from "lucide-react";

export default function AboutPage() {
    return (
        <div className="py-16">
            <Container>
                <SectionHeading
                    title="Về LECHSHOP"
                    subtitle="Bình dân hóa công nghệ cho người Việt"
                    centered
                    className="mb-12"
                />

                <div className="max-w-4xl mx-auto">
                    {/* Mục lục ẩn */}
                    <details className="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200 group">
                        <summary className="font-bold text-lg cursor-pointer text-gray-900 mb-2 flex items-center justify-between select-none">
                            <span>📑 MỤC LỤC NỘI DUNG</span>
                            <span className="transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <nav className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                            <a href="#tam-nhin" className="block text-gray-700 hover:text-blue-600 pl-4 border-l-2 border-gray-200 hover:border-blue-600 transition-colors">
                                1. Tầm nhìn & Sứ mệnh của LECHSHOP
                            </a>
                            <a href="#khac-biet" className="block text-gray-700 hover:text-blue-600 pl-4 border-l-2 border-gray-200 hover:border-blue-600 transition-colors">
                                2. Vì sao LECHSHOP lại khác biệt? (4 Giá trị cốt lõi)
                            </a>
                            <a href="#con-so" className="block text-gray-700 hover:text-blue-600 pl-4 border-l-2 border-gray-200 hover:border-blue-600 transition-colors">
                                3. Những con số thể hiện sự tin tưởng
                            </a>
                            <a href="#linh-vuc" className="block text-gray-700 hover:text-blue-600 pl-4 border-l-2 border-gray-200 hover:border-blue-600 transition-colors">
                                4. Lĩnh vực hoạt động chính
                            </a>
                            <a href="#cam-ket" className="block text-gray-700 hover:text-blue-600 pl-4 border-l-2 border-gray-200 hover:border-blue-600 transition-colors">
                                5. Cam kết chất lượng từ LECHSHOP
                            </a>
                            <a href="#lien-he" className="block text-gray-700 hover:text-blue-600 pl-4 border-l-2 border-gray-200 hover:border-blue-600 transition-colors">
                                6. Thông tin liên hệ chính thức
                            </a>
                        </nav>
                    </details>

                    <div className="space-y-20 text-gray-700 leading-relaxed">
                        {/* 1. Tầm nhìn */}
                        <section id="tam-nhin" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-2 border-b border-gray-100">
                                <Globe className="text-blue-600 h-6 w-6" />
                                Tầm nhìn: Công nghệ không còn là rào cản
                            </h2>
                            <p className="mb-4 text-justify">
                                Trong thời đại số, các công cụ bản quyền, nền tảng AI hay dịch vụ trực tuyến cao cấp đang trở thành nhu cầu thiết yếu cho học tập, làm việc, sáng tạo và kinh doanh. Tuy nhiên, chi phí cao, nguồn cung không minh bạch và rủi ro khóa tài khoản khiến nhiều người dùng gặp khó khăn khi tiếp cận.
                            </p>
                            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
                                <h3 className="font-bold text-blue-800 mb-2">Sứ mệnh LECHSHOP</h3>
                                <p className="italic text-blue-900">
                                    "Chúng tôi hướng đến việc <strong>bình dân hóa công nghệ</strong>, giúp người Việt có thể tiếp cận dịch vụ số chất lượng cao – giá hợp lý – an toàn – có hỗ trợ lâu dài. LECHSHOP không chỉ bán tài khoản hay key bản quyền, chúng tôi cung cấp giải pháp công nghệ trọn gói, đi kèm sự an tâm và trải nghiệm ổn định cho khách hàng."
                                </p>
                            </div>
                        </section>

                        {/* 2. Khác biệt */}
                        <section id="khac-biet" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-2 border-b border-gray-100">
                                <CheckCircle className="text-blue-600 h-6 w-6" />
                                Vì sao LECHSHOP khác biệt?
                            </h2>
                            <p className="mb-8">
                                Giữa thị trường dịch vụ số đầy cạnh tranh, LECHSHOP xây dựng uy tín dựa trên <strong>4 giá trị cốt lõi</strong>:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Value 1 */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                                        <Layers className="h-5 w-5 text-blue-600" />
                                        Dịch vụ toàn diện – All in One
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Tại LECHSHOP, khách hàng có thể tìm thấy mọi giải pháp công nghệ cần thiết:
                                    </p>
                                    <ul className="text-sm space-y-1 text-gray-500 list-disc pl-5">
                                        <li>Tài khoản & key bản quyền</li>
                                        <li>Công cụ AI thế hệ mới</li>
                                        <li>Phần mềm làm việc – sáng tạo</li>
                                        <li>Dịch vụ mạng xã hội & tăng tương tác</li>
                                    </ul>
                                </div>

                                {/* Value 2 */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                                        <Wrench className="h-5 w-5 text-blue-600" />
                                        Đội ngũ kỹ thuật chuyên môn
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        LECHSHOP sở hữu đội ngũ kỹ thuật riêng, am hiểu sâu về kích hoạt & xử lý lỗi, công cụ AI & phần mềm. Chúng tôi không chỉ bán xong là kết thúc, mà đồng hành cùng khách hàng từ lúc mua đến khi hết hạn dịch vụ.
                                    </p>
                                </div>

                                {/* Value 3 */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                                        Hậu mãi & bảo hành rõ ràng
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Chính sách bảo hành minh bạch, hỗ trợ nhanh qua Hotline & Zalo. Đổi/hoàn khi dịch vụ gặp lỗi kỹ thuật. Đối với chúng tôi, dịch vụ sau bán hàng mới là yếu tố tạo nên sự khác biệt lâu dài.
                                    </p>
                                </div>

                                {/* Value 4 */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition-shadow relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">HOT</div>
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                                        <Gift className="h-5 w-5 text-red-500" />
                                        Tặng tương tác MXH miễn phí
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        🎁 Tất cả dịch vụ đều được <strong>tặng kèm gói tương tác mạng xã hội</strong>:
                                    </p>
                                    <ul className="text-sm space-y-1 text-gray-600 list-disc pl-5">
                                        <li>Tăng like / follow / view (Facebook, TikTok, YouTube)</li>
                                        <li>Không phát sinh chi phí</li>
                                        <li>Nhận ngay sau khi sử dụng dịch vụ</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 3. Con số */}
                        <section id="con-so" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-2 border-b border-gray-100">
                                <Activity className="text-blue-600 h-6 w-6" />
                                Những con số thể hiện sự tin tưởng
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-3xl font-black text-gray-900 mb-1">500+</div>
                                    <div className="text-sm font-medium text-gray-500">Khách hàng tin dùng</div>
                                </div>
                                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-3xl font-black text-gray-900 mb-1">2 Năm</div>
                                    <div className="text-sm font-medium text-gray-500">Hoạt động ổn định</div>
                                </div>
                                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-3xl font-black text-gray-900 mb-1">50+</div>
                                    <div className="text-sm font-medium text-gray-500">Đơn hàng mỗi ngày</div>
                                </div>
                                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-3xl font-black text-gray-900 mb-1">24/7</div>
                                    <div className="text-sm font-medium text-gray-500">Hỗ trợ liên tục</div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Lĩnh vực */}
                        <section id="linh-vuc" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-2 border-b border-gray-100">
                                <Layers className="text-blue-600 h-6 w-6" />
                                Lĩnh vực hoạt động chính
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">1</div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-1">Tài khoản & Key bản quyền</h3>
                                        <p className="text-gray-600 text-sm mb-2">ChatGPT Plus, Gemini Pro, Cursor AI, Canva Pro, CapCut Pro, Adobe Full Apps, Microsoft Office, Windows, Netflix, YouTube Premium...</p>
                                        <p className="text-sm font-medium text-green-600">👉 Giá tiết kiệm hơn đáng kể so với mua trực tiếp</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">2</div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-1">Công cụ AI & giải pháp làm việc</h3>
                                        <p className="text-gray-600 text-sm">AI hỗ trợ học tập, viết nội dung, sáng tạo. Công cụ tăng năng suất cho cá nhân & doanh nghiệp. Tư vấn lựa chọn giải pháp AI phù hợp.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">3</div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-1">Dịch vụ mạng xã hội</h3>
                                        <p className="text-gray-600 text-sm">Tăng tương tác thật cho Facebook, TikTok, YouTube. Hỗ trợ xây dựng hình ảnh cá nhân & kinh doanh online.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Cam kết */}
                        <section id="cam-ket" className="scroll-mt-24 bg-gray-900 text-white p-8 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <ShieldCheck className="w-64 h-64" />
                            </div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                <ShieldCheck className="h-6 w-6 text-yellow-500" />
                                <span className="text-white">Cam kết từ LECHSHOP</span>
                            </h2>
                            <div className="space-y-4 relative z-10 text-gray-300">
                                <p className="text-lg italic font-medium text-white">
                                    “Chúng tôi không chạy theo giá rẻ nhất thị trường. LECHSHOP cam kết mang đến giá trị sử dụng cao nhất, dịch vụ ổn định và hỗ trợ tận tâm nhất cho mỗi khách hàng.”
                                </p>
                                <p>
                                    Sự hài lòng và thành công của bạn chính là thước đo uy tín lâu dài của LECHSHOP.
                                </p>
                            </div>
                        </section>

                        {/* 6. Liên hệ */}
                        <section id="lien-he" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-2 border-b border-gray-100">
                                <Zap className="text-blue-600 h-6 w-6" />
                                Thông tin liên hệ chính thức
                            </h2>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <p className="mb-4 text-gray-600">Để đảm bảo quyền lợi, quý khách vui lòng liên hệ qua các kênh sau:</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <p className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Globe size={16} /></span>
                                            <span className="text-gray-900 font-medium">Website:</span>
                                            <a href="https://lechshop.com" target="_blank" className="text-blue-600 hover:underline">https://lechshop.com</a>
                                        </p>
                                        <p className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600"><CheckCircle size={16} /></span>
                                            <span className="text-gray-900 font-medium">Fanpage:</span>
                                            <span className="text-gray-700">LECHSHOP</span>
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600"><Zap size={16} /></span>
                                            <span className="text-gray-900 font-medium">Hotline:</span>
                                            <a href="tel:0868127491" className="text-red-600 font-bold hover:underline">0868.127.491</a>
                                        </p>
                                        <p className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Wrench size={16} /></span>
                                            <span className="text-gray-900 font-medium">Zalo:</span>
                                            <a href="https://zalo.me/0868127491" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">0868.127.491</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-3">
                                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0"><Calendar size={16} /></span>
                                    <div>
                                        <span className="text-gray-900 font-medium block">Địa chỉ:</span>
                                        <span className="text-gray-600">Số Nhà 20, Ngõ 51, Khu Đô Thị Cầu Bưu, Hà Đông, Hà Nội</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </Container>
        </div>
    );
}
