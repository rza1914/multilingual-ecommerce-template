import { test, expect } from '@playwright/test';
import { setupApiMocks } from '../utils/setup';

test.describe('ProductsList - P0 Critical Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should load products page and display products', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/YourStore - Multilingual E-commerce/i);
    await expect(page.getByRole('heading', { name: /Products/i }).first()).toBeVisible();
    await expect(page.getByTestId('product-card').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('product-card')).toHaveCount(2);
  });

  test('should have functional filters sidebar', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    const filterButton = page.getByRole('button', { name: /Filter/i }).first();
    if (await filterButton.count() > 0) {
      await filterButton.click();
      await expect(page.locator('[class*="sidebar"], [class*="filter"]').first()).toBeVisible();
    }
  });

  test('should display search bar', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('input[placeholder*="Search" i], [class*="search"]').first()).toBeVisible();
  });
});