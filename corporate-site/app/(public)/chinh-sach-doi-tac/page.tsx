import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import {
    Users,
    Briefcase,
    Gift,
    TrendingUp,
    CreditCard,
    ShieldCheck,
    CheckCircle2
} from "lucide-react";

export default function PartnerPolicyPage() {
    return (
        <div className="py-16 bg-gray-50/50">
            <Container>
                <SectionHeading
                    title="CHÍNH SÁCH ĐỐI TÁC & CỘNG TÁC VIÊN"
                    subtitle="LỆCH SHOP - Áp dụng từ ngày 13/02/2026"
                    centered
                    className="mb-12"
                />

                <div className="max-w-4xl mx-auto space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">

                    {/* 1. Giới thiệu chung */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Users className="w-40 h-40" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-3 relative z-10">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Users size={20} /></span>
                            1. Giới thiệu chung
                        </h2>
                        <div className="relative z-10">
                            <p>
                                Chào mừng bạn gia nhập hệ thống kinh doanh của Lệch Shop - Đơn vị chuyên cung cấp các giải pháp tài khoản Premium chất lượng cao. Chúng tôi hướng tới việc xây dựng một cộng đồng kinh doanh lành mạnh, uy tín và cùng có lợi.
                            </p>
                        </div>
                    </section>

                    {/* 2. Đối tượng tham gia & 3. Sản phẩm */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* 2. Đối tượng tham gia */}
                        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-3">
                                <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><Briefcase size={20} /></span>
                                2. Đối tượng tham gia
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>Sinh viên, nhân viên văn phòng, hoặc bất kỳ cá nhân nào có nhu cầu kiếm thêm thu nhập thụ động.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span>Yêu thích công nghệ, có mạng lưới quan hệ rộng hoặc có khả năng bán hàng online.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span className="font-semibold text-emerald-700">Không yêu cầu vốn nhập hàng (đối với hình thức CTV Dropship).</span>
                                </li>
                            </ul>
                        </section>

                        {/* 3. Sản phẩm kinh doanh */}
                        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-3">
                                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Gift size={20} /></span>
                                3. Sản phẩm kinh doanh
                            </h2>
                            <p className="mb-3">Các loại tài khoản Premium do Lệch Shop cung cấp, bao gồm nhưng không giới hạn:</p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                                    <span><strong>Giải trí:</strong> Netflix, YouTube Premium...</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                                    <span><strong>Học tập & Công việc:</strong> ChatGPT Plus, Gemini Pro, Canva Pro...</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                                    <span>Các loại tài khoản khác theo bảng giá niêm yết.</span>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* 4. Cơ chế hoa hồng */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-t-4 border-t-red-500 border-x border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-3">
                            <span className="bg-red-100 text-red-600 p-2 rounded-lg"><TrendingUp size={20} /></span>
                            4. Cơ chế hoa hồng & Lợi nhuận
                        </h2>
                        <p className="mb-4">Lệch Shop áp dụng mức chiết khấu hấp dẫn để khích lệ tinh thần bán hàng:</p>

                        <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
                            <div className="font-bold text-red-700 text-lg mb-2">Mức hoa hồng cố định: <span className="text-2xl text-red-600">10%</span></div>
                            <p className="text-red-800">Trên tổng giá trị đơn hàng bán ra (theo giá niêm yết của Lệch Shop).</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-2">📌 Ví dụ minh họa:</h3>
                                <ul className="space-y-2 text-sm">
                                    <li>• Bạn bán 1 tài khoản ChatGPT Plus giá <strong>500.000 VNĐ</strong>.</li>
                                    <li>• Hoa hồng bạn nhận được: <strong className="text-green-600">50.000 VNĐ</strong>.</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <h3 className="font-bold text-amber-800 mb-2">🎁 Thưởng doanh số (Bonus):</h3>
                                <ul className="space-y-2 text-sm text-amber-900">
                                    <li>• Đạt doanh thu 5.000.000 VNĐ/tháng: Thưởng thêm <strong>200.000 VNĐ</strong>.</li>
                                    <li>• Đạt doanh thu 10.000.000 VNĐ/tháng: Thưởng thêm <strong>500.000 VNĐ</strong>.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 5. Quy trình & Thanh toán */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><CreditCard size={20} /></span>
                            5. Quy trình bán hàng & Thanh toán
                        </h2>

                        <div className="mb-8">
                            <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider">Cách thức làm việc:</h3>
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl text-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-2">1</div>
                                    <p className="text-sm">CTV tìm kiếm khách hàng và chốt đơn (giá niêm yết).</p>
                                </div>
                                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl text-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-2">2</div>
                                    <p className="text-sm">CTV gửi thông tin đơn hàng cho Admin Lệch Shop.</p>
                                </div>
                                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl text-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-2">3</div>
                                    <p className="text-sm">Lệch Shop tiến hành cấp tài khoản/gia hạn cho khách.</p>
                                </div>
                                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl text-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-2">4</div>
                                    <p className="text-sm">Hoàn tất đơn hàng, ghi nhận doanh thu cho CTV.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-800 mb-3 uppercase text-sm tracking-wider">Chính sách thanh toán:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                                    <span><strong>Chu kỳ thanh toán:</strong> Vào ngày 15 và 30 hàng tháng (hoặc linh hoạt theo tuần tùy bạn chọn).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                                    <span><strong>Hình thức:</strong> Chuyển khoản ngân hàng hoặc Momo.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                                    <span><strong>Hạn mức:</strong> Số dư hoa hồng tối thiểu đạt 50.000 VNĐ sẽ được thanh toán.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 6. Quyền lợi & Nghĩa vụ */}
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100 flex items-center gap-3">
                            <span className="bg-teal-100 text-teal-600 p-2 rounded-lg"><ShieldCheck size={20} /></span>
                            6. Quyền lợi & Nghĩa vụ
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-teal-700 mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Quyền lợi của CTV
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                                        <span>Được cung cấp đầy đủ thông tin, hình ảnh, bài viết mẫu (content) để đăng bán.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                                        <span>Được hỗ trợ kỹ thuật và bảo hành sản phẩm trọn đời từ đội ngũ Lệch Shop (CTV không cần lo về lỗi tài khoản).</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 flex-shrink-0"></div>
                                        <span className="font-medium">Không áp lực doanh số hàng tháng.</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-orange-700 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5" />
                                    Nghĩa vụ
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                                        <span>Bán đúng giá niêm yết, không phá giá làm ảnh hưởng đến thương hiệu.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                                        <span>Tư vấn trung thực về chế độ bảo hành và tính năng sản phẩm.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
                                        <span>Giữ gìn hình ảnh uy tín của Lệch Shop.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                </div>
            </Container>
        </div>
    );
}
