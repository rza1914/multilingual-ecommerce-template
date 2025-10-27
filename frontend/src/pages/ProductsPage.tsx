/**
 * Products Page
 * Browse and filter products with search functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Product } from '../types/product.types';
import * as productService from '../services/product.service';
import ProductCard from '../components/products/ProductCard';
import { ProductSkeletonGrid } from '../components/products/ProductSkeleton';
import SearchBar from '../components/search/SearchBar';
import FiltersSidebar from '../components/products/FiltersSidebar';
import EmptyState from '../components/EmptyState';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  /**
   * Fetch products with filters
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productService.getProducts({
        search: searchQuery || undefined,
        minPrice,
        maxPrice,
      });
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, minPrice, maxPrice]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Handle search
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  /**
   * Handle price filter
   */
  const handleFilterChange = useCallback((min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setIsFiltersOpen(false); // Close on mobile
  }, []);

  /**
   * Handle clear filters
   */
  const handleClearFilters = useCallback(() => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSearchQuery('');
  }, []);

  /**
   * Handle retry on error
   */
  const handleRetry = () => {
    fetchProducts();
  };

  /**
   * Toggle filters sidebar (mobile)
   */
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || minPrice !== undefined || maxPrice !== undefined;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-hero text-gradient-orange mb-4">
          Our Products
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse our collection of premium products
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search products by name or description..."
          loading={loading}
        />
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <FiltersSidebar
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          isOpen={isFiltersOpen}
          onToggle={toggleFilters}
        />

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {/* Products Count & Status */}
          {!loading && !error && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-orange-500">
                  {products.length}
                </span>{' '}
                {products.length === 1 ? 'product' : 'products'} found
                {hasActiveFilters && (
                  <span className="ml-2 text-sm">
                    (filtered)
                  </span>
                )}
              </p>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && <ProductSkeletonGrid count={6} />}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="glass-card p-12 max-w-md mx-auto">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <button onClick={handleRetry} className="btn-primary">
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <EmptyState
              icon="🔍"
              title={hasActiveFilters ? 'No products found' : 'No products available'}
              message={
                hasActiveFilters
                  ? 'Try adjusting your search or filters to find what you are looking for.'
                  : 'There are no products available at the moment. Please check back later!'
              }
              actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
              onAction={hasActiveFilters ? handleClearFilters : undefined}
            />
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
