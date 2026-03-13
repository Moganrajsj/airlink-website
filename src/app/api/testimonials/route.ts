import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json([], { status: 200 });
    }
}
