import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { guardApi } from '@/lib/auth/api-guard'

// GET all banners
export async function GET() {
    const denied = await guardApi('viewer')
    if (denied) return denied
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ success: true, banners })
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to fetch banners' }, { status: 500 })
    }
}

// POST create banner
export async function POST(req: NextRequest) {
    const denied = await guardApi('admin')
    if (denied) return denied
    try {
        const data = await req.json()
        const banner = await prisma.banner.create({ data })
        return NextResponse.json({ success: true, banner })
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to create banner' }, { status: 500 })
    }
}
