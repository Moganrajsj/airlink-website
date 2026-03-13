"use server";

import { readdir, unlink, stat } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const MEDIA_DIR = path.join(process.cwd(), "public", "images", "banners");

export async function getMediaFiles() {
    try {
        // Ensure the directory exists (it should if banners were uploaded)
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
        
        // Sort by newest first
        return { 
            success: true, 
            files: mediaFiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) 
        };
    } catch (error) {
        console.error("Error reading media files:", error);
        return { success: true, files: [] }; // Return empty instead of error if dir doesn't exist yet
    }
}

export async function deleteMediaFile(filename: string) {
    try {
        const filePath = path.join(MEDIA_DIR, filename);
        await unlink(filePath);
        revalidatePath("/admin/media");
        return { success: true };
    } catch (error) {
        console.error("Error deleting media file:", error);
        return { success: false, error: "Failed to delete file" };
    }
}
