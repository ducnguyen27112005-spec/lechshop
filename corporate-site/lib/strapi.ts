const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface CustomerRequestPayload {
    fullName: string;
    contact: string; // SĐT / Zalo
    serviceType: 'premium' | 'social';
    serviceName: string;
    note?: string;
    status: 'new' | 'done';
}

export async function createCustomerRequest(payload: CustomerRequestPayload) {
    try {
        const response = await fetch(`${STRAPI_URL}/api/customer-requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    fullName: payload.fullName,
                    contact: payload.contact,
                    serviceType: payload.serviceType,
                    serviceName: payload.serviceName,
                    note: payload.note || "",
                    status: payload.status || "new",
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Strapi create error:", errorData);
            throw new Error(errorData.error?.message || 'Failed to submit request');
        }

        const json = await response.json();
        return json.data; // Trả về đầy đủ data (có id)
    } catch (error) {
        console.error('Error creating customer request:', error);
        return null;
    }
}

/**
 * Fetchers for dynamic content
 */
export async function getSiteSettings() {
    try {
        const response = await fetch(`${STRAPI_URL}/api/site-setting`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) return null;
        const json = await response.json();
        return json.data;
    } catch (error) {
        return null;
    }
}

export async function getHeroSlides() {
    try {
        const response = await fetch(`${STRAPI_URL}/api/hero-slides?populate=*&sort=order:asc&filters[isActive][$eq]=true`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data;
    } catch (error) {
        return [];
    }
}

export async function getPremiumProducts() {
    try {
        const response = await fetch(`${STRAPI_URL}/api/premium-products?populate=*&sort=sortOrder:asc&filters[isActive][$eq]=true`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data;
    } catch (error) {
        return [];
    }
}

export async function getSocialServices() {
    try {
        const response = await fetch(`${STRAPI_URL}/api/social-services?populate=*&sort=sortOrder:asc&filters[isActive][$eq]=true`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data;
    } catch (error) {
        return [];
    }
}

export async function getPosts() {
    try {
        const response = await fetch(`${STRAPI_URL}/api/posts?populate=*&sort=publishedAt:desc&filters[isActive][$eq]=true`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data;
    } catch (error) {
        return [];
    }
}

export async function getPostBySlug(slug: string) {
    try {
        const response = await fetch(`${STRAPI_URL}/api/posts?filters[slug][$eq]=${slug}&populate=*`, {
            next: { revalidate: 60 }
        });
        if (!response.ok) return null;
        const json = await response.json();
        return json.data?.[0] || null;
    } catch (error) {
        return null;
    }
}
