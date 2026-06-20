import { NextResponse } from "next/server";
import {
    readMultipliersFromDisk,
    writeMultipliersToDisk,
    PriceMultipliers,
} from "@/lib/price-multipliers-storage";

export const dynamic = "force-dynamic";

// GET: Đọc cấu hình hệ số giá hiện tại
export async function GET() {
    try {
        const data = readMultipliersFromDisk();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to read price multipliers:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Lưu hệ số % giá mới
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const existing = readMultipliersFromDisk();

        const updated: PriceMultipliers = {
            productModifiers: {
                ...existing.productModifiers,
                ...(body.productModifiers ?? {}),
            },
            categoryModifiers: {
                ...existing.categoryModifiers,
                ...(body.categoryModifiers ?? {}),
            },
            thatimGlobalPercent:
                body.thatimGlobalPercent !== undefined
                    ? Number(body.thatimGlobalPercent)
                    : existing.thatimGlobalPercent,
        };

        writeMultipliersToDisk(updated);

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error("Failed to save price multipliers:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
