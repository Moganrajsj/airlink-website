export default function AdminSettingsPage() {
    return (
        <div className="min-h-screen bg-[#0A192F] text-white p-6 lg:p-10">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight">SEO Settings</h1>
                    <p className="text-white/40 text-sm font-medium mt-1">Manage meta titles, descriptions, and search engine optimization settings</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                    <span className="text-5xl mb-4 block">⚙️</span>
                    <h2 className="text-xl font-bold text-white mb-2">SEO &amp; Settings</h2>
                    <p className="text-white/40 text-sm">Configure SEO tags, site meta, and general settings here. Coming soon.</p>
                </div>
            </div>
        </div>
    );
}
