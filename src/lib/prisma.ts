import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Query logging leaks customer data into server logs, so it is opt-in and
 * disabled in production unless PRISMA_LOG_QUERIES=true is explicitly set.
 */
const shouldLogQueries =
    process.env.NODE_ENV !== "production" || process.env.PRISMA_LOG_QUERIES === "true";

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient(
        shouldLogQueries
            ? { log: process.env.NODE_ENV === "production" ? ["warn", "error"] : ["query", "warn", "error"] }
            : { log: ["warn", "error"] }
    );

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
