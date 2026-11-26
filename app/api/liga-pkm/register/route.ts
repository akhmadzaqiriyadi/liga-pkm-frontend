import { NextRequest, NextResponse } from 'next/server';
import { RegistrationPayloadSchema } from '@/src/schemas/registrationSchema';
import { buildAppsScriptUrl, getBackendBaseUrl, parseUpstreamJson } from '@/lib/backendApi';

interface RegisterUpstreamResponse {
  success?: boolean;
  status_code?: number;
  message?: string;
  data?: Record<string, unknown>;
}

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

    // Include both prodiKetua and prodiketua so Apps Script header mapping works either way
    const upstreamPayload = {
      ...parseResult.data,
      prodiketua: parseResult.data.prodiKetua,
    };

    // 2. Forward Validated Body to Google Apps Script (?action=register)
    const res = await fetch(buildAppsScriptUrl('register'), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(upstreamPayload),
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });

    const parsed = await parseUpstreamJson<RegisterUpstreamResponse>(res);
    if (!parsed.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `${parsed.error} (${getBackendBaseUrl()})`,
          },
        },
        { status: 502 }
      );
    }

    const data = parsed.data;
    const statusCode = data?.status_code || res.status || (data?.success ? 201 : 400);
    return NextResponse.json(data, { status: statusCode });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Kesalahan jaringan';
    return NextResponse.json(
      {
        success: false,
        error: {
          message: `Tidak dapat terhubung ke server API (${getBackendBaseUrl()}): ${msg}`,
        },
      },
      { status: 502 }
    );
  }
}
