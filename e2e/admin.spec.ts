import { test, expect } from '@playwright/test';

test.describe('Admin Area E2E - Full Management Lifecycle', () => {
  test('should reject invalid password at /admin/login', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByText('Akses Panitia')).toBeVisible();

    const passwordInput = page.getByPlaceholder(/Masukkan password/i);
    await passwordInput.fill('wrong-password-xyz');
    await page.getByRole('button', { name: /Masuk ke Dashboard/i }).click();

    // Verify error message
    await expect(page.getByText(/Password \/ Secret Key tidak valid/i)).toBeVisible();
  });

  test('should login, display submissions KPI, search, view detail, export CSV, and logout', async ({ page }) => {
    // 1. Login
    await page.goto('/admin/login');
    const passwordInput = page.getByPlaceholder(/Masukkan password/i);
    await passwordInput.fill('ligapkm-uty-secret-2026');
    await page.getByRole('button', { name: /Masuk ke Dashboard/i }).click();

    // 2. Submissions Dashboard Loaded
    await expect(page).toHaveURL(/\/admin\/submissions/);
    await expect(page.getByRole('heading', { name: /Daftar Pengajuan Tim/i })).toBeVisible();

    // 3. KPI Strip & Table Rows
    await expect(page.getByText('Total Pendaftar')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();

    // 4. Search Filter
    const searchInput = page.getByPlaceholder(/Cari nama ketua, NPM/i);
    await searchInput.fill('Zaqi');
    await expect(page.locator('table').getByText('Akhmad Zaqi Riyadi')).toBeVisible();

    // Reset search
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(searchInput).toHaveValue('');

    // 5. Open Detail Modal
    const detailButtons = page.locator('table').getByRole('button', { name: 'Detail' });
    await expect(detailButtons.first()).toBeVisible();
    await detailButtons.first().click();

    // Verify Detail Dialog opens
    await expect(page.getByRole('heading', { name: /Detail Pendaftaran Tim/i })).toBeVisible();
    await expect(page.getByText('Data Ketua Tim')).toBeVisible();
    await expect(page.getByText('Data Proposal')).toBeVisible();
    await expect(page.getByText('Perbarui Status Peninjauan')).toBeVisible();

    // Close Dialog by pressing Escape
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: /Detail Pendaftaran Tim/i })).not.toBeVisible();

    // 6. Verify Export CSV link
    const exportBtn = page.getByRole('button', { name: /Export CSV/i });
    await expect(exportBtn).toBeVisible();

    // 7. Logout
    await page.getByRole('button', { name: 'Keluar' }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByText('Akses Panitia')).toBeVisible();
  });
});
