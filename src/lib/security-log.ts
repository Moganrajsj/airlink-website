import { prisma } from "@/lib/prisma";

/**
 * Security audit trail. Only opaque identifiers, counts and hashes belong here —
 * never raw phone numbers, emails or names.
 */
export async function logSecurityEvent(
    kind: string,
    ipHash: string | null,
    detail?: Record<string, unknown>
): Promise<void> {
    try {
        await prisma.securityEvent.create({
            data: {
                kind,
                ipHash,
                detail: detail ? JSON.stringify(detail) : null,
            },
        });
    } catch (error) {
        console.warn("Could not record security event:", error instanceof Error ? error.message : error);
    }
}
