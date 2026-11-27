'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  keepPreviousData,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getAdminSubmissions,
  updateSubmissionStatus,
  type Submission,
  type SubmissionsResponse,
} from '@/src/services/ligaPkmService';
import { StatusBadge } from '@/components/StatusBadge';
import { BrandLogo } from '@/components/BrandLogo';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const STATUS_FILTER_LABELS: Record<string, string> = {
  all: 'Semua Status',
  pending: 'Menunggu',
  reviewed: 'Ditinjau',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

const BIDANG_OPTIONS = [
  'Kewirausahaan',
  'Pengabdian Masyarakat',
  'Riset Sosial Humaniora',
  'Riset Eksakta',
  'Penerapan IPTEK',
  'Karsa Cipta',
  'Karya Inovatif',
  'Video Gagasan Konstruktif',
  'Artikel Ilmiah',
  'Gagasan Futuristik Tertulis',
];

const BidangFilterItems = memo(function BidangFilterItems() {
  return (
    <>
      <SelectItem value="all">Semua Bidang</SelectItem>
      {BIDANG_OPTIONS.map((b) => (
        <SelectItem key={b} value={b}>
          {b}
        </SelectItem>
      ))}
    </>
  );
});

interface SubmissionDetail extends Submission {
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

const SubmissionDesktopRow = memo(function SubmissionDesktopRow({
  item,
  onOpenDetail,
}: {
  item: Submission;
  onOpenDetail: (item: Submission) => void;
}) {
  return (
    <TableRow className="hover:bg-background/50">
      <TableCell>
        <div className="font-medium text-foreground">{item.namaKetua}</div>
        <div className="font-mono text-xs text-muted-foreground">
          {item.npmKetua}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {item.prodiKetua}
      </TableCell>
      <TableCell className="max-w-xs truncate text-sm text-foreground">
        {item.judulDiusulkan}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs font-normal bg-background">
          {item.bidangPkm}
        </Badge>
      </TableCell>
      <TableCell>
        <StatusBadge status={item.status} />
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
        {new Date(item.createdAt).toLocaleDateString('id-ID')}
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs"
          onClick={() => onOpenDetail(item)}
        >
          Detail
        </Button>
      </TableCell>
    </TableRow>
  );
});

const SubmissionMobileCard = memo(function SubmissionMobileCard({
  item,
  onOpenDetail,
}: {
  item: Submission;
  onOpenDetail: (item: Submission) => void;
}) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-foreground truncate">
            {item.namaKetua}
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {item.npmKetua} · {item.prodiKetua}
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-sm text-foreground font-medium line-clamp-2">
        {item.judulDiusulkan}
      </p>
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant="outline" className="text-xs font-normal bg-background truncate">
            {item.bidangPkm}
          </Badge>
          <span className="font-mono text-xs text-muted-foreground shrink-0">
            {new Date(item.createdAt).toLocaleDateString('id-ID')}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs shrink-0"
          onClick={() => onOpenDetail(item)}
        >
          Detail
        </Button>
      </div>
    </div>
  );
});

