import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';
import { LandingHeader } from '@/components/LandingHeader';

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
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 md:py-24">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Universitas Teknologi Yogyakarta
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                  Portal Pendaftaran Resmi Liga PKM UTY 2026
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Wadah seleksi dan pembinaan Program Kreativitas Mahasiswa tingkat universitas.
                  Daftarkan tim lintas program studi, pilih bidang PKM, dan ajukan gagasan
                  terbaikmu bersama dosen pendamping.
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
                  <Link href="/daftar" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-11 px-6 text-sm font-semibold bg-primary text-primary-foreground hover:bg-[#083d82]"
                    >
                      Daftarkan Tim Sekarang
                    </Button>
                  </Link>
                  <a href="#ketentuan" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-11 px-6 text-sm font-medium bg-card hover:bg-secondary"
                    >
                      Baca Ketentuan Tim
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right Structured Fact Sheet */}
              <div className="lg:col-span-5 bg-card border border-border rounded-lg overflow-hidden shadow-xs">
                <div className="h-1.5 bg-gradient-to-r from-[#0a4da2] to-[#2aa8e8]" />
                <div className="p-6 space-y-6">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Ringkasan Skema 2026
                    </p>
                    <h2 className="text-lg font-semibold text-foreground mt-1">
                      Kapasitas & Parameter Kompetisi
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                    <div>
                      <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
                        24
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Program Studi UTY
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
                        10
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Bidang Skema PKM
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
                        31
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Dosen Pendamping
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
                        4–6
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Mahasiswa per Tim
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Persiapan Sebelum Mendaftar
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-baseline gap-2.5">
                        <span className="font-mono text-xs text-primary font-semibold">01</span>
                        <span>Data lengkap Ketua dan 3–5 Anggota (Nama, NPM, Prodi)</span>
                      </li>
                      <li className="flex items-baseline gap-2.5">
                        <span className="font-mono text-xs text-primary font-semibold">02</span>
                        <span>Judul usulan, bidang PKM, dan target SDGs</span>
                      </li>
                      <li className="flex items-baseline gap-2.5">
                        <span className="font-mono text-xs text-primary font-semibold">03</span>
                        <span>Ringkasan latar belakang masalah & solusi tim</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 01: Alur Pendaftaran */}
        <section id="alur" className="scroll-mt-16 border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
            <div className="max-w-xl mb-12">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-primary mb-2">
                01 / Alur Pendaftaran
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Tiga Tahap Pengajuan Tim
              </h2>
            </div>

            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border border-border rounded-lg bg-background">
              {ALUR_STEPS.map((item) => (
                <div key={item.step} className="p-6 sm:p-8 space-y-3">
                  <span className="font-mono text-xs font-semibold text-primary">
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
              <div className="lg:col-span-4 space-y-3">
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

              <div className="lg:col-span-8 bg-card border border-border rounded-lg divide-y divide-border">
                {KETENTUAN_LIST.map((item) => (
                  <div
                    key={item.label}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
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

            <div className="grid md:grid-cols-2 gap-4">
              {BIDANG_PKM.map((b, idx) => (
                <div
                  key={b.name}
                  className="p-5 rounded-lg border border-border bg-background hover:border-primary/40 transition-colors flex items-start gap-4"
                >
                  <span className="font-mono text-xs font-semibold text-muted-foreground pt-0.5 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-foreground">
                        {b.name}
                      </h3>
                      <span className="font-mono text-[11px] text-primary bg-accent px-1.5 py-0.5 rounded">
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
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
                className="h-11 px-7 text-sm font-semibold bg-white text-[#0a4da2] hover:bg-sky-50"
              >
                Mulai Pendaftaran
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#051d40] text-slate-300 border-t border-[#0f356b] py-6 text-xs sm:text-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <BrandLogo size={26} className="border-white/20" />
            <span>PKM Center · Universitas Teknologi Yogyakarta</span>
          </div>
          <span className="font-mono text-sky-200/70">Tahun Akademik 2026</span>
        </div>
      </footer>
    </div>
  );
}
