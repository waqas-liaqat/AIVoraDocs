'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DocumentRenderer from '@/components/templates/DocumentRenderer';
import { DocumentData, LineItem } from '@/lib/types';
import { 
  ArrowLeft, Check, Copy, ExternalLink, FileText, 
  Plus, Trash2, Save, Eye, Edit3 
} from 'lucide-react';
import Link from 'next/link';

export default function EditDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;

  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  useEffect(() => {
    if (!docId) return;

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

    fetchDoc();
  }, [docId]);

  // In-place text change handler
  const handleInPlaceTextChange = (field: keyof DocumentData, value: string) => {
    if (!doc) return;
    setDoc(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  // Line items
  const handleAddLineItem = () => {
    if (!doc) return;
    const items = doc.lineItems || [];
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: 'New Deliverable / Milestone',
      quantity: 1,
      rate: 1000,
      amount: 1000
    };
    const updated = [...items, newItem];
    const total = updated.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setDoc({ ...doc, lineItems: updated, totalAmount: total });
  };

  const handleUpdateLineItem = (index: number, field: keyof LineItem, val: any) => {
    if (!doc) return;
    const items = [...(doc.lineItems || [])];
    items[index] = { ...items[index], [field]: val };
    
    if (field === 'quantity' || field === 'rate') {
      const q = Number(items[index].quantity) || 0;
      const r = Number(items[index].rate) || 0;
      items[index].amount = q * r;
    }

    const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setDoc({ ...doc, lineItems: items, totalAmount: total });
  };

  const handleRemoveLineItem = (index: number) => {
    if (!doc) return;
    const items = (doc.lineItems || []).filter((_, i) => i !== index);
    const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setDoc({ ...doc, lineItems: items, totalAmount: total });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc) return;
    try {
      setIsSaving(true);
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save document edits');
      }
    } catch (err) {
      alert('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/d/${doc.slug || doc.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Client Link
            </Link>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-3 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            Document changes saved successfully! Client link is updated in real-time.
          </div>
        )}

        {/* Two Column Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Editor */}
          <div className={`space-y-6 ${viewMode === 'preview' ? 'hidden' : viewMode === 'edit' ? 'lg:col-span-12' : 'lg:col-span-5'}`}>
            <form onSubmit={handleSave} className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                  Edit Document Text &amp; Scope
                </h3>
                <span className="text-xs font-mono text-blue-400">
                  {doc.refNumber}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={doc.title}
                  onChange={(e) => setDoc({ ...doc, title: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Client Company</label>
                  <input
                    type="text"
                    required
                    value={doc.clientCompany}
                    onChange={(e) => setDoc({ ...doc, clientCompany: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={doc.clientContactName}
                    onChange={(e) => setDoc({ ...doc, clientContactName: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Total Fee Amount */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Total Fee Amount ({doc.currency})</label>
                <input
                  type="number"
                  value={doc.totalAmount || 0}
                  onChange={(e) => setDoc({ ...doc, totalAmount: Number(e.target.value) })}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Scope & Executive Summary */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Executive Summary / Scope</label>
                <textarea
                  rows={3}
                  value={doc.summary || ''}
                  onChange={(e) => setDoc({ ...doc, summary: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              {/* Custom Technical Deliverables */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Deliverables &amp; System Features</label>
                <textarea
                  rows={4}
                  value={doc.customScope || ''}
                  onChange={(e) => setDoc({ ...doc, customScope: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              {/* Special Legal Terms & Clauses */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Special Legal Clauses / Custom Terms</label>
                <textarea
                  rows={3}
                  value={doc.customClauses || ''}
                  onChange={(e) => setDoc({ ...doc, customClauses: e.target.value })}
                  placeholder="Add custom legal clauses or conditions..."
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Milestone Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Milestone
                  </button>
                </div>

                <div className="space-y-2">
                  {(doc.lineItems || []).map((item, idx) => (
                    <div key={item.id || idx} className="flex gap-2 items-center bg-[#0b0f19] p-2 rounded-lg border border-slate-800">
                      <input
                        type="text"
                        placeholder="Milestone description"
                        value={item.description}
                        onChange={(e) => handleUpdateLineItem(idx, 'description', e.target.value)}
                        className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => handleUpdateLineItem(idx, 'amount', Number(e.target.value))}
                        className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-right text-white font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLineItem(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving Changes...' : 'Save & Update Client Document'}
                </button>
              </div>

            </form>
          </div>

          {/* Visual Live Sheet Preview */}
          <div className={`space-y-3 ${viewMode === 'edit' ? 'hidden' : viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-400" />
                Live Document (Click &amp; Type on Sheet to Edit)
              </span>
              <span className="text-xs text-slate-500">
                Changes persist when you click Save
              </span>
            </div>

            <div className="sticky top-20 overflow-y-auto max-h-[85vh] rounded-2xl border border-slate-800 shadow-2xl bg-[#131b2e] p-2">
              <DocumentRenderer 
                doc={doc} 
                isEditable={true}
                onTextChange={handleInPlaceTextChange}
              />
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
