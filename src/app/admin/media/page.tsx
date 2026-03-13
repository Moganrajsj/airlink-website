"use client";

import React, { useState, useEffect } from 'react';
import { 
    Image as ImageIcon, Trash2, Upload, 
    Search, Grid, List as ListIcon, 
    X, CheckCircle, AlertCircle, Eye,
    Copy, Download, ExternalLink, HardDrive
} from 'lucide-react';
import { getMediaFiles, deleteMediaFile } from '@/app/actions/media';

interface MediaFile {
    name: string;
    url: string;
    size: number;
    createdAt: Date;
}

export default function AdminMediaPage() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        setIsLoading(true);
        const res = await getMediaFiles();
        if (res.success && res.files) {
            setFiles(res.files);
        }
        setIsLoading(false);
    };

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = async (filename: string) => {
        if (!confirm(`Permanently delete ${filename}? This action cannot be undone.`)) return;
        
        const res = await deleteMediaFile(filename);
        if (res.success) {
            showToast("File deleted successfully", "success");
            loadFiles();
            if (selectedFile?.name === filename) setSelectedFile(null);
        } else {
            showToast("Failed to delete file", "error");
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        showToast("Path copied to clipboard", "success");
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const filteredFiles = files.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalSize = files.reduce((acc, f) => acc + f.size, 0);

    return (
        <div className="min-h-screen bg-[#F7F8FA] p-6 lg:p-10">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300 ${
                    toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                }`}>
                    {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-black text-sm">{toast.message}</span>
                </div>
            )}

            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-[#0A192F] tracking-tighter mb-2 italic">MEDIA LIBRARY<span className="text-[#FBBF24]">.</span></h1>
                        <p className="text-[#0A192F]/40 font-bold text-sm uppercase tracking-widest">Manage your digital infrastructure assets</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-white/80 shadow-sm">
                        <div className="px-4 py-2 border-r border-gray-100 hidden sm:block">
                            <p className="text-[10px] font-black text-[#0A192F]/30 uppercase tracking-widest mb-0.5">Storage Used</p>
                            <p className="text-sm font-black text-[#0A192F]">{formatSize(totalSize)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setViewMode("grid")}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-[#0A192F] text-[#FBBF24]" : "text-[#0A192F]/20 hover:text-[#0A192F]"}`}
                            >
                                <Grid size={20} />
                            </button>
                            <button 
                                onClick={() => setViewMode("list")}
                                className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-[#0A192F] text-[#FBBF24]" : "text-[#0A192F]/20 hover:text-[#0A192F]"}`}
                            >
                                <ListIcon size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search & Actions */}
                <div className="bg-white p-6 rounded-[2rem] border border-white/80 shadow-sm flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 relative w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0A192F]/20" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by filename..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#F7F8FA] border-none rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-[#0A192F] focus:ring-2 focus:ring-[#FBBF24] outline-none placeholder-[#0A192F]/20 transition-all"
                        />
                    </div>
                    <button 
                        onClick={loadFiles}
                        className="p-4 bg-[#F7F8FA] rounded-2xl text-[#0A192F] hover:bg-gray-100 transition-all"
                    >
                        <RefreshCcw size={20} />
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="py-32 text-center">
                        <div className="w-12 h-12 border-4 border-[#FBBF24] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <p className="font-black text-[#0A192F]/20 uppercase tracking-[0.3em]">Scanning Media Core...</p>
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-[#F7F8FA] rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <ImageIcon size={40} />
                        </div>
                        <h3 className="text-xl font-black text-[#0A192F]/40 tracking-tight uppercase">No assets found</h3>
                        <p className="text-sm text-[#0A192F]/20 font-bold mt-2 uppercase tracking-widest">Upload assets via banners or coverage management</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {filteredFiles.map((file) => (
                            <div 
                                key={file.name}
                                onClick={() => setSelectedFile(file)}
                                className="group relative bg-white rounded-3xl p-3 border border-white/80 shadow-sm hover:border-[#FBBF24] hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 relative">
                                    <img 
                                        src={file.url} 
                                        alt={file.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                </div>
                                <div className="px-1">
                                    <p className="text-[10px] font-black text-[#0A192F] truncate mb-0.5">{file.name}</p>
                                    <p className="text-[9px] font-bold text-[#0A192F]/30 uppercase tracking-wider">{formatSize(file.size)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-white/80 shadow-sm">
                        <table className="w-full text-left">
                            <thead className="bg-[#F7F8FA] border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#0A192F]/30 uppercase tracking-widest">Asset</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#0A192F]/30 uppercase tracking-widest">Filename</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#0A192F]/30 uppercase tracking-widest">Size</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#0A192F]/30 uppercase tracking-widest">Modified</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-[#0A192F]/30 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredFiles.map((file) => (
                                    <tr key={file.name} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                                                <img src={file.url} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <p className="text-sm font-black text-[#0A192F]">{file.name}</p>
                                            <p className="text-[10px] font-bold text-[#0A192F]/30">{file.url}</p>
                                        </td>
                                        <td className="px-8 py-4 text-xs font-bold text-[#0A192F]/60 uppercase">{formatSize(file.size)}</td>
                                        <td className="px-8 py-4 text-xs font-bold text-[#0A192F]/30">{new Date(file.createdAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => copyToClipboard(file.url)} className="p-2.5 text-[#0A192F]/20 hover:text-[#0A192F] hover:bg-white rounded-lg transition-all"><Copy size={16} /></button>
                                                <button onClick={() => handleDelete(file.name)} className="p-2.5 text-red-500/30 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Selected File Details Overlay */}
            {selectedFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-end p-6 bg-[#0A192F]/40 backdrop-blur-sm" onClick={() => setSelectedFile(null)}>
                    <div className="bg-white h-full w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden translate-x-0 animate-in slide-in-from-right duration-500 flex flex-col" onClick={e => e.stopPropagation()}>
                        {/* Detail Header */}
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#0A192F] uppercase tracking-tighter">Asset Details</h2>
                            <button onClick={() => setSelectedFile(null)} className="p-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white transition-all"><X size={20} /></button>
                        </div>

                        {/* Detail Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="aspect-square w-full rounded-[2.5rem] overflow-hidden border-4 border-gray-50 bg-[#F7F8FA] flex items-center justify-center p-2">
                                <img src={selectedFile.url} className="w-full h-full object-contain rounded-[2rem]" alt="" />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-[#0A192F]/30 uppercase tracking-[0.2em] mb-2 block">Filename</label>
                                    <div className="bg-[#F7F8FA] p-4 rounded-2xl flex items-center justify-between">
                                        <span className="text-sm font-black text-[#0A192F] truncate max-w-[200px]">{selectedFile.name}</span>
                                        <button onClick={() => copyToClipboard(selectedFile.url)} className="text-[#FBBF24] hover:text-[#0A192F] transition-colors"><Copy size={16} /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#F7F8FA] p-4 rounded-2xl">
                                        <label className="text-[9px] font-black text-[#0A192F]/30 uppercase tracking-widest block mb-1">Size</label>
                                        <span className="text-xs font-black text-[#0A192F] uppercase">{formatSize(selectedFile.size)}</span>
                                    </div>
                                    <div className="bg-[#F7F8FA] p-4 rounded-2xl">
                                        <label className="text-[9px] font-black text-[#0A192F]/30 uppercase tracking-widest block mb-1">Format</label>
                                        <span className="text-xs font-black text-[#0A192F] uppercase text-blue-500">{selectedFile.name.split('.').pop()}</span>
                                    </div>
                                </div>

                                <div className="p-6 bg-[#0A192F] rounded-3xl text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black text-[#FBBF24] uppercase tracking-widest mb-1 italic">Network URL</p>
                                            <p className="text-xs font-bold text-white/60 truncate max-w-[200px]">{selectedFile.url}</p>
                                        </div>
                                        <a href={selectedFile.url} target="_blank" className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detail Footer */}
                        <div className="p-8 bg-[#F7F8FA] border-t border-gray-100 flex gap-4">
                            <button 
                                onClick={() => handleDelete(selectedFile.name)}
                                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Delete Forever
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const RefreshCcw = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size || 24} 
        height={size || 24} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
    </svg>
);
