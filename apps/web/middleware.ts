import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('krishi_auth_token')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/login');

    // For now, next/server middleware can't access localStorage.
    // However, we can use a cookie to mirror the token for route protection.
    // If we want to stay pure client-side for this demo, we can handle redirects in layout or components.
    // But standard Next.js middleware is better.

    // Simplification for this implementation session:
    // We will rely on a custom Auth Guard component in the client.
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
