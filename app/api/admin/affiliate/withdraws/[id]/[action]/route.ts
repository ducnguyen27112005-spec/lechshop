import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string; action: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id, action } = await params;

    try {
        const request = await prisma.withdrawRequest.findUnique({
            where: { id }
        });

        if (!request) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (action === "approve") {
            if (request.status !== "PENDING") return new NextResponse("Only pending requests can be approved.", { status: 400 });

            // Wallet reduction logic should actually happen on "creation" of a request to reserve the balance.
            // But since the scope logic says "approve: lock/trừ", we'll do it here:
            await prisma.$transaction(async (tx) => {
                const wallet = await tx.wallet.findUnique({
                    where: { userId: request.userId }
                });

                if (!wallet || wallet.balanceAvailable < request.amount) {
                    throw new Error("Insufficient available balance.");
                }

                await tx.wallet.update({
                    where: { userId: request.userId },
                    data: {
                        balanceAvailable: { decrement: request.amount }
                    }
                });

                await tx.withdrawRequest.update({
                    where: { id },
                    data: { status: "APPROVED", processedAt: new Date() }
                });
            });

            return NextResponse.json({ success: true, status: "APPROVED" });
        } else if (action === "reject") {
            if (request.status !== "PENDING" && request.status !== "APPROVED") return new NextResponse("Invalid state for rejection.", { status: 400 });

            const data = await req.json().catch(() => ({}));
            const adminReason = data.adminReason || data.reason || "Bị từ chối bởi Admin";

            await prisma.$transaction(async (tx) => {
                await tx.withdrawRequest.update({
                    where: { id },
                    data: { status: "REJECTED", processedAt: new Date(), adminReason }
                });

                // If it was already approved (amount deducted), we should refund it here.
                if (request.status === "APPROVED") {
                    await tx.wallet.update({
                        where: { userId: request.userId },
                        data: {
                            balanceAvailable: { increment: request.amount }
                        }
                    });
                }
            });

            return NextResponse.json({ success: true, status: "REJECTED" });
        } else if (action === "mark-paid") {
            if (request.status !== "APPROVED") return new NextResponse("Only approved requests can be marked as paid.", { status: 400 });

            await prisma.$transaction(async (tx) => {
                await tx.withdrawRequest.update({
                    where: { id },
                    data: { status: "PAID" }
                });

                await tx.wallet.update({
                    where: { userId: request.userId },
                    data: {
                        balancePaidTotal: { increment: request.amount }
                    }
                });
            });

            return NextResponse.json({ success: true, status: "PAID" });
        }

        return new NextResponse("Invalid action", { status: 400 });
    } catch (error: any) {
        console.error(error);
        if (error.message === "Insufficient available balance.") {
            return new NextResponse(error.message, { status: 400 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
