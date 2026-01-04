/**
 * Filters Sidebar Component
 * Product filtering interface with price range
 * Updated: Now renders as a glass drawer overlay on all screen sizes
 */

import React, { useState, useEffect } from 'react';
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
   * Handle ESC key to close drawer
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onToggle]);

  /**
   * Handle apply filters
   */
  const handleApply = () => {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;
    onFilterChange(min, max);
    onToggle(); // Close drawer after applying
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
      {/* Toggle Button - Always visible */}
      <button
        onClick={onToggle}
        className="fixed bottom-40 ltr:right-6 rtl:left-6 z-40 btn-primary p-4 rounded-full shadow-2xl"
        aria-label={t('buttons.toggleFilters')}
      >
        <Filter className="w-6 h-6" />
        {hasActiveFilters && (
          <span className="absolute -top-1 ltr:-right-1 rtl:-left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            !
          </span>
        )}
      </button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel - Glass effect, RTL aware */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        className={`
          fixed top-0 bottom-0 z-50
          w-80 max-w-[85vw]
          ltr:right-0 rtl:left-0
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'invisible pointer-events-none ltr:translate-x-full rtl:-translate-x-full'}
        `}
      >
        {/* Glass Card Container */}
        <div className="h-full glass-card !rounded-none ltr:!rounded-l-3xl rtl:!rounded-r-3xl border-0 ltr:border-l rtl:border-r border-white/20 dark:border-white/10 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="glass-orange p-2 rounded-xl">
                  <Filter className="w-5 h-5 text-orange-500" />
                </div>
                <h3 id="filters-title" className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('filters.filters')}
                </h3>
                {hasActiveFilters && (
                  <span className="badge-orange text-xs">
                    {t('filters.active')}
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onToggle}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                aria-label={t('buttons.closeFilters')}
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Price Range Filter */}
            <div className="glass p-6 rounded-2xl space-y-4">
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
                <div className="h-2 bg-white/20 dark:bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" />
                </div>
              </div>
            </div>

            {/* Filter Info */}
            <div className="glass p-4 rounded-2xl">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                <strong className="text-orange-500">{t('filters.tip')}</strong> {t('filters.priceFilterTip')}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/10 space-y-3">
            {/* Apply Button */}
            <button
              onClick={handleApply}
              className="btn-primary w-full"
            >
              {t('filters.applyFilters')}
            </button>

            {/* Clear All Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="w-full btn-glass text-red-500 dark:text-red-400 border-red-500/20"
              >
                <X className="w-4 h-4 inline me-2" />
                {t('filters.clearAll')}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default FiltersSidebar;