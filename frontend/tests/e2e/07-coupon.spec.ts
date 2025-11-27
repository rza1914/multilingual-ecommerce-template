import { test, expect } from '@playwright/test';
import { setupApiMocks } from '../utils/setup';

test.describe('Coupon - P0 Critical Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should have coupon input field in cart', async ({ page }) => {
    // Add an item to cart first
    await page.goto('/product/1');
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Go to cart page
    await page.getByRole('button', { name: /Cart/i }).click();
    await page.waitForURL('**/cart');

    // Check for coupon input field
    const couponInput = page.getByLabel(/coupon/i).or(page.locator('input[placeholder*="coupon" i]'));
    await expect(couponInput).toBeVisible();
  });
});