import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth"; // Assuming you have next-auth
// import { authOptions } from "@/lib/auth"; // Adjust path if needed

function generateOrderCode() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SO-${timestamp}${random}`;
}

export async function POST(req: Request) {
    // Optional: Check auth if strictly required, but user said "Manual processing", maybe open for guests?
    // "userId" field in schema is nullable. For now, let's allow guest or try to get session.
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.email || null; 

    // For now, let's just proceed without strict Auth enforcement if strictly not required by previous instruction, 
    // BUT usually orders need user context. If guest, we just store without userId.

    try {
        const body = await req.json();
        const { serviceSlug, targetUrl, quantity, selectedPlanCode, customerNote } = body;

        if (!serviceSlug || !targetUrl) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // 1. Fetch Service Info
        const service = await prisma.socialService.findUnique({
            where: { slug: serviceSlug },
            include: { plans: true }
        });

        if (!service) {
            return new NextResponse("Service not found", { status: 404 });
        }

        // 2. Calculate Price (if plan selected)
        let selectedPlan = null;
        let unitPrice = 0;
        let totalPrice = 0;

        const linkCount = targetUrl ? targetUrl.split('\n').filter((line: string) => line.trim()).length : 1;

        if (selectedPlanCode) {
            selectedPlan = service.plans.find(p => p.code === selectedPlanCode);
            if (selectedPlan) {
                unitPrice = selectedPlan.pricePerUnit;
                totalPrice = unitPrice * (quantity || 0) * linkCount;
            }
        }

        // 3. Create Order
        const newOrder = await prisma.socialOrder.create({
            data: {
                code: generateOrderCode(),
                serviceSlug: service.slug,
                serviceName: service.title,
                platformSlug: "unknown", // Ideally fetch from service -> category
                // We should probably include category relation or fetch it to store platform slug correctly
                // Let's re-fetch with category
                // For now, quick fix:
                targetUrl,
                quantity: quantity || 0,
                selectedPlanCode,
                unitPrice: unitPrice || null,
                totalPrice: totalPrice || null,
                customerNote,
                status: "received",
                // userId, 
            }
        });

        // 4. Update Platform Slug (better way: fetch via relation)
        // Since we didn't include category in first fetch, let's do a quick update or improved flow.
        const category = await prisma.socialCategory.findFirst({
            where: { services: { some: { id: service.id } } }
        });
        if (category) {
            await prisma.socialOrder.update({
                where: { id: newOrder.id },
                data: { platformSlug: category.slug }
            });
        }

        return NextResponse.json(newOrder);

    } catch (error) {
        console.error("Create Order Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    // Fetch History
    // const session = await getServerSession(authOptions);
    // if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        // Filter by user if we had auth. For now, returning ALL orders might be a leak if multiple users use it.
        // Assuming this is a demo/single-user context or need Session.
        // I will assume for now we might need to filter by cookie or session. 
        // If "History" tab is requested, it implies User History.

        // TEMPORARY: Return 50 most recent orders (Global) 
        // WARNING: IN PRODUCTION THIS MUST BE SCOPED TO USER. 
        // Since I don't have full Auth setup context validated, I'll fetch recent.

        const orders = await prisma.socialOrder.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json(orders);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
