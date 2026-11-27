import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CopyIdButton } from '@/components/CopyIdButton';
import { BrandLogo } from '@/components/BrandLogo';

export default async function SuksesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-border shadow-xs overflow-hidden pt-0 bg-card">
        <div className="h-1.5 bg-gradient-to-r from-[#0a4da2] to-[#2aa8e8]" />
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-border">
            <BrandLogo size={38} />
            <div>
              <p className="text-xs font-semibold text-foreground">PKM Center UTY</p>
              <p className="font-mono text-[11px] text-muted-foreground">Liga PKM 2026</p>
            </div>
          </div>
          <div className="space-y-2">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
              Pendaftaran Diterima
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tim Berhasil Didaftarkan
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Data tim dan ringkasan proposal Liga PKM UTY 2026 telah tersimpan di sistem.
              Simpan ID pendaftaran berikut sebagai referensi resmi.
            </p>
          </div>

          {id && (
            <div className="bg-background border border-border rounded-lg p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  ID Pendaftaran Resmi
                </p>
                <code className="text-sm font-mono font-semibold text-primary break-all">
                  {id}
                </code>
              </div>
              <CopyIdButton id={id} />
            </div>
          )}

          <div className="border-t border-border pt-5 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Langkah Selanjutnya
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs text-primary font-semibold">01</span>
                <span>Koordinasikan pengajuan proposal dengan dosen pendamping yang dipilih.</span>
              </li>
              <li className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs text-primary font-semibold">02</span>
                <span>Pastikan nomor WhatsApp ketua aktif untuk informasi peninjauan panitia.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {id ? (
              <Link href={`/cek-pendaftaran?id=${encodeURIComponent(id)}`} className="flex-1">
                <Button className="w-full h-10 bg-primary text-primary-foreground hover:bg-[#083d82]">
                  Lihat Data & Status Tim
                </Button>
              </Link>
            ) : (
              <Link href="/cek-pendaftaran" className="flex-1">
                <Button className="w-full h-10 bg-primary text-primary-foreground hover:bg-[#083d82]">
                  Cek Status Pendaftaran
                </Button>
              </Link>
            )}
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full h-10">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
