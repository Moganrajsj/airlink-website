import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const links = await prisma.socialLink.findMany({
            where: { status: true },
            orderBy: { platform: 'asc' }
        });
        return NextResponse.json(links);
    } catch (error) {
        console.error('Error fetching social links:', error);
        return NextResponse.json([], { status: 200 });
    }
}
