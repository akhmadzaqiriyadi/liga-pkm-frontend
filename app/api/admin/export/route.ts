import { NextResponse } from 'next/server';
import {
  buildAppsScriptUrl,
  getBackendSecret,
  normalizeSubmission,
  parseUpstreamJson,
} from '@/lib/backendApi';

const CSV_HEADERS = [
  'id',
  'namaKetua',
  'npmKetua',
  'prodiKetua',
  'noWhatsappKetua',
  'namaAnggota1',
  'npmAnggota1',
  'prodiAnggota1',
  'namaAnggota2',
  'npmAnggota2',
  'prodiAnggota2',
  'namaAnggota3',
  'npmAnggota3',
  'prodiAnggota3',
  'namaAnggota4',
  'npmAnggota4',
  'prodiAnggota4',
  'namaAnggota5',
  'npmAnggota5',
  'prodiAnggota5',
  'judulDiusulkan',
  'bidangPkm',
  'skemaSdgs',
  'dosenPendamping',
  'deskripsiIde',
  'status',
  'reviewerNotes',
  'createdAt',
];

function escapeCsvCell(value: unknown): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

interface ExportUpstreamPayload {
  success?: boolean;
  status_code?: number;
  message?: string;
  data?: {
    items?: Record<string, unknown>[];
  };
}

export async function GET() {
  try {
    const url = buildAppsScriptUrl('submissions', {
      secret: getBackendSecret(),
      page: '1',
      limit: '1000',
    });

    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });

    const parsed = await parseUpstreamJson<ExportUpstreamPayload>(res);
    if (!parsed.ok) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 502 });
    }

    const data = parsed.data;
    if (!data?.success) {
      return NextResponse.json(
        { success: false, message: data?.message || 'Gagal mengekspor CSV.' },
        { status: data?.status_code || 502 }
      );
    }

    const items: Record<string, unknown>[] = Array.isArray(data?.data?.items)
      ? data.data.items.map((item) => normalizeSubmission(item))
      : [];

    const rows = [
      CSV_HEADERS.join(','),
      ...items.map((item) => CSV_HEADERS.map((h) => escapeCsvCell(item[h])).join(',')),
    ];

    return new NextResponse(rows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="rekap-liga-pkm.csv"',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal mengekspor CSV dari server backend.' },
      { status: 502 }
    );
  }
}
