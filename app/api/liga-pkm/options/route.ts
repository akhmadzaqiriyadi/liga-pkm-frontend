import { NextResponse } from 'next/server';
import { FALLBACK_OPTIONS } from '@/src/data/fallbackOptions';
import { buildAppsScriptUrl, parseUpstreamJson } from '@/lib/backendApi';

interface UpstreamOptionsPayload {
  success?: boolean;
  status_code?: number;
  message?: string;
  data?: {
    prodi?: string[];
    bidangPkm?: string[];
    dosenPendamping?: string[];
  };
}

export async function GET() {
  try {
    const res = await fetch(buildAppsScriptUrl('options'), {
      cache: 'no-store',
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });

    const parsed = await parseUpstreamJson<UpstreamOptionsPayload>(res);
    if (!parsed.ok || !parsed.data?.success) {
      return NextResponse.json({
        success: true,
        data: FALLBACK_OPTIONS,
        source: 'fallback_upstream',
        message: !parsed.ok ? parsed.error : parsed.data?.message || 'Menggunakan master opsi cadangan.',
      });
    }

    const remoteData = parsed.data.data || {};
    const mergedData = {
      prodi: remoteData.prodi?.length ? remoteData.prodi : FALLBACK_OPTIONS.prodi,
      bidangPkm: remoteData.bidangPkm?.length ? remoteData.bidangPkm : FALLBACK_OPTIONS.bidangPkm,
      dosenPendamping: remoteData.dosenPendamping?.length
        ? remoteData.dosenPendamping
        : FALLBACK_OPTIONS.dosenPendamping,
    };

    return NextResponse.json(
      {
        ...parsed.data,
        data: mergedData,
      },
      { status: parsed.data.status_code || res.status || 200 }
    );
  } catch {
    return NextResponse.json({
      success: true,
      data: FALLBACK_OPTIONS,
      source: 'fallback_offline',
      message: 'Menggunakan master opsi cadangan (Server upstream belum dapat dihubungi).',
    });
  }
}
