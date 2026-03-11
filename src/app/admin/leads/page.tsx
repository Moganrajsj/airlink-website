import React, { Suspense } from 'react';
import { getAllLeads } from '@/app/actions/leads';
import LeadsTable from '@/components/admin/LeadsTable';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; interest?: string; status?: string; city?: string }>;
}) {
    const params = await searchParams;
    const leads = await getAllLeads(params.search, params.interest, params.status, params.city);

    return (
        <div className="min-h-screen bg-[#0A192F] text-white p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Lead Management</h1>
                        <p className="text-white/40 text-sm font-medium mt-1">All incoming broadband inquiries from the website</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#FBBF24]/20 text-[#FBBF24] text-xs font-black uppercase tracking-widest">
                            {leads.length} Leads
                        </span>
                    </div>
                </div>

                <Suspense fallback={<div className="text-white/40">Loading leads...</div>}>
                    <LeadsTable leads={leads} />
                </Suspense>
            </div>
        </div>
    );
}
