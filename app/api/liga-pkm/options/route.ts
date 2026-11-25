import { NextResponse } from 'next/server';
import { FALLBACK_OPTIONS } from '@/src/data/fallbackOptions';

const BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://kreanovasi.uty.ac.id/api/v1/liga-pkm';

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/options`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    });

    const contentType = res.headers.get('content-type') || '';

    if (res.status === 468 || contentType.includes('text/html')) {
      // Fallback to local static options if blocked by WAF challenge
      return NextResponse.json({
        success: true,
        data: FALLBACK_OPTIONS,
        source: 'fallback_waf',
        message: 'Menggunakan master opsi cadangan (WAF challenge terdeteksi).',
      });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    // Fallback to local static options if offline / connection error
    return NextResponse.json({
      success: true,
      data: FALLBACK_OPTIONS,
      source: 'fallback_offline',
      message: 'Menggunakan master opsi cadangan (Server upstream belum dapat dihubungi).',
    });
  }
}


