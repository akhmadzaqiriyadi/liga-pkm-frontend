import { NextRequest, NextResponse } from 'next/server';
import { RegistrationPayloadSchema } from '@/src/schemas/registrationSchema';

const BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://kreanovasi.uty.ac.id/api/v1/liga-pkm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod Validation (Strict Numeric & Content Verification)
    const parseResult = RegistrationPayloadSchema.safeParse(body);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const errorMsg = firstIssue
        ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
        : 'Validasi form pendaftaran gagal';

      return NextResponse.json(
        {
          success: false,
          error_code: 'VALIDATION_ERROR',
          message: errorMsg,
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    // 2. Forward Validated Body to Upstream Backend
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parseResult.data),
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
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Kesalahan jaringan';
    return NextResponse.json(
      {
        success: false,
        error: {
          message: `Tidak dapat terhubung ke server API (${BASE_URL}): ${msg}`,
        },
      },
      { status: 502 }
    );
  }
}
