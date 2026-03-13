export type NormalizedStatus =
    | 'CHO_THANH_TOAN' // Chờ thanh toán / Khởi tạo
    | 'DA_THANH_TOAN'  // Đã thanh toán / Chờ xử lý
    | 'DANG_XU_LY'     // Đang chạy / Chuẩn bị
    | 'HOAN_TAT'       // Hoàn thành
    | 'THAT_BAI'       // Lỗi / Cần thông tin 
    | 'DA_HUY';        // Khách hủy / Admin hủy

export type StatusGroupKey = 'paid' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface StatusGroupConfig {
    id: StatusGroupKey;
    label: string;
    color: string;
}

/**
 * Chuẩn hóa trạng thái đơn hàng Premium (bảng Order)
 */
export function normalizePremiumOrderStatus(
    paymentStatus: string,
    fulfillStatus: string
): NormalizedStatus {
    // 1. Ưu tiên các trạng thái đóng/hủy/lỗi trước
    if (fulfillStatus === 'CANCELLED') return 'DA_HUY';
    if (paymentStatus === 'FAILED') return 'THAT_BAI';
    if (paymentStatus === 'REFUNDED') return 'DA_HUY';

    // 2. Xử lý luồng thành công / đang chạy
    if (fulfillStatus === 'DONE') return 'HOAN_TAT';

    if (paymentStatus === 'PAID') {
        if (fulfillStatus === 'PROCESSING') return 'DANG_XU_LY';
        return 'DA_THANH_TOAN'; // Đã thanh toán nhưng mới (NEW)
    }

    // 3. Mặc định: Chờ thanh toán
    return 'CHO_THANH_TOAN';
}

/**
 * Chuẩn hóa trạng thái đơn hàng Social (bảng SocialOrder)
 */
export function normalizeSocialOrderStatus(status: string): NormalizedStatus {
    const s = status?.toLowerCase() || '';

    switch (s) {
        case 'received':
            return 'DA_THANH_TOAN';
        case 'preparing':
        case 'running':
            return 'DANG_XU_LY';
        case 'completed':
            return 'HOAN_TAT';
        case 'need_info':
            return 'THAT_BAI';
        case 'cancelled':
            return 'DA_HUY';
        default:
            console.warn(`[Order Status] Unknown social order status: "${status}". Falling back to THAT_BAI.`);
            return 'THAT_BAI';
    }
}

/**
 * Gom nhóm NormalizedStatus cho Biểu đồ Donut (Status Breakdown)
 */
export function groupStatusForChart(normalized: NormalizedStatus): StatusGroupConfig {
    switch (normalized) {
        case 'CHO_THANH_TOAN':
        case 'DA_THANH_TOAN':
            return { id: 'pending', label: 'Chờ xử lý', color: '#f59e0b' }; // Amber

        case 'DANG_XU_LY':
            return { id: 'processing', label: 'Đang xử lý', color: '#3b82f6' }; // Blue

        case 'HOAN_TAT':
            // "Đã thanh toán/Hoàn thành" chung một nhóm cho trực quan như Dashboard cũ
            return { id: 'completed', label: 'Đã thanh toán/Hoàn thành', color: '#10b981' }; // Emerald

        case 'THAT_BAI':
        case 'DA_HUY':
            return { id: 'cancelled', label: 'Đã hủy/Lỗi', color: '#ef4444' }; // Red

        default:
            return { id: 'failed', label: 'Không xác định', color: '#cbd5e1' }; // Gray fallback
    }
}
