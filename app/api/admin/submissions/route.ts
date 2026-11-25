import { NextRequest, NextResponse } from 'next/server';

const BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://kreanovasi.uty.ac.id/api/v1/liga-pkm';

const SECRET =
  process.env.PKM_SECRET ||
  process.env.ADMIN_PASSWORD ||
  process.env.ADMIN_SECRET_KEY ||
  'ligapkm-uty-secret-2026';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const res = await fetch(`${BASE_URL}/submissions?${searchParams.toString()}`, {
      headers: { 'X-PKM-SECRET': SECRET },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || contentType.includes('text/html')) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          message: 'Server backend upstream belum dapat dihubungi atau terkena WAF.',
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Koneksi upstream gagal';
    return NextResponse.json(
      {
        success: true,
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        message: `Offline mode: ${message}`,
      },
      { status: 200 }
    );
  }
}
