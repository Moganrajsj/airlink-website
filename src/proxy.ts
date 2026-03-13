import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-dev-only"
);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith('/admin')) {
        const session = request.cookies.get('admin_session');
        console.log(`[Middleware] Path: ${pathname}, Session Cookie: ${session ? 'Found' : 'Missing'}`);

        if (!session) {
            console.log("[Middleware] No session cookie, redirecting to /auth");
            // Redirect to login if no session
            const url = new URL('/auth', request.url);
            return NextResponse.redirect(url);
        }

        try {
            // Verify JWT token using jose (edge compatible)
            const { payload } = await jwtVerify(session.value, JWT_SECRET, { algorithms: ['HS256'] });
            console.log("[Middleware] JWT Verified successfully for:", payload.email);
            return NextResponse.next();
        } catch (error) {
            console.error("[Middleware] JWT Verification failed:", error instanceof Error ? error.message : error);
            const url = new URL('/auth', request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
