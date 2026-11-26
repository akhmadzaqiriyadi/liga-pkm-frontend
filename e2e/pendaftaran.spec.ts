import { test, expect, Page } from '@playwright/test';

// Helper to reliably pick option from Base UI Select dropdown
async function pickDropdownOption(page: Page, triggerPlaceholder: string | RegExp, optionText: string | RegExp) {
  const trigger = page.getByRole('combobox').filter({ hasText: triggerPlaceholder }).first();
  await trigger.click();
  const option = page.locator('[role="listbox"]').getByRole('option', { name: optionText }).first();
  await option.waitFor({ state: 'visible', timeout: 5000 });
  await option.click();
}

test.describe('Form Pendaftaran Tim E2E', () => {
  test('should sanitize NPM input to numbers only', async ({ page }) => {
    await page.goto('/daftar');

    const npmInput = page.locator('#npmKetua');
    await npmInput.fill('5230abc411001');

    // Letters should be filtered out by input sanitization
    await expect(npmInput).toHaveValue('5230411001');
  });

  test('should sanitize WhatsApp input to valid phone numbers', async ({ page }) => {
    await page.goto('/daftar');

    const waInput = page.locator('#waKetua');
    await waInput.fill('+62-852-9267-4431-abc');

    // Dashes and letters should be filtered, maintaining international format
    await expect(waInput).toHaveValue('+6285292674431');
  });

  test('should show validation error when members share identical NPM', async ({ page }) => {
    await page.goto('/daftar');

    // Fill Ketua
    await page.locator('#namaKetua').fill('Akhmad Zaqi');
    await page.locator('#npmKetua').fill('5230411001');
    await pickDropdownOption(page, /Pilih Program Studi/i, 'Informatika');
    await page.locator('#waKetua').fill('085292677431');

    // Fill Anggota 1 with duplicate NPM of Ketua
    const anggotaInputs = page.locator('input[placeholder="Nama lengkap"]');
    await anggotaInputs.nth(0).fill('Budi Santoso');

    const anggotaNpmInputs = page.locator('input[placeholder="NPM (angka)"]');
    await anggotaNpmInputs.nth(0).fill('5230411001'); // DUPLICATE!
    await pickDropdownOption(page, /Pilih Prodi/i, 'Informatika');

    // Fill Anggota 2
    await anggotaInputs.nth(1).fill('Citra Dewi');
    await anggotaNpmInputs.nth(1).fill('5230411003');
    await pickDropdownOption(page, /Pilih Prodi/i, 'Sistem Informasi');

    // Fill Anggota 3
    await anggotaInputs.nth(2).fill('Doni Prasetyo');
    await anggotaNpmInputs.nth(2).fill('5230411004');
    await pickDropdownOption(page, /Pilih Prodi/i, 'Teknik Komputer');

    // Fill Proposal
    await page.locator('#judul').fill('Inovasi Monitoring Logistik Cerdas');
    await pickDropdownOption(page, /Pilih Bidang PKM/i, 'Penerapan IPTEK');
    await pickDropdownOption(page, /Pilih Target SDGs/i, /SDG 9/i);
    await pickDropdownOption(page, /Pilih Dosen Pendamping/i, 'Moh. Ali Romli');

    // Fill Deskripsi
    await page.locator('#deskripsi').fill('Deskripsi proposal lengkap dengan analisis masalah dan solusi.');

    // Submit
    const submitBtn = page.locator('button[type="submit"]:has-text("Kirim Pendaftaran")').last();
    await submitBtn.click();

    // Should display validation error on duplicate NPM
    await expect(page.getByText('NPM Ketua dan setiap Anggota dalam satu tim harus berbeda').first()).toBeVisible();
  });

  test('should complete registration successfully and redirect to /daftar/sukses', async ({ page }) => {
    // Intercept register API to return success without spamming the live sheet
    await page.route('**/api/liga-pkm/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          status_code: 201,
          message: 'Pendaftaran tim Liga PKM berhasil dikirim',
          data: {
            id: 'REG-PKM-2026-TEST-99',
            namaKetua: 'Akhmad Zaqi Riyadi',
            judulDiusulkan: 'Sistem Telemetri Monitoring Armada Berbasis Bun Runtime',
          },
        }),
      });
    });

    await page.goto('/daftar');

    // 1. Data Ketua
    await page.locator('#namaKetua').fill('Akhmad Zaqi Riyadi');
    await page.locator('#npmKetua').fill('5230411001');
    await pickDropdownOption(page, /Pilih Program Studi/i, 'Informatika');
    await page.locator('#waKetua').fill('085292677431');

    // 2. Data Anggota (1, 2, 3)
    const anggotaNama = page.locator('input[placeholder="Nama lengkap"]');
    const anggotaNpm = page.locator('input[placeholder="NPM (angka)"]');

    await anggotaNama.nth(0).fill('Rian Ardiansyah');
    await anggotaNpm.nth(0).fill('5230411002');
    await pickDropdownOption(page, /Pilih Prodi/i, 'Informatika');

    await anggotaNama.nth(1).fill('Fikri Ramadhan');
    await anggotaNpm.nth(1).fill('5230411003');
    await pickDropdownOption(page, /Pilih Prodi/i, 'Sistem Informasi');

    await anggotaNama.nth(2).fill('Dina Permata');
    await anggotaNpm.nth(2).fill('5230411004');
    await pickDropdownOption(page, /Pilih Prodi/i, 'Teknik Komputer');

    // 3. Data Proposal
    await page.locator('#judul').fill('Sistem Telemetri Monitoring Armada Berbasis Bun Runtime');
    await pickDropdownOption(page, /Pilih Bidang PKM/i, 'Penerapan IPTEK');
    await pickDropdownOption(page, /Pilih Target SDGs/i, /SDG 9/i);
    await pickDropdownOption(page, /Pilih Dosen Pendamping/i, 'Moh. Ali Romli');

    await page.locator('#deskripsi').fill('Implementasi monitoring real-time berkinerja tinggi untuk transportasi armada.');

    // Submit
    const submitBtn = page.locator('button[type="submit"]:has-text("Kirim Pendaftaran")').last();
    await submitBtn.click();

    // Verify redirected to sukses page with generated ID
    await expect(page).toHaveURL(/\/daftar\/sukses\?id=REG-PKM-2026-TEST-99/);
    await expect(page.getByRole('heading', { name: /Tim Berhasil Didaftarkan/i })).toBeVisible();
    await expect(page.getByText('REG-PKM-2026-TEST-99')).toBeVisible();

    // Verify button to "Lihat Data & Status Tim"
    const cekBtn = page.getByRole('link', { name: /Lihat Data & Status Tim/i });
    await expect(cekBtn).toBeVisible();
  });

  test('should prevent duplicate registration if localStorage contains registered ID', async ({ page }) => {
    // Inject localStorage before navigation
    await page.addInitScript(() => {
      window.localStorage.setItem('liga_pkm_registered_id', 'REG-ALREADY-SUBMITTED-88');
    });

    await page.goto('/daftar');

    // Verify alert message is displayed
    await expect(page.getByText('Perangkat Ini Sudah Mengirim Pendaftaran')).toBeVisible();
    await expect(page.getByText('REG-ALREADY-SUBMITTED-88')).toBeVisible();

    // Verify submit button is disabled
    const submitBtn = page.locator('button[type="submit"]:has-text("Anda Sudah Terdaftar")').last();
    await expect(submitBtn).toBeDisabled();

    // Verify "Lihat Data Saya" link exists in the alert
    const lihatDataLink = page.getByRole('link', { name: /Lihat Data Saya/i });
    await expect(lihatDataLink).toBeVisible();
  });
});
