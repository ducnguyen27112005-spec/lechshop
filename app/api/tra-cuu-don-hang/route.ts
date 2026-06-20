import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
        return NextResponse.json({ error: "Vui lòng nhập mã đơn hàng." }, { status: 400 });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { code },
            include: {
                fulfillments: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        supplier: { select: { name: true } },
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Không tìm thấy đơn hàng với mã này." }, { status: 404 });
        }

        // Map fulfillStatus to display status
        const statusMap: Record<string, { label: string; color: string }> = {
            NEW: { label: "Chờ xử lý", color: "orange" },
            PROCESSING: { label: "Đang xử lý", color: "blue" },
            DONE: { label: "Đã giao", color: "green" },
            CANCELLED: { label: "Đã hủy", color: "red" },
        };

        const statusInfo = statusMap[order.fulfillStatus] ?? { label: order.fulfillStatus, color: "gray" };

        // Build timeline
        const timeline = [
            {
                label: "Đơn hàng đã được tạo",
                time: order.createdAt,
                done: true,
            },
            {
                label: "Đang xử lý đơn hàng",
                time: order.fulfillStatus !== "NEW" ? order.updatedAt : null,
                done: order.fulfillStatus !== "NEW",
            },
            {
                label: "Đã giao hàng",
                time: order.deliveredAt,
                done: order.fulfillStatus === "DONE",
            },
        ];

        // Credentials from the latest DELIVER fulfillment
        const deliverFulfillment = order.fulfillments
            .filter((f) => f.action === "DELIVER")
            .at(-1);

        return NextResponse.json({
            order: {
                id: order.id,
                code: order.code,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                type: order.type,
                amount: order.amount,
                paymentStatus: order.paymentStatus,
                fulfillStatus: order.fulfillStatus,
                statusInfo,
                adminNote: order.adminNote,
                createdAt: order.createdAt,
                deliveredAt: order.deliveredAt,
                timeline,
                credentialText: deliverFulfillment?.credentialText ?? null,
                fulfillments: order.fulfillments.map((f) => ({
                    id: f.id,
                    action: f.action,
                    note: f.note,
                    credentialText: f.credentialText,
                    createdAt: f.createdAt,
                })),
            },
        });
    } catch (err) {
        console.error("[tra-cuu-don-hang] error:", err);
        return NextResponse.json({ error: "Lỗi hệ thống. Vui lòng thử lại." }, { status: 500 });
    }
}
