import { NextRequest, NextResponse } from 'next/server';
import {
  buildAppsScriptUrl,
  normalizeSubmission,
  parseUpstreamJson,
} from '@/lib/backendApi';

interface TrackResponse {
  success?: boolean;
  status_code?: number;
  message?: string;
  data?: Record<string, unknown>;
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')?.trim() || '';
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID pendaftaran wajib diisi' },
        { status: 400 }
      );
    }

    const res = await fetch(buildAppsScriptUrl('track', { id }), {
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    const parsed = await parseUpstreamJson<TrackResponse>(res);
    if (!parsed.ok) {
      return NextResponse.json(
        { success: false, message: parsed.error },
        { status: 502 }
      );
    }

    const data = parsed.data;
    if (!data?.success) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Data pendaftaran tidak ditemukan' },
        { status: data?.status_code || 404 }
      );
    }

    if (data.data && typeof data.data === 'object') {
      data.data = normalizeSubmission(data.data);
    }

    return NextResponse.json(data, { status: data.status_code || 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memeriksa data pendaftaran dari server.' },
      { status: 502 }
    );
  }
}

