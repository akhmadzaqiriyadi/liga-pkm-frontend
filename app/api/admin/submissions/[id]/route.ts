import { NextRequest, NextResponse } from 'next/server';
import {
  buildAppsScriptUrl,
  getBackendSecret,
  normalizeSubmission,
  parseUpstreamJson,
} from '@/lib/backendApi';

interface DetailResponse {
  success?: boolean;
  status_code?: number;
  message?: string;
  data?: Record<string, unknown>;
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = buildAppsScriptUrl('submission_detail', {
      secret: getBackendSecret(),
      id,
    });

    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    const parsed = await parseUpstreamJson<DetailResponse>(res);
    if (!parsed.ok) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 502 });
    }

    const data = parsed.data;
    if (!data?.success) {
      return NextResponse.json(data, { status: data?.status_code || 404 });
    }

    if (data?.data && typeof data.data === 'object') {
      data.data = normalizeSubmission(data.data);
    }

    return NextResponse.json(data, { status: data?.status_code || 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail submission dari server backend.' },
      { status: 502 }
    );
  }
}
