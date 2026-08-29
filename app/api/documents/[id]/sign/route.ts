import { NextRequest, NextResponse } from 'next/server';
import { recordDocumentSign } from '@/lib/storage';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Verified IP';

    if (!body.signedByName) {
      return NextResponse.json({ success: false, error: 'Signer name is required' }, { status: 400 });
    }

    const updated = recordDocumentSign(params.id, body, { ip });
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, document: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to record signature' }, { status: 500 });
  }
}
