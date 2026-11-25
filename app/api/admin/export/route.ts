import { NextResponse } from 'next/server';

const BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://kreanovasi.uty.ac.id/api/v1/liga-pkm';

const SECRET =
  process.env.PKM_SECRET ||
  process.env.ADMIN_PASSWORD ||
  process.env.ADMIN_SECRET_KEY ||
  'ligapkm-uty-secret-2026';

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/submissions/export`, {
      headers: { 'X-PKM-SECRET': SECRET },
      signal: AbortSignal.timeout(5000),
    });
    const csv = await res.text();
    return new NextResponse(csv, {
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
