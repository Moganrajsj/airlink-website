import { getTestimonials } from '@/app/actions/cms';
import TestimonialsManager from '@/components/admin/TestimonialsManager';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
    const items = await getTestimonials();
    return (
        <div className="min-h-screen bg-[#F7F8FA] p-6 lg:p-10">
            <TestimonialsManager initial={items} />
        </div>
    );
}
