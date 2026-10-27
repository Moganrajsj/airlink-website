import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge guard for admin navigation and admin APIs.
 *
 * This is a first line of defence only. Every server action and route handler
 * re-checks the session with `requireAdmin()` because middleware matchers can
 * be bypassed and because read-only viewers need finer-grained checks.
 */

const DEV_FALLBACK_SECRET = "fallback-secret-for-dev-only";
const PUBLIC_ADMIN_PATHS = ["/api/admin/login", "/api/admin/logout"];

function secretKey(): Uint8Array | null {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV === "production") return null; // fail closed
        return new TextEncoder().encode(DEV_FALLBACK_SECRET);
    }
    return new TextEncoder().encode(secret);
}

async function isValidSession(request: NextRequest): Promise<boolean> {
    const token = request.cookies.get("admin_session")?.value;
    if (!token) return false;

    const key = secretKey();
    if (!key) return false;

    try {
        await jwtVerify(token, key, { algorithms: ["HS256"] });
        return true;
    } catch {
        return false;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path)) {
        return NextResponse.next();
    }

    if (!(await isValidSession(request))) {
        // API callers get JSON, browsers get the login page.
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ success: false, error: "Not authorised." }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
