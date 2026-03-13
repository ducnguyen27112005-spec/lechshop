import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
    title: "Chính Sách Bảo Mật Dữ Liệu Cá Nhân | LECHSHOP",
    description: "Chính sách bảo mật dữ liệu cá nhân tại LECHSHOP. Cam kết bảo vệ thông tin khách hàng với các tiêu chuẩn bảo mật hiện đại.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 px-6 py-8 sm:px-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
                        Chính Sách Bảo Mật Dữ Liệu Cá Nhân tại LECHSHOP
                    </h1>
                </div>

                <div className="px-6 py-8 sm:px-10 space-y-8 text-gray-700">
                    <div className="text-lg leading-relaxed border-l-4 border-blue-500 pl-4 italic bg-blue-50 p-4 rounded-r">
                        <p>
                            Chào mừng bạn đến với LECHSHOP. Chúng tôi hiểu rằng khi bạn mua sắm các sản phẩm số, sự an toàn của dữ liệu cá nhân và tài khoản là ưu tiên hàng đầu.
                        </p>
                        <p className="mt-2">
                            Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn, tuân thủ nghiêm ngặt các tiêu chuẩn bảo mật hiện đại và quy định pháp luật hiện hành.
                        </p>
                    </div>

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">1</span>
                            Dữ liệu Chúng tôi Thu thập và Lý do
                        </h2>
                        <p className="mb-4">
                            Chúng tôi chỉ thu thập những thông tin thực sự cần thiết để hoàn tất giao dịch và thực hiện nghĩa vụ bảo hành:
                        </p>
                        <ul className="space-y-4 list-disc pl-5">
                            <li>
                                <strong>Thông tin định danh:</strong> Họ tên, số điện thoại (Zalo) và địa chỉ Email.
                                <br />
                                <span className="text-sm text-gray-500">Mục đích: Gửi thông tin tài khoản, mã kích hoạt (Key) và liên hệ hỗ trợ kỹ thuật nhanh.</span>
                            </li>
                            <li>
                                <strong>Thông tin giao dịch:</strong> Lịch sử đơn hàng, thời gian thanh toán và sản phẩm đã mua.
                                <br />
                                <span className="text-sm text-gray-500">Mục đích: Đây là cơ sở dữ liệu cốt lõi để chúng tôi thực hiện Cam kết Bảo hành Trọn đời.</span>
                            </li>
                            <li>
                                <strong>Thông tin kỹ thuật (Cookies/IP):</strong> Để tối ưu hóa trải nghiệm website và ngăn chặn các hành vi gian lận hoặc tấn công mạng.
                            </li>
                        </ul>
                        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
                            <p className="font-semibold text-yellow-800">⚠️ Lưu ý quan trọng:</p>
                            <p className="text-yellow-700 text-sm mt-1">
                                Chúng tôi <strong>KHÔNG</strong> lưu trữ thông tin thẻ ngân hàng hay mật khẩu thanh toán của bạn. Mọi giao dịch được thực hiện qua cổng thanh toán bảo mật của ngân hàng/ví điện tử.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">2</span>
                            Cam kết Bảo vệ Dữ liệu trên Nền tảng bên thứ ba
                        </h2>
                        <p className="mb-4">
                            Vì LECHSHOP cung cấp dịch vụ nâng cấp trên chính Email cá nhân của khách hàng (như YouTube, Spotify, Canva, ChatGPT…), chúng tôi cam kết:
                        </p>
                        <ul className="space-y-4 list-disc pl-5">
                            <li>
                                <strong>Quyền riêng tư tuyệt đối:</strong> Kỹ thuật viên của chúng tôi chỉ thực hiện thao tác nâng cấp gói cước. Chúng tôi không có quyền và không bao giờ truy cập vào nội dung bên trong tài khoản cá nhân của bạn (như file thiết kế, danh sách phát, lịch sử chat…).
                            </li>
                            <li>
                                <strong>Bảo mật Email:</strong> Email của bạn chỉ được sử dụng cho mục đích đăng ký dịch vụ, không bao giờ bị tiết lộ cho bên thứ ba.
                            </li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">3</span>
                            Công nghệ Bảo mật Áp dụng
                        </h2>
                        <p className="mb-4">
                            Để bảo vệ thông tin khỏi sự truy cập trái phép, LECHSHOP triển khai các biện pháp kỹ thuật tiên tiến:
                        </p>
                        <ul className="space-y-4 list-disc pl-5">
                            <li>
                                <strong>Mã hóa SSL (Secure Sockets Layer):</strong> Toàn bộ dữ liệu truyền đi giữa trình duyệt của bạn và máy chủ của chúng tôi được mã hóa 256-bit.
                            </li>
                            <li>
                                <strong>Hệ thống tường lửa (WAF):</strong> Ngăn chặn các cuộc tấn công từ bên ngoài nhằm đánh cắp dữ liệu khách hàng.
                            </li>
                            <li>
                                <strong>Kiểm soát nội bộ:</strong> Chỉ những nhân sự được ủy quyền mới có quyền tiếp cận dữ liệu khách hàng để phục vụ mục đích bảo hành.
                            </li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">4</span>
                            Thời gian Lưu trữ và Quyền của Người dùng
                        </h2>
                        <ul className="space-y-4 list-disc pl-5">
                            <li>
                                <strong>Thời gian lưu trữ:</strong> Để đảm bảo quyền lợi bảo hành &quot;trọn đời&quot; cho khách hàng, thông tin đơn hàng sẽ được lưu trữ an toàn trên hệ thống trừ khi bạn có yêu cầu xóa bỏ.
                            </li>
                            <li>
                                <strong>Quyền của bạn:</strong> Bạn có quyền yêu cầu chúng tôi:
                                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-600">
                                    <li>Trích xuất dữ liệu cá nhân của bạn đang lưu trữ tại hệ thống.</li>
                                    <li>Chỉnh sửa thông tin liên hệ nếu có sai sót.</li>
                                    <li>Xóa hoàn toàn dữ liệu (Lưu ý: Việc xóa dữ liệu đơn hàng đồng nghĩa với việc chúng tôi không thể đối soát để thực hiện bảo hành trong tương lai).</li>
                                </ul>
                            </li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">5</span>
                            Chia sẻ Thông tin
                        </h2>
                        <p className="mb-4">
                            Chúng tôi cam kết <strong>KHÔNG</strong> bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo. Thông tin chỉ được chia sẻ trong các trường hợp:
                        </p>
                        <ul className="space-y-2 list-disc pl-5">
                            <li>Theo yêu cầu pháp lý từ cơ quan nhà nước có thẩm quyền.</li>
                            <li>Để bảo vệ quyền lợi hợp pháp của LECHSHOP trong các trường hợp gian lận thanh toán.</li>
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm shrink-0">6</span>
                            Thông tin Thực thể Quản lý Dữ liệu
                        </h2>
                        <p className="mb-4">
                            Mọi thắc mắc hoặc yêu cầu liên quan đến bảo mật dữ liệu, quý khách vui lòng liên hệ:
                        </p>
                        <div className="bg-gray-100 p-4 rounded space-y-2 text-sm">
                            <p><strong>Tên đơn vị:</strong> LECHSHOP</p>
                            <p><strong>Địa chỉ:</strong> {siteConfig.address}</p>
                            <p><strong>Hotline/Zalo hỗ trợ 24/7:</strong>{" "}
                                <a href={`tel:${siteConfig.phone}`} className="text-blue-600 hover:underline">{siteConfig.phone}</a>
                            </p>
                            <p><strong>Email:</strong>{" "}
                                <a href={`mailto:${siteConfig.email}`} className="text-blue-600 hover:underline">{siteConfig.email}</a>
                            </p>
                        </div>
                    </section>

                    <div className="text-sm text-gray-500 border-t pt-4 text-center">
                        Chính sách bảo mật này được cập nhật lần cuối vào ngày 13/02/2026. Chúng tôi có quyền điều chỉnh chính sách này để phù hợp với các thay đổi của pháp luật và công nghệ mà không cần thông báo trước.
                    </div>
                </div>
            </div>
        </div>
    );
}
