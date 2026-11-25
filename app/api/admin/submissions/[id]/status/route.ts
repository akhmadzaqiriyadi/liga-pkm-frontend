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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const res = await fetch(`${BASE_URL}/submissions/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-PKM-SECRET': SECRET,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui status ke server backend.' },
      { status: 502 }
    );
  }
}
