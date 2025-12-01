/**
 * Products Page
 * Browse and filter products with search functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Product } from '../types/product.types';
import * as productService from '../services/product.service';
import ProductCard from '../components/products/ProductCard';
import { ProductSkeletonGrid } from '../components/products/ProductSkeleton';
import SmartSearchBar from '../components/ai/SmartSearchBar'; // Updated import
import { LegacyWrapper } from '../components/legacy/LegacyWrapper';
import { MultilingualSmartSearchBar } from '../components/ai/multilingual/MultilingualSmartSearchBar'; // Legacy version
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
  // const [isSmartSearchActive, setIsSmartSearchActive] = useState(false); // Currently unused
  const [useLegacy, setUseLegacy] = useState(false);
  const [filterType, setFilterType] = useState<'featured' | 'new' | 'bestsellers' | null>(null);

  /**
   * Fetch products with filters
   */
  const fetchProducts = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get search from parameter if no explicit query provided
      const search = query !== undefined ? query : searchQuery;

      // Fetch all products first
      let data = await productService.getProducts({
        search: search || undefined,
        minPrice,
        maxPrice,
      });

      // Apply additional filtering based on current filterType state
      if (filterType === 'new') {
        // Sort by creation date if available, otherwise by ID (newer IDs are newer)
        data = data.sort((a, b) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          } else {
            // Fallback: sort by ID if no creation date
            return (b.id || 0) - (a.id || 0);
          }
        }).slice(0, 20); // Limit to 20 newest
      } else if (filterType === 'bestsellers') {
        // In a real implementation, you'd sort by sales/quantity sold
        // For now, we'll simulate: prioritize featured products as bestsellers
        data = data.sort((a, b) => {
          // Prioritize featured products
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          // Then sort by rating if available
          return (b.rating || 0) - (a.rating || 0);
        }).slice(0, 20);
      } else if (filterType === 'featured') {
        // Filter to featured products only
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
  }, [searchQuery, minPrice, maxPrice, filterType]);


  // Handle URL parameters on component mount and when location changes
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

    // Fetch products based on parameters
    fetchProducts();
  }, [location.search, fetchProducts, filterType]);


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
              } 
            }} 
          />
        ) : (
          <SmartSearchBar onSearch={(results: Product[], query?: string) => {
            setProducts(results);
            if (query) {
              setSearchQuery(query);
            }
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
