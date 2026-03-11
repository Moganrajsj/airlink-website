"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function loginUser(email: string, password: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) return { success: false, error: "Invalid email or password" };

        // For demo purposes, we'll check plain text if bcrypt fails or if it's the test accounts
        // In a real app, always use bcrypt.compare
        const isPasswordValid = await bcrypt.compare(password, user.password).catch(() => password === user.password);

        if (!isPasswordValid) return { success: false, error: "Invalid email or password" };

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                plan: user.plan,
                isPaid: user.isPaid,
                billingDate: user.billingDate?.toISOString(),
            }
        };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

export async function signupUser(email: string, password: string, name: string) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) return { success: false, error: "Email already exists" };

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: "customer",
                isPaid: false,
            }
        });

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isPaid: user.isPaid,
            }
        };
    } catch (error) {
        console.error("Signup error:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}
