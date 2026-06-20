import { NextResponse } from "next/server";
import { readProductsFromDisk, writeProductsToDisk } from "@/lib/products-storage";

export const dynamic = 'force-dynamic';

// GET: Read all products config
export async function GET() {
    try {
        const config = readProductsFromDisk();
        return NextResponse.json(config);
    } catch (error) {
        console.error("Failed to read products config:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PUT: Save products config
export async function PUT(req: Request) {
    try {
        const config = await req.json();
        writeProductsToDisk(config);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to save products config:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
