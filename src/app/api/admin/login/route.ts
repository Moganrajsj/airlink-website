import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, signAdminToken } from "@/lib/auth/admin-session";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body?.password === "string" ? body.password : "";

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const admin = await prisma.admin.findUnique({ where: { email } });

        // Always run a bcrypt comparison so a missing account and a wrong
        // password take a similar amount of time.
        const hash = admin?.password ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid";
        const isPasswordValid = await bcrypt.compare(password, hash).catch(() => false);

        if (!admin || !isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signAdminToken({
            id: admin.id,
            email: admin.email,
            role: admin.role,
        });

        const isProduction = process.env.NODE_ENV === "production";
        const isLocalhost = request.headers.get("host")?.includes("localhost") ?? false;

        const cookieStore = await cookies();
        cookieStore.set(ADMIN_COOKIE_NAME, token, {
            httpOnly: true,
            secure: isProduction && !isLocalhost,
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return NextResponse.json({
            success: true,
            user: {
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("Login API Error:", error instanceof Error ? error.message : error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
