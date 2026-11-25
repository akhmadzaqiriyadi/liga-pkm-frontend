'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getLigaPKMOptions,
  submitRegistration,
  LigaPKMRegistrationPayload,
} from '@/src/services/ligaPkmService';
import { FALLBACK_OPTIONS } from '@/src/data/fallbackOptions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { BrandLogo } from '@/components/BrandLogo';

function RequiredMark() {
  return <span className="text-red-500 font-semibold ml-0.5">*</span>;
}

const SDG_OPTIONS = [
  'SDG 1: Tanpa Kemiskinan',
  'SDG 2: Tanpa Kelaparan',
  'SDG 3: Kehidupan Sehat dan Sejahtera',
  'SDG 4: Pendidikan Berkualitas',
  'SDG 5: Kesetaraan Gender',
  'SDG 6: Air Bersih dan Sanitasi Layak',
  'SDG 7: Energi Bersih dan Terjangkau',
  'SDG 8: Pekerjaan Layak dan Pertumbuhan Ekonomi',
  'SDG 9: Industri, Inovasi dan Infrastruktur',
  'SDG 10: Berkurangnya Kesenjangan',
  'SDG 11: Kota dan Permukiman yang Berkelanjutan',
  'SDG 12: Konsumsi dan Produksi yang Bertanggung Jawab',
  'SDG 13: Penanganan Perubahan Iklim',
  'SDG 14: Ekosistem Lautan',
  'SDG 15: Ekosistem Daratan',
  'SDG 16: Perdamaian, Keadilan dan Kelembagaan yang Tangguh',
  'SDG 17: Kemitraan untuk Mencapai Tujuan',
];

const defaultAnggota = { nama: '', npm: '', prodi: '' };
const MANUAL_DOSEN_VALUE = '__manual__';

