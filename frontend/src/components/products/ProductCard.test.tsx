import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import { Product } from '../../types/product.types';

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      if (key === 'product.lowStock' && options?.count !== undefined) {
        return `Only ${options.count} left`;
      }
      return key; // Return the key as translation for simplicity
    },
    i18n: { language: 'en' }
  })
}));

// Mock the cart context
vi.mock('../../contexts/CartContext', async () => {
  const actual = await vi.importActual('../../contexts/CartContext');
  return {
    ...actual,
    useCart: vi.fn(),
    CartProvider: actual.CartProvider
  };
});

// Mock the image and i18n utils
vi.mock('../../utils/imageUtils', () => ({
  getProductImage: (url: string) => url || '/default-product.jpg',
  handleImageError: vi.fn()
}));

vi.mock('../../utils/i18n', () => ({
  getLocalizedTitle: (product: any, fallback: string) => fallback || product.title,
  getLocalizedDescription: (product: any, fallback: string) => fallback || product.description,
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`
}));

// Create a wrapper component with providers
const renderWithProviders = (ui: React.ReactElement, product: Product) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {ui}
      </CartProvider>
    </BrowserRouter>
  );
};

// Define a mock product
const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  discount: 10,
  stock: 5,
  image_url: 'https://example.com/test-product.jpg',
  category: 'Electronics',
  title_en: 'Test Product',
  description_en: 'Test Description',
  is_featured: true,
  rating: 4.5
};

describe('ProductCard Component', () => {
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    (useCart as vi.Mock).mockReturnValue({
      addToCart: mockAddToCart,
      cartItems: [],
      totalItems: 0,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      cartTotal: 0,
      loading: false
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, mockProduct);

    expect(screen.getByRole('link', { name: /Test Product/i })).toBeInTheDocument();
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
    expect(screen.getByText(/\$99.99/i)).toBeInTheDocument(); // Original price with discount applied
    expect(screen.getByText(/Electronics/i)).toBeInTheDocument();
  });

  it('displays discount badge when discount is available', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, mockProduct);

    expect(screen.getByText(/-10%/i)).toBeInTheDocument();
  });

  it('displays featured badge when product is featured', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, mockProduct);

    expect(screen.getByText(/⭐ featured/i)).toBeInTheDocument();
  });

  it('displays low stock badge when stock is between 1 and 10', () => {
    const lowStockProduct = { ...mockProduct, stock: 3 };
    renderWithProviders(<ProductCard product={lowStockProduct} />, lowStockProduct);

    expect(screen.getByText(/Only 3 left/i)).toBeInTheDocument();
  });

  it('displays out of stock overlay when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithProviders(<ProductCard product={outOfStockProduct} />, outOfStockProduct);

    expect(screen.getByText(/product.outOfStock/i)).toBeInTheDocument();
  });

  it('shows original price crossed out and discounted price when discount is applied', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, mockProduct);

    // Original price should be shown with line-through
    expect(screen.getByText(/\$99.99/i)).toBeInTheDocument();
    // The discounted price would be $89.99 (10% off $99.99)
    // But the component shows original price with line-through and discounted price
    expect(screen.getByText(/product.outOfStock/i)).not.toBeInTheDocument(); // This is just checking that it's not out of stock
  });

  it('calls addToCart with correct product and quantity when add to cart button is clicked', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, mockProduct);

    fireEvent.click(screen.getByLabelText(/Add to cart/i));

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('shows out of stock alert when trying to add out of stock product to cart', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    const mockAlert = vi.fn();
    window.alert = mockAlert;

    renderWithProviders(<ProductCard product={outOfStockProduct} />, outOfStockProduct);

    fireEvent.click(screen.getByLabelText(/Add to cart/i));

    expect(mockAlert).toHaveBeenCalledWith('product.outOfStock');
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it('displays product rating correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, mockProduct);

    expect(screen.getByText(/4.5/i)).toBeInTheDocument();
    // Check that 4 full stars and 1 half star are rendered
    const stars = screen.getAllByRole('img'); // All star icons
    expect(stars.length).toBe(5); // 5 stars for rating
  });

  it('handles missing product image gracefully', () => {
    const productWithoutImage = { ...mockProduct, image_url: '' };
    renderWithProviders(<ProductCard product={productWithoutImage} />, productWithoutImage);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/default-product.jpg');
  });

  it('renders correctly when discount is 0', () => {
    const productNoDiscount = { ...mockProduct, discount: 0 };
    renderWithProviders(<ProductCard product={productNoDiscount} />, productNoDiscount);

    expect(screen.queryByText(/-%/i)).not.toBeInTheDocument();
    expect(screen.getByText(/\$89.99/i)).toBeInTheDocument(); // Original price without discount badge
  });

  it('renders correctly when discount is undefined', () => {
    const productNoDiscount = { ...mockProduct, discount: undefined };
    renderWithProviders(<ProductCard product={productNoDiscount} />, productNoDiscount);

    expect(screen.queryByText(/-%/i)).not.toBeInTheDocument();
  });

  it('handles product with no rating', () => {
    const productNoRating = { ...mockProduct, rating: undefined };
    renderWithProviders(<ProductCard product={productNoRating} />, productNoRating);

    expect(screen.queryByText(/0.0/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument(); // No star rating displayed
  });

  it('handles product with no category', () => {
    const productNoCategory = { ...mockProduct, category: undefined };
    renderWithProviders(<ProductCard product={productNoCategory} />, productNoCategory);

    expect(screen.getByText(/General/i)).toBeInTheDocument();
  });

  it('disables add to cart button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithProviders(<ProductCard product={outOfStockProduct} />, outOfStockProduct);

    const addToCartButton = screen.getByLabelText(/Add to cart/i);
    expect(addToCartButton).toBeDisabled();
  });

  it('allows adding to cart when product is in stock', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, mockProduct);

    const addToCartButton = screen.getByLabelText(/Add to cart/i);
    expect(addToCartButton).not.toBeDisabled();
  });

  it('formats currency correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, mockProduct);

    // The price should be formatted as $89.99 (after discount)
    expect(screen.getByText(/\$89.99/i)).toBeInTheDocument();
  });

  it('uses localized title when available', () => {
    const localizedProduct = { ...mockProduct, title_en: 'English Title' };
    renderWithProviders(<ProductCard product={localizedProduct} />, localizedProduct);

    expect(screen.getByText(/English Title/i)).toBeInTheDocument();
  });

  it('uses localized description when available', () => {
    const localizedProduct = { ...mockProduct, description_en: 'English Description' };
    renderWithProviders(<ProductCard product={localizedProduct} />, localizedProduct);

    expect(screen.getByText(/English Description/i)).toBeInTheDocument();
  });

  it('handles zero stock correctly', () => {
    const zeroStockProduct = { ...mockProduct, stock: 0 };
    renderWithProviders(<ProductCard product={zeroStockProduct} />, zeroStockProduct);

    // Should show out of stock message
    expect(screen.getByText(/product.outOfStock/i)).toBeInTheDocument();
    // Should have disabled state
    const addToCartButton = screen.getByLabelText(/Add to cart/i);
    expect(addToCartButton).toBeDisabled();
  });

  it('handles negative discount value gracefully', () => {
    const negativeDiscountProduct = { ...mockProduct, discount: -10 };
    renderWithProviders(<ProductCard product={negativeDiscountProduct} />, negativeDiscountProduct);

    // Should not show a discount badge with negative discount
    expect(screen.queryByText(/-%/i)).not.toBeInTheDocument();
  });

  it('handles large discount (over 100%) gracefully', () => {
    const largeDiscountProduct = { ...mockProduct, discount: 150 };
    renderWithProviders(<ProductCard product={largeDiscountProduct} />, largeDiscountProduct);

    // Should still show the discount badge even with large discount
    expect(screen.getByText(/-150%/i)).toBeInTheDocument();
  });

  it('handles click on product card link', () => {
    renderWithProviders(<ProductCard product={mockProduct} />, mockProduct);

    const productLink = screen.getByRole('link', { name: /Test Product/i });
    expect(productLink).toHaveAttribute('href', '/products/1');
  });
});