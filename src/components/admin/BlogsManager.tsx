"use client";

import React, { useState, useTransition } from 'react';
import { Plus, Newspaper, Trash2, X, Check, Eye, EyeOff } from 'lucide-react';
import { createBlog, updateBlog, deleteBlog } from '@/app/actions/cms';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string | null;
    published: boolean;
    createdAt: Date;
}

const emptyForm = { title: "", slug: "", excerpt: "", content: "", image: "", published: false };

function toSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function BlogsManager({ initial }: { initial: Blog[] }) {
    const [blogs, setBlogs] = useState<Blog[]>(initial);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [isPending, startTransition] = useTransition();

    const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
    const openEdit = (b: Blog) => {
        setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content, image: b.image || "", published: b.published });
        setEditingId(b.id); setShowForm(true);
    };

    const handleSave = () => {
        startTransition(async () => {
            const data = { ...form, slug: form.slug || toSlug(form.title), image: form.image || undefined };
            if (editingId) {
                await updateBlog(editingId, data);
                setBlogs(prev => prev.map(b => b.id === editingId ? { ...b, ...data } as Blog : b));
            } else {
                await createBlog(data);
                window.location.reload();
            }
            setShowForm(false);
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this blog post?")) return;
        startTransition(async () => {
            await deleteBlog(id);
            setBlogs(prev => prev.filter(b => b.id !== id));
        });
    };

    const handleTogglePublish = (b: Blog) => {
        startTransition(async () => {
            await updateBlog(b.id, { published: !b.published });
            setBlogs(prev => prev.map(x => x.id === b.id ? { ...x, published: !x.published } : x));
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0A192F] tracking-tight">Blog Posts</h1>
                    <p className="text-[#0A192F]/40 text-sm mt-1">Published posts appear on the public blog</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 bg-[#FBBF24] hover:bg-[#0A192F] hover:text-white text-[#0A192F] font-black text-sm rounded-xl transition-all">
                    <Plus size={16} /> New Post
                </button>
            </div>

            <div className="space-y-3">
                {blogs.map(b => (
                    <div key={b.id} className={`bg-white rounded-2xl border p-5 flex items-start gap-4 ${b.published ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                        <div className="w-10 h-10 rounded-xl bg-[#0A192F]/5 flex items-center justify-center flex-shrink-0">
                            <Newspaper size={18} className="text-[#0A192F]/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-black text-[#0A192F] text-sm">{b.title}</h3>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${b.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {b.published ? "Published" : "Draft"}
                                </span>
                            </div>
                            <p className="text-xs text-[#0A192F]/50 mb-1 line-clamp-1">{b.excerpt}</p>
                            <p className="text-[10px] text-[#0A192F]/30 font-mono">/{b.slug}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => handleTogglePublish(b)} className={`p-1.5 rounded-lg border transition-all ${b.published ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`} title={b.published ? "Unpublish" : "Publish"}>
                                {b.published ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                            <button onClick={() => openEdit(b)} className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-[#0A192F] hover:text-white hover:border-[#0A192F] transition-all">Edit</button>
                            <button onClick={() => handleDelete(b.id)} className="p-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
                {blogs.length === 0 && <div className="text-center py-16 text-[#0A192F]/40">No blog posts yet. Create your first one!</div>}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-black text-[#0A192F]">{editingId ? "Edit Post" : "New Blog Post"}</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Title</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: toSlug(e.target.value) }))}
                                    placeholder="5 Reasons to Upgrade to Fiber Internet"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FBBF24]" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">URL Slug</label>
                                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                    placeholder="5-reasons-to-upgrade-fiber"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:border-[#FBBF24]" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Short Excerpt</label>
                                <input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                                    placeholder="Short summary shown in blog listing..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FBBF24]" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Full Content</label>
                                <textarea rows={6} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    placeholder="Full blog post content..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FBBF24] resize-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A192F]/50 block mb-1.5">Cover Image URL (optional)</label>
                                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#FBBF24]" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="accent-[#FBBF24] w-4 h-4" />
                                <span className="text-sm font-semibold text-[#0A192F]/60">Publish immediately</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={handleSave} disabled={isPending || !form.title || !form.excerpt || !form.content}
                                className="flex-1 py-3 bg-[#0A192F] text-white font-black text-sm rounded-xl hover:bg-[#FBBF24] hover:text-[#0A192F] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                <Check size={16} /> {isPending ? "Saving..." : "Save Post"}
                            </button>
                            <button onClick={() => setShowForm(false)} className="px-5 py-3 border border-gray-200 font-bold text-sm rounded-xl hover:bg-gray-50">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
