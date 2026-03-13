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
        const orders = await prisma.socialOrder.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 100,
        });

        // Map to format that UI expects for the Ant Design table
        const formattedOrders = orders.map((order) => ({
            id: order.id,
            code: order.code,
            customerName: `Khách hàng (User: ${order.userId?.substring(0, 4) || 'Guest'})`,
            targetUrl: order.targetUrl,
            serviceName: order.serviceName,
            quantity: order.quantity || 0,
            totalAmount: order.totalPrice || 0,
            system_status: order.system_status,
            start_time: order.start_time,
            completed_time: order.completed_time,
            expected_duration: order.expected_duration,
            createdAt: order.createdAt,
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        console.error("Error fetching social orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
