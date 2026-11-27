'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { getLigaPKMOptions } from '@/src/services/ligaPkmService';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';
import { LandingHeader } from '@/components/LandingHeader';
import { HeroBannerBackground } from '@/components/HeroBannerSlideshow';
import { GsapPageScope } from '@/components/GsapMotion';

const ALUR_STEPS = [
  {
    step: '01',
    title: 'Bentuk Tim Lintas Prodi',
    desc: 'Tentukan 1 ketua pengusul dan minimal 3 anggota tim (maksimal 5 anggota) dari 24 program studi di lingkungan UTY.',
  },
  {
    step: '02',
    title: 'Tentukan Bidang & SDGs',
    desc: 'Pilih salah satu dari 10 bidang PKM yang paling sesuai dengan gagasan tim dan kaitkan dengan target SDGs terkait.',
  },
  {
    step: '03',
    title: 'Lengkapi Proposal & Dosen',
    desc: 'Pilih 1 dosen pendamping dari daftar resmi UTY, tulis ringkasan ide, lalu kirim pendaftaran untuk ditinjau panitia.',
  },
];

const KETENTUAN_LIST = [
  {
    label: 'Ketua Tim',
    tag: 'Wajib',
    detail: '1 mahasiswa aktif pengusul utama. Melampirkan nama lengkap, NPM (minimal 8 digit), program studi, dan nomor WhatsApp aktif.',
  },
  {
    label: 'Anggota Wajib (1–3)',
    tag: 'Wajib',
    detail: 'Setiap tim wajib memiliki minimal 3 anggota pendamping beserta data nama lengkap, NPM, dan program studi masing-masing.',
  },
  {
    label: 'Anggota Opsional (4–5)',
    tag: 'Opsional',
    detail: 'Tim dapat menambahkan hingga 2 anggota tambahan (total maksimal 6 mahasiswa termasuk ketua) sesuai kebutuhan lintas disiplin.',
  },
  {
    label: 'Dosen Pendamping',
    tag: 'Wajib',
    detail: 'Setiap tim wajib memilih 1 dosen pendamping dari 31 dosen pembimbing Liga PKM UTY yang terdaftar pada sistem.',
  },
];

const BIDANG_PKM = [
  {
    name: 'Kewirausahaan',
    code: 'PKM-K',
    focus: 'Pengembangan produk atau jasa kreatif berbasis peluang pasar dan kemandirian usaha mahasiswa.',
  },
  {
    name: 'Pengabdian Masyarakat',
    code: 'PKM-PM',
    focus: 'Penerapan ilmu pengetahuan dan teknologi untuk membantu mitra masyarakat non-profit.',
  },
  {
    name: 'Riset Sosial Humaniora',
    code: 'PKM-RSH',
    focus: 'Penelitian ilmiah mengenai fenomena sosial, budaya, ekonomi, hukum, dan humaniora.',
  },
  {
    name: 'Riset Eksakta',
    code: 'PKM-RE',
    focus: 'Eksplorasi ilmiah berbasis ilmu alam, rekayasa, komputasi, dan metode eksperimental.',
  },
  {
    name: 'Penerapan IPTEK',
    code: 'PKM-PI',
    focus: 'Solusi teknologi terapan bagi mitra usaha atau industri untuk meningkatkan produktivitas.',
  },
  {
    name: 'Karsa Cipta',
    code: 'PKM-KC',
    focus: 'Penciptaan karya fungsional berupa prototipe, sistem, atau desain konstruktif baru.',
  },
  {
    name: 'Karya Inovatif',
    code: 'PKM-KI',
    focus: 'Inovasi produk atau perangkat siap pakai yang menjawab kebutuhan nyata skala luas.',
  },
  {
    name: 'Video Gagasan Konstruktif',
    code: 'PKM-VGK',
    focus: 'Penyampaian gagasan solutif atas isu strategis nasional dalam format video terstruktur.',
  },
  {
    name: 'Artikel Ilmiah',
    code: 'PKM-AI',
    focus: 'Penulisan artikel ilmiah dari hasil kegiatan akademik, riset, atau pengabdian yang telah selesai.',
  },
  {
    name: 'Gagasan Futuristik Tertulis',
    code: 'PKM-GFT',
    focus: 'Konsep jangka panjang berskala visioner untuk menjawab tantangan masa depan bangsa.',
  },
];

