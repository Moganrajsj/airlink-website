"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Plus, Trash2, Edit, Image as ImageIcon, Link as LinkIcon,
    Power, PowerOff, Upload, X, CheckCircle, AlertCircle, Eye
} from "lucide-react";
import { getBanners, createBanner, updateBanner, deleteBanner, toggleBannerStatus, type BannerInput } from "@/app/actions/banners";
import type { Banner } from "@prisma/client";

type ToastType = "success" | "error";
interface Toast { message: string; type: ToastType; }

export default function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const initialFormState: BannerInput = {
        title: "",
        subtitle: "",
        offerHighlight: "",
        imageUrl: "",
        ctaText: "",
        ctaLink: "",
        bannerType: "promo",
        status: true,
    };
    const [formData, setFormData] = useState<BannerInput>(initialFormState);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Update image preview if imageUrl field is changed manually
        if (name === "imageUrl") {
            setImagePreview(value || null);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        try {
            const res = await fetch("/api/admin/banners/upload", {
                method: "POST",
                body: uploadFormData,
            });
            const data = await res.json();
            if (data.success) {
                setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
                setImagePreview(data.imageUrl);
                showToast("Image uploaded successfully!", "success");
            } else {
                showToast(data.error || "Image upload failed", "error");
            }
        } catch {
            showToast("Failed to upload image. Please try again.", "error");
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (isEditing && editingId) {
            const res = await updateBanner(editingId, formData);
            if (res.success) {
                showToast("Banner updated successfully!", "success");
                resetForm();
                loadBanners();
            } else {
                showToast("Failed to update banner.", "error");
            }
        } else {
            const res = await createBanner(formData);
            if (res.success) {
                showToast("Banner created successfully!", "success");
                resetForm();
                loadBanners();
            } else {
                showToast("Failed to create banner.", "error");
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
        setImagePreview(banner.imageUrl || null);
        setEditingId(banner.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner? This cannot be undone.")) return;
        const res = await deleteBanner(id);
        if (res.success) {
            showToast("Banner deleted.", "success");
            loadBanners();
        } else {
            showToast("Failed to delete banner.", "error");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const res = await toggleBannerStatus(id, currentStatus);
        if (res.success) {
            showToast(`Banner ${currentStatus ? "deactivated" : "activated"}.`, "success");
            loadBanners();
        } else {
            showToast("Failed to toggle status.", "error");
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditingId(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const bannerTypeColors: Record<string, string> = {
        promo: "bg-amber-100 text-amber-800 border-amber-200",
        announcement: "bg-blue-100 text-blue-800 border-blue-200",
        hero: "bg-purple-100 text-purple-800 border-purple-200",
        shop: "bg-green-100 text-green-800 border-green-200",
    };

    return (
        <div>
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border transition-all duration-300 ${toast.type === "success"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                    }`}>
                    {toast.type === "success"
                        ? <CheckCircle size={18} className="text-green-600" />
                        : <AlertCircle size={18} className="text-red-600" />}
                    <span className="font-bold text-sm">{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100">
                        <X size={14} />
                    </button>
                </div>
            )}

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
                                placeholder="e.g. Unlimited Entertainment Awaits"
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
                                className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all text-[#0A192F] font-bold cursor-pointer"
                            >
                                <option value="promo">Promo Banner (Section Divider)</option>
                                <option value="announcement">Announcement (Top Ticker)</option>
                                <option value="hero">Hero Banner (Home Top)</option>
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
                                placeholder="e.g. Premium OTT streaming with every plan"
                            />
                        </div>

                        {/* Offer Highlight */}
                        <div>
                            <label className="block text-xs font-black text-[#0A192F]/60 uppercase tracking-wider mb-2">Offer Highlight</label>
                            <input
                                type="text"
                                name="offerHighlight"
                                value={formData.offerHighlight}
                                onChange={handleInputChange}
                                className="w-full bg-[#F7F8FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#FBBF24] focus:ring-1 focus:ring-[#FBBF24] outline-none transition-all text-[#0A192F] font-medium"
                                placeholder="e.g. Free Installation for Limited Time"
                            />
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
                                    placeholder="e.g. /plans"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-[#0A192F]/60 uppercase tracking-wider mb-2">
                                Banner Image
                            </label>
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Upload button */}
                                <div className="flex-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="banner-image-upload"
                                    />
                                    <label
                                        htmlFor="banner-image-upload"
                                        className={`w-full flex items-center justify-center gap-3 border-2 border-dashed rounded-xl py-5 cursor-pointer transition-all ${imageUploading
                                            ? "border-[#FBBF24] bg-amber-50 text-amber-700"
                                            : "border-gray-300 hover:border-[#FBBF24] hover:bg-amber-50 text-gray-500"
                                            }`}
                                    >
                                        <Upload size={20} />
                                        <span className="font-bold text-sm">
                                            {imageUploading ? "Uploading..." : "Click to upload image"}
                                        </span>
                                    </label>

                                    {/* Manual URL input */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xs font-bold text-[#0A192F]/40">OR paste URL</span>
                                        <div className="relative flex-1 flex items-center">
                                            <ImageIcon size={14} className="absolute left-3 text-[#0A192F]/40" />
                                            <input
                                                type="text"
                                                name="imageUrl"
                                                value={formData.imageUrl}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#F7F8FA] border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-xs focus:border-[#FBBF24] outline-none transition-all text-[#0A192F]"
                                                placeholder="/images/banners/my-banner.png"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="relative w-full md:w-56 h-32 rounded-xl overflow-hidden border-2 border-[#FBBF24] bg-gray-100 flex-shrink-0">
                                        <img
                                            src={imagePreview}
                                            alt="Banner Preview"
                                            className="w-full h-full object-cover"
                                            onError={() => setImagePreview(null)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setFormData(prev => ({ ...prev, imageUrl: "" }));
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-1 px-2">
                                            <span className="text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                <Eye size={10} /> Preview
                                            </span>
                                        </div>
                                    </div>
                                )}
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
                            disabled={isSubmitting || imageUploading}
                            className="bg-[#0A192F] hover:bg-[#FBBF24] text-white hover:text-[#0A192F] px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : isEditing ? "Update Banner" : <><Plus size={16} /> Create Banner</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Banners List */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-[#0A192F]">
                        Existing Banners
                        {banners.length > 0 && (
                            <span className="ml-3 text-sm font-bold text-[#0A192F]/40 bg-gray-100 px-3 py-1 rounded-full">
                                {banners.length} total
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={loadBanners}
                        className="text-xs font-black text-[#0A192F]/50 hover:text-[#FBBF24] uppercase tracking-wider transition-colors"
                    >
                        Refresh
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="w-8 h-8 border-4 border-[#FBBF24] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm font-bold text-[#0A192F]/40">Loading banners...</p>
                    </div>
                ) : banners.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
                        <ImageIcon size={40} className="text-gray-300 mx-auto mb-4" />
                        <p className="font-black text-[#0A192F]/30 text-lg">No banners found</p>
                        <p className="text-sm text-[#0A192F]/20 font-medium mt-1">Create your first banner using the form above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className={`border rounded-2xl overflow-hidden transition-all ${banner.status ? 'border-gray-200 hover:border-[#FBBF24]/40 hover:shadow-md' : 'border-red-100 bg-red-50/30 opacity-70'}`}
                            >
                                {/* Banner image thumbnail */}
                                {banner.imageUrl && (
                                    <div className="w-full h-28 bg-gray-100 overflow-hidden relative">
                                        <img
                                            src={banner.imageUrl}
                                            alt={banner.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                    </div>
                                )}

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 pr-4">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`text-[9px] px-2 py-1 rounded-lg border font-black uppercase tracking-widest ${bannerTypeColors[banner.bannerType] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                    {banner.bannerType}
                                                </span>
                                                {!banner.status && (
                                                    <span className="bg-red-500 text-white text-[9px] px-2 py-1 rounded-lg tracking-widest uppercase font-black">Inactive</span>
                                                )}
                                            </div>
                                            <h3 className="font-black text-[#0A192F] text-base leading-tight">{banner.title}</h3>
                                            {banner.subtitle && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{banner.subtitle}</p>
                                            )}
                                        </div>
                                        {/* Toggle Status */}
                                        <button
                                            onClick={() => handleToggleStatus(banner.id, banner.status)}
                                            className={`p-2 rounded-xl border transition-colors flex-shrink-0 ${banner.status
                                                ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                                }`}
                                            title={banner.status ? "Click to Deactivate" : "Click to Activate"}
                                        >
                                            {banner.status ? <Power size={15} /> : <PowerOff size={15} />}
                                        </button>
                                    </div>

                                    {(banner.ctaText || banner.ctaLink) && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mb-4 bg-gray-50 rounded-lg px-3 py-2">
                                            <LinkIcon size={12} className="text-gray-400 flex-shrink-0" />
                                            <span className="text-[#0A192F] font-black">{banner.ctaText}</span>
                                            {banner.ctaLink && <span className="text-blue-500 truncate">→ {banner.ctaLink}</span>}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-[#F7F8FA] hover:bg-[#FBBF24] text-[#0A192F] py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                                        >
                                            <Edit size={13} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                                        >
                                            <Trash2 size={13} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
