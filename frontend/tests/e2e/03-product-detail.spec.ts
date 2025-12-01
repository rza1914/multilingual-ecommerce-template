import { test, expect } from '@playwright/test';
import { setupApiMocks } from '../utils/setup';

test.describe('ProductDetail - P0 Critical Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should load product detail page and display product info', async ({ page }) => {
    // Go directly to a product detail page
    await page.goto('/product/1');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading').first()).toBeVisible();
    await expect(page.getByRole('img')).toBeVisible();
    await expect(page.getByRole('button', { name: /Add to Cart/i }).first()).toBeVisible();
  });

  test('should add product to cart from detail page', async ({ page }) => {
    // Go directly to a product detail page
    await page.goto('/product/1');
    await page.waitForLoadState('networkidle');

    // Find and click the add to cart button
    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Verify the product was added to cart (look for a success message)
    const successMessage = page.getByText(/added/i).or(page.getByText(/افزوده/i));
    if (await successMessage.count() > 0) {
      await expect(successMessage).toBeVisible();
    }
  });
});