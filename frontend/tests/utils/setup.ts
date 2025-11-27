import { Page } from '@playwright/test';

/**
 * Setup API mocks for consistent testing
 */
export async function setupApiMocks(page: Page) {
  // Mock products data
  const mockProducts = [
    {"id": 1, "title": "محصول تست ۱", "title_en": "Test Product 1", "price": 99000, "image_url": "/images/placeholder.jpg", "category": "Electronics", "description": "A test product for automation testing", "stock": 10, "rating": 4.5, "is_featured": true},
    {"id": 2, "title": "محصول تست ۲", "title_en": "Test Product 2", "price": 149000, "image_url": "/images/placeholder.jpg", "category": "Accessories", "description": "Another test product for automation testing", "stock": 5, "rating": 4.2, "is_featured": false}
  ];

  // Mock products API
  await page.route('**/api/v1/products**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProducts)
    });
  });

  // Mock featured products API
  await page.route('**/api/v1/products/featured**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProducts.slice(0, 2))
    });
  });

  // Mock single product API
  await page.route('**/api/v1/products/*', async route => {
    const url = route.request().url();
    const id = url.split('/').pop();
    const product = mockProducts.find(p => p.id.toString() === id) || mockProducts[0];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(product)
    });
  });

  // Mock cart API
  await page.route('**/api/v1/cart**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ items: [], total: 0 })
    });
  });

  // Mock auth API
  await page.route('**/api/v1/auth**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: { id: 1, username: 'testuser' }, token: 'mock-token' })
    });
  });
}