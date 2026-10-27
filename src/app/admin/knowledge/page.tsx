import { getKnowledgeEntries } from "@/app/actions/knowledge";
import KnowledgeManager from "@/components/admin/KnowledgeManager";

export const dynamic = "force-dynamic";

export default async function AdminKnowledgePage() {
    const entries = await getKnowledgeEntries();

    return (
        <div className="min-h-screen bg-[#F7F8FA] p-6 lg:p-10">
            <KnowledgeManager initialEntries={entries} />
        </div>
    );
}
