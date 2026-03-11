"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Image as ImageIcon, Link as LinkIcon, Power, PowerOff } from "lucide-react";
import { getBanners, createBanner, updateBanner, deleteBanner, toggleBannerStatus, type BannerInput } from "@/app/actions/banners";
import type { Banner } from "@prisma/client";

export default function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialFormState: BannerInput = {
        title: "",
        subtitle: "",
        offerHighlight: "",
        imageUrl: "",
        ctaText: "",
        ctaLink: "",
        bannerType: "hero",
        status: true,
    };
    const [formData, setFormData] = useState<BannerInput>(initialFormState);

    // Fetch banners on load
    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        setIsLoading(true);
        const res = await getBanners();
        if (res.success && res.banners) {
            setBanners(res.banners);
        }
        setIsLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (isEditing && editingId) {
            const res = await updateBanner(editingId, formData);
            if (res.success) {
                alert("Banner updated successfully!");
                resetForm();
                loadBanners();
            } else {
                alert("Failed to update banner.");
            }
        } else {
            const res = await createBanner(formData);
            if (res.success) {
                alert("Banner created successfully!");
                resetForm();
                loadBanners();
            } else {
                alert("Failed to create banner.");
            }
        }
        setIsSubmitting(false);
    };

    const handleEdit = (banner: Banner) => {
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || "",
            offerHighlight: banner.offerHighlight || "",
            imageUrl: banner.imageUrl || "",
            ctaText: banner.ctaText || "",
            ctaLink: banner.ctaLink || "",
            bannerType: banner.bannerType as any,
            status: banner.status,
        });
        setEditingId(banner.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;

        const res = await deleteBanner(id);
        if (res.success) {
            loadBanners();
        } else {
            alert("Failed to delete banner.");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const res = await toggleBannerStatus(id, currentStatus);
        if (res.success) {
            loadBanners();
        } else {
            alert("Failed to toggle status.");
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#0A192F] uppercase tracking-tighter">
                    Banner Management
                </h1>
                <p className="text-[#0A192F]/60 font-medium mt-2">
                    Create and manage Hero, Promo, Announcement, and Shop banners.
                </p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/5 rounded-bl-full pointer-events-none" />
                <h2 className="text-xl font-black text-[#0A192F] mb-6 flex items-center gap-2">
                    <ImageIcon className="text-[#FBBF24]" size={20} />
                    {isEditing ? "Edit Banner" : "Create New Banner"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-black text-[#0A192F]/60 uppercase tracking-wider mb-2">Banner Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all text-[#0A192F] font-bold"
                                placeholder="e.g. Experience Speed Beyond Thinking"
                            />
                        </div>

                        {/* Banner Type */}
                        <div>
                            <label className="block text-xs font-black text-[#0A192F]/60 uppercase tracking-wider mb-2">Banner Type *</label>
                            <select
                                name="bannerType"
                                value={formData.bannerType}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all text-[#0A192F] font-bold cursor-pointer appearance-none"
                            >
                                <option value="hero">Hero Banner (Home Top)</option>
                                <option value="promo">Promo Banner (Section Divider)</option>
                                <option value="announcement">Announcement (Top Ticker)</option>
                                <option value="shop">Shop Banner</option>
                            </select>
                        </div>

                        {/* Subtitle */}
                        <div>
                            <label className="block text-xs font-black text-[#0A192F]/60 uppercase tracking-wider mb-2">Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all text-[#0A192F] font-medium"
                                placeholder="e.g. Ultra-fast fiber broadband for homes across TN."
                            />
                        </div>

                        {/* Offer Highlight */}
                        <div>
                            <label className="block text-xs font-black text-[#0A192F]/60 uppercase tracking-wider mb-2">Offer Highlight (Promo Banner only)</label>
                            <input
                                type="text"
                                name="offerHighlight"
                                value={formData.offerHighlight}
                                onChange={handleInputChange}
                                className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all text-[#0A192F] font-medium"
                                placeholder="e.g. Free Installation Available for a Limited Time"
                            />
                        </div>

                        {/* Image URL */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-[#0A192F]/60 uppercase tracking-wider mb-2">Image URL (Optional for Announcement)</label>
                            <div className="relative flex items-center">
                                <ImageIcon size={16} className="absolute left-4 text-[#0A192F]/40" />
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all text-[#0A192F] font-medium"
                                    placeholder="e.g. /backgrounds/hero-1.jpg"
                                />
                            </div>
                        </div>

                        {/* CTA Text */}
                        <div>
                            <label className="block text-xs font-black text-[#0A192F]/60 uppercase tracking-wider mb-2">CTA Button Text</label>
                            <input
                                type="text"
                                name="ctaText"
                                value={formData.ctaText}
                                onChange={handleInputChange}
                                className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all text-[#0A192F] font-medium"
                                placeholder="e.g. View Plans"
                            />
                        </div>

                        {/* CTA Link */}
                        <div>
                            <label className="block text-xs font-black text-[#0A192F]/60 uppercase tracking-wider mb-2">CTA Link</label>
                            <div className="relative flex items-center">
                                <LinkIcon size={16} className="absolute left-4 text-[#0A192F]/40" />
                                <input
                                    type="text"
                                    name="ctaLink"
                                    value={formData.ctaLink}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all text-[#0A192F] font-medium"
                                    placeholder="e.g. /plans or https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 rounded-xl font-bold text-sm text-[#0A192F]/60 hover:bg-gray-100 transition-colors"
                            >
                                Cancel Edit
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#0A192F] hover:bg-[#FBBF24] text-white hover:text-[#0A192F] px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : isEditing ? "Update Banner" : <><Plus size={16} /> Create Banner</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Banners List */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <h2 className="text-xl font-black text-[#0A192F] mb-6">Existing Banners</h2>

                {isLoading ? (
                    <div className="text-center py-10 opacity-50 font-bold">Loading banners...</div>
                ) : banners.length === 0 ? (
                    <div className="text-center py-10 opacity-50 font-bold">No banners found. Create one above.</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {banners.map((banner) => (
                            <div key={banner.id} className={`border rounded-2xl p-5 relative overflow-hidden ${banner.status ? 'border-gray-200' : 'border-red-100 bg-red-50/30 opacity-75'}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="pr-12">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-[#0A192F] text-white text-[9px] px-2 py-1 rounded tracking-widest uppercase font-black">
                                                {banner.bannerType}
                                            </span>
                                            {!banner.status && (
                                                <span className="bg-red-500 text-white text-[9px] px-2 py-1 rounded tracking-widest uppercase font-black">Inactive</span>
                                            )}
                                        </div>
                                        <h3 className="font-black text-[#0A192F] text-lg leading-tight truncate">{banner.title}</h3>
                                        {banner.subtitle && <p className="text-sm text-gray-500 mt-1 line-clamp-2 md:line-clamp-1">{banner.subtitle}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2 absolute top-5 right-5">
                                        <button
                                            onClick={() => handleToggleStatus(banner.id, banner.status)}
                                            className={`p-2 rounded-lg border transition-colors ${banner.status ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}
                                            title={banner.status ? "Deactivate" : "Activate"}
                                        >
                                            {banner.status ? <Power size={14} /> : <PowerOff size={14} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4 text-xs font-semibold text-gray-500">
                                    {banner.ctaText && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-16">CTA:</span>
                                            <span className="text-[#0A192F] bg-gray-100 px-2 py-0.5 rounded">{banner.ctaText}</span>
                                            {banner.ctaLink && <span className="text-blue-500 truncate max-w-[150px]">({banner.ctaLink})</span>}
                                        </div>
                                    )}
                                    {banner.imageUrl && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-16">Image:</span>
                                            <span className="truncate max-w-[200px]">{banner.imageUrl}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-[#F7F8FA] hover:bg-[#FBBF24] text-[#0A192F] py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                                    >
                                        <Edit size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
