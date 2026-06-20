import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const categories = await prisma.socialCategory.findMany({
            orderBy: { sortOrder: "asc" },
            include: {
                _count: {
                    select: { services: true }
                }
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();

        // Basic validation
        if (!data.name || !data.slug) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const category = await prisma.socialCategory.create({
            data: {
                name: data.name,
                slug: data.slug,
                iconKey: data.iconKey,
                sortOrder: parseInt(data.sortOrder) || 0,
                isActive: data.isActive ?? true,
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        console.error("Error creating social category:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
