import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { id } = await params;
        const { system_status, expected_duration } = await req.json();

        const updateData: any = {
            system_status,
        };

        if (system_status === "running") {
            updateData.start_time = new Date();
            // Default expected duration to 60 mins if not provided
            updateData.expected_duration = expected_duration || 60;
        } else if (system_status === "completed") {
            updateData.completed_time = new Date();
            updateData.status = "completed"; // Update the legacy status field too
        }

        const updatedOrder = await prisma.socialOrder.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Error updating social order status:", error);
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        );
    }
}
