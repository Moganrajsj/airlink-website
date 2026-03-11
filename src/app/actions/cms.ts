"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── PLAN ACTIONS ─────────────────────────────────────────────────────────────

export async function getPlans(business = false) {
    return prisma.plan.findMany({
        where: { isBusiness: business },
        orderBy: { speed: "asc" },
    });
}

export async function getAllPlans() {
    return prisma.plan.findMany({ orderBy: { speed: "asc" } });
}

export async function createPlan(data: {
    title: string; speed: number; price: number;
    features: string; tag?: string; isBusiness: boolean; status: boolean;
}) {
    await prisma.plan.create({ data });
    revalidatePath("/plans");
    revalidatePath("/admin/plans");
    return { success: true };
}

export async function updatePlan(id: string, data: {
    title?: string; speed?: number; price?: number;
    features?: string; tag?: string; isBusiness?: boolean; status?: boolean;
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
    return prisma.testimonial.findMany({
        where: activeOnly ? { isActive: true } : {},
        orderBy: { createdAt: "desc" },
    });
}

export async function createTestimonial(data: {
    name: string; role?: string; content: string; rating: number; isActive: boolean;
}) {
    await prisma.testimonial.create({ data });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
}

export async function updateTestimonial(id: string, data: {
    name?: string; role?: string | null; content?: string; rating?: number; isActive?: boolean;
}) {
    await prisma.testimonial.update({ where: { id }, data });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
}

export async function deleteTestimonial(id: string) {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
}

// ─── BLOG ACTIONS ────────────────────────────────────────────────────────────

export async function getBlogs(publishedOnly = false) {
    return prisma.blog.findMany({
        where: publishedOnly ? { published: true } : {},
        orderBy: { createdAt: "desc" },
    });
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
