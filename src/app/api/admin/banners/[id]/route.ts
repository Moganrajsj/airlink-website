import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update banner
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const data = await req.json()
        const banner = await prisma.banner.update({
            where: { id },
            data
        })
        return NextResponse.json({ success: true, banner })
    } catch (error) {
        console.error('Error updating banner:', error)
        return NextResponse.json({ success: false, error: 'Failed to update banner' }, { status: 500 })
    }
}

// DELETE banner
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.banner.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting banner:', error)
        return NextResponse.json({ success: false, error: 'Failed to delete banner' }, { status: 500 })
    }
}

// PATCH toggle status
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { status } = await req.json()
        const banner = await prisma.banner.update({
            where: { id },
            data: { status }
        })
        return NextResponse.json({ success: true, banner })
    } catch (error) {
        console.error('Error toggling banner status:', error)
        return NextResponse.json({ success: false, error: 'Failed to toggle status' }, { status: 500 })
    }
}
