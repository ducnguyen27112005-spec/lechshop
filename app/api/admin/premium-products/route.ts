import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const products = await prisma.premiumProduct.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(products);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const product = await prisma.premiumProduct.create({
            data: {
                name: data.name,
                slug: data.slug,
                thumbnail: data.thumbnail,
                shortDescription: data.shortDescription,
                benefits: data.benefits,
                price: parseFloat(data.price),
                durationDays: parseInt(data.durationDays),
                isActive: data.isActive,
                isFeatured: data.isFeatured,
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
