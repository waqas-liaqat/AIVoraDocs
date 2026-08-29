import { DocumentData } from './types';
import { createDefaultDocument } from './defaultTemplates';

// Global In-Memory Store for Serverless Environment
let globalDocuments: DocumentData[] = [];

// Seed sample documents on initialization
function seedInitialDocuments(): DocumentData[] {
  const doc1 = {
    ...createDefaultDocument('contract', 'EHHMD Healthcare Group'),
    id: 'aiv-doc-101',
    slug: 'ehhmd-contract-2025',
    status: 'signed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    signedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    signature: {
      typedSignature: 'Douglas White',
      signedByName: 'Douglas White',
      signedByTitle: 'Founder & CEO',
      signedByEmail: 'douglas@ehhmd.com',
      signedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      legalConsent: true,
      ipAddress: '198.51.100.42 (US East)'
    },
    timeline: [
      {
        id: 't1',
        type: 'created',
        title: 'Document Created',
        description: 'Created by Aivora Engineering Team',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 't2',
        type: 'sent',
        title: 'Link Sent to Client',
        description: 'Sent to douglas@ehhmd.com via WhatsApp & Email',
        timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 't3',
        type: 'viewed',
        title: 'Viewed by Client',
        description: 'Opened on Chrome (Desktop) from United States',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 't4',
        type: 'signed',
        title: 'Document Signed & Completed',
        description: 'Signed by Douglas White (Founder & CEO)',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  } as DocumentData;

  const doc2 = {
    ...createDefaultDocument('proposal', 'Sparkle Technologies UK'),
    id: 'aiv-doc-102',
    slug: 'sparkle-ai-proposal',
    status: 'viewed',
    totalAmount: 5300,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    viewedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 't1',
        type: 'created',
        title: 'Document Created',
        description: 'Created by Aivora Team',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 't2',
        type: 'sent',
        title: 'Link Sent to Client',
        description: 'Sent to Temitope at Sparkle UK',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 't3',
        type: 'viewed',
        title: 'Viewed by Client',
        description: 'Client opened and reviewed proposal options',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ]
  } as DocumentData;

  const doc3 = {
    ...createDefaultDocument('invoice', 'Safe Pest Control LLC'),
    id: 'aiv-doc-103',
    slug: 'safe-pest-inv-001',
    status: 'paid',
    totalAmount: 2250,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        id: 't1',
        type: 'created',
        title: 'Invoice Issued',
        description: 'Milestone 1 (50% Deposit) issued',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 't2',
        type: 'sent',
        title: 'Invoice Sent',
        description: 'Sent via email with wire instructions',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 't3',
        type: 'paid',
        title: 'Payment Received & Cleared',
        description: 'Bank Wire settled in full ($2,250.00 USD)',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  } as DocumentData;

  return [doc1, doc2, doc3];
}

// Initialize storage
if (globalDocuments.length === 0) {
  globalDocuments = seedInitialDocuments();
}

export function getAllDocuments(): DocumentData[] {
  return [...globalDocuments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getDocumentByIdOrSlug(idOrSlug: string): DocumentData | null {
  const doc = globalDocuments.find(d => d.id === idOrSlug || d.slug === idOrSlug);
  return doc ? { ...doc } : null;
}

export function saveDocument(doc: DocumentData): DocumentData {
  const index = globalDocuments.findIndex(d => d.id === doc.id);
  const now = new Date().toISOString();
  
  if (index >= 0) {
    globalDocuments[index] = {
      ...globalDocuments[index],
      ...doc,
      updatedAt: now
    };
    return globalDocuments[index];
  } else {
    const newDoc: DocumentData = {
      ...doc,
      createdAt: doc.createdAt || now,
      updatedAt: now
    };
    globalDocuments.unshift(newDoc);
    return newDoc;
  }
}

export function deleteDocument(id: string): boolean {
  const initialLen = globalDocuments.length;
  globalDocuments = globalDocuments.filter(d => d.id !== id);
  return globalDocuments.length < initialLen;
}

export function recordDocumentView(idOrSlug: string, meta?: { ip?: string; ua?: string }): DocumentData | null {
  const doc = globalDocuments.find(d => d.id === idOrSlug || d.slug === idOrSlug);
  if (!doc) return null;

  const now = new Date().toISOString();
  doc.viewedAt = now;
  
  // If status was draft or sent, advance to viewed
  if (doc.status === 'draft' || doc.status === 'sent') {
    doc.status = 'viewed';
  }

  // Add timeline event
  doc.timeline.push({
    id: 't-' + Date.now(),
    type: 'viewed',
    title: 'Client Opened Document',
    description: `Opened by client on ${meta?.ua ? 'device' : 'web'}`,
    timestamp: now,
    ipAddress: meta?.ip,
    userAgent: meta?.ua
  });

  return { ...doc };
}

export function recordDocumentSign(idOrSlug: string, signature: any, meta?: { ip?: string }): DocumentData | null {
  const doc = globalDocuments.find(d => d.id === idOrSlug || d.slug === idOrSlug);
  if (!doc) return null;

  const now = new Date().toISOString();
  doc.signedAt = now;
  doc.status = 'signed';
  doc.signature = {
    ...signature,
    signedAt: now,
    ipAddress: meta?.ip || 'Verified Web Session',
    legalConsent: true
  };

  doc.timeline.push({
    id: 't-' + Date.now(),
    type: 'signed',
    title: 'Document Signed & Accepted',
    description: `Digitally signed by ${signature.signedByName} (${signature.signedByTitle || 'Authorized Signatory'})`,
    timestamp: now,
    ipAddress: meta?.ip
  });

  return { ...doc };
}
