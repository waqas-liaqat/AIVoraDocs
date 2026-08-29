'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import DocumentTable from '@/components/DocumentTable';
import { DocumentData } from '@/lib/types';
import Link from 'next/link';
import { PlusCircle, Sparkles, RefreshCw, Zap } from 'lucide-react';

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDocuments(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-purple-950/30 p-6 rounded-2xl border border-blue-900/40 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Aivora Agency Document &amp; E-Sign Engine
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Client Documents <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">&amp; Progress Pipeline</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Create client documents, generate unique shareable links, capture digital e-signatures, and track real-time completion stages.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={fetchDocuments}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Refresh Pipeline"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Create Document
            </Link>
          </div>
        </div>

        {/* Stats KPIs */}
        <DashboardStats documents={documents} />

        {/* Pipeline & Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Live Document Pipeline
            </h2>
            <span className="text-xs text-slate-400">
              Showing {documents.length} documents
            </span>
          </div>

          <DocumentTable 
            documents={documents} 
            onDelete={handleDelete}
            onRefresh={fetchDocuments}
          />
        </section>

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-[#0b0f19]">
        <p>&copy; 2025 Aivora Automations &bull; <a href="https://aivoraai.online/" target="_blank" className="text-blue-400 hover:underline">aivoraai.online</a> &bull; info@aivoraautomations.com</p>
      </footer>
    </div>
  );
}
