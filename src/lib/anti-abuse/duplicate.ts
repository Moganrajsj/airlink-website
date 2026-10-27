import { prisma } from "@/lib/prisma";

export interface DuplicateMatch {
    id: string;
    createdAt: Date;
    name: string;
    source: string;
}

/**
 * Duplicates are linked, never deleted and never silently merged. Admins decide
 * what to do with them in the duplicate-management view.
 */
export async function findRecentDuplicate(
    phoneNormalized: string | null,
    hours = 24
): Promise<{ count: number; original: DuplicateMatch | null }> {
    if (!phoneNormalized) return { count: 0, original: null };

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const existing = await prisma.lead.findMany({
        where: {
            createdAt: { gte: since },
            OR: [
                { phoneNormalized },
                // Legacy rows only stored the national 10-digit number.
                { mobile: phoneNormalized },
                { phone: phoneNormalized },
            ],
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, createdAt: true, name: true, source: true },
        take: 5,
    });

    return {
        count: existing.length,
        original: existing[0] ?? null,
    };
}

export async function findNameCityDuplicate(
    nameNormalized: string | null,
    city: string | null,
    hours = 1
): Promise<DuplicateMatch | null> {
    if (!nameNormalized || !city) return null;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const existing = await prisma.lead.findFirst({
        where: {
            createdAt: { gte: since },
            nameNormalized,
            city: { equals: city },
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, createdAt: true, name: true, source: true },
    });

    return existing ?? null;
}
