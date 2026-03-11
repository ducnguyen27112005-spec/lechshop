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
        const category = await prisma.socialCategory.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                iconKey: data.iconKey,
                sortOrder: parseInt(data.sortOrder),
                isActive: data.isActive,
            }
        });
        return NextResponse.json(category);
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
        await prisma.socialCategory.delete({
            where: { id }
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
