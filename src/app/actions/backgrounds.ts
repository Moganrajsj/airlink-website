"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type BackgroundAssetInput = {
    sectionName: string;
    imageUrl?: string;
    animationType: string;
    speed: number;
    opacity: number;
    status: boolean;
};

export async function getBackgroundAssets() {
    try {
        const assets = await prisma.backgroundAsset.findMany({
            orderBy: { sectionName: "asc" },
        });
        return { success: true, assets };
    } catch (error) {
        console.error("Error fetching background assets:", error);
        return { success: false, error: "Failed to fetch background assets" };
    }
}

export async function createBackgroundAsset(data: BackgroundAssetInput) {
    try {
        const asset = await prisma.backgroundAsset.create({ data });
        revalidatePath("/admin/backgrounds");
        return { success: true, asset };
    } catch (error) {
        console.error("Error creating background asset:", error);
        return { success: false, error: "Failed to create background asset" };
    }
}

export async function updateBackgroundAsset(id: string, data: Partial<BackgroundAssetInput>) {
    try {
        const asset = await prisma.backgroundAsset.update({
            where: { id },
            data,
        });
        revalidatePath("/admin/backgrounds");
        return { success: true, asset };
    } catch (error) {
        console.error("Error updating background asset:", error);
        return { success: false, error: "Failed to update background asset" };
    }
}

export async function deleteBackgroundAsset(id: string) {
    try {
        await prisma.backgroundAsset.delete({ where: { id } });
        revalidatePath("/admin/backgrounds");
        return { success: true };
    } catch (error) {
        console.error("Error deleting background asset:", error);
        return { success: false, error: "Failed to delete background asset" };
    }
}

export async function toggleBackgroundAssetStatus(id: string, currentStatus: boolean) {
    try {
        const asset = await prisma.backgroundAsset.update({
            where: { id },
            data: { status: !currentStatus },
        });
        revalidatePath("/admin/backgrounds");
        return { success: true, asset };
    } catch (error) {
        console.error("Error toggling background asset status:", error);
        return { success: false, error: "Failed to toggle background asset status" };
    }
}
