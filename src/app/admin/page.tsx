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

    const totalLeads = await prisma.lead.count();

    // Stats for the view
    const stats = {
        totalLeads: totalLeads.toString(),
        // Add more real metrics as needed
    };

    return (
        <DashboardView leads={leads} stats={stats} />
    );
}
