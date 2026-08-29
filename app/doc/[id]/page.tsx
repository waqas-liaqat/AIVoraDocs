'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DocumentRenderer from '@/components/templates/DocumentRenderer';
import { DocumentData, DocumentStatus } from '@/lib/types';
import { 
  ArrowLeft, Copy, Check, ExternalLink, MessageCircle, 
  Clock, ShieldCheck, CheckCircle2, DollarSign, Eye, Printer, Edit3 
} from 'lucide-react';
import Link from 'next/link';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;

  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchDoc = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/documents/${docId}`);
      const data = await res.json();
      if (data.success && data.document) {
        setDoc(data.document);
      }
    } catch (err) {
      console.error('Failed to load document:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [docId]);

  const handleUpdateStatus = async (newStatus: DocumentStatus) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success && data.document) {
        setDoc(data.document);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCopyLink = () => {
    if (!doc) return;
    const url = `${window.location.origin}/d/${doc.slug || doc.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-slate-400">
        <p>Document not found</p>
        <Link href="/" className="mt-2 text-blue-400 underline">Back to Dashboard</Link>
      </div>
    );
  }

  const clientUrl = typeof window !== 'undefined' ? `${window.location.origin}/d/${doc.slug || doc.id}` : '';

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Copy Client Link'}
            </button>

            <Link
              href={`/d/${doc.slug || doc.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Client Page
            </Link>
          </div>
        </div>

        {/* Quick Summary Strip */}
        <div className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Client Organization</span>
            <span className="font-display font-bold text-lg text-white block mt-0.5">{doc.clientCompany}</span>
            <span className="text-xs text-slate-400">{doc.clientContactName} &bull; {doc.clientEmail}</span>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Deal Value</span>
            <span className="font-display font-bold text-xl text-emerald-400 block mt-0.5">
              ${doc.totalAmount?.toLocaleString()} {doc.currency}
            </span>
            <span className="text-xs text-slate-400">Ref: {doc.refNumber}</span>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Current Pipeline Stage</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                {doc.status}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {doc.status === 'signed' ? 'Signed & accepted by client' : 'Awaiting completion'}
            </div>
          </div>

          {/* Quick Manual Status Override */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Update Stage</span>
            <select
              value={doc.status}
              onChange={(e) => handleUpdateStatus(e.target.value as DocumentStatus)}
              className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
            >
              <option value="draft">Draft (25%)</option>
              <option value="sent">Sent to Client (50%)</option>
              <option value="viewed">Viewed by Client (75%)</option>
              <option value="signed">Signed &amp; Accepted (100%)</option>
              <option value="paid">Paid in Full (100%)</option>
            </select>
          </div>
        </div>

        {/* Two Column Layout: Activity Timeline & Document View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Timeline Audit Log */}
          <div className="lg:col-span-4 bg-[#131b2e] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Activity &amp; Audit Log
            </h3>
            
            <p className="text-xs text-slate-400">
              Complete chronological audit trail of this document:
            </p>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {(doc.timeline || []).map((event, idx) => (
                <div key={event.id || idx} className="flex items-start gap-3 relative z-10 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-200 block text-sm font-semibold">{event.title}</strong>
                    <span className="text-slate-400 block">{event.description}</span>
                    <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Data Box */}
            {doc.signature && (
              <div className="mt-6 pt-4 border-t border-slate-800 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-800/50 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Digital E-Signature
                </div>
                <div className="space-y-1 text-slate-300">
                  <div><strong>Signatory:</strong> {doc.signature.signedByName}</div>
                  <div><strong>Title:</strong> {doc.signature.signedByTitle || 'Authorized Signatory'}</div>
                  <div><strong>IP Session:</strong> {doc.signature.ipAddress || 'Verified'}</div>
                  <div className="text-[11px] text-emerald-400">
                    Signed at: {new Date(doc.signature.signedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Document Renderer */}
          <div className="lg:col-span-8 overflow-y-auto max-h-[85vh] rounded-2xl border border-slate-800 shadow-2xl bg-[#131b2e] p-2">
            <DocumentRenderer doc={doc} />
          </div>

        </div>

      </main>
    </div>
  );
}
