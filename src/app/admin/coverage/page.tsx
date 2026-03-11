import { getCoverageAreas } from '@/app/actions/cms';
import { prisma } from '@/lib/prisma';
import CoverageManager from '@/components/admin/CoverageManager';

export const dynamic = 'force-dynamic';

export default async function AdminCoveragePage() {
    const [areas, allLeads] = await Promise.all([
        getCoverageAreas(),
        prisma.lead.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    // Filter in JS to avoid stale Prisma client type issues
    const coverageLeads = (allLeads as Record<string, unknown>[]).filter((l) => {
        const interest = String(l.interest || '');
        const source = String(l.source || '');
        return interest.includes('Check') || source.includes('availability') || interest.includes('Fiber');
    }).map(l => ({
        id: l.id as string,
        name: l.name as string,
        mobile: (l.mobile as string) || (l.phone as string) || '',
        email: l.email as string | null,
        city: l.city as string,
        source: l.source as string | null,
        status: l.status as string,
        createdAt: l.createdAt as Date,
    }));

    return (
        <div className="min-h-screen bg-[#F7F8FA] p-6 lg:p-10">
            <CoverageManager initialCoverage={areas} coverageLeads={coverageLeads} />
        </div>
    );
}

