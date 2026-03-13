import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; action: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id, action } = await params;

    try {
        const commission = await prisma.commission.findUnique({
            where: { id }
        });

        if (!commission) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Parse optional body for adminReason
        let adminReason = "";
        try {
            const body = await req.json();
            if (body && body.adminReason) {
                adminReason = body.adminReason;
            }
        } catch (e) {
            // Ignore if no body
        }

        const adminId = (session.user as any)?.id || session.user?.email || "admin";

        if (action === "approve") {
            if (commission.status !== "PENDING") {
                return new NextResponse("Only pending commissions can be approved.", { status: 400 });
            }

            // Transaction: Approve commission + update wallet
            await prisma.$transaction(async (tx) => {
                await tx.commission.update({
                    where: { id },
                    data: { status: "APPROVED", approvedAt: new Date(), adminReason: adminReason || null }
                });

                await tx.affiliateLog.create({
                    data: {
                        affiliateCommissionId: id,
                        action: "approved",
                        note: adminReason || "Admin approved",
                        adminId
                    }
                });

                // Get or create wallet
                const wallet = await tx.wallet.findUnique({
                    where: { userId: commission.referrerUserId }
                });

                if (wallet) {
                    await tx.wallet.update({
                        where: { userId: commission.referrerUserId },
                        data: {
                            balancePending: { decrement: commission.commissionAmount },
                            balanceAvailable: { increment: commission.commissionAmount }
                        }
                    });
                } else {
                    await tx.wallet.create({
                        data: {
                            userId: commission.referrerUserId,
                            balancePending: 0,
                            balanceAvailable: commission.commissionAmount,
                            balancePaidTotal: 0
                        }
                    });
                }
            });

            return NextResponse.json({ success: true, status: "APPROVED" });
        } else if (action === "reject") {
            if (commission.status !== "PENDING") {
                return new NextResponse("Only pending commissions can be rejected.", { status: 400 });
            }

            if (!adminReason?.trim()) {
                return new NextResponse("Reason is required for rejection.", { status: 400 });
            }

            await prisma.$transaction(async (tx) => {
                await tx.commission.update({
                    where: { id },
                    data: { status: "REJECTED", adminReason: adminReason.trim() }
                });

                await tx.affiliateLog.create({
                    data: {
                        affiliateCommissionId: id,
                        action: "rejected",
                        note: adminReason.trim(),
                        adminId
                    }
                });

                // decrement pending balance
                const wallet = await tx.wallet.findUnique({
                    where: { userId: commission.referrerUserId }
                });

                if (wallet) {
                    await tx.wallet.update({
                        where: { userId: commission.referrerUserId },
                        data: {
                            balancePending: { decrement: commission.commissionAmount }
                        }
                    });
                }
            });

            return NextResponse.json({ success: true, status: "REJECTED" });
        }

        return new NextResponse("Invalid action", { status: 400 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
