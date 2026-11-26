export function getBackendBaseUrl(): string {
  const raw =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://kreanovasi.uty.ac.id/api/v1/liga-pkm';
  return raw.replace(/\/+$/, '');
}

export function getBackendSecret(): string {
  return (
    process.env.PKM_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_SECRET_KEY ||
    'ligapkm-uty-secret-2026'
  );
}

export function buildAppsScriptUrl(
  action: string,
  params: Record<string, string | undefined> = {}
): string {
  const url = new URL(getBackendBaseUrl());
  url.searchParams.set('action', action);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

export function normalizeSubmission(item: Record<string, unknown>): Record<string, unknown> {
  if (!item || typeof item !== 'object') return item;
  if (!item.prodiKetua && item.prodiketua) {
    return { ...item, prodiKetua: item.prodiketua };
  }
  return item;
}

export async function parseUpstreamJson<T = Record<string, unknown>>(
  res: Response
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  const contentType = res.headers.get('content-type') || '';
  if (res.status === 468 || contentType.includes('text/html')) {
    return {
      ok: false,
      error: `Upstream mengembalikan HTML/WAF (HTTP ${res.status}).`,
    };
  }
  try {
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      error: 'Response dari server upstream bukan JSON yang valid.',
    };
  }
}
