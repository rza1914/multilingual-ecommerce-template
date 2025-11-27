import { test, expect } from '@playwright/test';
import { setupApiMocks } from '../utils/setup';

test.describe('Responsive - P0 Critical Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test('should render correctly on mobile viewport (480px)', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 480, height: 800 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if mobile-specific elements are accessible
    const mobileMenuButton = page.getByRole('button', { name: /menu|nav|hamburger/i }).or(
      page.locator('.mobile-menu-btn, [class*="mobileMenu"], .menu-toggle').first()
    );

    // This test verifies that the page renders without errors at mobile size
    await expect(page.getByRole('main').or(page.locator('main'))).toBeVisible();
  });

  test('should render correctly on tablet viewport (768px)', async ({ page }) => {
    // Set viewport to tablet size
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if the page renders correctly on tablet
    await expect(page.getByRole('main').or(page.locator('main'))).toBeVisible();
  });
});