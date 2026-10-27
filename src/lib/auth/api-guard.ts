import { NextResponse } from "next/server";
import { getAdminSession, type AdminRole } from "@/lib/auth/admin-session";

/**
 * Route-handler guard. Returns a ready-made 401/403 response, or `null` when
 * the caller is allowed to continue.
 */
export async function guardApi(minimumRole: AdminRole = "admin"): Promise<NextResponse | null> {
    const session = await getAdminSession();

    if (!session) {
        return NextResponse.json({ success: false, error: "Not authorised." }, { status: 401 });
    }
    if (minimumRole === "admin" && session.role !== "admin") {
        return NextResponse.json(
            { success: false, error: "Your account does not have permission for this action." },
            { status: 403 }
        );
    }
    return null;
}
