import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    try {
        const where: any = {};
        if (status && status !== 'ALL') where.status = status;
        if (source && source !== 'ALL') where.source = source;

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { createdAt: "desc" },
            // Limit to 100 for immediate dashboard feel without pagination initially
            take: 100
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error("Trans GET Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
