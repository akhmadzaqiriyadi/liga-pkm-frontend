import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E', () => {
  test('should display hero section, navigation links, and brand elements', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header').getByText('Liga PKM UTY')).toBeVisible();

    // Check hero headline
    await expect(
      page.getByRole('heading', { name: /Portal Pendaftaran Resmi Liga PKM UTY 2026/i })
    ).toBeVisible();

    // Check stats
    await expect(page.getByText('Program Studi UTY').first()).toBeVisible();
    await expect(page.getByText('Bidang Skema PKM').first()).toBeVisible();
    await expect(page.getByText('Dosen Pendamping').first()).toBeVisible();

    // Check Cek Status link
    await expect(page.getByRole('link', { name: 'Cek Status' }).first()).toBeVisible();

    // Check CTA
    await expect(page.getByRole('link', { name: /Daftarkan Tim Sekarang/i })).toBeVisible();
  });

  test('should navigate to /cek-pendaftaran when Cek Status is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Cek Status' }).first().click();
    await expect(page).toHaveURL(/\/cek-pendaftaran/);
    await expect(page.getByRole('heading', { name: /Cek Status & Data Pendaftaran Tim/i })).toBeVisible();
  });

  test('should navigate to /daftar when Daftarkan Tim Sekarang is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Daftarkan Tim Sekarang/i }).first().click();
    await expect(page).toHaveURL(/\/daftar/);
    await expect(page.getByRole('heading', { name: /Pendaftaran Liga PKM UTY 2026/i })).toBeVisible();
  });
});
