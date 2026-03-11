import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const resolvedParams = await params;
        const body = await request.json();
        const { orderCode } = body;

        const transaction = await prisma.transaction.findUnique({
            where: { id: resolvedParams.id }
        });

        if (!transaction) return new NextResponse("Not Found", { status: 404 });

        // Calculate mismatch dynamically if the order code exists. We have to query Order or SocialOrder.
        let orderAmount = 0;
        let found = false;

        if (orderCode) {
            const premiumOrder = await prisma.order.findUnique({ where: { code: orderCode } });
            if (premiumOrder) {
                orderAmount = premiumOrder.amount;
                found = true;
            } else {
                const socialOrder = await prisma.socialOrder.findUnique({ where: { code: orderCode } });
                if (socialOrder) {
                    orderAmount = socialOrder.totalPrice || 0;
                    found = true;
                }
            }
        }

        const mismatchAmount = found ? (transaction.amount - orderAmount) : null;
        const newStatus = orderCode ? 'matched' : 'pending';

        const dataToUpdate: any = {
            orderCode: orderCode || null,
            status: newStatus,
        };

        if (found) {
            dataToUpdate.mismatchAmount = mismatchAmount;
        } else {
            // If we unassigned an order, reset mismatch to null
            if (!orderCode) {
                dataToUpdate.mismatchAmount = null;
            }
        }

        const updated = await prisma.transaction.update({
            where: { id: resolvedParams.id },
            data: dataToUpdate
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Trans Assign API Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
