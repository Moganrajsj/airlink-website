import IntelligenceDashboard from "@/components/admin/intelligence/IntelligenceDashboard";
import { getAllLeads } from "@/app/actions/leads";
import { getDuplicateGroups, getMetrics } from "@/app/actions/intelligence";

export const dynamic = "force-dynamic";

export default async function AdminIntelligencePage() {
    const [metrics, leads, duplicates] = await Promise.all([
        getMetrics(),
        getAllLeads(),
        getDuplicateGroups(),
    ]);

    return (
        <IntelligenceDashboard
            metrics={metrics}
            leads={leads as unknown as Parameters<typeof IntelligenceDashboard>[0]["leads"]}
            duplicates={duplicates}
        />
    );
}
