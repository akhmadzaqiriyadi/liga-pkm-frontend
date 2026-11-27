'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  trackRegistrationById,
  type SubmissionDetail,
} from '@/src/services/ligaPkmService';
import { BrandLogo } from '@/components/BrandLogo';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

function CekPendaftaranContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get('id')?.trim() || '';
  const [inputId, setInputId] = useState(initialId);
  const activeId = initialId;

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['trackRegistration', activeId],
    queryFn: () => trackRegistrationById(activeId),
    enabled: Boolean(activeId),
    staleTime: 60 * 1000,
    retry: false,
  });

  const result = data?.data ?? null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputId.trim();
    if (!trimmed) return;
    router.replace(`/cek-pendaftaran?id=${encodeURIComponent(trimmed)}`);
  };

  const anggotaList = result
    ? [1, 2, 3, 4, 5]
        .map((n) => ({
          no: n,
          nama: result[`namaAnggota${n}` as keyof SubmissionDetail] as string | undefined,
          npm: result[`npmAnggota${n}` as keyof SubmissionDetail] as string | undefined,
          prodi: result[`prodiAnggota${n}` as keyof SubmissionDetail] as string | undefined,
        }))
        .filter((a) => a.nama || a.npm)
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <BrandLogo size={34} />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/daftar">
              <Button size="sm" className="h-9 px-4 bg-primary text-primary-foreground hover:bg-[#083d82]">
                Daftar Tim
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 md:py-12 space-y-8">
        <div className="space-y-2 max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
            Pelacakan Pendaftaran
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Cek Status & Data Pendaftaran Tim
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Masukkan ID Pendaftaran Resmi (UUID) yang Anda dapatkan setelah mengirim formulir
            untuk melihat status peninjauan panitia dan rincian data tim.
          </p>
        </div>

        <Card className="border-border shadow-none bg-card overflow-hidden pt-0">
          <div className="h-1 bg-gradient-to-r from-[#0a4da2] to-[#2aa8e8]" />
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Label htmlFor="reg-id">ID Pendaftaran Resmi</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  id="reg-id"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder="Contoh: 6b47875c-1b55-4461-ba20-92aeee9ff495"
                  className="h-10 bg-background font-mono text-sm flex-1"
                  required
                />
                <Button
                  type="submit"
                  disabled={isFetching}
                  className="h-10 px-6 bg-primary text-primary-foreground hover:bg-[#083d82] font-semibold shrink-0"
                >
                  {isFetching ? 'Mencari...' : 'Cek Pendaftaran'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="border-rose-200 bg-rose-50 text-rose-800">
            <AlertTitle className="font-semibold">Data Tidak Ditemukan</AlertTitle>
            <AlertDescription className="text-rose-700">
              {error instanceof Error
                ? error.message
                : 'Data pendaftaran dengan ID tersebut tidak ditemukan.'}
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-56 w-full rounded-lg" />
          </div>
        )}

        {!isLoading && result && (
          <div className="space-y-6">
            {/* Status Header Card */}
            <Card className="border-border shadow-none bg-card">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      ID Pendaftaran Resmi
                    </p>
                    <code className="font-mono text-sm font-semibold text-primary break-all">
                      {result.id}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={result.status} />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      disabled={isFetching}
                      onClick={() => refetch()}
                    >
                      {isFetching ? 'Memuat...' : 'Segarkan'}
                    </Button>
                  </div>
                </div>

                {result.reviewerNotes && (
                  <div className="bg-secondary/70 border border-border rounded-lg p-4 space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Catatan Reviewer Panitia
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {result.reviewerNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proposal & Pendamping */}
            <Card className="border-border shadow-none bg-card">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base font-semibold">
                  Ringkasan Proposal & Pendampingan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">
                    Judul Usulan
                  </span>
                  <p className="font-semibold text-foreground text-base">
                    {result.judulDiusulkan}
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-0.5">
                      Bidang PKM
                    </span>
                    <span className="font-medium text-foreground">{result.bidangPkm}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-0.5">
                      Skema SDGs
                    </span>
                    <span className="font-medium text-foreground">{result.skemaSdgs || '—'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-0.5">
                      Dosen Pendamping
                    </span>
                    <span className="font-medium text-foreground">{result.dosenPendamping}</span>
                  </div>
                </div>
                {result.deskripsiIde && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground block mb-1">
                      Deskripsi Ide / Latar Belakang
                    </span>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {result.deskripsiIde}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ketua & Anggota */}
            <Card className="border-border shadow-none bg-card">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base font-semibold">
                  Susunan Tim Pengusul
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4 text-sm">
                <div className="p-4 rounded-lg border border-primary/20 bg-accent/40 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Ketua Tim
                  </span>
                  <p className="font-semibold text-foreground">{result.namaKetua}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    NPM: {result.npmKetua} · {result.prodiKetua} · WA: {result.noWhatsappKetua}
                  </p>
                </div>

                {anggotaList.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {anggotaList.map((a) => (
                      <div
                        key={a.no}
                        className="p-3.5 rounded-lg border border-border bg-background space-y-1"
                      >
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Anggota {a.no}
                        </span>
                        <p className="font-semibold text-foreground">{a.nama || '—'}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {a.npm || '—'} · {a.prodi || '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CekPendaftaranPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-6 max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      }
    >
      <CekPendaftaranContent />
    </Suspense>
  );
}
