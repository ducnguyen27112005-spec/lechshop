import Container from "@/components/shared/Container";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";

export const metadata = {
    title: "Chính Sách Hỗ Trợ, Bảo Hành & Hoàn Tiền | Lệch Shop",
    description: "Chính sách bảo hành 1 đổi 1 và hoàn tiền minh bạch tại Lệch Shop, cam kết đồng hành cùng Đối tác/CTV mang lại trải nghiệm tốt nhất.",
};

export default function PolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-10 lg:py-16">
            <Container>
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-sm text-gray-500 mb-8 font-medium">
                        <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className="text-gray-900">Chính sách bảo hành & hoàn tiền</span>
                    </nav>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-10 text-white">
                            <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
                                <ShieldCheck className="h-8 w-8 text-blue-100" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
                                Chính Sách Hỗ Trợ, Bảo Hành & Hoàn Tiền
                            </h1>
                            <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
                                Lệch Shop cam kết đồng hành cùng Đối tác/CTV trong việc xử lý các vấn đề kỹ thuật để đảm bảo trải nghiệm tốt nhất cho khách hàng cuối.
                            </p>
                        </div>

                        {/* Content Body */}
                        <div className="p-8 lg:p-12 space-y-12 text-gray-700 leading-relaxed">

                            {/* Section 1 */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">a. Quy Định Bảo Hành (Chế độ 1 đổi 1)</h2>
                                </div>
                                <ul className="space-y-4 pl-4 border-l-2 border-gray-100 ml-5">
                                    <li className="relative">
                                        <span className="absolute -left-6 top-2 w-2 h-2 rounded-full bg-blue-500"></span>
                                        <strong className="text-gray-900">Thời hạn bảo hành:</strong> Bảo hành trọn đời theo thời gian gói tài khoản khách đã mua (Ví dụ: Khách mua gói 1 tháng sẽ được bảo hành đủ 30 ngày).
                                    </li>
                                    <li className="relative">
                                        <span className="absolute -left-6 top-2 w-2 h-2 rounded-full bg-blue-500"></span>
                                        <strong className="text-gray-900">Cơ chế "1 đổi 1":</strong> Nếu tài khoản bị lỗi (sai mật khẩu, mất Premium, bị quét...) và không thể khắc phục được, Lệch Shop sẽ cấp ngay một tài khoản mới tương đương cho khách hàng.
                                    </li>
                                    <li className="relative">
                                        <span className="absolute -left-6 top-2 w-2 h-2 rounded-full bg-blue-500"></span>
                                        <strong className="text-gray-900">Thời gian xử lý:</strong> Cam kết xử lý sự cố trong vòng 2h - 24h kể từ khi tiếp nhận phản hồi (trừ các trường hợp bất khả kháng do nền tảng update).
                                    </li>
                                </ul>
                            </section>

                            {/* Section 2 */}
                            <section className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-600">
                                        <RotateCcw className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">b. Chính Sách Hoàn Tiền (Refund Policy)</h2>
                                </div>
                                <p className="mb-6 font-medium text-gray-600">Lệch Shop áp dụng chính sách hoàn tiền minh bạch để bảo vệ quyền lợi khách hàng trong trường hợp không thể thực hiện bảo hành:</p>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
                                            Điều kiện hoàn tiền:
                                        </h3>
                                        <ol className="list-decimal pl-5 space-y-2 ml-4">
                                            <li>Sản phẩm bị lỗi và Lệch Shop không thể khắc phục hoặc cấp tài khoản mới thay thế sau 24h tiếp nhận.</li>
                                            <li>Sản phẩm không đúng với mô tả hoặc tính năng cam kết ban đầu.</li>
                                        </ol>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
                                            Mức hoàn tiền:
                                        </h3>
                                        <ul className="space-y-3 pl-4 border-l-2 border-gray-200 ml-4">
                                            <li className="relative">
                                                <span className="absolute -left-[21px] top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-orange-500"></span>
                                                <strong className="text-gray-900">Hoàn tiền 100%:</strong> Nếu lỗi xảy ra trong vòng 3 - 5 ngày đầu tiên sử dụng (tùy loại tài khoản).
                                            </li>
                                            <li className="relative">
                                                <span className="absolute -left-[21px] top-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-orange-500"></span>
                                                <strong className="text-gray-900">Hoàn tiền theo thời gian sử dụng thực tế (Back tiền):</strong> Nếu lỗi xảy ra sau thời gian trên.
                                            </li>
                                        </ul>

                                        <div className="mt-4 bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-900 text-sm">
                                            <p className="font-bold mb-2">💡 Công thức:</p>
                                            <p className="mb-2 font-mono bg-white p-2 rounded border border-orange-200 inline-block">Số tiền hoàn = (Giá trị đơn hàng / Tổng số ngày của gói) x Số ngày chưa sử dụng</p>
                                            <p className="italic opacity-80">(Ví dụ: Khách mua gói 30 ngày giá 90k. Dùng được 10 ngày thì lỗi không fix được. Số tiền hoàn lại = (90.000 / 30) x 20 ngày còn lại = 60.000đ).</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
                                            Quy trình hoàn tiền:
                                        </h3>
                                        <ol className="list-decimal pl-5 space-y-2 ml-4">
                                            <li>CTV báo cáo tình trạng lỗi và yêu cầu hoàn tiền cho Admin Lệch Shop.</li>
                                            <li>Admin xác nhận lỗi.</li>
                                            <li>Lệch Shop hoàn tiền về lại cho CTV (để CTV hoàn cho khách) hoặc chuyển thẳng cho khách (tùy yêu cầu) trong vòng 24h.</li>
                                        </ol>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">c. Trách nhiệm của Đối tác/CTV</h2>
                                </div>
                                <ul className="space-y-4 pl-4 border-l-2 border-gray-100 ml-5">
                                    <li className="relative">
                                        <span className="absolute -left-6 top-2 w-2 h-2 rounded-full bg-indigo-500"></span>
                                        <strong className="text-gray-900">Tiếp nhận thông tin:</strong> Khi khách báo lỗi, CTV cần bình tĩnh ghi nhận thông tin (ảnh chụp màn hình lỗi, email tài khoản) và chuyển ngay cho bộ phận hỗ trợ của Lệch Shop.
                                    </li>
                                    <li className="relative">
                                        <span className="absolute -left-6 top-2 w-2 h-2 rounded-full bg-indigo-500"></span>
                                        <strong className="text-gray-900">Trấn an khách hàng:</strong> Trong thời gian chờ Lệch Shop fix lỗi, CTV cần khéo léo trấn an khách hàng dựa trên uy tín của Shop.
                                    </li>
                                    <li className="relative">
                                        <span className="absolute -left-6 top-2 w-2 h-2 rounded-full bg-indigo-500"></span>
                                        <strong className="text-gray-900">Không tự ý cam kết:</strong> CTV không tự ý cam kết hoàn tiền ngay lập tức khi chưa có xác nhận từ Admin (để tránh trường hợp lỗi do người dùng hoặc lỗi fix được ngay).
                                    </li>
                                </ul>
                            </section>

                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
