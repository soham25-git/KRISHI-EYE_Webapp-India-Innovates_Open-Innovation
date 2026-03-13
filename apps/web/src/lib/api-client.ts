'use client'

// API routes have no version prefix; strip /v1 automatically if callers include it
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    // Strip /v1 prefix since backend routes have no version prefix
    const normalizedEndpoint = endpoint.startsWith('/v1/') ? endpoint.slice(3) : endpoint;

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Include HTTP-Only cookies automatically
    });

    if (!response.ok) {
        // NOTE: Do NOT redirect on 401 here. The dashboard layout handles
        // auth redirects via router.push (soft navigation). Using
        // window.location.href caused infinite reload loops because
        // AuthProvider's session check always triggers on mount.
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}
