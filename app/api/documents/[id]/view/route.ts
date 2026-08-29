import { NextRequest, NextResponse } from 'next/server';
import { recordDocumentView } from '@/lib/storage';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown IP';
    const ua = req.headers.get('user-agent') || 'Browser';

    const updated = recordDocumentView(params.id, { ip, ua });
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, document: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to record view' }, { status: 500 });
  }
}
