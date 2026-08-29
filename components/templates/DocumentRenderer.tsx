'use client';

import React from 'react';
import { DocumentData } from '@/lib/types';
import { TEMPLATE_CONFIGS } from '@/lib/defaultTemplates';
import { CheckCircle2, ShieldCheck, Edit3 } from 'lucide-react';

interface DocumentRendererProps {
  doc: DocumentData;
  isClientView?: boolean;
  isEditable?: boolean;
  onTextChange?: (field: keyof DocumentData, value: string) => void;
}

export default function DocumentRenderer({ 
  doc, 
  isClientView = false,
  isEditable = false,
  onTextChange
}: DocumentRendererProps) {
  const config = TEMPLATE_CONFIGS[doc.type] || {
    badge: 'Document',
    name: 'Document'
  };

  const isSigned = doc.status === 'signed' || !!doc.signature;
  const isPaid = doc.status === 'paid';

  const handleBlur = (field: keyof DocumentData, e: React.FocusEvent<HTMLElement>) => {
    if (onTextChange) {
      onTextChange(field, e.currentTarget.innerText);
    }
  };

  const editableClass = isEditable 
    ? 'outline-none hover:bg-blue-50/50 focus:bg-blue-50 focus:ring-1 focus:ring-blue-500 rounded px-1 transition-all cursor-text'
    : '';

  return (
    <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-14 max-w-4xl mx-auto print-clean font-sans relative">
      
      {/* Live Direct Editing Indicator */}
      {isEditable && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-xs flex items-center justify-between no-print">
          <span className="flex items-center gap-2 font-medium">
            <Edit3 className="w-4 h-4 text-amber-600" />
            <strong>Visual Direct Edit Active:</strong> Click directly on any text, paragraph, or clause below to edit it!
          </span>
          <span className="text-[11px] bg-amber-200/60 px-2 py-0.5 rounded font-semibold">
            Click &amp; Type
          </span>
        </div>
      )}

      {/* Official Stamps */}
      {isPaid && (
        <div className="absolute top-10 right-10 border-4 border-emerald-600 text-emerald-600 font-display font-extrabold text-lg px-4 py-1.5 rounded-lg uppercase tracking-widest rotate-[-5deg] opacity-90 select-none">
          PAID IN FULL ✓
        </div>
      )}

      {isSigned && !isPaid && (
        <div className="absolute top-10 right-10 border-4 border-emerald-600 text-emerald-600 font-display font-extrabold text-lg px-4 py-1.5 rounded-lg uppercase tracking-widest rotate-[-5deg] opacity-90 select-none">
          DIGITALLY SIGNED ✓
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-100 pb-8 mb-8 gap-6">
        <div>
          <div className="h-12 w-auto mb-2 flex items-center">
            <img 
              src="/logo.png" 
              alt="Aivora Automations" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-800">Aivora Automations</strong> &bull; aivoraai.online<br />
            info@aivoraautomations.com
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
            {config.badge}
          </span>
          <h1 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('title', e)}
            className={`font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight ${editableClass}`}
          >
            {doc.title}
          </h1>
          <div className="text-xs text-slate-500 font-mono mt-1">
            Ref: <span className="font-bold text-slate-700">{doc.refNumber}</span> | Date: {doc.issueDate}
          </div>
        </div>
      </div>

      {/* Parties Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 border border-slate-200/80 rounded-xl p-5 mb-8 text-sm">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Service Provider</h4>
          <div className="font-bold text-slate-900 text-base">Aivora Automations</div>
          <div className="text-xs text-slate-600 mt-1 leading-relaxed">
            <strong>Website:</strong> https://aivoraai.online/<br />
            <strong>Email:</strong> info@aivoraautomations.com<br />
            <strong>Specialization:</strong> AI Agents, Voice AI &amp; Workflow Systems
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Prepared For (Client)</h4>
          <div 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('clientCompany', e)}
            className={`font-bold text-slate-900 text-base ${editableClass}`}
          >
            {doc.clientCompany}
          </div>
          <div className="text-xs text-slate-600 mt-1 leading-relaxed">
            <strong>Attn:</strong>{' '}
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('clientContactName', e)}
              className={editableClass}
            >
              {doc.clientContactName}
            </span>
            <br />
            <strong>Email:</strong>{' '}
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('clientEmail', e)}
              className={editableClass}
            >
              {doc.clientEmail}
            </span>
            <br />
            {doc.clientAddress && (
              <>
                <strong>Address:</strong>{' '}
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleBlur('clientAddress', e)}
                  className={editableClass}
                >
                  {doc.clientAddress}
                </span>
                <br />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scope / Summary */}
      {doc.summary && (
        <div className="mb-8">
          <h2 className="font-display text-base font-bold text-slate-900 border-l-4 border-blue-600 pl-3 mb-3">
            1. Executive Summary &amp; Scope
          </h2>
          <p 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('summary', e)}
            className={`text-sm text-slate-700 leading-relaxed whitespace-pre-line ${editableClass}`}
          >
            {doc.summary}
          </p>
        </div>
      )}

      {/* Custom Scope / Technical Deliverables */}
      {doc.customScope && (
        <div className="mb-8">
          <h2 className="font-display text-base font-bold text-slate-900 border-l-4 border-blue-600 pl-3 mb-3">
            2. Deliverables &amp; System Specifications
          </h2>
          <div 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('customScope', e)}
            className={`bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-700 whitespace-pre-line leading-relaxed ${editableClass}`}
          >
            {doc.customScope}
          </div>
        </div>
      )}

      {/* Line Items Table */}
      {doc.lineItems && doc.lineItems.length > 0 && doc.totalAmount > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-base font-bold text-slate-900 border-l-4 border-blue-600 pl-3 mb-3">
            3. Investment &amp; Milestone Schedule
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase">
                  <th className="py-3 px-4">Milestone / Description</th>
                  <th className="py-3 px-4 text-center w-20">Qty</th>
                  <th className="py-3 px-4 text-right w-32">Rate</th>
                  <th className="py-3 px-4 text-right w-32">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {doc.lineItems.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-3 px-4 text-slate-800 font-medium">{item.description}</td>
                    <td className="py-3 px-4 text-center text-slate-600">{item.quantity || 1}</td>
                    <td className="py-3 px-4 text-right text-slate-600">${item.rate?.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">${item.amount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Box */}
          <div className="flex justify-end mt-4">
            <div className="w-72 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${doc.totalAmount.toLocaleString()} {doc.currency}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax / VAT (0% Export):</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-extrabold text-blue-600">
                <span>Total Amount:</span>
                <span>${doc.totalAmount.toLocaleString()} {doc.currency}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment / International Instructions */}
      {doc.paymentTerms && (
        <div className="mb-8 bg-blue-50/70 border border-blue-100 rounded-xl p-5 text-sm text-slate-700">
          <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-1.5">Payment Terms &amp; Settlement</h4>
          <p 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('paymentTerms', e)}
            className={`text-xs text-slate-600 leading-relaxed mb-3 ${editableClass}`}
          >
            {doc.paymentTerms}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <strong>1. International Bank Wire (SWIFT / IBAN)</strong>
              <p className="text-slate-500 mt-0.5">Beneficiary: Aivora Automations &bull; SCB / Meezan Bank</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <strong>2. Stripe Card, Wise, Payoneer &amp; Crypto</strong>
              <p className="text-slate-500 mt-0.5">billing@aivoraautomations.com &bull; USDT (TRC20)</p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Clauses & Terms */}
      {doc.customClauses && (
        <div className="mb-8">
          <h2 className="font-display text-base font-bold text-slate-900 border-l-4 border-blue-600 pl-3 mb-3">
            4. Special Clauses &amp; Terms
          </h2>
          <div 
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('customClauses', e)}
            className={`bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-700 whitespace-pre-line leading-relaxed ${editableClass}`}
          >
            {doc.customClauses}
          </div>
        </div>
      )}

      {/* 30-Day Warranty & Legal Safeguards */}
      <div className="mb-8 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-6 space-y-2">
        <p>
          <strong>30-Day Bug-Fix Warranty:</strong>{' '}
          <span
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('warrantyTerms', e)}
            className={editableClass}
          >
            {doc.warrantyTerms || 'Aivora Automations guarantees all built workflows against bugs in the original build for 30 calendar days post-deployment.'}
          </span>
        </p>
        <p>
          <strong>AI Data Privacy:</strong>{' '}
          <span
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('privacyTerms', e)}
            className={editableClass}
          >
            {doc.privacyTerms || 'Customer data and proprietary conversations are strictly confidential and will never be used to train public LLM models.'}
          </span>
        </p>
      </div>

      {/* E-Signature Block */}
      {doc.requireSignature && (
        <div className="mt-10 pt-6 border-t-2 border-dashed border-slate-200 page-break">
          <h3 className="font-display font-bold text-center text-slate-900 text-sm mb-6 uppercase tracking-wider">
            Signatures &amp; Acceptance
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* Aivora Signature */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
                Aivora Automations
              </div>
              <div className="h-12 border-b border-slate-400 flex items-end pb-1 font-serif italic text-lg text-slate-800">
                Aivora Engineering Lead
              </div>
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div><strong>Name:</strong> Aivora Solutions Team</div>
                <div><strong>Title:</strong> Managing Director / Founder</div>
                <div><strong>Date:</strong> {doc.issueDate}</div>
              </div>
            </div>

            {/* Client Signature */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
                Client Acceptance: {doc.clientCompany}
              </div>

              {isSigned && doc.signature ? (
                <div>
                  {doc.signature.signatureImage ? (
                    <div className="h-12 border-b border-emerald-600 flex items-end pb-1">
                      <img 
                        src={doc.signature.signatureImage} 
                        alt="Client Signature" 
                        className="max-h-11 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-12 border-b border-emerald-600 flex items-end pb-1 font-serif italic text-xl text-emerald-800">
                      {doc.signature.typedSignature || doc.signature.signedByName}
                    </div>
                  )}
                  <div className="mt-3 text-xs text-slate-700 space-y-1">
                    <div><strong>Signed By:</strong> {doc.signature.signedByName}</div>
                    <div><strong>Title:</strong> {doc.signature.signedByTitle || 'Authorized Signatory'}</div>
                    <div><strong>Email:</strong> {doc.signature.signedByEmail || doc.clientEmail}</div>
                    <div className="text-emerald-700 font-medium flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Digitally Verified: {new Date(doc.signature.signedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400 flex items-end pb-1 text-slate-400 text-xs italic">
                    Awaiting Digital Signature below
                  </div>
                  <div className="mt-3 text-xs text-slate-500 space-y-1">
                    <div><strong>Name:</strong> {doc.clientContactName}</div>
                    <div><strong>Status:</strong> Pending Client E-Sign</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
