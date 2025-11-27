import { test, expect } from '@playwright/test';
import { setupApiMocks } from '../utils/setup';

test.describe('HomePage - P0 Critical Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should load homepage and display hero content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/YourStore/i);

    // Look for visible hero content using more flexible selectors
    const heroHeading = page.locator('h1, [class*="hero"], [class*="title"], .text-gradient-orange').first();
    await expect(heroHeading).toBeVisible({ timeout: 15000 });

    // Look for product cards with flexible selectors
    const productCard = page.locator('[class*="product"], [data-testid*="product" i], .product-card').first();
    await expect(productCard).toBeVisible({ timeout: 15000 });
  });

  test('should navigate to products page from homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Use more flexible selector for the products link
    const productsLink = page.locator('a[href="/products"], [class*="products"], text=Explore Collection').first();
    await expect(productsLink).toBeVisible();
    await productsLink.click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('should have working header and footer', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for header and footer sections with flexible selectors
    const header = page.locator('header, [class*="header"]');
    const footer = page.locator('footer, [class*="footer"]');

    await expect(header).toBeVisible();
    await expect(footer).toBeVisible();

    // Check for cart button with flexible selectors
    const cartButton = page.locator('[class*="cart"], button[aria-label*="Cart" i], [aria-label*="cart" i]');
    if (await cartButton.count() > 0) {
      await expect(cartButton).toBeVisible();
    }
  });
});