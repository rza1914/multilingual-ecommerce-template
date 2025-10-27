/**
 * Products Context
 * Global state management for products with caching and filtering
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, ProductFilters } from '../types/product.types';
import * as productService from '../services/product.service';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;

  // Fetch functions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchFeaturedProducts: (limit?: number) => Promise<void>;

  // Filter functions
  setFilters: (filters: ProductFilters) => void;
  searchProducts: (query: string) => Promise<void>;
  filterByPrice: (minPrice: number, maxPrice: number) => Promise<void>;
  clearFilters: () => Promise<void>;

  // Utility
  refetch: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ProductFilters>({});

  // Cache to avoid unnecessary API calls
  const [cache, setCache] = useState<{ [key: string]: Product[] }>({});

  /**
   * Generate cache key from filters
   */
  const getCacheKey = (filters?: ProductFilters): string => {
    return JSON.stringify(filters || {});
  };

  /**
   * Fetch products with optional filters
   */
  const fetchProducts = useCallback(async (newFilters?: ProductFilters) => {
    const finalFilters = newFilters || filters;
    const cacheKey = getCacheKey(finalFilters);

    // Check cache first
    if (cache[cacheKey]) {
      setProducts(cache[cacheKey]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await productService.getProducts(finalFilters);
      setProducts(data);

      // Update cache
      setCache(prev => ({ ...prev, [cacheKey]: data }));

      // Update filters state
      if (newFilters) {
        setFiltersState(newFilters);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, cache]);

  /**
   * Fetch featured products
   */
  const fetchFeaturedProducts = useCallback(async (limit: number = 6) => {
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getFeaturedProducts(limit);
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured products';
      setError(errorMessage);
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search products by query
   */
  const searchProducts = useCallback(async (query: string) => {
    const newFilters = { ...filters, search: query };
    await fetchProducts(newFilters);
  }, [filters, fetchProducts]);

  /**
   * Filter products by price range
   */
  const filterByPrice = useCallback(async (minPrice: number, maxPrice: number) => {
    const newFilters = { ...filters, minPrice, maxPrice };
    await fetchProducts(newFilters);
  }, [filters, fetchProducts]);

  /**
   * Clear all filters and fetch all products
   */
  const clearFilters = useCallback(async () => {
    setFiltersState({});
    await fetchProducts({});
  }, [fetchProducts]);

  /**
   * Set filters without fetching
   */
  const setFilters = useCallback((newFilters: ProductFilters) => {
    setFiltersState(newFilters);
  }, []);

  /**
   * Refetch with current filters
   */
  const refetch = useCallback(async () => {
    // Clear cache for current filters
    const cacheKey = getCacheKey(filters);
    setCache(prev => {
      const newCache = { ...prev };
      delete newCache[cacheKey];
      return newCache;
    });

    await fetchProducts(filters);
  }, [filters, fetchProducts]);

  const value: ProductsContextType = {
    products,
    loading,
    error,
    filters,
    fetchProducts,
    fetchFeaturedProducts,
    setFilters,
    searchProducts,
    filterByPrice,
    clearFilters,
    refetch,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

/**
 * Hook to use Products context
 */
export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};
