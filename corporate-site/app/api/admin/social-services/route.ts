import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const services = await prisma.socialService.findMany({
            orderBy: { platform: "asc" }
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
        const service = await prisma.socialService.create({
            data: {
                platform: data.platform,
                serviceType: data.serviceType,
                name: data.name,
                min: parseInt(data.min),
                max: parseInt(data.max),
                pricePerUnit: parseFloat(data.pricePerUnit),
                warrantyDays: parseInt(data.warrantyDays),
                note: data.note,
                isActive: data.isActive,
            }
        });
        return NextResponse.json(service);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
