import { NextResponse } from "next/server";
import { getServiceCategories, getServiceConfigMap } from "@/lib/serviceData";

// Always fetch fresh data
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const [categories, serviceMap] = await Promise.all([
            getServiceCategories(),
            getServiceConfigMap()
        ]);

        return NextResponse.json({ categories, serviceMap });
    } catch (error) {
        console.error("Error fetching service sidebar data:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
