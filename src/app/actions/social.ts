"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSocialLinks() {
    try {
        const links = await prisma.socialLink.findMany({
            orderBy: {
                platform: 'asc'
            }
        });
        return links;
    } catch (error) {
        console.error("Error fetching social links:", error);
        return [];
    }
}

export async function upsertSocialLink(data: { id?: string, platform: string, url: string, status?: boolean }) {
    try {
        if (data.id) {
            await prisma.socialLink.update({
                where: { id: data.id },
                data: {
                    platform: data.platform,
                    url: data.url,
                    status: data.status !== false
                }
            });
        } else {
            await prisma.socialLink.create({
                data: {
                    platform: data.platform,
                    url: data.url,
                    status: data.status !== false
                }
            });
        }

        revalidatePath("/admin/social");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Error upserting social link:", error);
        return { success: false, error: `Failed to save: ${error.message || "Unknown error"}` };
    }
}

export async function deleteSocialLink(id: string) {
    try {
        await prisma.socialLink.delete({
            where: { id }
        });
        revalidatePath("/admin/social");
        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting social link:", error);
        return { success: false, error: "Failed to delete social link" };
    }
}

export async function toggleSocialLinkStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.socialLink.update({
            where: { id },
            data: {
                status: !currentStatus
            }
        });
        revalidatePath("/admin/social");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error toggling social link status:", error);
        return { success: false };
    }
}

