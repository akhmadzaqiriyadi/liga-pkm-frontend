import { NextRequest, NextResponse } from 'next/server';
import { buildAppsScriptUrl, getBackendSecret, parseUpstreamJson } from '@/lib/backendApi';

const VALID_STATUSES = new Set(['pending', 'reviewed', 'approved', 'rejected']);

interface UpdateStatusResponse {
  success?: boolean;
  status_code?: number;
  message?: string;
  data?: Record<string, unknown>;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body?.status || !VALID_STATUSES.has(String(body.status))) {
      return NextResponse.json(
        { success: false, message: 'Status tidak valid (harus pending, reviewed, approved, atau rejected).' },
        { status: 400 }
      );
    }

    const res = await fetch(buildAppsScriptUrl('update_status'), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        id,
        status: body.status,
        reviewerNotes: body.reviewerNotes ?? '',
        secret: getBackendSecret(),
      }),
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });

    const parsed = await parseUpstreamJson<UpdateStatusResponse>(res);
    if (!parsed.ok) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 502 });
    }

    const data = parsed.data;
    const statusCode = data?.status_code || (data?.success ? 200 : 400);
    return NextResponse.json(data, { status: statusCode });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status ke server backend.' },
      { status: 502 }
    );
  }
}