const PAGE_SIZE = 10;

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [bidangFilter, setBidangFilter] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const queryKey = useMemo(
    () => ['submissions', page, search, statusFilter, bidangFilter] as const,
    [page, search, statusFilter, bidangFilter]
  );

  // Fetch 10 items per page so each payload stays light; keepPreviousData prevents UI flicker
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => getAdminSubmissions(page, search, statusFilter, bidangFilter, PAGE_SIZE),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: string;
      notes: string;
    }) => updateSubmissionStatus(id, status, notes),
    onSuccess: (_res, variables) => {
      queryClient.setQueryData<SubmissionsResponse>(queryKey, (old) => {
        if (!old?.data?.items) return old;
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((item) =>
              item.id === variables.id
                ? {
                    ...item,
                    status: variables.status as Submission['status'],
                    reviewerNotes: variables.notes,
                  }
                : item
            ),
          },
        };
      });
    },
  });

  const items = useMemo(() => data?.data?.items ?? [], [data]);
  const total = data?.data?.total ?? 0;
  const totalPages = Math.max(1, data?.data?.totalPages ?? 1);
  const safePage = Math.min(page, totalPages);

  // Prefetch next page in background so pagination feels instant
  useEffect(() => {
    if (safePage < totalPages) {
      const nextPage = safePage + 1;
      queryClient.prefetchQuery({
        queryKey: ['submissions', nextPage, search, statusFilter, bidangFilter],
        queryFn: () => getAdminSubmissions(nextPage, search, statusFilter, bidangFilter, PAGE_SIZE),
        staleTime: 60 * 1000,
      });
    }
  }, [safePage, totalPages, search, statusFilter, bidangFilter, queryClient]);

  const pendingCount = useMemo(
    () => items.filter((i) => i.status === 'pending').length,
    [items]
  );
  const reviewedCount = useMemo(
    () => items.filter((i) => i.status === 'reviewed').length,
    [items]
  );
  const approvedCount = useMemo(
    () => items.filter((i) => i.status === 'approved').length,
    [items]
  );

  const hasActiveFilters = Boolean(searchInput || search || statusFilter || bidangFilter);

  const handleResetFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatusFilter('');
    setBidangFilter('');
    setPage(1);
  };

  const resetUpdateMutation = updateMutation.reset;
  const handleOpenDetail = useCallback((item: Submission) => {
    setSelectedId(item.id);
    setNewStatus(item.status);
    setReviewNotes(item.reviewerNotes ?? '');
    resetUpdateMutation();
  }, [resetUpdateMutation]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const detailData: SubmissionDetail | undefined = useMemo(
    () =>
      selectedId
        ? (items.find((i) => i.id === selectedId) as SubmissionDetail | undefined)
        : undefined,
    [items, selectedId]
  );
  const anggotaList = detailData
    ? [
      { nama: detailData.namaAnggota1, npm: detailData.npmAnggota1, prodi: detailData.prodiAnggota1 },
      { nama: detailData.namaAnggota2, npm: detailData.npmAnggota2, prodi: detailData.prodiAnggota2 },
      { nama: detailData.namaAnggota3, npm: detailData.npmAnggota3, prodi: detailData.prodiAnggota3 },
      { nama: detailData.namaAnggota4, npm: detailData.npmAnggota4, prodi: detailData.prodiAnggota4 },
      { nama: detailData.namaAnggota5, npm: detailData.npmAnggota5, prodi: detailData.prodiAnggota5 },
    ].filter((a) => Boolean(a.nama))
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <BrandLogo size={36} />
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate">
                        Panel Panitia
                      </span>
                        <span className="hidden sm:inline-block font-mono text-xs text-primary bg-accent px-2 py-0.5 rounded border border-primary/15 shrink-0">
                          Liga PKM 2026
                        </span>
                    </div>
                </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 px-2.5 sm:px-3.5 text-xs sm:text-sm bg-card"
                      disabled={isFetching}
                      onClick={() => refetch()}
                    >
                      {isFetching ? 'Memuat...' : 'Muat Ulang'}
                    </Button>
                    <a href="/api/admin/export" download="rekap-liga-pkm.csv">
                        <Button variant="outline" size="sm" className="h-9 px-2.5 sm:px-3.5 text-xs sm:text-sm bg-card">
                          Export CSV
                        </Button>
                    </a>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-9 px-2.5 sm:px-3.5 text-xs sm:text-sm"
                      onClick={handleLogout}
                    >
                      Keluar
                    </Button>
                  </div>
                </div>
              </header>

              <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-6">
                {/* Heading & KPI Strip */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      Daftar Pengajuan Tim
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Kelola data pendaftaran, tinjau proposal, dan perbarui status verifikasi tim.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-xs font-medium text-muted-foreground">Total Pendaftar</p>
                      <p className="font-mono text-2xl font-bold text-foreground mt-1 tabular-nums">
                        {total}
                      </p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-xs font-medium text-muted-foreground">Menunggu (Hal. Ini)</p>
                      <p className="font-mono text-2xl font-bold text-amber-700 mt-1 tabular-nums">
                        {pendingCount}
                      </p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-xs font-medium text-muted-foreground">Ditinjau (Hal. Ini)</p>
                      <p className="font-mono text-2xl font-bold text-sky-700 mt-1 tabular-nums">
                        {reviewedCount}
                      </p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-xs font-medium text-muted-foreground">Disetujui (Hal. Ini)</p>
                      <p className="font-mono text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
                        {approvedCount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <Card className="border-border shadow-none bg-card py-0">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-5 min-w-0">
                        <Input
                          className="h-10 bg-background"
                          placeholder="Cari nama ketua, NPM, judul, atau dosen..."
                          value={searchInput}
                          onChange={(e) => {
                            setSearchInput(e.target.value);
                            setPage(1);
                          }}
                        />
                      </div>
                      <div className="md:col-span-3 min-w-0">
                        <Select
                          value={statusFilter || 'all'}
                          onValueChange={(v: string | null) => {
                            setStatusFilter(v === 'all' ? '' : (v ?? ''));
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="w-full h-10 bg-background">
                            <SelectValue placeholder="Semua Status">
                              {STATUS_FILTER_LABELS[statusFilter || 'all']}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Menunggu</SelectItem>
                            <SelectItem value="reviewed">Ditinjau</SelectItem>
                            <SelectItem value="approved">Disetujui</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-4 min-w-0 flex gap-2">
                        <Select
                          value={bidangFilter || 'all'}
                          onValueChange={(v: string | null) => {
                            setBidangFilter(v === 'all' ? '' : (v ?? ''));
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="w-full h-10 bg-background">
                            <SelectValue placeholder="Semua Bidang">
                              {bidangFilter || 'Semua Bidang'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <BidangFilterItems />
                          </SelectContent>
                        </Select>
                        {hasActiveFilters && (
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 px-3 shrink-0"
                            onClick={handleResetFilters}
                          >
                            Reset
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Table / Error / Loading */}
                <Card className="border-border shadow-none overflow-hidden bg-card py-0">
                  <CardContent className="p-0">
                    {isError ? (
                      <div className="p-10 text-center space-y-3">
                        <p className="text-sm font-semibold text-foreground">
                          Gagal Mengambil Data Pendaftar
                        </p>
                        <p className="text-xs text-muted-foreground max-w-md mx-auto">
                          Terjadi gangguan saat menghubungi server. Silakan muat ulang data atau periksa
                          sesi login Anda.
                        </p>
                        <Button size="sm" variant="outline" onClick={() => refetch()}>
                          Coba Lagi
                        </Button>
                      </div>
                    ) : isLoading ? (
                      <div className="p-6 space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-11 w-full" />
                        ))}
                      </div>
                    ) : (
                                    <>
                                      {/* Mobile Card List (< md) */}
                                      <div className="md:hidden divide-y divide-border">
                                        {items.length === 0 ? (
                                          <div className="text-center py-12 px-4 text-sm text-muted-foreground">
                                            {hasActiveFilters
                                              ? 'Tidak ada pendaftar yang sesuai dengan filter.'
                                              : 'Belum ada data pendaftar.'}
                                          </div>
                                        ) : (
                                          items.map((item: Submission) => (
                                            <SubmissionMobileCard
                                              key={item.id}
                                              item={item}
                                              onOpenDetail={handleOpenDetail}
                                            />
                                          ))
                                        )}
                                      </div>

                                      {/* Tablet & Desktop Table (md+) */}
                                      <div className="hidden md:block overflow-x-auto">
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="bg-background/60 hover:bg-background/60">
                                              <TableHead className="font-semibold text-foreground">Ketua Tim</TableHead>
                                              <TableHead className="font-semibold text-foreground">Prodi</TableHead>
                                              <TableHead className="font-semibold text-foreground">Judul Proposal</TableHead>
                                              <TableHead className="font-semibold text-foreground">Bidang PKM</TableHead>
                                              <TableHead className="font-semibold text-foreground">Status</TableHead>
                                              <TableHead className="font-semibold text-foreground">Tanggal</TableHead>
                                              <TableHead className="text-right font-semibold text-foreground">Aksi</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {items.length === 0 ? (
                                              <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                                  {hasActiveFilters
                                                    ? 'Tidak ada pendaftar yang sesuai dengan filter.'
                                                    : 'Belum ada data pendaftar.'}
                                                </TableCell>
                                              </TableRow>
                                      ) : (
                        items.map((item: Submission) => (
                                      <SubmissionDesktopRow
                                        key={item.id}
                                        item={item}
                                        onOpenDetail={handleOpenDetail}
                                      />
                                      ))
                      )}
                                    </TableBody>
                                  </Table>
                                </div>
              </>
            )}
                        </CardContent>
                      </Card>

        {/* Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
                      <span className="text-muted-foreground">
                        Halaman <strong className="font-mono text-foreground">{safePage}</strong> dari{' '}
                        <strong className="font-mono text-foreground">{totalPages}</strong>
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-card"
                          disabled={safePage <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          Sebelumnya
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-card"
                          disabled={safePage >= totalPages}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                          Selanjutnya
                        </Button>
                      </div>
                    </div>

                    {/* Detail Dialog */}
                    <Dialog
                      open={!!selectedId}
                      onOpenChange={(open) => {
                        if (!open) {
                          setSelectedId(null);
                        }
                      }}
                    >
                        <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
                          <DialogHeader className="border-b border-border pb-3">
                            <DialogTitle className="text-lg font-bold text-foreground">
                              Detail Pendaftaran Tim
                            </DialogTitle>
                          </DialogHeader>

                          {detailData ? (
                            <div className="space-y-4 text-sm pt-1">
                              <div className="flex flex-wrap items-center justify-between gap-2 bg-background border border-border rounded-lg px-4 py-3">
                                <div>
                                  <span className="text-xs text-muted-foreground block">ID Pendaftaran</span>
                                  <code className="font-mono text-xs text-foreground">{detailData.id}</code>
                                </div>
                                <StatusBadge status={detailData.status} />
                              </div>

                              <Card className="border-border shadow-none bg-background/50">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Data Ketua Tim
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="grid sm:grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-xs text-muted-foreground block">Nama</span>
                                    <span className="font-medium text-foreground">{detailData.namaKetua}</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground block">NPM</span>
                                    <span className="font-mono text-foreground">{detailData.npmKetua}</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground block">Program Studi</span>
                                    <span className="text-foreground">{detailData.prodiKetua}</span>
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground block">WhatsApp</span>
                                    <span className="font-mono text-foreground">
                                      {detailData.noWhatsappKetua}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>

                              {anggotaList.length > 0 && (
                                <Card className="border-border shadow-none bg-background/50">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                      Anggota Tim ({anggotaList.length})
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="divide-y divide-border">
                                    {anggotaList.map((a, idx) => (
                                      <div key={idx} className="py-2 first:pt-0 last:pb-0 flex justify-between gap-3">
                                        <div>
                                          <span className="font-medium text-foreground">{a.nama}</span>
                                          <span className="text-xs text-muted-foreground block">{a.prodi}</span>
                                        </div>
                                        <span className="font-mono text-xs text-muted-foreground shrink-0">
                                          {a.npm}
                                        </span>
                                      </div>
                                    ))}
                                  </CardContent>
                                </Card>
                              )}

                              <Card className="border-border shadow-none bg-background/50">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Data Proposal
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2.5 text-sm">
                                  <div>
                                    <span className="text-xs text-muted-foreground block">Judul Usulan</span>
                                    <span className="font-semibold text-foreground">
                                      {detailData.judulDiusulkan}
                                    </span>
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-2">
                                    <div>
                                      <span className="text-xs text-muted-foreground block">Bidang PKM</span>
                                      <span className="text-foreground">{detailData.bidangPkm}</span>
                                    </div>
                                    {detailData.skemaSdgs && (
                                      <div>
                                        <span className="text-xs text-muted-foreground block">Skema SDGs</span>
                                        <span className="text-foreground">{detailData.skemaSdgs}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-xs text-muted-foreground block">Dosen Pendamping</span>
                                    <span className="text-foreground">{detailData.dosenPendamping}</span>
                                  </div>
                                  {detailData.deskripsiIde && (
                                    <div>
                                      <span className="text-xs text-muted-foreground block mb-1">
                                        Deskripsi Ide
                                      </span>
                                      <p className="text-muted-foreground bg-card p-3 rounded-md border border-border leading-relaxed whitespace-pre-line">
                                        {detailData.deskripsiIde}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              {detailData.reviewerNotes && (
                                <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5">
                                  <p className="text-xs text-sky-800 mb-1 font-semibold">
                                    Catatan Reviewer Sebelumnya
                                  </p>
                                  <p className="text-slate-700 leading-relaxed">{detailData.reviewerNotes}</p>
                                </div>
                              )}

                              <Card className="border-border shadow-none bg-card">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-semibold text-foreground">
                                    Perbarui Status Peninjauan
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="space-y-1.5">
                                    <Label className="text-xs">Status Baru</Label>
                                    <Select
                                      value={newStatus}
                                      onValueChange={(v: string | null) => setNewStatus(v ?? '')}
                                    >
                                      <SelectTrigger className="w-full h-10 bg-background">
                                        <SelectValue placeholder="Pilih status baru">
                                          {newStatus ? STATUS_FILTER_LABELS[newStatus] : 'Pilih status baru'}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Menunggu</SelectItem>
                                        <SelectItem value="reviewed">Ditinjau</SelectItem>
                                        <SelectItem value="approved">Disetujui</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label className="text-xs">Catatan Reviewer</Label>
                                    <Textarea
                                      className="bg-background"
                                      placeholder="Tambahkan catatan evaluasi untuk peserta..."
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                  {updateMutation.isError && (
                                    <p className="text-xs text-rose-600">
                                      Gagal memperbarui status. Silakan coba lagi.
                                    </p>
                                  )}
                                  {updateMutation.isSuccess && (
                                    <p className="text-xs text-emerald-700">
                                      Status dan catatan berhasil disimpan.
                                    </p>
                                  )}
                                  <Button
                                    className="w-full h-10 bg-primary text-primary-foreground hover:bg-[#083d82] font-semibold"
                                    disabled={!newStatus || updateMutation.isPending}
                                    onClick={() => {
                                      if (selectedId && newStatus) {
                                        updateMutation.mutate({
                                          id: selectedId,
                                          status: newStatus,
                                          notes: reviewNotes,
                                        });
                                      }
                                    }}
                                  >
                                    {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                                  </Button>
                                </CardContent>
                              </Card>
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center py-8">Data tidak tersedia.</p>
                          )}
                        </DialogContent>
                    </Dialog>
                  </main>
                </div>
                );
}
