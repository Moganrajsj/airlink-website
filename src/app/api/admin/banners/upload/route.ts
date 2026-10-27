import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { guardApi } from '@/lib/auth/api-guard'

const ALLOWED_TYPES: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
}

export async function POST(req: NextRequest) {
    const denied = await guardApi('admin')
    if (denied) return denied

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
        }

        // Extension is derived from the declared MIME type, never from the
        // client-supplied filename, so an "image.php" cannot be stored.
        const ext = ALLOWED_TYPES[file.type]
        if (!ext) {
            return NextResponse.json(
                { success: false, error: 'Only image files are allowed (jpg, png, gif, webp)' },
                { status: 400 }
            )
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: 'File size must be less than 5MB' },
                { status: 400 }
            )
        }

        const filename = `banner-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const uploadDir = path.join(process.cwd(), 'public', 'images', 'banners')
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        const bytes = await file.arrayBuffer()
        await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

        return NextResponse.json({ success: true, imageUrl: `/images/banners/${filename}` })
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 })
    }
}
