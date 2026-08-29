'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DocumentRenderer from '@/components/templates/DocumentRenderer';
import { DocumentType, DocumentData, LineItem } from '@/lib/types';
import { TEMPLATE_CONFIGS, createDefaultDocument } from '@/lib/defaultTemplates';
import { 
  ArrowLeft, Check, Copy, ExternalLink, FileText, 
  Plus, Trash2, Sparkles, Eye, Link as LinkIcon, Edit3 
} from 'lucide-react';
import Link from 'next/link';

export default function CreateDocumentPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<DocumentType>('contract');
  const [formData, setFormData] = useState<Partial<DocumentData>>(() => 
    createDefaultDocument('contract', 'Acme Innovations LLC')
  );
  
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdDoc, setCreatedDoc] = useState<DocumentData | null>(null);

  // Switch template
  const handleTypeChange = (type: DocumentType) => {
    setSelectedType(type);
    const newDoc = createDefaultDocument(type, formData.clientCompany || 'Acme Innovations LLC');
    setFormData({
      ...newDoc,
      clientCompany: formData.clientCompany || 'Acme Innovations LLC',
      clientContactName: formData.clientContactName || 'John Smith',
      clientEmail: formData.clientEmail || 'john@company.com',
    });
  };

  // Direct in-place text change from clicking on document sheet
  const handleInPlaceTextChange = (field: keyof DocumentData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Line item handlers
  const handleAddLineItem = () => {
    const items = formData.lineItems || [];
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: 'New Scope / Workflow Deliverable',
      quantity: 1,
      rate: 1000,
      amount: 1000
    };
    const updated = [...items, newItem];
    const total = updated.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setFormData({ ...formData, lineItems: updated, totalAmount: total });
  };

  const handleUpdateLineItem = (index: number, field: keyof LineItem, val: any) => {
    const items = [...(formData.lineItems || [])];
    items[index] = { ...items[index], [field]: val };
    
    if (field === 'quantity' || field === 'rate') {
      const q = Number(items[index].quantity) || 0;
      const r = Number(items[index].rate) || 0;
      items[index].amount = q * r;
    }

    const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setFormData({ ...formData, lineItems: items, totalAmount: total });
  };

  const handleRemoveLineItem = (index: number) => {
    const items = (formData.lineItems || []).filter((_, i) => i !== index);
    const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setFormData({ ...formData, lineItems: items, totalAmount: total });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: selectedType,
          status: 'sent'
        })
      });

      const data = await res.json();
      if (data.success) {
        setCreatedDoc(data.document);
      } else {
        alert('Failed to create document');
      }
    } catch (err) {
      alert('An error occurred while creating document');
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {/* View Toggles for Desktop */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                viewMode === 'split' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Split Form &amp; Live Edit
            </button>
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                viewMode === 'edit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Form Only
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                viewMode === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Visual Live Sheet Only
            </button>
          </div>
        </div>

        {/* Success Modal / Banner when created */}
        {createdDoc && (
          <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/60 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Document Successfully Created!
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Your unique client link is live and ready to send.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/40 border border-emerald-900/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-xs text-emerald-300 truncate max-w-md">
                {typeof window !== 'undefined' ? `${window.location.origin}/d/${createdDoc.slug || createdDoc.id}` : ''}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/d/${createdDoc.slug || createdDoc.id}`;
                    navigator.clipboard.writeText(url);
                    alert('Copied client link to clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </button>
                <Link
                  href={`/d/${createdDoc.slug || createdDoc.id}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Client View
                </Link>
                <Link
                  href="/"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
                >
                  Go to Dashboard &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Template Selector Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Select Document Template
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {(Object.keys(TEMPLATE_CONFIGS) as DocumentType[]).map((type) => {
              const cfg = TEMPLATE_CONFIGS[type];
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    isSelected 
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                      : 'bg-[#131b2e] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold leading-tight block mb-1">
                    {cfg.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {cfg.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Editor & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column */}
          <div className={`space-y-6 ${viewMode === 'preview' ? 'hidden' : viewMode === 'edit' ? 'lg:col-span-12' : 'lg:col-span-5'}`}>
            <form onSubmit={handleSubmit} className="bg-[#131b2e] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Client &amp; Scope Details
                </h3>
                <span className="text-xs font-mono text-blue-400">
                  {formData.refNumber}
                </span>
              </div>

              {/* Title & Ref */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Client Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Health Corp"
                    value={formData.clientCompany || ''}
                    onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. John Smith"
                    value={formData.clientContactName || ''}
                    onChange={(e) => setFormData({ ...formData, clientContactName: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Client Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={formData.clientEmail || ''}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Client Phone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.clientPhone || ''}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Financials & Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Currency</label>
                  <select
                    value={formData.currency || 'USD'}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Total Fee Amount</label>
                  <input
                    type="number"
                    value={formData.totalAmount || 0}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Scope & Executive Summary */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Executive Summary / Scope</label>
                <textarea
                  rows={3}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              {/* Custom Technical Deliverables */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Deliverables &amp; Features</label>
                <textarea
                  rows={4}
                  value={formData.customScope || ''}
                  onChange={(e) => setFormData({ ...formData, customScope: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              {/* Milestone Line Items */}
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
                  {(formData.lineItems || []).map((item, idx) => (
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

              {/* Custom Legal & Warranty Terms */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Custom Legal Clauses / Special Terms</label>
                  <textarea
                    rows={2}
                    placeholder="Add any specific conditions, client-requested terms, or payment notes..."
                    value={formData.customClauses || ''}
                    onChange={(e) => setFormData({ ...formData, customClauses: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Warranty Terms Text</label>
                  <input
                    type="text"
                    value={formData.warrantyTerms || 'Aivora Automations guarantees all built workflows against bugs in the original build for 30 calendar days post-deployment.'}
                    onChange={(e) => setFormData({ ...formData, warrantyTerms: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isSubmitting ? 'Generating Document...' : 'Generate Client Link & Document'}
                </button>
              </div>

            </form>
          </div>

          {/* Live Interactive Preview Column */}
          <div className={`space-y-3 ${viewMode === 'edit' ? 'hidden' : viewMode === 'preview' ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-400" />
                Live Client Preview (Visual Click-to-Edit Enabled)
              </span>
              <span className="text-xs text-slate-500">
                You can click on any text below to rewrite it
              </span>
            </div>

            <div className="sticky top-20 overflow-y-auto max-h-[85vh] rounded-2xl border border-slate-800 shadow-2xl bg-[#131b2e] p-2">
              <DocumentRenderer 
                doc={{
                  ...formData as DocumentData,
                  type: selectedType,
                  id: 'preview',
                  slug: 'preview',
                  status: 'draft',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  timeline: []
                }}
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
