import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev-only";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find admin - Canonicalize email to lowercase
        const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!admin) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create JWT token with explicit algorithm
        const token = jwt.sign(
            { 
                id: admin.id, 
                email: admin.email, 
                role: admin.role 
            },
            JWT_SECRET,
            { expiresIn: "1d", algorithm: "HS256" }
        );
 
        // Set secure cookie - handle local dev vs production
        const isProduction = process.env.NODE_ENV === "production";
        const isLocalhost = request.headers.get("host")?.includes("localhost");
        
        console.log(`[Login API] Creating session for ${admin.email}. Production: ${isProduction}, Localhost: ${isLocalhost}`);

        const cookieStore = await cookies();
        cookieStore.set("admin_session", token, {
            httpOnly: true,
            secure: isProduction && !isLocalhost, // Only secure if production AND not localhost
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return NextResponse.json({
            success: true,
            user: {
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Login API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
