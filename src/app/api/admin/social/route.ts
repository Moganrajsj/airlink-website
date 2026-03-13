import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET all social links (for admin)
export async function GET() {
    try {
        const links = await prisma.socialLink.findMany({
            orderBy: { platform: 'asc' }
        });
        return NextResponse.json(links);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create/update social link
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        if (data.id) {
            await prisma.socialLink.update({
                where: { id: data.id },
                data: {
                    platform: data.platform,
                    url: data.url,
                    status: Boolean(data.status)
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
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE a social link
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await prisma.socialLink.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PATCH toggle status
export async function PATCH(request: NextRequest) {
    try {
        const { id, status } = await request.json();
        await prisma.socialLink.update({
            where: { id },
            data: { status: Boolean(status) }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
