import React from 'react';
import { prisma } from '@/lib/prisma';
import DashboardView from '@/components/admin/DashboardView';

// Force dynamic ensures we always get the latest data from the DB
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Fetch real data from Prisma
    const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    const [totalLeads, totalPlans, totalCoverage, totalBanners] = await Promise.all([
        prisma.lead.count(),
        prisma.plan.count(),
        prisma.coverage.count(),
        prisma.banner.count({ where: { status: true } })
    ]);

    const activeAssets = await prisma.backgroundAsset.findMany({
        where: { status: true },
        take: 5
    });

    // Stats for the view
    const stats = {
        totalLeads: totalLeads.toString(),
        totalPlans: totalPlans.toString(),
        totalCoverage: totalCoverage.toString(),
        activeBanners: totalBanners.toString(),
    };

    return (
        <DashboardView leads={leads} stats={stats} activeAssets={activeAssets} />
    );
}
