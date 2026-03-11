import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const { id } = await params;

    try {
        const data = await req.json();
        const service = await prisma.socialService.update({
            where: { id },
            data: {
                categoryId: data.categoryId,
                title: data.title,
                slug: data.slug,
                shortDescription: data.shortDescription,
                targetType: data.targetType,
                unitLabel: data.unitLabel,
                coverImageUrl: data.coverImageUrl,
                sortOrder: parseInt(data.sortOrder),
                isActive: data.isActive,
            }
        });
        return NextResponse.json(service);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    const { id } = await params;

    try {
        // Delete all plans first (cascade)
        await prisma.socialPlan.deleteMany({
            where: { serviceId: id }
        });
        await prisma.socialService.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Delete service error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
