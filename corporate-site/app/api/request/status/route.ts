import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function PATCH(request: Request) {
    try {
        const { requestId, status } = await request.json();

        if (!requestId || !status) {
            return NextResponse.json({ error: 'Missing requestId or status' }, { status: 400 });
        }

        if (!STRAPI_API_TOKEN) {
            console.error('STRAPI_API_TOKEN is not defined');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch(`${STRAPI_URL}/api/customer-requests/${requestId}`, {
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
            return NextResponse.json({ error: errorData.error?.message || 'Failed to update status' }, { status: response.status });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
