import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardApi } from '@/lib/auth/api-guard';

export const dynamic = 'force-dynamic';

// GET all social links (for admin)
export async function GET() {
    const denied = await guardApi('viewer');
    if (denied) return denied;
    try {
        const links = await prisma.socialLink.findMany({
            orderBy: { platform: 'asc' }
        });
        return NextResponse.json(links);
    } catch {
        return NextResponse.json({ error: 'Failed to load social links.' }, { status: 500 });
    }
}

// POST create/update social link
export async function POST(request: NextRequest) {
    const denied = await guardApi('admin');
    if (denied) return denied;
    try {
        const data = await request.json();

        if (typeof data?.platform !== 'string' || typeof data?.url !== 'string') {
            return NextResponse.json({ success: false, error: 'Platform and URL are required.' }, { status: 400 });
        }

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
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to save social link.' }, { status: 500 });
    }
}

// DELETE a social link
export async function DELETE(request: NextRequest) {
    const denied = await guardApi('admin');
    if (denied) return denied;
    try {
        const { id } = await request.json();
        await prisma.socialLink.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to delete social link.' }, { status: 500 });
    }
}

// PATCH toggle status
export async function PATCH(request: NextRequest) {
    const denied = await guardApi('admin');
    if (denied) return denied;
    try {
        const { id, status } = await request.json();
        await prisma.socialLink.update({
            where: { id },
            data: { status: Boolean(status) }
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to update social link.' }, { status: 500 });
    }
}
