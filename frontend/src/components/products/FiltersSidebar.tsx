/**
 * Filters Sidebar Component
 * Product filtering interface with price range
 */

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FiltersSidebarProps {
  onFilterChange: (minPrice?: number, maxPrice?: number) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  onFilterChange,
  onClearFilters,
  isOpen,
  onToggle,
}) => {
  const { t } = useTranslation();
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  /**
   * Handle apply filters
   */
  const handleApply = () => {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;

    onFilterChange(min, max);
  };

  /**
   * Handle clear filters
   */
  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    onClearFilters();
  };

  /**
   * Check if filters are active
   */
  const hasActiveFilters = minPrice !== '' || maxPrice !== '';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-6 right-6 z-40 btn-primary p-4 rounded-full shadow-2xl"
        aria-label="Toggle filters"
      >
        <Filter className="w-6 h-6" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            !
          </span>
        )}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-80 lg:w-auto
          bg-white/95 dark:bg-gray-900/95 lg:bg-transparent
          backdrop-blur-xl lg:backdrop-blur-none
          border-r lg:border-r-0 border-gray-200 dark:border-gray-800
          z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('filters.filters')}
              </h3>
              {hasActiveFilters && (
                <span className="badge-orange text-xs">
                  {t('filters.active')}
                </span>
              )}
            </div>

            {/* Close Button (Mobile) */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="glass-card p-6 space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('filters.priceRange')}
            </h4>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('filters.minPrice')}
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder={t('filters.placeholderMin')}
                min="0"
                step="1"
                className="input-field"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('filters.maxPrice')}
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={t('filters.placeholderMax')}
                min="0"
                step="1"
                className="input-field"
              />
            </div>

            {/* Visual Price Range */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>${minPrice || '0'}</span>
                <span>${maxPrice || '∞'}</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" />
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              className="btn-primary w-full"
              disabled={!hasActiveFilters}
            >
              {t('filters.applyFilters')}
            </button>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="w-full btn-glass text-red-500 dark:text-red-400 border-red-500/20"
            >
              <X className="w-4 h-4 inline mr-2" />
              {t('filters.clearAll')}
            </button>
          )}

          {/* Filter Info */}
          <div className="glass p-4 rounded-2xl">
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <strong className="text-orange-500">{t('filters.tip')}</strong> {t('filters.priceFilterTip')}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FiltersSidebar;
