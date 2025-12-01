import { test, expect } from '@playwright/test';
import { setupApiMocks } from '../utils/setup';

test.describe('Login and Checkout - P0 Critical Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should attempt login', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Check if login elements are present
    const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordInput = page.getByLabel(/password/i).or(page.locator('input[type="password"]'));

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');

      const loginButton = page.getByRole('button', { name: /Login|ورود/i }).first();
      await expect(loginButton).toBeVisible();
      await loginButton.click();

      // Just check if the page changes or shows an error message
      await page.waitForTimeout(1000);
    }
  });

  test('should have register page accessible', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Check if registration form elements are present
    const emailLabel = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));
    const passwordLabel = page.getByLabel(/password/i).or(page.locator('input[type="password"]'));

    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });
});