import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";

    try {
        const whereClause = status !== "ALL" ? { status: status as any } : {};
        const requests = await prisma.withdrawRequest.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
