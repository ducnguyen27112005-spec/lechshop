import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const totalClicks = await prisma.referralClick.count();
        const totalAttributions = await prisma.referralAttribution.count();
        const commissions = await prisma.commission.findMany();

        let pendingCommission = 0;
        let approvedCommission = 0;
        let paidCommission = 0;
        let rejectedCommission = 0;

        commissions.forEach(c => {
            if (c.status === "PENDING") pendingCommission += c.commissionAmount;
            if (c.status === "APPROVED") approvedCommission += c.commissionAmount;
            if (c.status === "PAID") paidCommission += c.commissionAmount;
            if (c.status === "REJECTED") rejectedCommission += c.commissionAmount;
        });

        // Generate monthly chart data (last 6 months)
        const monthlyData: any[] = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthLabel = d.toLocaleDateString("vi-VN", { month: 'short', year: 'numeric' });

            const thisMonthCommissions = commissions.filter(c => {
                const cd = new Date(c.createdAt);
                return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
            });

            const totalCommissionAmount = thisMonthCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
            const totalOrders = thisMonthCommissions.length;

            monthlyData.push({
                month: monthLabel,
                commission: totalCommissionAmount,
                orders: totalOrders
            });
        }

        // Funnel Data
        const funnelData = [
            { stage: 'Click', count: totalClicks },
            { stage: 'Signup', count: totalAttributions },
            { stage: 'Order', count: commissions.length }
        ];

        // Top Referrers
        const topReferrers = await prisma.referralCode.findMany({
            include: {
                _count: {
                    select: { clicks: true }
                }
            },
            take: 5,
            orderBy: {
                clicks: {
                    _count: 'desc'
                }
            }
        });

        return NextResponse.json({
            stats: {
                totalClicks,
                totalSignups: totalAttributions,
                totalOrders: commissions.length,
                pendingCommission,
                approvedCommission,
                paidCommission,
                rejectedCommission
            },
            monthlyData,
            funnelData,
            topReferrers: topReferrers.map(r => ({
                id: r.id,
                userId: r.userId,
                code: r.code,
                clicks: r._count.clicks
            }))
        });
    } catch (error) {
        console.error("Affiliate overview error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
