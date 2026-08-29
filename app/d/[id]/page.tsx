'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DocumentRenderer from '@/components/templates/DocumentRenderer';
import SignaturePad from '@/components/SignaturePad';
import { DocumentData, SignatureData } from '@/lib/types';
import { 
  FileText, CheckCircle2, Download, Printer, 
  PenTool, ShieldCheck, Check, Sparkles 
} from 'lucide-react';

export default function ClientPublicDocPage() {
  const params = useParams();
  const docId = params.id as string;

  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);

  // Load document and trigger auto-view event
  useEffect(() => {
    if (!docId) return;

    const loadAndTrackView = async () => {
      try {
        setLoading(true);
        // 1. Fetch document
        const res = await fetch(`/api/documents/${docId}`);
        const data = await res.json();

        if (data.success && data.document) {
          setDoc(data.document);

          // 2. Track view if not already signed/paid
          if (data.document.status === 'sent' || data.document.status === 'draft') {
            await fetch(`/api/documents/${docId}/view`, { method: 'POST' });
          }
        }
      } catch (err) {
        console.error('Failed to fetch document:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAndTrackView();
  }, [docId]);

  // Handle signature submission
  const handleSignatureSubmit = async (sigData: SignatureData) => {
    try {
      const res = await fetch(`/api/documents/${docId}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sigData)
      });

      const data = await res.json();
      if (data.success && data.document) {
        setDoc(data.document);
        setShowSignModal(false);
        setSignSuccess(true);
        setTimeout(() => setSignSuccess(false), 5000);
      } else {
        alert('Failed to record signature. Please try again.');
      }
    } catch (err) {
      alert('An error occurred during signing.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Loading official document...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-300 px-4">
        <div className="text-center max-w-md bg-[#131b2e] p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h2 className="font-display font-bold text-xl text-white">Document Not Found</h2>
          <p className="text-sm text-slate-400 mt-2">
            The link you opened may have expired or is invalid. Please contact Aivora Automations.
          </p>
        </div>
      </div>
    );
  }

  const isSigned = doc.status === 'signed' || !!doc.signature;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6">
      
      {/* Top Client Navigation & Print Bar (Hidden in Print) */}
      <div className="max-w-4xl mx-auto w-full mb-6 no-print">
        <div className="bg-[#131b2e] border border-slate-800 rounded-xl p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Aivora Logo" 
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="text-xs font-bold text-white block">Aivora Automations</span>
              <span className="text-[11px] text-slate-400">Official Client Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isSigned ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Signed &amp; Verified
              </span>
            ) : doc.requireSignature ? (
              <button
                onClick={() => setShowSignModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
              >
                <PenTool className="w-3.5 h-3.5" />
                Sign Document Now
              </button>
            ) : null}

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Download / Print PDF
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {signSuccess && (
        <div className="max-w-4xl mx-auto w-full mb-6 no-print animate-in fade-in">
          <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-4 flex items-center gap-3 text-emerald-300 text-sm">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <strong>Thank you!</strong> Your signature has been recorded and verified. A copy of this signed agreement is now active in your records.
            </div>
          </div>
        </div>
      )}

      {/* Document Sheet */}
      <main className="max-w-4xl mx-auto w-full">
        <DocumentRenderer doc={doc} isClientView={true} />
      </main>

      {/* Footer Branding */}
      <footer className="max-w-4xl mx-auto w-full mt-10 text-center text-xs text-slate-500 no-print">
        <p>&copy; 2025 Aivora Automations &bull; <a href="https://aivoraai.online/" target="_blank" className="text-blue-400 hover:underline">aivoraai.online</a> &bull; info@aivoraautomations.com</p>
      </footer>

      {/* E-Signature Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-in fade-in">
          <SignaturePad
            clientCompany={doc.clientCompany}
            defaultName={doc.clientContactName}
            defaultEmail={doc.clientEmail}
            onSignSubmit={handleSignatureSubmit}
            onClose={() => setShowSignModal(false)}
          />
        </div>
      )}

    </div>
  );
}
