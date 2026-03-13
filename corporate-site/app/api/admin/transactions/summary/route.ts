import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Total Received Today (all statuses except failed)
        const receivedTodayData = await prisma.transaction.aggregate({
            where: {
                createdAt: { gte: today },
                status: { not: 'failed' }
            },
            _sum: { amount: true }
        });

        // 2. Reconciled Amount (all time or this month depend on UX, usually total actioned)
        // For reconciliation dashboard, it's often useful to see overall matched/reconciled waiting, 
        // but let's stick to simple "Total currently Pending" vs "Total ever Reconciled" for now.
        const reconciledData = await prisma.transaction.aggregate({
            where: { status: 'reconciled' },
            _sum: { amount: true }
        });

        // 3. Pending Review (pending + matched)
        const pendingReviewData = await prisma.transaction.aggregate({
            where: { status: { in: ['pending', 'matched'] } },
            _sum: { amount: true },
            _count: { id: true }
        });

        // 4. Failed Transactions
        const failedCount = await prisma.transaction.count({
            where: { status: 'failed' }
        });

        return NextResponse.json({
            receivedToday: receivedTodayData._sum.amount || 0,
            reconciledAmount: reconciledData._sum.amount || 0,
            pendingAmount: pendingReviewData._sum.amount || 0,
            pendingCount: pendingReviewData._count.id || 0,
            failedCount: failedCount
        });
    } catch (error) {
        console.error("Trans Summary API Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
