import { test, expect } from '@playwright/test';
import { setupApiMocks } from '../utils/setup';

test.describe('Checkout Guest - P0 Critical Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should complete guest checkout flow', async ({ page }) => {
    // Add an item to cart first
    await page.goto('/product/1');
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Proceed to checkout
    await page.getByRole('button', { name: /Cart/i }).click();
    await page.waitForURL('**/cart');

    const checkoutButton = page.getByRole('button', { name: /Checkout/i }).first();
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();

    // Wait for checkout page to load
    await page.waitForURL('**/checkout');
    await expect(page).toHaveURL(/\/checkout/);

    // Fill in guest checkout details
    await page.getByLabel(/email/i).fill('guest@example.com');
    await page.getByLabel(/first name/i).fill('Guest');
    await page.getByLabel(/last name/i).fill('User');
    await page.getByLabel(/address/i).fill('123 Test Street');
    await page.getByLabel(/city/i).fill('Test City');
    await page.getByLabel(/zip/i).fill('12345');

    // Complete checkout
    const placeOrderButton = page.getByRole('button', { name: /Place Order|Order/i });
    await expect(placeOrderButton).toBeVisible();
    await placeOrderButton.click();

    // Wait for order confirmation
    await page.waitForURL('**/order-confirmation**');
    await expect(page.getByText(/success|confirmed/i).or(page.getByText(/موفق|تایید/i))).toBeVisible();
  });

  test('should show cart items in checkout', async ({ page }) => {
    // Add an item to cart first
    await page.goto('/product/1');
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Proceed to checkout
    await page.getByRole('button', { name: /Cart/i }).click();
    await page.waitForURL('**/cart');

    await page.getByRole('button', { name: /Checkout/i }).click();

    // Verify cart items are shown in checkout
    await page.waitForURL('**/checkout');
    await expect(page.getByTestId('cart-summary').or(page.locator('[class*="summary"]'))).toBeVisible();
    await expect(page.getByTestId('checkout-item').or(page.locator('[class*="item"]'))).toBeVisible();
  });
});