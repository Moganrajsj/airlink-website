"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { packages, toPrismaPlan } from "@/data/packages";

// ─── PLAN ACTIONS ─────────────────────────────────────────────────────────────

export async function getPlans(business = false) {
    try {
        const plans = await prisma.plan.findMany({
            where: { isBusiness: business, status: true },
            orderBy: { speed: "asc" },
        });
        if (plans.length > 0) return plans;
        throw new Error("No plans in DB");
    } catch (error) {
        console.warn("getPlans: DB unreachable or empty, using static fallbacks");
        return packages
            .filter(pkg => !!pkg.isPremium === business)
            .map(toPrismaPlan);
    }
}

export async function getAllPlans() {
    try {
        const plans = await prisma.plan.findMany({ orderBy: { speed: "asc" } });
        if (plans.length > 0) return plans;
        throw new Error("No plans in DB");
    } catch (error) {
        console.warn("getAllPlans: DB unreachable or empty, using static fallbacks");
        return packages.map(toPrismaPlan);
    }
}

export async function createPlan(data: {
    title: string; speed: number; price: number;
    features: string; tag?: string | null; isBusiness: boolean; status: boolean;
}) {
    await prisma.plan.create({ data });
    revalidatePath("/plans");
    revalidatePath("/admin/plans");
    return { success: true };
}

export async function updatePlan(id: string, data: {
    title?: string; speed?: number; price?: number;
    features?: string; tag?: string | null; isBusiness?: boolean; status?: boolean;
}) {
    await prisma.plan.update({ where: { id }, data });
    revalidatePath("/plans");
    revalidatePath("/admin/plans");
    return { success: true };
}

export async function deletePlan(id: string) {
    await prisma.plan.delete({ where: { id } });
    revalidatePath("/plans");
    revalidatePath("/admin/plans");
    return { success: true };
}

// ─── COVERAGE ACTIONS ─────────────────────────────────────────────────────────

export async function getCoverageAreas() {
    return prisma.coverage.findMany({ orderBy: { cityName: "asc" } });
}

export async function createCoverage(data: { cityName: string; status: string }) {
    await prisma.coverage.create({ data: { ...data, leadsCount: 0 } });
    revalidatePath("/admin/coverage");
    return { success: true };
}

export async function updateCoverage(id: string, data: { cityName?: string; status?: string }) {
    await prisma.coverage.update({ where: { id }, data });
    revalidatePath("/admin/coverage");
    return { success: true };
}

export async function deleteCoverage(id: string) {
    await prisma.coverage.delete({ where: { id } });
    revalidatePath("/admin/coverage");
    return { success: true };
}

// ─── TESTIMONIAL ACTIONS ─────────────────────────────────────────────────────

export async function getTestimonials(activeOnly = false) {
    try {
        return await prisma.testimonial.findMany({
            where: activeOnly ? { isActive: true } : {},
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.warn("getTestimonials: DB unreachable, returning empty array");
        return [];
    }
}

export async function createTestimonial(data: {
    name: string; role?: string; content: string; rating: number; isActive: boolean;
    person?: string; city?: string; tag?: string; metric?: string; color?: string;
}) {
    try {
        await prisma.testimonial.create({ data });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("createTestimonial failed:", error);
        return { success: false, error: "Database unreachable" };
    }
}

export async function updateTestimonial(id: string, data: {
    name?: string; role?: string | null; content?: string; rating?: number; isActive?: boolean;
    person?: string; city?: string; tag?: string | null; metric?: string | null; color?: string;
}) {
    try {
        await prisma.testimonial.update({ where: { id }, data });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("updateTestimonial failed:", error);
        return { success: false, error: "Database unreachable" };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await prisma.testimonial.delete({ where: { id } });
        revalidatePath("/admin/testimonials");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("deleteTestimonial failed:", error);
        return { success: false, error: "Database unreachable" };
    }
}

// ─── BLOG ACTIONS ────────────────────────────────────────────────────────────

export async function getBlogs(publishedOnly = false) {
    try {
        return await prisma.blog.findMany({
            where: publishedOnly ? { published: true } : {},
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.warn("getBlogs: DB unreachable, returning empty array");
        return [];
    }
}

export async function createBlog(data: {
    title: string; slug: string; excerpt: string;
    content: string; image?: string; published: boolean;
}) {
    const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    await prisma.blog.create({ data: { ...data, slug } });
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true };
}

export async function updateBlog(id: string, data: {
    title?: string; slug?: string; excerpt?: string;
    content?: string; image?: string; published?: boolean;
}) {
    await prisma.blog.update({ where: { id }, data });
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true };
}

export async function deleteBlog(id: string) {
    await prisma.blog.delete({ where: { id } });
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true };
}
