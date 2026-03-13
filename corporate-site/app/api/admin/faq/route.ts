import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const faqs = await prisma.fAQ.findMany({
            orderBy: { order: "asc" }
        });
        return NextResponse.json(faqs);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const data = await req.json();
        const faq = await prisma.fAQ.create({
            data: {
                question: data.question,
                answer: data.answer,
                order: parseInt(data.order),
                isActive: data.isActive,
            }
        });
        return NextResponse.json(faq);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
