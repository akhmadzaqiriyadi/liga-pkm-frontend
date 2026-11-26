// ========== TYPES ==========
export interface OptionsData {
  prodi: string[];
  bidangPkm: string[];
  dosenPendamping: string[];
}

export interface LigaPKMRegistrationPayload {
  namaKetua: string;
  npmKetua: string;
  prodiKetua: string;
  noWhatsappKetua: string;
  namaAnggota1: string;
  npmAnggota1: string;
  prodiAnggota1: string;
  namaAnggota2: string;
  npmAnggota2: string;
  prodiAnggota2: string;
  namaAnggota3: string;
  npmAnggota3: string;
  prodiAnggota3: string;
  namaAnggota4?: string;
  npmAnggota4?: string;
  prodiAnggota4?: string;
  namaAnggota5?: string;
  npmAnggota5?: string;
  prodiAnggota5?: string;
  judulDiusulkan: string;
  bidangPkm: string;
  skemaSdgs: string;
  dosenPendamping: string;
  deskripsiIde: string;
}

export interface Submission {
  id: string;
  namaKetua: string;
  npmKetua: string;
  prodiKetua: string;
  noWhatsappKetua: string;
  judulDiusulkan: string;
  bidangPkm: string;
  dosenPendamping: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewerNotes?: string;
  createdAt: string;
}

export interface SubmissionDetail extends Submission {
  skemaSdgs?: string;
  deskripsiIde?: string;
  namaAnggota1?: string;
  npmAnggota1?: string;
  prodiAnggota1?: string;
  namaAnggota2?: string;
  npmAnggota2?: string;
  prodiAnggota2?: string;
  namaAnggota3?: string;
  npmAnggota3?: string;
  prodiAnggota3?: string;
  namaAnggota4?: string;
  npmAnggota4?: string;
  prodiAnggota4?: string;
  namaAnggota5?: string;
  npmAnggota5?: string;
  prodiAnggota5?: string;
}

export interface SubmissionsResponse {
  success: boolean;
  data: {
    items: Submission[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ========== PUBLIC API (lewat Next.js proxy untuk menghindari CORS) ==========
export async function getLigaPKMOptions(): Promise<OptionsData> {
  const res = await fetch('/api/liga-pkm/options');
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || 'Gagal mengambil data master opsi');
  return json.data;
}

export async function submitRegistration(payload: LigaPKMRegistrationPayload) {
  const res = await fetch('/api/liga-pkm/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || data?.error?.message || 'Gagal mengirim pendaftaran');
  return data;
}

export async function trackRegistrationById(id: string): Promise<{ success: boolean; data: SubmissionDetail }> {
  const res = await fetch(`/api/liga-pkm/track?id=${encodeURIComponent(id.trim())}`);
  const data = await res.json();
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || 'Data pendaftaran dengan ID tersebut tidak ditemukan');
  }
  return data;
}

// ========== ADMIN API (lewat Next.js proxy) ==========
export async function getAdminSubmissions(
  page = 1,
  search = '',
  status = '',
  bidang = ''
): Promise<SubmissionsResponse> {
  const params = new URLSearchParams({ page: String(page), limit: '10' });
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (bidang) params.append('bidang', bidang);
  const res = await fetch(`/api/admin/submissions?${params.toString()}`);
  if (!res.ok) throw new Error('Akses panitia ditolak');
  return res.json();
}

export async function getSubmissionDetail(id: string) {
  const res = await fetch(`/api/admin/submissions/${id}`);
  if (!res.ok) throw new Error('Data tidak ditemukan');
  return res.json();
}

export async function updateSubmissionStatus(
  id: string,
  status: string,
  reviewerNotes: string
) {
  const res = await fetch(`/api/admin/submissions/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, reviewerNotes }),
  });
  if (!res.ok) throw new Error('Gagal update status');
  return res.json();
}

