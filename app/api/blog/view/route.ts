import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";

// Simple in-memory cache for IP throttling (10 minutes)
// In a serverless environment, this is best-effort.
const viewCache = new Map<string, number>();
const THROTTLE_TIME = 10 * 60 * 1000; // 10 minutes

export async function POST(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

        const headerList = await headers();
        const ip = headerList.get("x-forwarded-for") || "unknown";
        const cacheKey = `${ip}:${id}`;
        const lastView = viewCache.get(cacheKey);
        const now = Date.now();

        if (lastView && now - lastView < THROTTLE_TIME) {
            return NextResponse.json({ message: "View already counted recently" });
        }

        await prisma.post.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        });

        viewCache.set(cacheKey, now);

        // Optional: Cleanup old cache entries periodically
        if (viewCache.size > 10000) {
            const expiry = now - THROTTLE_TIME;
            for (const [key, timestamp] of viewCache.entries()) {
                if (timestamp < expiry) viewCache.delete(key);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("View Count Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
