import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all banners
export async function GET() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ success: true, banners })
    } catch (error) {
        console.error('Error fetching banners:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch banners' }, { status: 500 })
    }
}

// POST create banner
export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        const banner = await prisma.banner.create({ data })
        return NextResponse.json({ success: true, banner })
    } catch (error) {
        console.error('Error creating banner:', error)
        return NextResponse.json({ success: false, error: 'Failed to create banner' }, { status: 500 })
    }
}
