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

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${BASE_URL}/submissions/${id}`, {
      headers: { 'X-PKM-SECRET': SECRET },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil detail submission dari server backend.' },
      { status: 502 }
    );
  }
}
