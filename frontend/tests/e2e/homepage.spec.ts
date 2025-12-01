import { test, expect } from '@playwright/test';

test.describe('HomePage - Critical', () => {
  test('should load homepage and display title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/فروشگاه|Shop|Home/i);
    await expect(page.locator('h1, [data-testid="hero-title"], .hero-title, [class*="hero"]')).toBeVisible();
  });
});