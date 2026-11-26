import { NextRequest, NextResponse } from 'next/server';
import {
  buildAppsScriptUrl,
  getBackendSecret,
  normalizeSubmission,
  parseUpstreamJson,
} from '@/lib/backendApi';

interface SubmissionsUpstreamPayload {
  success?: boolean;
  status_code?: number;
  message?: string;
  data?: {
    items?: Record<string, unknown>[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = buildAppsScriptUrl('submissions', {
      secret: getBackendSecret(),
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      bidang: searchParams.get('bidang') || undefined,
    });

    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    const parsed = await parseUpstreamJson<SubmissionsUpstreamPayload>(res);
    if (!parsed.ok) {
      return NextResponse.json(
        {
          success: true,
          data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
          message: parsed.error,
        },
        { status: 200 }
      );
    }

    const data = parsed.data;
    if (!data?.success) {
      return NextResponse.json(data, { status: data?.status_code || 401 });
    }

    if (Array.isArray(data?.data?.items)) {
      data.data.items = data.data.items.map((item) => normalizeSubmission(item));
    }

    return NextResponse.json(data, { status: data?.status_code || 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Koneksi upstream gagal';
    return NextResponse.json(
      {
        success: true,
        data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 },
        message: `Offline mode: ${message}`,
      },
      { status: 200 }
    );
  }
}
