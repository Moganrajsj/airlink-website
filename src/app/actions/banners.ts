"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Type definition for creating/updating a banner
export type BannerInput = {
    title: string;
    subtitle?: string;
    offerHighlight?: string;
    imageUrl?: string;
    ctaText?: string;
    ctaLink?: string;
    bannerType: "hero" | "promo" | "announcement" | "shop";
    status?: boolean;
};

/**
 * Fetch all banners
 */
export async function getBanners() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { success: true, banners };
    } catch (error) {
        console.error("Error fetching banners:", error);
        return { success: false, error: "Failed to fetch banners" };
    }
}

/**
 * Fetch active banners by type
 */
export async function getActiveBannersByType(type: "hero" | "promo" | "announcement" | "shop") {
    try {
        const banners = await prisma.banner.findMany({
            where: {
                bannerType: type,
                status: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return { success: true, banners };
    } catch (error) {
        console.error(`Error fetching ${type} banners:`, error);
        return { success: false, error: `Failed to fetch ${type} banners` };
    }
}

/**
 * Create a new banner
 */
export async function createBanner(data: BannerInput) {
    try {
        const banner = await prisma.banner.create({
            data,
        });
        revalidatePath("/");
        revalidatePath("/admin/banners");
        return { success: true, banner };
    } catch (error) {
        console.error("Error creating banner:", error);
        return { success: false, error: "Failed to create banner" };
    }
}

/**
 * Update an existing banner
 */
export async function updateBanner(id: string, data: Partial<BannerInput>) {
    try {
        const banner = await prisma.banner.update({
            where: { id },
            data,
        });
        revalidatePath("/");
        revalidatePath("/admin/banners");
        return { success: true, banner };
    } catch (error) {
        console.error("Error updating banner:", error);
        return { success: false, error: "Failed to update banner" };
    }
}

/**
 * Delete a banner
 */
export async function deleteBanner(id: string) {
    try {
        await prisma.banner.delete({
            where: { id },
        });
        revalidatePath("/");
        revalidatePath("/admin/banners");
        return { success: true };
    } catch (error) {
        console.error("Error deleting banner:", error);
        return { success: false, error: "Failed to delete banner" };
    }
}

/**
 * Toggle banner status (Active/Inactive)
 */
export async function toggleBannerStatus(id: string, currentStatus: boolean) {
    try {
        const banner = await prisma.banner.update({
            where: { id },
            data: { status: !currentStatus },
        });
        revalidatePath("/");
        revalidatePath("/admin/banners");
        return { success: true, banner };
    } catch (error) {
        console.error("Error toggling banner status:", error);
        return { success: false, error: "Failed to toggle banner status" };
    }
}
