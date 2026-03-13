import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    // pagination, etc. can be added later

    try {
        const referrers = await prisma.referralCode.findMany({
            where: search ? {
                OR: [
                    { userId: { contains: search } },
                    { code: { contains: search } }
                ]
            } : {},
            orderBy: { createdAt: "desc" }
        });

        // For each, get stats (clicks, signups, wallet)
        const enriched = await Promise.all(referrers.map(async (ref) => {
            const clicks = await prisma.referralClick.count({ where: { codeId: ref.id } });
            const signups = await prisma.referralAttribution.count({ where: { referrerUserId: ref.userId } });
            const wallet = await prisma.wallet.findUnique({ where: { userId: ref.userId } });

            return {
                id: ref.id,
                userId: ref.userId,
                code: ref.code,
                status: ref.status,
                createdAt: ref.createdAt,
                stats: {
                    clicks,
                    signups,
                    wallet: wallet || { balancePending: 0, balanceAvailable: 0, balancePaidTotal: 0 }
                }
            };
        }));

        return NextResponse.json(enriched);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
