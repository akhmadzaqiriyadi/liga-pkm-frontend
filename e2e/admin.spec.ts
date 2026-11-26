import { test, expect } from '@playwright/test';

test.describe('Admin Area E2E', () => {
  test('should reject invalid password at /admin/login', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByText('Akses Panitia')).toBeVisible();

    const passwordInput = page.getByPlaceholder(/Masukkan password/i);
    await passwordInput.fill('wrong-password-xyz');
    await page.getByRole('button', { name: /Masuk ke Dashboard/i }).click();

    // Verify error message
    await expect(page.getByText(/Password \/ Secret Key tidak valid/i)).toBeVisible();
  });

  test('should login successfully with valid secret and view submissions', async ({ page }) => {
    await page.goto('/admin/login');
    const passwordInput = page.getByPlaceholder(/Masukkan password/i);
    await passwordInput.fill('ligapkm-uty-secret-2026');
    await page.getByRole('button', { name: /Masuk ke Dashboard/i }).click();

    // Verify redirect to submissions
    await expect(page).toHaveURL(/\/admin\/submissions/);
    await expect(page.getByRole('heading', { name: /Daftar Pengajuan Tim/i })).toBeVisible();

    // Check export CSV button exists
    await expect(page.getByRole('button', { name: /Export CSV/i })).toBeVisible();
  });
});
