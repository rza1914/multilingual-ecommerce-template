/**
 * Products Page
 * Browse and filter products with Smart Search
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Product } from '../types/product.types';
import * as productService from '../services/product.service';
import ProductCard from '../components/products/ProductCard';
import { ProductSkeletonGrid } from '../components/products/ProductSkeleton';
import SmartSearchBar from '../components/ai/SmartSearchBar';
import FiltersSidebar from '../components/products/FiltersSidebar';
import EmptyState from '../components/EmptyState';
import { useTranslation } from 'react-i18next';

const ProductsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterType, setFilterType] = useState<'featured' | 'new' | 'bestsellers' | null>(null);

  /**
   * Fetch products with filters
   */
  const fetchProducts = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      const search = query !== undefined ? query : searchQuery;

      let data = await productService.getProducts({
        search: search || undefined,
        minPrice,
        maxPrice,
      });

      // Apply filtering based on filterType
      if (filterType === 'new') {
        data = data.sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return (b.id || 0) - (a.id || 0);
        }).slice(0, 20);
      } else if (filterType === 'bestsellers') {
        data = data.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (b.rating || 0) - (a.rating || 0);
        }).slice(0, 20);
      } else if (filterType === 'featured') {
        data = data.filter(product => product.is_featured === true);
      }

      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('products.loadError');
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, minPrice, maxPrice, filterType, t]);

  // Handle URL parameters
  useEffect(() => {
    const newParam = searchParams.get('new');
    const bestsellersParam = searchParams.get('bestsellers');
    const featuredParam = searchParams.get('featured');

    let newFilterType: 'featured' | 'new' | 'bestsellers' | null = null;

    if (newParam === 'true') {
      newFilterType = 'new';
    } else if (bestsellersParam === 'true') {
      newFilterType = 'bestsellers';
    } else if (featuredParam === 'true') {
      newFilterType = 'featured';
    }

    if (newFilterType !== filterType) {
      setFilterType(newFilterType);
    }

    fetchProducts();
  }, [location.search, fetchProducts, filterType]);

  /**
   * Handle price filter
   */
  const handleFilterChange = useCallback((min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  }, []);

  // Refetch when price filters change
  useEffect(() => {
    if (minPrice !== undefined || maxPrice !== undefined) {
      fetchProducts();
    }
  }, [minPrice, maxPrice, fetchProducts]);

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
   * Toggle filters drawer
   */
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const hasActiveFilters = searchQuery || minPrice !== undefined || maxPrice !== undefined;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-hero text-gradient-orange mb-4">
          {filterType === 'new' ? t('products.new_arrivals_title', 'New Arrivals') :
           filterType === 'bestsellers' ? t('products.bestsellers_title', 'Bestsellers') :
           filterType === 'featured' ? t('products.featured_title', 'Featured Products') :
           t('products.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {filterType === 'new' ? t('products.new_arrivals_subtitle', 'Recently added items') :
           filterType === 'bestsellers' ? t('products.bestsellers_subtitle', 'Our most popular items') :
           filterType === 'featured' ? t('products.featured_subtitle', 'Curated selection of our best products') :
           t('products.subtitle')}
        </p>
      </div>

      {/* Smart Search Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <SmartSearchBar
          onSearch={(results: Product[], query?: string) => {
            setProducts(results);
            if (query) {
              setSearchQuery(query);
            }
          }}
        />
      </div>

      {/* Products Content - Full width now (no sidebar in layout) */}
      <div>
        {/* Products Count & Status */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-orange-500">
                {products.length}
              </span>{' '}
              {t(products.length === 1 ? 'products.productFound' : 'products.productsFound')}
              {hasActiveFilters && (
                <span className="ms-2 text-sm">
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
                <RefreshCw className="w-4 h-4 inline me-2" />
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

        {/* Products Grid - Now uses full width */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
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

      {/* Filters Drawer - Now overlay on all screen sizes */}
      <FiltersSidebar
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        isOpen={isFiltersOpen}
        onToggle={toggleFilters}
      />
    </div>
  );
};

export default ProductsPage;