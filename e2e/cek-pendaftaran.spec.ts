import { test, expect } from '@playwright/test';

test.describe('Cek Pendaftaran E2E', () => {
  test('should display tracking form correctly', async ({ page }) => {
    await page.goto('/cek-pendaftaran');
    await expect(page.getByRole('heading', { name: /Cek Status & Data Pendaftaran Tim/i })).toBeVisible();
    await expect(page.getByPlaceholder(/6b47875c/i)).toBeVisible();
  });

  test('should display error when searching with non-existent ID', async ({ page }) => {
    // Intercept with 404 response
    await page.route('**/api/liga-pkm/track?id=non-existent-id-9999', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Data pendaftaran dengan ID tersebut tidak ditemukan.',
        }),
      });
    });

    await page.goto('/cek-pendaftaran');
    const input = page.getByPlaceholder(/6b47875c/i);
    await input.fill('non-existent-id-9999');
    await page.getByRole('button', { name: /Cek Pendaftaran/i }).click();

    // Verify error alert
    await expect(page.getByText('Data Tidak Ditemukan')).toBeVisible();
  });

  test('should display registration detail when ID is found', async ({ page }) => {
    await page.route('**/api/liga-pkm/track?id=test-id-1234', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status_code: 200,
          data: {
            id: 'test-id-1234',
            namaKetua: 'Budi Santoso',
            npmKetua: '5230411999',
            prodiKetua: 'Informatika',
            noWhatsappKetua: '081234567890',
            namaAnggota1: 'Siti Rahma',
            npmAnggota1: '5230411888',
            prodiAnggota1: 'Sistem Informasi',
            namaAnggota2: 'Ahmad Fauzi',
            npmAnggota2: '5230411777',
            prodiAnggota2: 'Teknik Elektro',
            namaAnggota3: 'Dewi Lestari',
            npmAnggota3: '5230411666',
            prodiAnggota3: 'Teknik Komputer',
            judulDiusulkan: 'Sistem Deteksi Dini Kebakaran Hutan Berbasis IoT',
            bidangPkm: 'Penerapan IPTEK',
            skemaSdgs: 'SDG 15: Ekosistem Daratan',
            dosenPendamping: 'Moh. Ali Romli',
            deskripsiIde: 'Solusi monitoring lingkungan dengan sensor telemetri real-time.',
            status: 'approved',
            reviewerNotes: 'Proposal sangat baik dan memenuhi standar.',
            createdAt: '2026-11-26T10:00:00.000Z',
          },
        }),
      });
    });

    await page.goto('/cek-pendaftaran?id=test-id-1234');

    await expect(page.getByText('Budi Santoso')).toBeVisible();
    await expect(page.getByText('5230411999')).toBeVisible();
    await expect(page.getByText('Sistem Deteksi Dini Kebakaran Hutan Berbasis IoT')).toBeVisible();
    await expect(page.getByText('Penerapan IPTEK')).toBeVisible();
  });
});
