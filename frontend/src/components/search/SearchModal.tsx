import { useEffect, useState } from 'react';
import { X, Search, TrendingUp, Clock } from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { Product } from '../../types/product.types';
import { useTranslation } from '../../config/i18n';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductClick?: (product: Product) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onProductClick }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches] = useState<string[]>(['Laptop', 'Headphones', 'Smartwatch']);

  useEffect(() => {
    // Handle ESC key to close modal
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  // Search products
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const results = mockProducts.filter(
        (product) =>
          product.title_en.toLowerCase().includes(query) ||
          product.description_en.toLowerCase().includes(query) ||
          (product.category?.toLowerCase() || '').includes(query)
      );
      setSearchResults(results.slice(0, 6)); // Limit to 6 results
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const popularProducts = mockProducts.filter((p) => p.is_featured).slice(0, 4);

  const handleProductClick = (product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[60] flex items-start justify-center p-4 pt-20 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border-2 border-orange-500/30 dark:border-orange-500/50 rounded-3xl shadow-2xl shadow-orange-500/20 dark:shadow-orange-500/30"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-6 border-b border-orange-500/20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.searchPlaceholder')}
                autoFocus
                className="w-full pl-14 pr-14 py-4 glass-orange rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none transition-all text-lg text-gray-900 dark:text-white placeholder-gray-500"
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 glass-orange p-2 rounded-xl hover:scale-110 transition-transform"
                aria-label={t('search.closeSearch')}
              >
                <X className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
            {searchQuery.trim().length > 0 ? (
              <>
                {/* Search Results */}
                {searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      {t('search.searchResults', { count: searchResults.length })}
                    </h3>
                    <div className="space-y-3">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="w-full flex items-center gap-4 p-4 glass-card rounded-2xl hover:border-orange-500 border-2 border-transparent transition-all group"
                        >
                          <img
                            src={product.image_url}
                            alt={product.title_en}
                            className="w-16 h-16 object-cover rounded-xl"
                          />
                          <div className="flex-1 text-left">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                              {product.title_en}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                              {product.description_en}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-bold text-gradient-orange">
                                ${product.discount && product.discount > 0
                                  ? (product.price * (1 - product.discount / 100)).toFixed(2)
                                  : product.price.toFixed(2)}
                              </span>
                              <span className="text-xs badge-glass">{product.category || t('search.generalCategory')}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {t('search.noResults')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('search.tryDifferentKeywords')}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t('search.recentSearches')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setSearchQuery(search)}
                          className="px-4 py-2 glass-orange rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Products */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {t('search.popularProducts')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center gap-4 p-4 glass-card rounded-2xl hover:border-orange-500 border-2 border-transparent transition-all group text-left"
                      >
                        <img
                          src={product.image_url}
                          alt={product.title_en}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                            {product.title_en}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                            {product.description_en}
                          </p>
                          <span className="text-sm font-bold text-gradient-orange">
                            ${product.discount && product.discount > 0
                              ? (product.price * (1 - product.discount / 100)).toFixed(2)
                              : product.price.toFixed(2)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
