import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(orders);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const order = await prisma.order.create({
            data: {
                code: data.code,
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                type: data.type,
                amount: parseFloat(data.amount),
                paymentStatus: data.paymentStatus,
                fulfillStatus: data.fulfillStatus,
                adminNote: data.adminNote,
            }
        });
        return NextResponse.json(order);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
