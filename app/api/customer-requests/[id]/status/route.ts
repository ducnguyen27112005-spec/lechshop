import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * PATH: /api/customer-requests/[id]/status
 * METHOD: PATCH
 * BODY: { "status": "waiting_delivery" | "done" | ... }
 */
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json({ error: 'Missing status' }, { status: 400 });
        }

        if (!STRAPI_API_TOKEN) {
            console.error('SERVER ERROR: STRAPI_API_TOKEN is missing in environment variables.');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        const response = await fetch(`${STRAPI_URL}/api/customer-requests/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
            },
            body: JSON.stringify({
                data: { status }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Strapi PATCH Error:", errorData);
            return NextResponse.json(
                { error: errorData.error?.message || 'Failed to update Strapi' },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json({ ok: true, data: result.data });

    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
