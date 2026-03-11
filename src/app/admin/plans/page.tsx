import { getAllPlans } from '@/app/actions/cms';
import PlansManager from '@/components/admin/PlansManager';

export const dynamic = 'force-dynamic';

export default async function AdminPlansPage() {
    const plans = await getAllPlans();
    return (
        <div className="min-h-screen bg-[#F7F8FA] p-6 lg:p-10">
            <PlansManager initialPlans={plans} />
        </div>
    );
}
