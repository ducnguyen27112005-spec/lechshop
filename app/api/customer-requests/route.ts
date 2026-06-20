import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const payload = body.data || body;

        const order = await prisma.order.create({
            data: {
                code: payload.orderCode,
                customerName: payload.fullName,
                customerEmail: payload.email || "no-email@lechshop.vn",
                type: payload.serviceType === "premium" ? "PREMIUM" : "SOCIAL",
                amount: payload.totalAmount || 0,
                paymentStatus: "PENDING",
                fulfillStatus: "NEW",
                adminNote: `Phone/Zalo: ${payload.contact}\nProducts: ${JSON.stringify(payload.products)}\nNote: ${payload.note || ""}`
            }
        });

        return NextResponse.json({ data: order });
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json(
            { error: { message: "Failed to create order in database." } },
            { status: 500 }
        );
    }
}
