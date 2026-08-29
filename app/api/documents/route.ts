import { NextRequest, NextResponse } from 'next/server';
import { getAllDocuments, saveDocument } from '@/lib/storage';
import { DocumentData } from '@/lib/types';

export async function GET() {
  try {
    const docs = getAllDocuments();
    return NextResponse.json({ success: true, documents: docs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Generate UUID / Slug if not provided
    const id = body.id || 'aiv-' + Math.random().toString(36).substring(2, 9);
    const slug = body.slug || (body.clientCompany ? body.clientCompany.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(100 + Math.random() * 900) : id);
    
    const docData: DocumentData = {
      ...body,
      id,
      slug,
      status: body.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: body.timeline || [
        {
          id: 't-' + Date.now(),
          type: 'created',
          title: 'Document Created',
          description: `Created for ${body.clientCompany || 'Client'}`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    const saved = saveDocument(docData);
    return NextResponse.json({ success: true, document: saved });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create document' }, { status: 500 });
  }
}
