import { NextRequest, NextResponse } from 'next/server';
import { getDocumentByIdOrSlug, saveDocument, deleteDocument } from '@/lib/storage';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doc = getDocumentByIdOrSlug(params.id);
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve document' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const existing = getDocumentByIdOrSlug(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    const updated = saveDocument({
      ...existing,
      ...body,
      id: existing.id,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, document: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteDocument(params.id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete document' }, { status: 500 });
  }
}
