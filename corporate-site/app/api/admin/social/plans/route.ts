import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const serviceId = searchParams.get("serviceId");

        const whereClause = serviceId ? { serviceId } : {};

        const plans = await prisma.socialPlan.findMany({
            where: whereClause,
            orderBy: { createdAt: "asc" },
            include: {
                service: true
            }
        });
        return NextResponse.json(plans);
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
        if (!data.serviceId || !data.code || !data.name || data.pricePerUnit === undefined) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const plan = await prisma.socialPlan.create({
            data: {
                serviceId: data.serviceId,
                code: data.code,
                name: data.name,
                pricePerUnit: parseFloat(data.pricePerUnit),
                currency: data.currency || "VND",
                min: parseInt(data.min) || 1,
                max: parseInt(data.max) || 1000,
                tags: data.tags,
                description: data.description,
                isActive: data.isActive ?? true,
            }
        });
        return NextResponse.json(plan);
    } catch (error) {
        console.error("Error creating social plan:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
