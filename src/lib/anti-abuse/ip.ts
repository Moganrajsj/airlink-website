import { createHash } from "node:crypto";

/**
 * Only hashed IPs are persisted. The salt keeps the hashes useless to anyone
 * who obtains a database dump but does not have the server environment.
 */
export function hashIp(ip: string | null | undefined): string | null {
    if (!ip) return null;
    const salt = process.env.IP_HASH_SALT || process.env.JWT_SECRET || "dev-ip-salt";
    return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function getClientIpFromHeaders(headers: Headers): string {
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
    return headers.get("x-real-ip")?.trim() || "unknown";
}

export function hashUserAgent(userAgent: string | null | undefined): string | null {
    if (!userAgent) return null;
    const salt = process.env.IP_HASH_SALT || process.env.JWT_SECRET || "dev-ip-salt";
    return createHash("sha256").update(`${salt}:ua:${userAgent}`).digest("hex").slice(0, 32);
}
