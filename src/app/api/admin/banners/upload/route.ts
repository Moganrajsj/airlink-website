import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Only image files are allowed (jpg, png, gif, webp)' },
                { status: 400 }
            )
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: 'File size must be less than 5MB' },
                { status: 400 }
            )
        }

        // Generate unique filename
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const filename = `banner-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'banners')
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        // Write file to disk
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(path.join(uploadDir, filename), buffer)

        const imageUrl = `/images/banners/${filename}`
        return NextResponse.json({ success: true, imageUrl })
    } catch (error) {
        console.error('Error uploading image:', error)
        return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 })
    }
}
