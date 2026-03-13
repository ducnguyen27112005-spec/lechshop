import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const { id } = await params;

    try {
        const data = await req.json();
        const plan = await prisma.socialPlan.update({
            where: { id },
            data: {
                serviceId: data.serviceId,
                code: data.code,
                name: data.name,
                pricePerUnit: parseFloat(data.pricePerUnit),
                currency: data.currency,
                min: parseInt(data.min),
                max: parseInt(data.max),
                tags: data.tags,
                description: data.description,
                isActive: data.isActive,
            }
        });
        return NextResponse.json(plan);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const { id } = await params;

    try {
        await prisma.socialPlan.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
