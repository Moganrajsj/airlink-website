"use client";

import React, { useState } from 'react';
import { Search, Filter, Download, Check, Clock, PhoneCall, Ban, ChevronRight } from 'lucide-react';
import { updateLeadStatus } from '@/app/actions/leads';

interface Lead {
    id: string;
    name: string;
    mobile: string;
    email?: string | null;
    company?: string | null;
    city: string;
    pincode?: string | null;
    interest?: string | null;
    source?: string | null;
    status: string;
    createdAt: Date;
}

const STATUS_OPTIONS = ['new', 'contacted', 'interested', 'converted', 'closed'];
const INTEREST_OPTIONS = ['Home Broadband', 'Business Internet', 'WiFi Router Setup', 'CCTV Security', 'Check Fiber Availability'];
const SOURCE_OPTIONS = ['popup_multi_step', 'contact_form', 'plans_page', 'speed_test', 'shop_page', 'check_availability'];

const STATUS_STYLES: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    contacted: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    interested: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    converted: 'bg-green-500/20 text-green-300 border border-green-500/30',
    closed: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

const STATUS_ICONS: Record<string, React.ElementType> = {
    new: Clock,
    contacted: PhoneCall,
    interested: ChevronRight,
    converted: Check,
    closed: Ban,
};

function exportToCSV(leads: Lead[]) {
    const headers = ['Name', 'Mobile', 'Email', 'Interest', 'Source', 'Status', 'Submitted At'];
    const rows = leads.map(l => [
        l.name, l.mobile, l.email || '',
        l.interest || '', l.source || '', l.status,
        new Date(l.createdAt).toLocaleString('en-IN')
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airlink-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
    const [search, setSearch] = useState('');
    const [filterInterest, setFilterInterest] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterSource, setFilterSource] = useState('');
    const [localLeads, setLocalLeads] = useState<Lead[]>(leads);

    const filtered = localLeads.filter(l => {
        const q = search.toLowerCase();
        const matchSearch = !q || 
            l.name.toLowerCase().includes(q) || 
            (l.mobile || '').includes(q) || 
            (l.email || '').toLowerCase().includes(q) ||
            (l.company || '').toLowerCase().includes(q);
        const matchInterest = !filterInterest || l.interest === filterInterest;
        const matchStatus = !filterStatus || l.status === filterStatus;
        const matchSource = !filterSource || l.source === filterSource;
        return matchSearch && matchInterest && matchStatus && matchSource;
    });

    const handleStatusChange = async (leadId: string, newStatus: string) => {
        await updateLeadStatus(leadId, newStatus);
        setLocalLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    };

    return (
        <div>
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by name, mobile, or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-[#FBBF24] transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={14} className="text-white/40" />
                    <select value={filterInterest} onChange={e => setFilterInterest(e.target.value)} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="">All Services</option>
                        {INTEREST_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0A192F]">{o}</option>)}
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0A192F]">{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                    </select>
                    <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className="bg-white/5 border border-white/10 text-sm text-white/70 px-3 py-2 rounded-xl outline-none focus:border-[#FBBF24]">
                        <option value="">All Sources</option>
                        {SOURCE_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0A192F]">{o}</option>)}
                    </select>
                    <button
                        onClick={() => exportToCSV(filtered)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#FBBF24] hover:bg-white text-[#0A192F] rounded-xl text-sm font-black transition-all uppercase tracking-widest"
                    >
                        <Download size={14} /> Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-widest text-white/40">
                                <th className="text-left px-4 py-3">Mobile</th>
                                <th className="text-left px-4 py-3 hidden md:table-cell">Company</th>
                                <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                                <th className="text-left px-4 py-3 hidden lg:table-cell">Interest</th>
                                <th className="text-left px-4 py-3 hidden lg:table-cell">Source</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3 hidden xl:table-cell">Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-12 text-white/30 font-medium">No leads found.</td></tr>
                            ) : filtered.map((lead, i) => {
                                const Icon = STATUS_ICONS[lead.status] || Clock;
                                return (
                                    <tr key={lead.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                                        <td className="px-4 py-3 font-semibold text-white">
                                            {lead.name}
                                            {lead.company && <div className="text-[10px] text-primary font-bold uppercase tracking-tighter md:hidden">{lead.company}</div>}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-white/80">{lead.mobile}</td>
                                        <td className="px-4 py-3 text-white/50 hidden md:table-cell font-bold uppercase text-[10px] tracking-widest">{lead.company || '—'}</td>
                                        <td className="px-4 py-3 text-white/50 hidden md:table-cell">{lead.email || '—'}</td>
                                        <td className="px-4 py-3 text-white/50 hidden lg:table-cell">{lead.interest || '—'}</td>
                                        <td className="px-4 py-3 text-white/40 text-xs hidden lg:table-cell">{lead.source || '—'}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={lead.status}
                                                onChange={e => handleStatusChange(lead.id, e.target.value)}
                                                className={`text-[10px] font-black uppercase tracking-wider rounded-full px-2 py-1 border-none outline-none cursor-pointer ${STATUS_STYLES[lead.status] || STATUS_STYLES.new} bg-transparent`}
                                            >
                                                {STATUS_OPTIONS.map(o => <option key={o} value={o} className="bg-[#0A192F] text-white">{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-white/30 text-xs hidden xl:table-cell">
                                            {new Date(lead.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-white/30 text-xs mt-3 text-right">Showing {filtered.length} of {localLeads.length} leads</p>
        </div>
    );
}
