import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const totalProductOrders = await prisma.order.count({ where: { type: "PREMIUM" } });
        const ordersByStatus = await prisma.order.groupBy({
            by: ['paymentStatus', 'fulfillStatus'],
            where: { type: "PREMIUM" },
            _count: { id: true }
        });

        console.log("DEBUG: Total PREMIUM orders in DB:", totalProductOrders);
        console.log("DEBUG: PREMIUM Orders by status:", ordersByStatus);

        const orders = await prisma.order.findMany({
            where: { type: "PREMIUM" },
            orderBy: { createdAt: "desc" },
            include: {
                fulfillments: {
                    orderBy: { createdAt: "desc" },
                    include: { supplier: true }
                }
            }
        });

        // Adapter mapping for Product Order
        const mappedOrders = orders.map(o => ({
            id: o.id,
            orderCode: o.code,
            code: o.code, // for backward compat
            customerName: o.customerName,
            customerEmail: o.customerEmail,
            email: o.customerEmail,
            customerPhone: "",
            phone: "",
            total: o.amount,
            paymentStatus: o.paymentStatus,
            fulfillmentStatus: o.fulfillStatus,
            fulfillStatus: o.fulfillStatus,
            createdAt: o.createdAt.toISOString(),
            type: "PREMIUM",
            products: [], // Needs proper relation in future
            subtotal: o.amount,
            transactionFee: 0,
            totalAmount: o.amount,
            fulfillments: o.fulfillments,
            accountDelivered: null,
            deliveredAt: o.deliveredAt,
            note: o.adminNote || "",
        }));

        return NextResponse.json(mappedOrders);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
