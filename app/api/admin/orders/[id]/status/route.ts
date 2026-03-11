import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { NormalizedStatus } from "@/lib/order-status";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        if (!id) {
            return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
        }

        const body = await request.json();
        const { type, normalizedStatus }: { type: 'product' | 'social', normalizedStatus: NormalizedStatus } = body;

        if (!type || !normalizedStatus) {
            return NextResponse.json({ error: "Missing type or normalizedStatus" }, { status: 400 });
        }

        let updatedOrder;

        if (type === 'product') {
            // Xác nhận order tồn tại
            const existingOrder = await prisma.order.findUnique({
                where: { id }
            });

            if (!existingOrder) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            // Ánh xạ ngược từ NormalizedStatus về native fields
            let paymentStatus = existingOrder.paymentStatus;
            let fulfillStatus = existingOrder.fulfillStatus;

            switch (normalizedStatus) {
                case 'HOAN_TAT':
                    paymentStatus = 'PAID';
                    fulfillStatus = 'DONE';
                    break;
                case 'DANG_XU_LY':
                    paymentStatus = 'PAID';
                    fulfillStatus = 'PROCESSING';
                    break;
                case 'DA_THANH_TOAN':
                    paymentStatus = 'PAID';
                    fulfillStatus = 'NEW';
                    break;
                case 'CHO_THANH_TOAN':
                    paymentStatus = 'PENDING';
                    fulfillStatus = 'NEW';
                    break;
                case 'THAT_BAI':
                    paymentStatus = 'FAILED';
                    break;
                case 'DA_HUY':
                    fulfillStatus = 'CANCELLED';
                    break;
                default:
                    return NextResponse.json({ error: "Invalid status for product order" }, { status: 400 });
            }

            // Thực hiện update
            updatedOrder = await prisma.order.update({
                where: { id },
                data: {
                    paymentStatus,
                    fulfillStatus
                }
            });

            // Ghi log nhẹ nhàng có thể ở đây nếu cần (vd thêm 1 bảng OrderHistory, tạm thời thì bỏ qua)
        } else if (type === 'social') {
            // Xác nhận order tồn tại
            const existingOrder = await prisma.socialOrder.findUnique({
                where: { id }
            });

            if (!existingOrder) {
                return NextResponse.json({ error: "Social Order not found" }, { status: 404 });
            }

            // Ánh xạ ngược từ NormalizedStatus về native field
            let status = existingOrder.status;

            switch (normalizedStatus) {
                case 'HOAN_TAT':
                    status = 'completed';
                    break;
                case 'DANG_XU_LY':
                    status = 'running';
                    break;
                case 'DA_THANH_TOAN':
                    status = 'received';
                    break;
                case 'CHO_THANH_TOAN':
                    // Xử lý tạm là received cho logic cũ
                    status = 'received';
                    break;
                case 'THAT_BAI':
                    status = 'need_info';
                    break;
                case 'DA_HUY':
                    status = 'cancelled';
                    break;
                default:
                    return NextResponse.json({ error: "Invalid status for social order" }, { status: 400 });
            }

            updatedOrder = await prisma.socialOrder.update({
                where: { id },
                data: { status }
            });
        } else {
            return NextResponse.json({ error: "Invalid type. Must be 'product' or 'social'" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "Cập nhật trạng thái thành công",
            data: updatedOrder
        });

    } catch (error: any) {
        console.error("Update Order Status Error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
