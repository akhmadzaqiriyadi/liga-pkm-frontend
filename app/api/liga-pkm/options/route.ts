import { NextResponse } from 'next/server';

const BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://kreanovasi.uty.ac.id/api/v1/liga-pkm';

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/options`, {
      cache: 'no-store',
    });

    const contentType = res.headers.get('content-type') || '';

    if (res.status === 468 || contentType.includes('text/html')) {
      return NextResponse.json(
        {
          success: false,
          message: `Server API (${BASE_URL}) mengembalikan HTTP ${res.status} (SafeLine WAF challenge). Endpoint /api/v1/liga-pkm/* perlu di-whitelist di WAF atau gunakan URL internal/lokal.`,
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: `Tidak dapat terhubung ke server API (${BASE_URL}).`,
      },
      { status: 502 }
    );
  }
}

