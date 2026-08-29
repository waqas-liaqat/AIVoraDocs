'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DocumentData, DocumentStatus, DocumentType } from '@/lib/types';
import { TEMPLATE_CONFIGS } from '@/lib/defaultTemplates';
import { 
  Copy, Check, ExternalLink, Eye, Trash2, Edit3, 
  Send, MessageCircle, FileText, Clock, CheckCircle2, DollarSign
} from 'lucide-react';

interface DocumentTableProps {
  documents: DocumentData[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function DocumentTable({ documents, onDelete, onRefresh }: DocumentTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.refNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopyLink = (doc: DocumentData, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/d/${doc.slug || doc.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getWhatsAppShareLink = (doc: DocumentData) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/d/${doc.slug || doc.id}` : '';
    const text = encodeURIComponent(
      `Hello ${doc.clientContactName || doc.clientCompany},\n\nPlease review and sign your ${doc.title} from Aivora Automations here:\n${url}\n\nThank you!`
    );
    return `https://wa.me/${doc.clientPhone?.replace(/[^0-9]/g, '') || ''}?text=${text}`;
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Draft (25%)
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Sent to Client (50%)
          </span>
        );
      case 'viewed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Viewed by Client 👁️ (75%)
          </span>
        );
      case 'signed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Signed &amp; Accepted ✅ (100%)
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-950/80 text-green-300 border border-green-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            Paid in Full 💰 (100%)
          </span>
        );
    }
  };

  const getProgressPercentage = (status: DocumentStatus) => {
    switch (status) {
      case 'draft': return 25;
      case 'sent': return 50;
      case 'viewed': return 75;
      case 'signed': return 100;
      case 'paid': return 100;
    }
  };

  const getProgressBarColor = (status: DocumentStatus) => {
    switch (status) {
      case 'draft': return 'bg-slate-500';
      case 'sent': return 'bg-blue-500';
      case 'viewed': return 'bg-amber-500';
      case 'signed': return 'bg-emerald-500';
      case 'paid': return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#131b2e] p-4 rounded-xl border border-slate-800">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by client, reference number, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'draft', 'sent', 'viewed', 'signed', 'paid'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {status === 'all' ? 'All Docs' : status}
            </button>
          ))}
        </div>

      </div>

      {/* Table List */}
      <div className="bg-[#131b2e] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg text-slate-300">No documents found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Create a new client document or adjust your search filter above.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition"
            >
              Create New Document
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0f172a]/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Client &amp; Document</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Value</th>
                  <th className="py-3.5 px-4">Progress Stage</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDocs.map((doc) => {
                  const templateConfig = TEMPLATE_CONFIGS[doc.type] || { badge: 'Doc' };
                  const pct = getProgressPercentage(doc.status);
                  const colorClass = getProgressBarColor(doc.status);

                  return (
                    <tr 
                      key={doc.id}
                      className="hover:bg-slate-800/30 transition group"
                    >
                      
                      {/* Client & Doc Info */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white group-hover:text-blue-400 transition flex items-center gap-2">
                          <Link href={`/doc/${doc.id}`}>
                            {doc.clientCompany}
                          </Link>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{doc.title}</span>
                          <span className="text-slate-600">&bull;</span>
                          <span className="font-mono text-slate-500">{doc.refNumber}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800/90 text-slate-300 border border-slate-700/60">
                          {templateConfig.name.split(' ')[0]}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-200">
                          {doc.totalAmount > 0 ? `$${doc.totalAmount.toLocaleString()} ${doc.currency}` : '—'}
                        </span>
                      </td>

                      {/* Progress Bar & Status */}
                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          {getStatusBadge(doc.status)}
                        </div>
                        {/* Progress meter */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colorClass} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-slate-400">
                        {new Date(doc.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* 1-Click Copy Client Link */}
                          <button
                            onClick={(e) => handleCopyLink(doc, e)}
                            title="Copy Client Public Link"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition relative"
                          >
                            {copiedId === doc.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Share on WhatsApp */}
                          <a
                            href={getWhatsAppShareLink(doc)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Send Client Link on WhatsApp"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-400 transition"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Client View Link */}
                          <Link
                            href={`/d/${doc.slug || doc.id}`}
                            target="_blank"
                            title="Open Client Public View"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-950 text-slate-300 hover:text-blue-400 transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit Document */}
                          <Link
                            href={`/edit/${doc.id}`}
                            title="Edit Document Text & Scope"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-950 text-slate-300 hover:text-amber-400 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {/* Internal Detail / Audit View */}
                          <Link
                            href={`/doc/${doc.id}`}
                            title="View Audit Trail & Status"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Delete document for ${doc.clientCompany}?`)) {
                                onDelete(doc.id);
                              }
                            }}
                            title="Delete Document"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
