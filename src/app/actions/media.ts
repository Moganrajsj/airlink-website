"use server";

import { readdir, unlink, stat } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/admin-session";

const MEDIA_DIR = path.join(process.cwd(), "public", "images", "banners");

/** Rejects `../` and absolute paths so a crafted filename cannot escape MEDIA_DIR. */
function resolveMediaPath(filename: string): string | null {
    const safeName = path.basename(filename);
    if (!safeName || safeName !== filename || safeName.startsWith(".")) return null;
    return path.join(MEDIA_DIR, safeName);
}

export async function getMediaFiles() {
    if (!(await requireAdminAction("viewer"))) {
        return { success: false, error: "Not authorised.", files: [] };
    }
    try {
        const files = await readdir(MEDIA_DIR);

        const mediaFiles = await Promise.all(
            files.map(async (file) => {
                const filePath = path.join(MEDIA_DIR, file);
                const fileStat = await stat(filePath);

                return {
                    name: file,
                    url: `/images/banners/${file}`,
                    size: fileStat.size,
                    createdAt: fileStat.birthtime,
                };
            })
        );

        return {
            success: true,
            files: mediaFiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        };
    } catch (error) {
        console.error("Error reading media files:", error);
        return { success: true, files: [] };
    }
}

export async function deleteMediaFile(filename: string) {
    if (!(await requireAdminAction("admin"))) {
        return { success: false, error: "Not authorised." };
    }
    try {
        const filePath = resolveMediaPath(filename);
        if (!filePath) return { success: false, error: "Invalid file name." };

        await unlink(filePath);
        revalidatePath("/admin/media");
        return { success: true };
    } catch (error) {
        console.error("Error deleting media file:", error instanceof Error ? error.message : error);
        return { success: false, error: "Failed to delete file" };
    }
}
