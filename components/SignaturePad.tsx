'use client';

import React, { useRef, useState, useEffect } from 'react';
import { SignatureData } from '@/lib/types';
import { PenTool, Type, Eraser, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface SignaturePadProps {
  clientCompany: string;
  defaultName?: string;
  defaultEmail?: string;
  onSignSubmit: (signatureData: SignatureData) => void;
  onClose?: () => void;
}

export default function SignaturePad({
  clientCompany,
  defaultName = '',
  defaultEmail = '',
  onSignSubmit,
  onClose
}: SignaturePadProps) {
  const [tab, setTab] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState(defaultName);
  const [signerTitle, setSignerTitle] = useState('Authorized Signatory');
  const [signerEmail, setSignerEmail] = useState(defaultEmail);
  const [legalConsent, setLegalConsent] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [tab]);

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedName.trim()) {
      alert('Please enter your full legal name.');
      return;
    }
    if (!legalConsent) {
      alert('Please check the authorization and consent box to proceed.');
      return;
    }

    let signatureImage: string | undefined;
    if (tab === 'draw' && canvasRef.current && hasDrawn) {
      signatureImage = canvasRef.current.toDataURL('image/png');
    }

    const sigData: SignatureData = {
      signatureImage,
      typedSignature: typedName,
      signedByName: typedName,
      signedByTitle: signerTitle,
      signedByEmail: signerEmail,
      signedAt: new Date().toISOString(),
      legalConsent: true
    };

    onSignSubmit(sigData);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-xl w-full text-slate-100 relative">
      
      {/* Close button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-white">Digital E-Signature</h3>
          <p className="text-xs text-slate-400">Legally binding electronic signature for {clientCompany}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Tab Selection */}
        <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700">
          <button
            type="button"
            onClick={() => setTab('draw')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition ${
              tab === 'draw' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Draw Signature
          </button>
          <button
            type="button"
            onClick={() => setTab('type')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition ${
              tab === 'type' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Type Signature
          </button>
        </div>

        {/* Draw Canvas */}
        {tab === 'draw' && (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={500}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full bg-white rounded-lg border-2 border-dashed border-slate-400 cursor-crosshair touch-none"
            />
            <div className="flex justify-between items-center mt-1.5 px-1">
              <span className="text-[11px] text-slate-400 italic">Sign within the box above</span>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Typed Preview */}
        {tab === 'type' && (
          <div className="bg-white p-4 rounded-lg border border-slate-300 min-h-[100px] flex items-center justify-center">
            <span className="font-serif italic text-2xl text-blue-900 tracking-wide select-none">
              {typedName || 'Your Signature Preview'}
            </span>
          </div>
        )}

        {/* Signer Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. John Smith"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Title / Designation</label>
            <input
              type="text"
              placeholder="e.g. Founder & CEO"
              value={signerTitle}
              onChange={(e) => setSignerTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Official Work Email</label>
          <input
            type="email"
            placeholder="john@company.com"
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Legal Consent */}
        <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={legalConsent}
            onChange={(e) => setLegalConsent(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
          />
          <span className="text-xs text-slate-300 leading-relaxed">
            I confirm that I am authorized to sign and accept this document on behalf of <strong>{clientCompany}</strong>, and understand this constitutes a legally binding digital contract.
          </span>
        </label>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!legalConsent || !typedName.trim()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Sign &amp; Accept Agreement
          </button>
        </div>

      </form>

    </div>
  );
}