export default function LandingPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['ligaPKMOptions'],
      queryFn: getLigaPKMOptions,
      staleTime: 10 * 60 * 1000,
    });
  }, [queryClient]);

  return (
    <GsapPageScope className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section with Background Slideshow */}
        <section className="relative overflow-hidden border-b border-border bg-[#051d40] text-white">
          <HeroBannerBackground />

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center flex flex-col items-center space-y-5 sm:space-y-6">
              <p
                data-gsap="hero-badge"
                className="text-xs font-semibold uppercase tracking-widest text-[#2aa8e8] bg-sky-950/60 border border-sky-400/20 px-3.5 py-1 rounded-full backdrop-blur-xs drop-shadow-sm"
              >
                Universitas Teknologi Yogyakarta
              </p>
              <h1
                data-gsap="hero-title"
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15] drop-shadow-sm"
              >
                Portal Pendaftaran Resmi Liga PKM UTY 2026
              </h1>
              <p
                data-gsap="hero-desc"
                className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl drop-shadow-sm"
              >
                Wadah seleksi dan pembinaan Program Kreativitas Mahasiswa tingkat universitas.
                Daftarkan tim lintas program studi, pilih bidang PKM, dan ajukan gagasan
                terbaikmu bersama dosen pendamping.
              </p>

              <div
                className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 pt-2 w-full sm:w-auto"
              >
                <Link href="/daftar" className="w-full sm:w-auto">
                  <Button
                    data-gsap="hero-cta"
                    size="lg"
                    className="w-full sm:w-auto h-11 px-7 text-sm font-semibold bg-primary text-primary-foreground hover:bg-[#083d82] border border-sky-400/25 shadow-md shadow-[#051d40]/30 transition-all hover:scale-105 active:scale-95"
                  >
                    Daftarkan Tim Sekarang
                  </Button>
                </Link>
                <a href="#ketentuan" className="w-full sm:w-auto">
                  <Button
                    data-gsap="hero-cta"
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-11 px-6 text-sm font-medium bg-white/15 text-white border-white/30 hover:bg-white/25 hover:text-white backdrop-blur-xs transition-all hover:scale-105 active:scale-95"
                  >
                    Baca Ketentuan Tim
                  </Button>
                </a>
              </div>

              {/* Inline Counting Stats */}
              <div
                data-gsap="hero-stats"
                className="pt-6 mt-6 w-full border-t border-white/20 flex flex-wrap items-baseline justify-center gap-x-8 gap-y-4"
              >
                <div className="flex items-baseline gap-2">
                  <span
                    data-gsap="count"
                    data-target="24"
                    className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums drop-shadow-sm"
                  >
                    24
                  </span>
                  <span className="text-xs sm:text-sm text-sky-100/95 drop-shadow-sm">
                    Program Studi UTY
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span
                    data-gsap="count"
                    data-target="10"
                    className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums drop-shadow-sm"
                  >
                    10
                  </span>
                  <span className="text-xs sm:text-sm text-sky-100/95 drop-shadow-sm">
                    Bidang Skema PKM
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span
                    data-gsap="count"
                    data-target="31"
                    className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums drop-shadow-sm"
                  >
                    31
                  </span>
                  <span className="text-xs sm:text-sm text-sky-100/95 drop-shadow-sm">
                    Dosen Pendamping
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums drop-shadow-sm">
                    4–
                    <span data-gsap="count" data-target="6">
                      6
                    </span>
                  </span>
                  <span className="text-xs sm:text-sm text-sky-100/95 drop-shadow-sm">
                    Mahasiswa per Tim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 01: Alur Pendaftaran */}
        <section id="alur" className="scroll-mt-16 border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
            <div data-gsap="section-heading" className="max-w-xl mb-12">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary mb-2">
                01 / Alur Pendaftaran
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Tiga Tahap Pengajuan Tim
              </h2>
            </div>

            <div
              data-gsap="alur-group"
              className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border border-border rounded-lg bg-background overflow-hidden shadow-xs"
            >
              {ALUR_STEPS.map((item) => (
                <div
                  key={item.step}
                  data-gsap="alur-card"
                  className="p-6 sm:p-8 space-y-3 gsap-hover-card transition-colors hover:bg-accent/40"
                >
                  <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    TAHAP {item.step}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 02: Ketentuan Tim (Asymmetric Split) */}
        <section id="ketentuan" className="scroll-mt-16 border-b border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
            <div className="grid lg:grid-cols-12 gap-10">
              <div data-gsap="ketentuan-left" className="lg:col-span-4 space-y-3">
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary">
                  02 / Ketentuan Tim
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Komposisi & Syarat Kepesertaan
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pastikan seluruh anggota tim berstatus mahasiswa aktif Universitas Teknologi
                  Yogyakarta dan belum terdaftar pada tim lain di skema yang sama.
                </p>
              </div>

              <div className="lg:col-span-8 bg-card border border-border rounded-lg divide-y divide-border overflow-hidden shadow-xs">
                {KETENTUAN_LIST.map((item) => (
                  <div
                    key={item.label}
                    data-gsap="ketentuan-item"
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 gsap-hover-card transition-colors hover:bg-accent/30"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-semibold text-foreground">
                          {item.label}
                        </h3>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                            item.tag === 'Wajib'
                              ? 'bg-accent text-primary border-primary/20'
                              : 'bg-secondary text-muted-foreground border-border'
                          }`}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: 10 Bidang PKM Directory */}
        <section id="bidang" className="scroll-mt-16 border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
            <div
              data-gsap="section-heading"
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
            >
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary mb-2">
                  03 / Skema Kompetisi
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  10 Bidang PKM yang Dibuka
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Pilih satu bidang yang paling relevan dengan fokus masalah dan luaran proposal tim.
              </p>
            </div>

            <div data-gsap="bidang-grid" className="grid md:grid-cols-2 gap-4">
              {BIDANG_PKM.map((b, idx) => (
                <div
                  key={b.name}
                  data-gsap="bidang-card"
                  className="p-5 rounded-lg border border-border bg-background hover:border-primary/50 gsap-hover-card transition-all flex items-start gap-4 shadow-xs"
                >
                  <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-foreground">
                        {b.name}
                      </h3>
                      <span className="font-mono text-[11px] font-semibold text-primary bg-accent px-1.5 py-0.5 rounded border border-primary/20">
                        {b.code}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {b.focus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#072b5c] text-white">
          <div
            data-gsap="cta-box"
            className="mx-auto max-w-6xl px-4 sm:px-6 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Siap Mengajukan Gagasan Tim?
              </h2>
              <p className="text-sky-100/85 text-sm sm:text-base">
                Lengkapi formulir pendaftaran sekarang dan dapatkan ID registrasi untuk
                koordinasi bersama dosen pendamping.
              </p>
            </div>
            <Link href="/daftar">
              <Button
                size="lg"
                className="h-11 px-8 text-sm font-semibold bg-white text-[#0a4da2] hover:bg-sky-50 shadow-lg shadow-sky-950/20 transition-all hover:scale-105 active:scale-95"
              >
                Mulai Pendaftaran
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        data-gsap="footer"
        className="bg-[#051d40] text-slate-300 border-t border-[#0f356b] py-6 text-xs sm:text-sm"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={26} className="border-white/20" />
            <span>PKM Center · Universitas Teknologi Yogyakarta</span>
          </div>
          <span className="font-mono text-sky-200/70">Tahun Akademik 2026</span>
        </div>
      </footer>
    </GsapPageScope>
  );
}
