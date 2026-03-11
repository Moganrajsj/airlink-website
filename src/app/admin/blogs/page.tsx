import { getBlogs } from '@/app/actions/cms';
import BlogsManager from '@/components/admin/BlogsManager';

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
    const blogs = await getBlogs();
    return (
        <div className="min-h-screen bg-[#F7F8FA] p-6 lg:p-10">
            <BlogsManager initial={blogs} />
        </div>
    );
}
