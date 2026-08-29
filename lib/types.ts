export type DocumentType = 
  | 'contract'
  | 'proposal'
  | 'sow'
  | 'nda'
  | 'invoice'
  | 'quote'
  | 'receipt'
  | 'case_study';

export type DocumentStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'paid';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'sent' | 'viewed' | 'signed' | 'paid' | 'updated';
  title: string;
  description?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SignatureData {
  signatureImage?: string;
  typedSignature?: string;
  signedByName: string;
  signedByTitle?: string;
  signedByEmail?: string;
  signedAt: string;
  ipAddress?: string;
  legalConsent: boolean;
}

export interface DocumentData {
  id: string;
  slug: string;
  type: DocumentType;
  title: string;
  refNumber: string;
  status: DocumentStatus;
  
  // Client Info
  clientCompany: string;
  clientContactName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  
  // Financials & Dates
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  totalAmount: number;
  depositAmount?: number;
  issueDate: string;
  dueDate?: string;
  validUntil?: string;
  
  // Scope & Editable Text Clauses
  summary?: string;
  customScope?: string;
  warrantyTerms?: string;
  privacyTerms?: string;
  customClauses?: string;
  lineItems: LineItem[];
  paymentTerms?: string;
  notes?: string;
  
  // E-Signature & Audits
  requireSignature: boolean;
  signature?: SignatureData;
  timeline: TimelineEvent[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
  signedAt?: string;
  paidAt?: string;
}
