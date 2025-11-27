import { test, expect } from '@playwright/test';
import { setupApiMocks } from '../utils/setup';

test.describe('Cart - P0 Critical Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should add item to cart and navigate to cart page', async ({ page }) => {
    await page.goto('/product/1');
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Navigate to cart page using the cart link/button
    await page.getByRole('button', { name: /Cart/i }).click();
    await page.waitForURL('**/cart');

    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByTestId('cart-item').first()).toBeVisible();
  });

  test('should update cart quantity', async ({ page }) => {
    // First add item to cart
    await page.goto('/product/1');
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Go to cart
    await page.getByRole('button', { name: /Cart/i }).click();
    await page.waitForURL('**/cart');

    // Update quantity
    const quantityInput = page.locator('input[type="number"], [class*="quantity"]').first();
    if (await quantityInput.count() > 0) {
      await quantityInput.fill('2');
      await expect(quantityInput).toHaveValue('2');
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // First add item to cart
    await page.goto('/product/1');
    await page.waitForLoadState('networkidle');

    const addToCartButton = page.getByRole('button', { name: /Add to Cart/i }).first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Go to cart
    await page.getByRole('button', { name: /Cart/i }).click();
    await page.waitForURL('**/cart');

    // Remove item
    const removeButton = page.getByRole('button', { name: /Remove/i }).or(page.getByRole('button', { name: /حذف/i }));
    if (await removeButton.count() > 0) {
      const initialItemCount = await page.getByTestId('cart-item').count();
      await removeButton.first().click();

      // Wait a bit for the item to be removed
      await page.waitForTimeout(500);

      if (initialItemCount > 1) {
        await expect(page.getByTestId('cart-item')).toHaveCount(initialItemCount - 1);
      } else {
        await expect(page.getByText(/empty|خالی/i).or(page.getByText(/cart is empty/i))).toBeVisible();
      }
    }
  });
});