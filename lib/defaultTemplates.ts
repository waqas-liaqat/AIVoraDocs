import { DocumentType, DocumentData } from './types';

export const TEMPLATE_CONFIGS: Record<DocumentType, {
  name: string;
  badge: string;
  defaultTitle: string;
  defaultPrefix: string;
  requireSignature: boolean;
  defaultAmount: number;
  description: string;
}> = {
  contract: {
    name: 'Client Contract / MSA',
    badge: 'Legal Agreement',
    defaultTitle: 'Master Services Agreement',
    defaultPrefix: 'AIV-MSA',
    requireSignature: true,
    defaultAmount: 4500,
    description: 'Master legal agreement covering project terms, deliverables, IP ownership, and 30-day bug-fix warranty.'
  },
  proposal: {
    name: 'Project Proposal',
    badge: 'Sales Proposal',
    defaultTitle: 'Autonomous AI Automation System Proposal',
    defaultPrefix: 'AIV-PROP',
    requireSignature: true,
    defaultAmount: 3500,
    description: 'High-converting sales pitch with AI architecture, $1.5k–$10k investment tiers, and ROI projections.'
  },
  sow: {
    name: 'Statement of Work (SOW)',
    badge: 'Technical Blueprint',
    defaultTitle: 'Statement of Work — AI & CRM Infrastructure',
    defaultPrefix: 'AIV-SOW',
    requireSignature: true,
    defaultAmount: 4500,
    description: 'Detailed technical scope covering n8n workflows, GPT-4o prompts, CRM mapping, and acceptance criteria.'
  },
  nda: {
    name: 'Mutual NDA',
    badge: 'Confidentiality',
    defaultTitle: 'Mutual Non-Disclosure & AI Data Privacy Agreement',
    defaultPrefix: 'AIV-NDA',
    requireSignature: true,
    defaultAmount: 0,
    description: 'Bilateral confidentiality agreement safeguarding API keys and guaranteeing AI data privacy.'
  },
  invoice: {
    name: 'Professional Invoice',
    badge: 'Billing & Payment',
    defaultTitle: 'Invoice for AI Development Services',
    defaultPrefix: 'INV',
    requireSignature: false,
    defaultAmount: 2250,
    description: 'Itemized invoice supporting Bank Wire (SWIFT/IBAN), Stripe, Payoneer, Wise, and Crypto settlement.'
  },
  quote: {
    name: 'Project Quote / Estimate',
    badge: 'Price Estimation',
    defaultTitle: 'Project Estimate & Modular Pricing Quote',
    defaultPrefix: 'AIV-EST',
    requireSignature: true,
    defaultAmount: 3500,
    description: 'Formal quotation document with modular scope packages (Core build vs. Voice Agent add-on) valid for 14 days.'
  },
  receipt: {
    name: 'Payment Receipt',
    badge: 'Official Settlement',
    defaultTitle: 'Official Payment Receipt',
    defaultPrefix: 'REC',
    requireSignature: false,
    defaultAmount: 2250,
    description: 'Payment acknowledgment receipt with Transaction ID, Paid stamp, and balance zero confirmation.'
  },
  case_study: {
    name: 'Case Study / Proof',
    badge: 'Client Proof',
    defaultTitle: 'Client Success Case Study — 400% Booking Growth',
    defaultPrefix: 'AIV-CASE',
    requireSignature: false,
    defaultAmount: 0,
    description: 'High-impact client results showcase (400% ROI, < 3s latency, and client testimonials).'
  }
};

export function createDefaultDocument(type: DocumentType, clientCompany = 'Acme Corp'): Partial<DocumentData> {
  const config = TEMPLATE_CONFIGS[type];
  const now = new Date();
  const year = now.getFullYear();
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const refNumber = `${config.defaultPrefix}-${year}-${randomId}`;

  const todayStr = now.toISOString().split('T')[0];
  const due = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const valid = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return {
    type,
    title: config.defaultTitle,
    refNumber,
    status: 'draft',
    clientCompany: clientCompany,
    clientContactName: 'John Smith',
    clientEmail: 'john@company.com',
    clientPhone: '+1 (555) 019-2834',
    clientAddress: 'San Francisco, CA, United States',
    currency: 'USD',
    totalAmount: config.defaultAmount,
    depositAmount: config.defaultAmount > 0 ? Math.round(config.defaultAmount * 0.5) : 0,
    issueDate: todayStr,
    dueDate: due,
    validUntil: valid,
    requireSignature: config.requireSignature,
    summary: `Autonomous Artificial Intelligence & Workflow Automation System designed and engineered for ${clientCompany}.`,
    customScope: `• Multi-Stage Conversational AI Chatbot (WhatsApp & Web Widget)\n• n8n / Make.com Webhook Orchestration Pipeline\n• Bi-Directional CRM & Google Calendar Sync\n• 30-Day Complimentary Post-Launch Bug-Fix Warranty`,
    lineItems: [
      {
        id: '1',
        description: 'Milestone 1: 50% Upfront Deposit — Core AI Chatbot & CRM Automation Pipeline',
        quantity: 1,
        rate: config.defaultAmount > 0 ? Math.round(config.defaultAmount * 0.5) : 0,
        amount: config.defaultAmount > 0 ? Math.round(config.defaultAmount * 0.5) : 0,
      },
      {
        id: '2',
        description: 'Milestone 2: 50% Final Balance — Testing, Video SOPs & Production Handover',
        quantity: 1,
        rate: config.defaultAmount > 0 ? Math.round(config.defaultAmount * 0.5) : 0,
        amount: config.defaultAmount > 0 ? Math.round(config.defaultAmount * 0.5) : 0,
      }
    ],
    paymentTerms: '50% Upfront Deposit upon contract execution, 50% upon successful testing and handover. Invoices payable within 7 days via Wire Transfer, Stripe, Payoneer, Wise, or Crypto.',
    notes: 'Zero-rated cross-border software export service (0% VAT / Reverse Charge applies).',
    timeline: [
      {
        id: '1',
        type: 'created',
        title: 'Document Created',
        description: 'Created by Aivora team member',
        timestamp: new Date().toISOString()
      }
    ]
  };
}
