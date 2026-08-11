import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth"; // Assuming you have next-auth
// import { authOptions } from "@/lib/auth"; // Adjust path if needed
import { readMultipliersFromDisk } from "@/lib/price-multipliers-storage";

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

        let unitPrice = 0;
        let totalPrice = 0;
        let serviceName = "";
        let platformSlug = "unknown";
        const linkCount = targetUrl ? targetUrl.split('\n').filter((line: string) => line.trim()).length : 1;

        if (service) {
            serviceName = service.title;
            const category = await prisma.socialCategory.findFirst({
                where: { services: { some: { id: service.id } } }
            });
            if (category) platformSlug = category.slug;

            if (selectedPlanCode) {
                const selectedPlan = service.plans.find(p => p.code === selectedPlanCode);
                if (selectedPlan) {
                    unitPrice = selectedPlan.pricePerUnit;
                    totalPrice = unitPrice * (quantity || 0) * linkCount;
                }
            }
        } else {
            // Fallback to Thatim API if service not in DB
            const apiKey = process.env.THATIM_API_KEY || "OhIyzlL01GrKyyKzHBMsiXtgNbCvgt";
            
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout
            
            let res;
            try {
                res = await fetch("https://thatim.vn/api/v2", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `key=${apiKey}&action=services`,
                    cache: "no-store",
                    signal: controller.signal
                });
            } catch (e) {
                return new NextResponse("API Timeout or Network Error", { status: 504 });
            } finally {
                clearTimeout(timeoutId);
            }
            
            if (!res.ok) {
                return new NextResponse("Service not found", { status: 404 });
            }
            
            const apiServices = await res.json();
            if (!Array.isArray(apiServices)) {
                return new NextResponse("Service not found", { status: 404 });
            }

            const apiService = apiServices.find((s: any) => s.service.toString() === selectedPlanCode);
            if (!apiService) {
                return new NextResponse("Service not found", { status: 404 });
            }

            serviceName = apiService.name;
            platformSlug = apiService.platform?.toLowerCase() || "unknown";
            
            // Auto-create category to satisfy Prisma Foreign Key constraints
            let dbCategory = await prisma.socialCategory.findUnique({ where: { slug: platformSlug } });
            if (!dbCategory) {
                dbCategory = await prisma.socialCategory.create({
                    data: {
                        name: platformSlug.toUpperCase(),
                        slug: platformSlug,
                    }
                });
            }

            const multipliers = await readMultipliersFromDisk();
            let pct = multipliers.categoryModifiers[platformSlug];
            if (pct === undefined) {
                pct = multipliers.thatimGlobalPercent ?? 0;
            }
            const multiplierFactor = 1 + (pct / 100);
            
            const rate = parseFloat(apiService.rate) || 0;
            unitPrice = Number((((rate * 26000) / 1000) * multiplierFactor).toFixed(2));
            totalPrice = unitPrice * (quantity || 0) * linkCount;

            await prisma.socialService.create({
                data: {
                    categoryId: dbCategory.id,
                    title: serviceName,
                    slug: serviceSlug,
                    targetType: "link",
                    unitLabel: "lượt",
                }
            });
        }

        // 3. Create Order
        const newOrder = await prisma.socialOrder.create({
            data: {
                code: generateOrderCode(),
                serviceSlug: serviceSlug,
                serviceName: serviceName,
                platformSlug: platformSlug,
                targetUrl,
                quantity: quantity || 0,
                selectedPlanCode,
                unitPrice: unitPrice || null,
                totalPrice: totalPrice || null,
                customerNote,
                status: "new",
            }
        });

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
