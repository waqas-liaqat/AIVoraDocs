'use client';

import React from 'react';
import { DocumentData } from '@/lib/types';
import { FileText, Clock, CheckCircle2, DollarSign, ArrowUpRight } from 'lucide-react';

interface DashboardStatsProps {
  documents: DocumentData[];
}

export default function DashboardStats({ documents }: DashboardStatsProps) {
  const totalDocs = documents.length;
  
  const pendingDocs = documents.filter(
    d => d.status === 'draft' || d.status === 'sent' || d.status === 'viewed'
  ).length;

  const signedDocs = documents.filter(d => d.status === 'signed').length;
  const paidDocs = documents.filter(d => d.status === 'paid').length;

  const totalPipelineValue = documents.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
  const closedValue = documents
    .filter(d => d.status === 'signed' || d.status === 'paid')
    .reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Metric 1: Total Documents */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Documents</span>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-3xl font-extrabold text-white">{totalDocs}</span>
          <span className="text-xs text-slate-400">active items</span>
        </div>
      </div>

      {/* Metric 2: Awaiting Client Action */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress / Review</span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-3xl font-extrabold text-amber-400">{pendingDocs}</span>
          <span className="text-xs text-amber-300/70">sent &amp; viewed</span>
        </div>
      </div>

      {/* Metric 3: Signed & Completed */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed &amp; Closed</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-3xl font-extrabold text-emerald-400">{signedDocs + paidDocs}</span>
          <span className="text-xs text-emerald-300/70">completed deals</span>
        </div>
      </div>

      {/* Metric 4: Pipeline Value */}
      <div className="bg-[#131b2e] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pipeline Value</span>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-3xl font-extrabold text-white">
            ${totalPipelineValue.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-400 font-medium flex items-center">
            ${closedValue.toLocaleString()} closed
          </span>
        </div>
      </div>

    </div>
  );
}
