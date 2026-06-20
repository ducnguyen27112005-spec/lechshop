import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        
        // Mode 1: Update specific plans
        if (body.plans && Array.isArray(body.plans)) {
            // Because Prisma doesn't support bulk update with different values easily,
            // we do it in a transaction
            const updates = body.plans.map((plan: any) => {
                return prisma.socialPlan.update({
                    where: { id: plan.id },
                    data: { pricePerUnit: plan.pricePerUnit }
                });
            });
            await prisma.$transaction(updates);
            return NextResponse.json({ success: true, count: updates.length });
        }
        
        // Mode 2: Apply multiplier to all
        if (body.multiplier) {
            const multiplier = parseFloat(body.multiplier);
            if (isNaN(multiplier) || multiplier <= 0) {
                return new NextResponse("Invalid multiplier", { status: 400 });
            }
            
            // We have to read all, multiply, then update all
            const allPlans = await prisma.socialPlan.findMany();
            const updates = allPlans.map(plan => {
                return prisma.socialPlan.update({
                    where: { id: plan.id },
                    data: { pricePerUnit: plan.pricePerUnit * multiplier }
                });
            });
            await prisma.$transaction(updates);
            return NextResponse.json({ success: true, count: updates.length });
        }

        // Mode 3: Apply multiplier per service
        if (body.serviceModifiers && typeof body.serviceModifiers === "object") {
            const updates = [];
            for (const [serviceId, percent] of Object.entries(body.serviceModifiers)) {
                const percentNum = parseFloat(percent as string);
                if (!isNaN(percentNum) && percentNum !== 0) {
                    const multiplier = 1 + (percentNum / 100);
                    // Get all plans for this service
                    const plans = await prisma.socialPlan.findMany({ where: { serviceId } });
                    for (const plan of plans) {
                        updates.push(prisma.socialPlan.update({
                            where: { id: plan.id },
                            data: { pricePerUnit: plan.pricePerUnit * multiplier }
                        }));
                    }
                }
            }
            if (updates.length > 0) {
                await prisma.$transaction(updates);
            }
            return NextResponse.json({ success: true, count: updates.length });
        }

        return new NextResponse("Invalid request", { status: 400 });
    } catch (error) {
        console.error("Bulk update social plans error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
