# 🏆 Frontend Liga PKM UTY 2026

Repositori resmi frontend web portal pendaftaran dan dashboard panitia/reviewer untuk **Liga PKM Universitas Teknologi Yogyakarta (UTY)**.

---

## 🚀 Integrasi Backend API

- **Base URL Production**: `https://kreanovasi.uty.ac.id/api/v1/liga-pkm`
- **Internal VPS Port**: `http://10.10.10.200:2582/api/v1/liga-pkm` (Port proxy Nginx)
- **Local Port Backend**: `http://localhost:5000/api/v1/liga-pkm`

### 🔑 Autentikasi Panitia / Admin
Endpoint pendaftaran peserta terbuka secara publik. Untuk endpoint pengelolaan panitia (list submissions, update status, export CSV), sertakan header:
```http
X-PKM-SECRET: ligapkm-uty-secret-2026
```

---

## 📡 Daftar Endpoint Utama

1. **`GET /options`** *(Publik)*: Mengambil master opsi dinamis (24 Prodi UTY, 10 Bidang PKM, 31 Dosen Pendamping).
2. **`POST /register`** *(Publik)*: Submit formulir pendaftaran proposal tim Liga PKM.
   - **Wajib**: `namaKetua`, `npmKetua`, `prodiKetua`, `noWhatsappKetua`, `namaAnggota1..3`, `npmAnggota1..3`, `prodiAnggota1..3`, `judulDiusulkan`, `bidangPkm`, `skemaSdgs`, `dosenPendamping`, `deskripsiIde`.
   - **Opsional**: `namaAnggota4..5`, `npmAnggota4..5`, `prodiAnggota4..5`.
3. **`GET /submissions`** *(Admin Secret)*: Menampilkan daftar pendaftar lengkap dengan search, filter status/bidang, sorting, dan pagination.
4. **`GET /submissions/:id`** *(Admin Secret)*: Detail lengkap 1 proposal pendaftar.
5. **`PATCH /submissions/:id/status`** *(Admin Secret)*: Update status seleksi (`pending`, `reviewed`, `approved`, `rejected`) + catatan reviewer.
6. **`GET /submissions/export`** *(Admin Secret)*: Download file CSV rekapitulasi data pendaftar untuk Excel / Google Sheets.

---

## 🛠️ Panduan Memulai (Development)

Rekomendasi package manager: **Bun** (`bun`).

```bash
# Clone repository
git clone https://github.com/akhmadzaqiriyadi/liga-pkm-frontend.git
cd liga-pkm-frontend

# Install dependencies dengan Bun
bun install

# Setup Environment (.env.local)
cp .env.example .env.local

# Jalankan dev server
bun run dev
```

Server lokal akan berjalan di `http://localhost:3000`.
