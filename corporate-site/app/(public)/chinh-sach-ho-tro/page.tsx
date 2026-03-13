import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chính Sách Hỗ Trợ, Bảo Hành & Hoàn Tiền | Lệch Shop",
    description: "Chính sách hỗ trợ, bảo hành trọn đời và hoàn tiền minh bạch tại Lệch Shop. Cam kết xử lý nhanh chóng, đảm bảo quyền lợi khách hàng.",
};

export default function SupportPolicyPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 px-6 py-8 sm:px-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
                        Chính Sách Hỗ Trợ, Bảo Hành & Hoàn Tiền
                    </h1>
                </div>

                <div className="px-6 py-8 sm:px-10 space-y-8 text-gray-700">
                    <div className="text-lg leading-relaxed border-l-4 border-blue-500 pl-4 italic bg-blue-50 p-4 rounded-r">
                        <p>
                            Lệch Shop cam kết đồng hành cùng Đối tác/CTV trong việc xử lý các vấn đề kỹ thuật để đảm bảo trải nghiệm tốt nhất cho khách hàng cuối.
                        </p>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">A</span>
                            Quy Định Bảo Hành (Chế độ 1 đổi 1)
                        </h2>
                        <ul className="space-y-4 list-disc pl-5">
                            <li>
                                <strong>Thời hạn bảo hành:</strong> Bảo hành trọn đời theo thời gian gói tài khoản khách đã mua.
                                <br />
                                <span className="text-sm text-gray-500">(Ví dụ: Khách mua gói 1 tháng sẽ được bảo hành đủ 30 ngày).</span>
                            </li>
                            <li>
                                <strong>Cơ chế "1 đổi 1":</strong> Nếu tài khoản bị lỗi (sai mật khẩu, mất Premium, bị quét...) và không thể khắc phục được, Lệch Shop sẽ cấp ngay một tài khoản mới tương đương cho khách hàng.
                            </li>
                            <li>
                                <strong>Thời gian xử lý:</strong> Cam kết xử lý sự cố trong vòng <strong>2h - 24h</strong> kể từ khi tiếp nhận phản hồi (trừ các trường hợp bất khả kháng do nền tảng update).
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">B</span>
                            Chính Sách Hoàn Tiền (Refund Policy)
                        </h2>
                        <p className="mb-4">
                            Lệch Shop áp dụng chính sách hoàn tiền minh bạch để bảo vệ quyền lợi khách hàng trong trường hợp không thể thực hiện bảo hành:
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">1. Điều kiện hoàn tiền:</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Sản phẩm bị lỗi và Lệch Shop không thể khắc phục hoặc cấp tài khoản mới thay thế sau 24h tiếp nhận.</li>
                                    <li>Sản phẩm không đúng với mô tả hoặc tính năng cam kết ban đầu.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">2. Mức hoàn tiền:</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        <strong>Hoàn tiền 100%:</strong> Nếu lỗi xảy ra trong vòng 3 - 5 ngày đầu tiên sử dụng (tùy loại tài khoản).
                                    </li>
                                    <li>
                                        <strong>Hoàn tiền theo thời gian sử dụng thực tế (Back tiền):</strong> Nếu lỗi xảy ra sau thời gian trên.
                                    </li>
                                </ul>
                                <div className="mt-3 bg-gray-100 p-4 rounded text-sm">
                                    <p className="font-medium text-gray-900">Công thức:</p>
                                    <p className="font-mono bg-white p-2 border rounded mt-1 inline-block">
                                        Số tiền hoàn = (Giá trị đơn hàng / Tổng số ngày của gói) x Số ngày chưa sử dụng
                                    </p>
                                    <p className="mt-2 text-gray-600 italic">
                                        (Ví dụ: Khách mua gói 30 ngày giá 90k. Dùng được 10 ngày thì lỗi không fix được. Số tiền hoàn lại = (90.000 / 30) x 20 ngày còn lại = 60.000đ).
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">3. Quy trình hoàn tiền:</h3>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>CTV báo cáo tình trạng lỗi và yêu cầu hoàn tiền cho Admin Lệch Shop.</li>
                                    <li>Admin xác nhận lỗi.</li>
                                    <li>Lệch Shop hoàn tiền về lại cho CTV (để CTV hoàn cho khách) hoặc chuyển thẳng cho khách (tùy yêu cầu) trong vòng 24h.</li>
                                </ol>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">C</span>
                            Trách nhiệm của Đối tác/CTV
                        </h2>
                        <ul className="space-y-4 list-disc pl-5">
                            <li>
                                <strong>Tiếp nhận thông tin:</strong> Khi khách báo lỗi, CTV cần bình tĩnh ghi nhận thông tin (ảnh chụp màn hình lỗi, email tài khoản) và chuyển ngay cho bộ phận hỗ trợ của Lệch Shop.
                            </li>
                            <li>
                                <strong>Trấn an khách hàng:</strong> Trong thời gian chờ Lệch Shop fix lỗi, CTV cần khéo léo trấn an khách hàng dựa trên uy tín của Shop.
                            </li>
                            <li>
                                <strong>Không tự ý cam kết:</strong> CTV không tự ý cam kết hoàn tiền ngay lập tức khi chưa có xác nhận từ Admin (để tránh trường hợp lỗi do người dùng hoặc lỗi fix được ngay).
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
