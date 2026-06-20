import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId");

        const whereClause = categoryId ? { categoryId } : {};

        const services = await prisma.socialService.findMany({
            where: whereClause,
            orderBy: [
                { category: { sortOrder: "asc" } },
                { sortOrder: "asc" }
            ],
            include: {
                category: true,
                _count: {
                    select: { plans: true }
                }
            }
        });
        return NextResponse.json(services);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();

        if (!data.title || !data.slug || !data.categoryId || !data.targetType) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const service = await prisma.socialService.create({
            data: {
                categoryId: data.categoryId,
                title: data.title,
                slug: data.slug,
                shortDescription: data.shortDescription,
                targetType: data.targetType,
                unitLabel: data.unitLabel || "unit",
                coverImageUrl: data.coverImageUrl,
                sortOrder: parseInt(data.sortOrder) || 0,
                isActive: data.isActive ?? true,
            }
        });
        return NextResponse.json(service);
    } catch (error) {
        console.error("Error creating social service:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
