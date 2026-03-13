import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        const transaction = await prisma.transaction.findUnique({
            where: { id }
        });

        if (!transaction) return new NextResponse("Not Found", { status: 404 });

        // Update status to reconciled and set tracking fields
        const adminId = (session.user as any)?.id || session.user?.email || "unknown";
        const updated = await prisma.transaction.update({
            where: { id },
            data: {
                status: 'reconciled',
                reconciledAt: new Date(),
                reconciledByAdminId: adminId
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Trans Reconcile API Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
