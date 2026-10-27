import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

/**
 * Single source of truth for admin authentication.
 *
 * - Server actions and route handlers must call `getAdminSession()` /
 *   `requireAdmin()` themselves. The `/admin` middleware only protects page
 *   navigation and is not a substitute for per-action authorisation.
 * - Roles: `admin` (full access) and `viewer` (read-only intelligence).
 */

export type AdminRole = "admin" | "viewer";

export interface AdminSession {
    id: string;
    email: string;
    role: AdminRole;
}

const DEV_FALLBACK_SECRET = "fallback-secret-for-dev-only";
const COOKIE_NAME = "admin_session";

function secretKey(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // In production a missing secret must fail closed: without it, any
        // token would validate against a publicly known default.
        if (process.env.NODE_ENV === "production") {
            throw new Error("JWT_SECRET is not configured");
        }
        return new TextEncoder().encode(DEV_FALLBACK_SECRET);
    }
    return new TextEncoder().encode(secret);
}

export function normalizeRole(role: unknown): AdminRole {
    return role === "viewer" ? "viewer" : "admin";
}

export async function getAdminSession(): Promise<AdminSession | null> {
    let token: string | undefined;
    try {
        token = (await cookies()).get(COOKIE_NAME)?.value;
    } catch {
        // Called outside a request scope.
        return null;
    }
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
        const id = typeof payload.id === "string" ? payload.id : payload.sub;
        const email = payload.email;
        if (typeof id !== "string" || typeof email !== "string") return null;
        return { id, email, role: normalizeRole(payload.role) };
    } catch {
        return null;
    }
}

export class AdminAuthError extends Error {
    status: number;

    constructor(message = "Not authorised.", status = 401) {
        super(message);
        this.name = "AdminAuthError";
        this.status = status;
    }
}

/**
 * Throws `AdminAuthError` when the caller is not signed in, or when a
 * mutation is attempted by a read-only viewer.
 */
export async function requireAdmin(minimumRole: AdminRole = "admin"): Promise<AdminSession> {
    const session = await getAdminSession();
    if (!session) throw new AdminAuthError("Not authorised.", 401);
    if (minimumRole === "admin" && session.role !== "admin") {
        throw new AdminAuthError("Your account does not have permission for this action.", 403);
    }
    return session;
}

/**
 * Server-action friendly guard: returns the session or `null` so the action
 * can reply with a normal `{ success: false }` result instead of throwing.
 */
export async function requireAdminAction(minimumRole: AdminRole = "admin"): Promise<AdminSession | null> {
    try {
        return await requireAdmin(minimumRole);
    } catch {
        return null;
    }
}

export async function signAdminToken(payload: {
    id: string;
    email: string;
    role: string;
}): Promise<string> {
    return new SignJWT({ id: payload.id, email: payload.email, role: payload.role })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secretKey());
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
