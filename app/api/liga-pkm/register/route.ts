import { NextRequest, NextResponse } from 'next/server';

const BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://kreanovasi.uty.ac.id/api/v1/liga-pkm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get('content-type') || '';

    if (res.status === 468 || contentType.includes('text/html')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Server API (${BASE_URL}) memblokir request dengan HTTP ${res.status} (SafeLine WAF).`,
          },
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
        error: {
          message: `Tidak dapat terhubung ke server API (${BASE_URL}).`,
        },
      },
      { status: 502 }
    );
  }
}

