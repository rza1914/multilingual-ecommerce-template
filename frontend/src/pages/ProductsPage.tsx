/**
 * Products Page
 * Browse and filter products with search functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { Product } from '../types/product.types';
import * as productService from '../services/product.service';
import ProductCard from '../components/products/ProductCard';
import { ProductSkeletonGrid } from '../components/products/ProductSkeleton';
import SearchBar from '../components/search/SearchBar';
import SmartSearchBar from '../components/ai/SmartSearchBar'; // Updated import
import { LegacyWrapper } from '../components/legacy/LegacyWrapper';
import { MultilingualSmartSearchBar } from '../components/ai/multilingual/MultilingualSmartSearchBar'; // Legacy version
import FiltersSidebar from '../components/products/FiltersSidebar';
import EmptyState from '../components/EmptyState';
import { useTranslation } from 'react-i18next';

const ProductsPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSmartSearchActive, setIsSmartSearchActive] = useState(false);
  const [useLegacy, setUseLegacy] = useState(false);

  /**
   * Fetch products with filters
   */
  const fetchProducts = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const search = query !== undefined ? query : searchQuery;
      const data = await productService.getProducts({
        search: search || undefined,
        minPrice,
        maxPrice,
      });
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('products.loadError');
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, minPrice, maxPrice]);

  /**
   * Handle smart search
   */
  const handleSmartSearch = useCallback(async (query: string) => {
    setIsSmartSearchActive(true);
    setLoading(true);
    setError(null);

    try {
      // Smart search may need a different API endpoint
      // For now, we'll use the same productService but this could be expanded
      const response = await fetch('/api/v1/products/smart-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Smart search failed');
      }

      const data = await response.json();
      setProducts(data.results || []);
    } catch (err) {
      console.error('Smart search error:', err);
      // Fallback to regular search
      setSearchQuery(query);
      fetchProducts(query);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

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
          {t('products.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {t('products.subtitle')}
        </p>
      </div>

      {/* Toggle between legacy and new versions */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setUseLegacy(!useLegacy)}
          className={`px-6 py-3 rounded-lg ${useLegacy ? 'bg-orange-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'} text-white font-medium hover:opacity-90 transition-opacity`}
        >
          {useLegacy ? t('common.use_legacy') : t('common.use_new')}
        </button>
      </div>

      {/* Smart Search Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        {useLegacy ? (
          <LegacyWrapper 
            component={MultilingualSmartSearchBar} 
            legacyProps={{ 
              onSearch: (results: Product[], query?: string) => {
                setProducts(results);
                if (query) {
                  setSearchQuery(query);
                }
                setIsSmartSearchActive(true);
              } 
            }} 
          />
        ) : (
          <SmartSearchBar onSearch={(results: Product[], query?: string) => {
            setProducts(results);
            if (query) {
              setSearchQuery(query);
            }
            setIsSmartSearchActive(true);
          }} />
        )}
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
                {t(products.length === 1 ? 'products.productFound' : 'products.productsFound')}
                {hasActiveFilters && (
                  <span className="ml-2 text-sm">
                    ({t('products.filtered')})
                  </span>
                )}
              </p>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  {t('products.clearAllFilters')}
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
                  {t('products.errorTitle')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <button onClick={handleRetry} className="btn-primary">
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  {t('products.tryAgain')}
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <EmptyState
              icon="🔍"
              title={hasActiveFilters ? t('products.noProductsFound') : t('products.noProductsAvailable')}
              message={
                hasActiveFilters
                  ? t('products.noProductsFoundMessage')
                  : t('products.noProductsAvailableMessage')
              }
              actionLabel={hasActiveFilters ? t('products.clearFilters') : undefined}
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