export default function DaftarPage() {
  const router = useRouter();
  const [extraAnggota, setExtraAnggota] = useState(0);
  const [manualDosen, setManualDosen] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    namaKetua: '',
    npmKetua: '',
    prodiKetua: '',
    noWhatsappKetua: '',
    anggota: [
      { ...defaultAnggota },
      { ...defaultAnggota },
      { ...defaultAnggota },
      { ...defaultAnggota },
      { ...defaultAnggota },
    ],
    judulDiusulkan: '',
    bidangPkm: '',
    skemaSdgs: '',
    dosenPendamping: '',
    deskripsiIde: '',
  });

  const {
    data: options,
    isLoading: loadingOptions,
  } = useQuery({
    queryKey: ['ligaPKMOptions'],
    queryFn: getLigaPKMOptions,
  });

  const mutation = useMutation({
    mutationFn: submitRegistration,
    onSuccess: (data) => {
      router.push(`/daftar/sukses?id=${data.data.id}`);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const setField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setAnggota = (index: number, field: string, value: string) =>
    setForm((prev) => {
      const updated = [...prev.anggota];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, anggota: updated };
    });

  const handleRemoveExtraAnggota = () => {
    if (extraAnggota <= 0) return;
    const removeIdx = 3 + extraAnggota - 1;
    setForm((prev) => {
      const updated = [...prev.anggota];
      updated[removeIdx] = { ...defaultAnggota };
      return { ...prev, anggota: updated };
    });
    setExtraAnggota((e) => e - 1);
    setConfirmRemoveOpen(false);
  };

  const isDirty =
    !mutation.isSuccess &&
    (Boolean(form.namaKetua) ||
      Boolean(form.npmKetua) ||
      Boolean(form.prodiKetua) ||
      Boolean(form.noWhatsappKetua) ||
      Boolean(form.judulDiusulkan) ||
      Boolean(form.bidangPkm) ||
      Boolean(form.skemaSdgs) ||
      Boolean(form.dosenPendamping) ||
      Boolean(form.deskripsiIde) ||
      form.anggota.some((a) => Boolean(a.nama || a.npm || a.prodi)));

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleBackClick = () => {
    if (isDirty) {
      setConfirmLeaveOpen(true);
    } else {
      router.push('/');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload: LigaPKMRegistrationPayload = {
      namaKetua: form.namaKetua.trim(),
      npmKetua: form.npmKetua.trim(),
      prodiKetua: form.prodiKetua,
      noWhatsappKetua: form.noWhatsappKetua.trim(),
      namaAnggota1: form.anggota[0].nama.trim(),
      npmAnggota1: form.anggota[0].npm.trim(),
      prodiAnggota1: form.anggota[0].prodi,
      namaAnggota2: form.anggota[1].nama.trim(),
      npmAnggota2: form.anggota[1].npm.trim(),
      prodiAnggota2: form.anggota[1].prodi,
      namaAnggota3: form.anggota[2].nama.trim(),
      npmAnggota3: form.anggota[2].npm.trim(),
      prodiAnggota3: form.anggota[2].prodi,
      namaAnggota4: form.anggota[3].nama.trim() || undefined,
      npmAnggota4: form.anggota[3].npm.trim() || undefined,
      prodiAnggota4: form.anggota[3].prodi || undefined,
      namaAnggota5: form.anggota[4].nama.trim() || undefined,
      npmAnggota5: form.anggota[4].npm.trim() || undefined,
      prodiAnggota5: form.anggota[4].prodi || undefined,
      judulDiusulkan: form.judulDiusulkan.trim(),
      bidangPkm: form.bidangPkm,
      skemaSdgs: form.skemaSdgs,
      dosenPendamping: form.dosenPendamping,
      deskripsiIde: form.deskripsiIde.trim(),
    };
    mutation.mutate(payload);
  };

  const ketuaComplete =
    Boolean(form.namaKetua.trim()) &&
    form.npmKetua.trim().length >= 8 &&
    Boolean(form.prodiKetua) &&
    Boolean(form.noWhatsappKetua.trim());

  const anggotaComplete = [0, 1, 2].every(
    (idx) =>
      Boolean(form.anggota[idx].nama.trim()) &&
      Boolean(form.anggota[idx].npm.trim()) &&
      Boolean(form.anggota[idx].prodi)
  );

  const proposalComplete =
    Boolean(form.judulDiusulkan.trim()) &&
    Boolean(form.bidangPkm) &&
    Boolean(form.skemaSdgs) &&
    Boolean(form.dosenPendamping) &&
    Boolean(form.deskripsiIde.trim());

  const totalAnggota = 3 + extraAnggota;
  const prodiList = options?.prodi?.length ? options.prodi : FALLBACK_OPTIONS.prodi;
  const bidangList = options?.bidangPkm?.length
    ? options.bidangPkm
    : FALLBACK_OPTIONS.bidangPkm;
  const dosenList = options?.dosenPendamping?.length
    ? options.dosenPendamping
    : FALLBACK_OPTIONS.dosenPendamping;

  if (loadingOptions) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card h-16" />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
          <Skeleton className="h-9 w-80 mb-3" />
          <Skeleton className="h-5 w-96 mb-8" />
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-56 w-full rounded-lg" />
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex items-center gap-2.5 sm:gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-w-0"
          >
            <BrandLogo size={34} />
            <span className="truncate">
              <span className="hidden sm:inline">Kembali ke Beranda</span>
              <span className="sm:hidden">Beranda</span>
            </span>
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs sm:text-sm font-semibold text-foreground">
              Formulir Pendaftaran
            </span>
            <span className="font-mono text-xs text-primary bg-accent px-2 py-0.5 rounded border border-primary/15">
              2026
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 md:py-12">
        <div className="mb-8 max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary mb-2">
            Registrasi Tim Baru
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Pendaftaran Liga PKM UTY 2026
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Lengkapi seluruh kolom bertanda wajib (<RequiredMark />). Ketua tim dan minimal 3 anggota wajib
            diisi sebelum mengirim pendaftaran.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Main Form Column */}
            <div className="lg:col-span-8 min-w-0 space-y-6">
              {error && (
                <Alert variant="destructive" className="border-rose-200 bg-rose-50 text-rose-800">
                  <AlertTitle className="font-semibold">Pendaftaran Gagal Dikirim</AlertTitle>
                  <AlertDescription className="text-rose-700">{error}</AlertDescription>
                  <AlertAction>
                    <button
                      type="button"
                      onClick={() => setError('')}
                      className="text-xs font-medium text-rose-700 hover:text-rose-900"
                    >
                      Tutup
                    </button>
                  </AlertAction>
                </Alert>
              )}

              {/* SECTION 01: Data Ketua */}
              <Card className="border-border shadow-none bg-card">
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                      <span className="font-mono text-xs text-primary mr-2">01</span>
                      Data Ketua Tim
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">Wajib diisi</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="namaKetua">
                        Nama Lengkap Ketua <RequiredMark />
                      </Label>
                      <Input
                        id="namaKetua"
                        className="h-10 bg-background"
                        placeholder="Sesuai KTM"
                        required
                        value={form.namaKetua}
                        onChange={(e) => setField('namaKetua', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="npmKetua">
                        NPM Ketua <RequiredMark />
                      </Label>
                      <Input
                        id="npmKetua"
                        className="h-10 bg-background font-mono"
                        placeholder="Minimal 8 digit"
                        required
                        minLength={8}
                        value={form.npmKetua}
                        onChange={(e) => setField('npmKetua', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>
                        Program Studi <RequiredMark />
                      </Label>
                      <Select
                        required
                        value={form.prodiKetua}
                        onValueChange={(v: string | null) => setField('prodiKetua', v ?? '')}
                      >
                        <SelectTrigger className="w-full h-10 bg-background">
                          <SelectValue placeholder="Pilih Program Studi" />
                        </SelectTrigger>
                        <SelectContent>
                          {prodiList.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="waKetua">
                        No. WhatsApp Aktif <RequiredMark />
                      </Label>
                      <Input
                        id="waKetua"
                        className="h-10 bg-background font-mono"
                        placeholder="081234567890"
                        required
                        value={form.noWhatsappKetua}
                        onChange={(e) => setField('noWhatsappKetua', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION 02: Data Anggota */}
              <Card className="border-border shadow-none bg-card">
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                      <span className="font-mono text-xs text-primary mr-2">02</span>
                      Data Anggota Tim
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {totalAnggota} dari 5 slot aktif
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {[...Array(totalAnggota)].map((_, i) => (
                    <div
                      key={i}
                      className="border border-border rounded-lg p-4 space-y-3 bg-background"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-foreground">
                          Anggota {i + 1}{' '}
                          {i < 3 ? (
                            <RequiredMark />
                          ) : (
                            <span className="text-xs font-normal text-muted-foreground ml-1">
                              (Opsional)
                            </span>
                          )}
                        </p>
                        {i >= 3 && i === totalAnggota - 1 && (
                          <button
                            type="button"
                            onClick={() => setConfirmRemoveOpen(true)}
                            className="text-xs font-medium text-red-600 hover:text-red-800"
                          >
                            Hapus Anggota {i + 1}
                          </button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">
                            Nama Lengkap{i < 3 && <RequiredMark />}
                          </Label>
                          <Input
                            className="h-9 bg-card"
                            placeholder="Nama lengkap"
                            required={i < 3}
                            value={form.anggota[i].nama}
                            onChange={(e) => setAnggota(i, 'nama', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">
                            NPM{i < 3 && <RequiredMark />}
                          </Label>
                          <Input
                            className="h-9 bg-card font-mono"
                            placeholder="NPM"
                            required={i < 3}
                            value={form.anggota[i].npm}
                            onChange={(e) => setAnggota(i, 'npm', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">
                            Program Studi{i < 3 && <RequiredMark />}
                          </Label>
                          <Select
                            required={i < 3}
                            value={form.anggota[i].prodi}
                            onValueChange={(v: string | null) =>
                              setAnggota(i, 'prodi', v ?? '')
                            }
                          >
                            <SelectTrigger className="w-full h-9 bg-card">
                              <SelectValue placeholder="Pilih Prodi" />
                            </SelectTrigger>
                            <SelectContent>
                              {prodiList.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {extraAnggota < 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-10 border-dashed bg-background hover:bg-secondary text-foreground"
                      onClick={() => setExtraAnggota((e) => e + 1)}
                    >
                      Tambah Anggota Opsional (Anggota {3 + extraAnggota + 1} dari 5)
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* SECTION 03: Data Proposal */}
              <Card className="border-border shadow-none bg-card">
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-semibold text-foreground">
                      <span className="font-mono text-xs text-primary mr-2">03</span>
                      Data Proposal & Pendampingan
                    </CardTitle>
                    <span className="text-xs text-muted-foreground">Wajib diisi</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="judul">
                      Judul Usulan <RequiredMark />
                    </Label>
                    <Input
                      id="judul"
                      className="h-10 bg-background"
                      placeholder="Tuliskan judul proposal PKM yang diusulkan"
                      required
                      value={form.judulDiusulkan}
                      onChange={(e) => setField('judulDiusulkan', e.target.value)}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>
                        Bidang PKM <RequiredMark />
                      </Label>
                      <Select
                        required
                        value={form.bidangPkm}
                        onValueChange={(v: string | null) => setField('bidangPkm', v ?? '')}
                      >
                        <SelectTrigger className="w-full h-10 bg-background">
                          <SelectValue placeholder="Pilih Bidang PKM" />
                        </SelectTrigger>
                        <SelectContent>
                          {bidangList.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>
                        Skema SDGs <RequiredMark />
                      </Label>
                      <Select
                        required
                        value={form.skemaSdgs}
                        onValueChange={(v: string | null) => setField('skemaSdgs', v ?? '')}
                      >
                        <SelectTrigger className="w-full h-10 bg-background">
                          <SelectValue placeholder="Pilih Target SDGs" />
                        </SelectTrigger>
                        <SelectContent>
                          {SDG_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label>
                        Dosen Pendamping <RequiredMark />
                      </Label>
                      {manualDosen && (
                        <button
                          type="button"
                          onClick={() => {
                            setManualDosen(false);
                            setField('dosenPendamping', '');
                          }}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Pilih dari Daftar
                        </button>
                      )}
                    </div>
                    {manualDosen ? (
                      <Input
                        className="h-10 bg-background"
                        placeholder="Ketik nama lengkap dosen pendamping"
                        required
                        value={form.dosenPendamping}
                        onChange={(e) => setField('dosenPendamping', e.target.value)}
                      />
                    ) : (
                      <Select
                        required
                        value={form.dosenPendamping}
                        onValueChange={(v: string | null) => {
                          if (v === MANUAL_DOSEN_VALUE) {
                            setManualDosen(true);
                            setField('dosenPendamping', '');
                          } else {
                            setField('dosenPendamping', v ?? '');
                          }
                        }}
                      >
                        <SelectTrigger className="w-full h-10 bg-background">
                          <SelectValue placeholder="Pilih Dosen Pendamping" />
                        </SelectTrigger>
                        <SelectContent>
                          {dosenList.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                          <SelectItem value={MANUAL_DOSEN_VALUE}>
                            Dosen Lainnya (Ketik Manual)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="deskripsi">
                        Deskripsi Ide / Latar Belakang <RequiredMark />
                      </Label>
                      <span className="font-mono text-xs text-muted-foreground">
                        {form.deskripsiIde.length} karakter
                      </span>
                    </div>
                    <Textarea
                      id="deskripsi"
                      className="bg-background min-h-32"
                      placeholder="Jelaskan secara ringkas latar belakang masalah, tujuan, serta solusi inovatif yang ditawarkan tim..."
                      required
                      rows={5}
                      value={form.deskripsiIde}
                      onChange={(e) => setField('deskripsiIde', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="lg:hidden">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-[#083d82]"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}
                </Button>
              </div>
            </div>

            {/* Sticky Sidebar Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <Card className="border-border shadow-none bg-card overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-[#0a4da2] to-[#2aa8e8]" />
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Ringkasan Pengisian
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-sm">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">01. Data Ketua</span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          ketuaComplete
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {ketuaComplete ? 'Lengkap' : 'Belum lengkap'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">02. Anggota Wajib (1–3)</span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          anggotaComplete
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {anggotaComplete ? 'Lengkap' : 'Belum lengkap'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">03. Data Proposal</span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          proposalComplete
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {proposalComplete ? 'Lengkap' : 'Belum lengkap'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block">Ketua Pengusul</span>
                      <span className="font-medium text-foreground">
                        {form.namaKetua.trim() || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Bidang PKM</span>
                      <span className="font-medium text-foreground">
                        {form.bidangPkm || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Dosen Pendamping</span>
                      <span className="font-medium text-foreground">
                        {form.dosenPendamping || '—'}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="hidden lg:flex w-full h-11 text-sm font-semibold bg-primary text-primary-foreground hover:bg-[#083d82]"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran'}
                  </Button>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Periksa kembali NPM dan nomor WhatsApp aktif sebelum mengirim formulir.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </div>
        </form>
      </main>

      {/* AlertDialog Konfirmasi Keluar dari Form */}
      <AlertDialog open={confirmLeaveOpen} onOpenChange={setConfirmLeaveOpen}>
        <AlertDialogContent className="w-[calc(100vw-2rem)] sm:max-w-md bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              Yakin ingin keluar dari formulir?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Data yang sudah Anda isi akan hilang karena belum dikirim. Anda yakin ingin
              kembali ke beranda?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmLeaveOpen(false)}>
              Lanjut Mengisi
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => router.push('/')}
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog Konfirmasi Hapus Anggota Opsional */}
      <AlertDialog open={confirmRemoveOpen} onOpenChange={setConfirmRemoveOpen}>
        <AlertDialogContent className="w-[calc(100vw-2rem)] sm:max-w-md bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              Yakin ingin menghapus Anggota {totalAnggota}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Seluruh data yang sudah diisi pada slot Anggota {totalAnggota} akan dihapus dari
              formulir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmRemoveOpen(false)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleRemoveExtraAnggota}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
