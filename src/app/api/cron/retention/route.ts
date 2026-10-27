import { timingSafeEqual } from "node:crypto";
import { getAdminSession } from "@/lib/auth/admin-session";
import { runRetention } from "@/lib/retention";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Retention job endpoint.
 *
 * Call it from a scheduled task (cPanel cron, Vercel cron, or any scheduler):
 *
 *   curl -X POST https://www.srirambroadband.com/api/cron/retention \
 *        -H "Authorization: Bearer $CRON_SECRET"
 *
 * Authorisation is either the `CRON_SECRET` bearer token (timing-safe compare)
 * or a signed-in administrator. If neither is present the request is rejected.
 * The job only clears technical abuse signals and expired counters — it never
 * deletes a customer lead.
 */

function safeEqual(a: string, b: string): boolean {
    const left = Buffer.from(a);
    const right = Buffer.from(b);
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
}

async function isAuthorised(request: Request): Promise<boolean> {
    const secret = process.env.CRON_SECRET;
    const header = request.headers.get("authorization") ?? "";
    if (secret && header.startsWith("Bearer ")) {
        if (safeEqual(header.slice("Bearer ".length).trim(), secret)) return true;
    }

    const session = await getAdminSession();
    return session?.role === "admin";
}

export async function POST(request: Request) {
    if (!(await isAuthorised(request))) {
        return Response.json({ error: "Not authorised." }, { status: 401 });
    }

    try {
        const result = await runRetention();
        return Response.json({ success: true, result });
    } catch (error) {
        console.error(
            "Retention job failed:",
            error instanceof Error ? error.message : error
        );
        return Response.json({ error: "Retention job failed." }, { status: 500 });
    }
}

/** Allows a manual admin trigger from the browser; same authorisation rules. */
export async function GET(request: Request) {
    return POST(request);
}
