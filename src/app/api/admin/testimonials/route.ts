import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardApi } from '@/lib/auth/api-guard';

export const dynamic = 'force-dynamic';

// GET all testimonials (admin - includes hidden)
export async function GET() {
    const denied = await guardApi('viewer');
    if (denied) return denied;
    try {
        const rows = await prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(rows.map(r => ({
            ...r,
            status: Boolean(r.isActive),
            person: r.person || r.name,
            city: r.city || 'Tamil Nadu',
            color: r.color || '#FBBF24',
        })));
    } catch {
        return NextResponse.json({ error: 'Failed to load testimonials.' }, { status: 500 });
    }
}

// POST create/update testimonial
export async function POST(request: NextRequest) {
    const denied = await guardApi('admin');
    if (denied) return denied;
    try {
        const data = await request.json();

        if (typeof data?.name !== 'string' || typeof data?.content !== 'string') {
            return NextResponse.json({ success: false, error: 'Name and content are required.' }, { status: 400 });
        }

        const payload = {
            name: data.name,
            role: data.role,
            content: data.content,
            rating: data.rating ?? 5,
            person: data.person || data.name,
            city: data.city || 'Tamil Nadu',
            tag: data.tag || '',
            metric: data.metric || '',
            color: data.color || '#FBBF24'
        };

        if (data.id) {
            await prisma.testimonial.update({
                where: { id: data.id },
                data: { ...payload, isActive: Boolean(data.status) }
            });
        } else {
            await prisma.testimonial.create({
                data: { ...payload, isActive: data.status !== false }
            });
        }
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to save testimonial.' }, { status: 500 });
    }
}

// DELETE a testimonial
export async function DELETE(request: NextRequest) {
    const denied = await guardApi('admin');
    if (denied) return denied;
    try {
        const { id } = await request.json();
        await prisma.testimonial.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to delete testimonial.' }, { status: 500 });
    }
}

// PATCH toggle status
export async function PATCH(request: NextRequest) {
    const denied = await guardApi('admin');
    if (denied) return denied;
    try {
        const { id, status } = await request.json();
        await prisma.testimonial.update({
            where: { id },
            data: { isActive: Boolean(status) }
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Failed to update testimonial.' }, { status: 500 });
    }
}
