import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET all testimonials (admin - includes hidden)
export async function GET() {
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
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST create/update testimonial
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (data.id) {
            await prisma.testimonial.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    role: data.role,
                    content: data.content,
                    rating: data.rating ?? 5,
                    isActive: Boolean(data.status),
                    person: data.person || data.name,
                    city: data.city || 'Tamil Nadu',
                    tag: data.tag || '',
                    metric: data.metric || '',
                    color: data.color || '#FBBF24'
                }
            });
        } else {
            await prisma.testimonial.create({
                data: {
                    name: data.name,
                    role: data.role,
                    content: data.content,
                    rating: data.rating ?? 5,
                    isActive: data.status !== false,
                    person: data.person || data.name,
                    city: data.city || 'Tamil Nadu',
                    tag: data.tag || '',
                    metric: data.metric || '',
                    color: data.color || '#FBBF24'
                }
            });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE a testimonial
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await prisma.testimonial.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PATCH toggle status
export async function PATCH(request: NextRequest) {
    try {
        const { id, status } = await request.json();
        await prisma.testimonial.update({
            where: { id },
            data: { isActive: Boolean(status) }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
