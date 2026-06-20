import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action") || "category";
        
        const apiKey = process.env.THATIM_API_KEY || "OhIyzlL01GrKyyKzHBMsiXtgNbCvgt";
        
        // Setup timeout to prevent 3-minute hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout
        
        const res = await fetch(`https://thatim.vn/api/product?key=${apiKey}&action=${action}`, {
            cache: 'no-store',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
            return NextResponse.json({ error: `Thatim API returned ${res.status}` }, { status: res.status });
        }
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        console.error("Proxy error fetching Thatim API:", e);
        return NextResponse.json({ error: "Failed to fetch from Thatim API" }, { status: 500 });
    }
}
