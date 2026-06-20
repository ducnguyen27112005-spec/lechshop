"use client";



export function ServiceInstructions({ categorySlug }: { categorySlug?: string }) {
    const isFacebook = categorySlug?.toLowerCase().includes('facebook');
    const isGoogleMaps = categorySlug?.toLowerCase().includes('google-maps');

    return (
        <div className="space-y-6">
            {/* Hướng Dẫn & Ghi Chú */}
            <div className="bg-[#5bc0de] text-white rounded-md overflow-hidden">
                <div className="p-4">
                    <h3 className="font-bold text-lg mb-4">Hướng Dẫn & Ghi Chú:</h3>
                    <ul className="space-y-2 text-sm">
                        {isFacebook ? (
                            <>
                                <li>• Các máy chủ thuộc dịch vụ việt nam đều sử dụng nguồn tài khoản việt nam, một số máy chủ sẽ sử dụng người dùng thật</li>
                                <li>• Nếu máy chủ không đặt được đơn hàng hoặc cần hỗ trợ đơn vàng vui lòng nhấp vào chat hỗ trợ góc trái để được hỗ trợ nhanh nhất</li>
                            </>
                        ) : isGoogleMaps ? (
                            <>
                                <li>⚠️ Kiểm tra định dạng Link cẩn thận trước khi đặt hàng. Nếu sai định dạng Link sẽ không được hỗ trợ.</li>
                                <li>⚠️ Vui lòng đảm bảo tài khoản của bạn ở chế độ công khai, Không riêng tư.</li>
                                <li>⚠️ Không đặt nhiều đơn hàng cho cùng một liên kết trước khi hoàn thành.</li>
                            </>
                        ) : (
                            <>
                                <li>• Các máy chủ thuộc dịch vụ việt nam đều sử dụng nguồn tài tài khoản việt nam, một số máy chủ sẽ sử dụng người dùng thật</li>
                                <li>• Mua bằng link các định dạng sau: ví dụ <span className="font-mono bg-black/10 px-1 rounded">https://www.tiktok.com/@quynhh.vn/video/7041...</span> hoặc <span className="font-mono bg-black/10 px-1 rounded">https://vm.tiktok.com/TTPdMymqpa</span></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* LƯU Ý */}
            <div className="bg-[#ef5350] text-white rounded-md overflow-hidden">
                <div className="p-4">
                    <h3 className="font-bold text-lg mb-4">LƯU Ý!</h3>
                    <ul className="space-y-2 text-sm">
                        <li>• 1 ID không mua 2 đơn cùng lúc trong hệ thống ! đơn cũ hoàn thành mới mua đơn mới ! cố tình mua bị hụt số lượng sẽ không xử lý !</li>
                        <li>• Nghiêm cấm buff các đơn có nội dung vi phạm pháp luật, chính trị, đồ trụy...</li>
                        <li>• Nếu cố tình buff và bị phát hiện bạn sẽ bị trừ hết tiền và ban khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.</li>
                        <li>• Nếu đơn đang chạy trên hệ thống mà bạn vẫn mua ở các hệ thống bên khác, nếu có tình trạng hụt, thiếu số lượng giữa 2 bên thì sẽ không được xử lý.</li>
                        <li>• Vui Lòng Kiểm Tra Link Mua Hoặc ID Đúng Trước Khi Mua, Một Số Ít Máy Chủ Mua Sai Chúng Tôi Sẽ Không Thể Hoàn Tiền.</li>
                    </ul>
                </div>
            </div>


        </div>
    );
}
