import { z } from 'zod';

const NUMERIC_ONLY_REGEX = /^[0-9]+$/;

export const AnggotaItemSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(1, 'Nama anggota wajib diisi')
    .min(3, 'Nama anggota minimal 3 karakter'),
  npm: z
    .string()
    .trim()
    .min(1, 'NPM anggota wajib diisi')
    .regex(NUMERIC_ONLY_REGEX, 'NPM anggota harus berupa angka saja (tanpa huruf atau simbol)')
    .min(8, 'NPM anggota minimal 8 digit angka')
    .max(15, 'NPM anggota maksimal 15 digit angka'),
  prodi: z.string().trim().min(1, 'Program studi anggota wajib dipilih'),
});

export const RegistrationPayloadSchema = z
  .object({
    namaKetua: z
      .string()
      .trim()
      .min(1, 'Nama ketua tim wajib diisi')
      .min(3, 'Nama ketua tim minimal 3 karakter'),
    npmKetua: z
      .string()
      .trim()
      .min(1, 'NPM ketua tim wajib diisi')
      .regex(NUMERIC_ONLY_REGEX, 'NPM ketua tim harus berupa angka saja (tanpa huruf atau simbol)')
      .min(8, 'NPM ketua tim minimal 8 digit angka')
      .max(15, 'NPM ketua tim maksimal 15 digit angka'),
    prodiKetua: z
      .string()
      .trim()
      .min(1, 'Program studi ketua tim wajib dipilih'),
    noWhatsappKetua: z
      .string()
      .trim()
      .min(1, 'Nomor WhatsApp ketua tim wajib diisi')
      .regex(
        /^[0-9+]+$/,
        'Nomor WhatsApp hanya boleh berupa angka (diawali 08, 62, atau +62)'
      )
      .refine(
        (val) => {
          const digits = val.replace(/^\+/, '');
          return NUMERIC_ONLY_REGEX.test(digits) && digits.length >= 10 && digits.length <= 16;
        },
        'Nomor WhatsApp minimal 10 digit dan maksimal 15 digit angka'
      ),

    // Anggota 1-3 (Wajib)
    namaAnggota1: z
      .string()
      .trim()
      .min(1, 'Nama Anggota 1 wajib diisi')
      .min(3, 'Nama Anggota 1 minimal 3 karakter'),
    npmAnggota1: z
      .string()
      .trim()
      .min(1, 'NPM Anggota 1 wajib diisi')
      .regex(NUMERIC_ONLY_REGEX, 'NPM Anggota 1 harus berupa angka saja (tanpa huruf atau simbol)')
      .min(8, 'NPM Anggota 1 minimal 8 digit angka')
      .max(15, 'NPM Anggota 1 maksimal 15 digit angka'),
    prodiAnggota1: z
      .string()
      .trim()
      .min(1, 'Program studi Anggota 1 wajib dipilih'),

    namaAnggota2: z
      .string()
      .trim()
      .min(1, 'Nama Anggota 2 wajib diisi')
      .min(3, 'Nama Anggota 2 minimal 3 karakter'),
    npmAnggota2: z
      .string()
      .trim()
      .min(1, 'NPM Anggota 2 wajib diisi')
      .regex(NUMERIC_ONLY_REGEX, 'NPM Anggota 2 harus berupa angka saja (tanpa huruf atau simbol)')
      .min(8, 'NPM Anggota 2 minimal 8 digit angka')
      .max(15, 'NPM Anggota 2 maksimal 15 digit angka'),
    prodiAnggota2: z
      .string()
      .trim()
      .min(1, 'Program studi Anggota 2 wajib dipilih'),

    namaAnggota3: z
      .string()
      .trim()
      .min(1, 'Nama Anggota 3 wajib diisi')
      .min(3, 'Nama Anggota 3 minimal 3 karakter'),
    npmAnggota3: z
      .string()
      .trim()
      .min(1, 'NPM Anggota 3 wajib diisi')
      .regex(NUMERIC_ONLY_REGEX, 'NPM Anggota 3 harus berupa angka saja (tanpa huruf atau simbol)')
      .min(8, 'NPM Anggota 3 minimal 8 digit angka')
      .max(15, 'NPM Anggota 3 maksimal 15 digit angka'),
    prodiAnggota3: z
      .string()
      .trim()
      .min(1, 'Program studi Anggota 3 wajib dipilih'),

    // Anggota 4-5 (Opsional)
    namaAnggota4: z.string().trim().optional(),
    npmAnggota4: z.string().trim().optional(),
    prodiAnggota4: z.string().trim().optional(),

    namaAnggota5: z.string().trim().optional(),
    npmAnggota5: z.string().trim().optional(),
    prodiAnggota5: z.string().trim().optional(),

    // Proposal
    judulDiusulkan: z
      .string()
      .trim()
      .min(1, 'Judul proposal wajib diisi')
      .min(5, 'Judul proposal minimal 5 karakter'),
    bidangPkm: z
      .string()
      .trim()
      .min(1, 'Bidang PKM wajib dipilih'),
    skemaSdgs: z
      .string()
      .trim()
      .min(1, 'Skema SDGs wajib dipilih'),
    dosenPendamping: z
      .string()
      .trim()
      .min(1, 'Dosen pendamping wajib dipilih'),
    deskripsiIde: z
      .string()
      .trim()
      .min(1, 'Deskripsi ide wajib diisi')
      .min(20, 'Deskripsi ide minimal 20 karakter'),
  })
  .superRefine((data, ctx) => {
    if (data.namaAnggota4 || data.npmAnggota4 || data.prodiAnggota4) {
      if (!data.namaAnggota4 || data.namaAnggota4.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nama Anggota 4 minimal 3 karakter',
          path: ['namaAnggota4'],
        });
      }
      if (
        !data.npmAnggota4 ||
        !NUMERIC_ONLY_REGEX.test(data.npmAnggota4) ||
        data.npmAnggota4.length < 8 ||
        data.npmAnggota4.length > 15
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'NPM Anggota 4 harus berupa angka 8-15 digit',
          path: ['npmAnggota4'],
        });
      }
      if (!data.prodiAnggota4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Program studi Anggota 4 wajib dipilih',
          path: ['prodiAnggota4'],
        });
      }
    }

    if (data.namaAnggota5 || data.npmAnggota5 || data.prodiAnggota5) {
      if (!data.namaAnggota5 || data.namaAnggota5.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nama Anggota 5 minimal 3 karakter',
          path: ['namaAnggota5'],
        });
      }
      if (
        !data.npmAnggota5 ||
        !NUMERIC_ONLY_REGEX.test(data.npmAnggota5) ||
        data.npmAnggota5.length < 8 ||
        data.npmAnggota5.length > 15
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'NPM Anggota 5 harus berupa angka 8-15 digit',
          path: ['npmAnggota5'],
        });
      }
      if (!data.prodiAnggota5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Program studi Anggota 5 wajib dipilih',
          path: ['prodiAnggota5'],
        });
      }
    }
  });

export type RegistrationPayload = z.infer<typeof RegistrationPayloadSchema>;

