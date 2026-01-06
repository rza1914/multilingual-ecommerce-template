/**
 * Smart Search Bar Component
 * AI-powered search with Quick Actions and glassmorphism styling
 * RTL/LTR safe
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Loader2, Brain } from 'lucide-react';
import { API_CONFIG } from '../../config/api.config';
import { getFullApiUrl } from '../../config/api';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types/product.types';
import { formatCurrency } from '../../utils/i18n';
import AIQuickActions from './AIQuickActions';

interface SmartSearchResult {
  results: Product[];
  explanation: string;
  extracted_filters: Record<string, unknown>;
  total_results: number;
}


interface SmartSearchBarProps {
  onSearch?: (results: Product[], query?: string) => void;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SmartSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample suggestions
  const sampleSuggestions = [
    t('search.suggestion1', 'گوشی سامسونگ زیر 20 میلیون'),
    t('search.suggestion2', 'لپ تاپ گیمینگ تا 40 میلیون'),
    t('search.suggestion3', 'هدفون بی‌سیم با کیفیت'),
    t('search.suggestion4', 'ساعت اپل با قیمت مناسب'),
    t('search.suggestion5', 'تبلت برای کار و تفریح')
  ];

  // Handle clicks outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as HTMLElement)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (query.trim()) {
      const filtered = sampleSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setShowResults(true);

    try {
      const response = await fetch(getFullApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.SMART_SEARCH), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SmartSearchResult = await response.json();
      setResults(data);

      if (onSearch) {
        onSearch(data.results, searchQuery);
      }
    } catch (error) {
      console.error('Error performing smart search:', error);
      const errorResult: SmartSearchResult = {
        results: [],
        explanation: t('search.error_message', 'متاسفانه خطایی در پردازش جستجو رخ داد. لطفاً دوباره امتحان کنید.'),
        extracted_filters: {},
        total_results: 0
      };
      setResults(errorResult);

      if (onSearch) {
        onSearch(errorResult.results);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle Quick Action selection
  const handleQuickAction = (prompt: string) => {
    setQuery(prompt);
    inputRef.current?.focus();
    // Optionally auto-search
    handleSearch(prompt);
  };

  return (
    <div className="w-full max-w-3xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input Container - Glass Card Style */}
        <div className="glass-card !rounded-2xl border-2 border-orange-500/30 flex items-center overflow-hidden">
          {/* AI Icon - Brain/Sparkles hybrid feel */}
          <div className="glass-orange p-3 m-1.5 rounded-xl flex-shrink-0">
            <Brain className="w-5 h-5 text-orange-500" />
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder', 'جستجوی هوشمند محصولات...')}
            className="flex-1 py-3 px-2 bg-transparent border-none outline-none
                       text-gray-900 dark:text-white
                       placeholder:text-gray-500 dark:placeholder:text-gray-400"
            onFocus={() => query && setShowResults(true)}
          />

          {/* AI Quick Actions Button */}
          <AIQuickActions
            onActionSelect={handleQuickAction}
            className="me-1"
          />

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex-shrink-0 m-1.5 px-5 py-2.5 rounded-xl
                       bg-gradient-to-r from-orange-500 to-orange-600
                       text-white font-semibold
                       hover:shadow-lg hover:shadow-orange-500/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200
                       flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">{t('search.loading', 'جستجو')}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">{t('search.submit', 'جستجو')}</span>
              </>
            )}
          </button>
        </div>

        {/* AI Hint */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t('search.aiHint', 'جستجوی هوشمند با هوش مصنوعی')}
          </span>
        </div>

        {/* Suggestions Dropdown */}
        {query && suggestions.length > 0 && !loading && !results && (
          <div className="absolute z-50 w-full mt-2 glass-card !rounded-2xl border-2 border-orange-500/30 overflow-hidden animate-scale-in">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 cursor-pointer
                           hover:bg-orange-500/10
                           text-gray-900 dark:text-white
                           transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Dropdown */}
        {showResults && (results || loading) && (
          <div className="absolute z-50 w-full mt-2 glass-card !rounded-2xl border-2 border-orange-500/30 max-h-96 overflow-y-auto animate-scale-in">
            {loading ? (
              <div className="p-6 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('search.processing', 'در حال پردازش با هوش مصنوعی...')}
                </span>
              </div>
            ) : results && (
              <div className="p-4">
                {/* AI Explanation */}
                <div className="mb-4 p-3 glass-orange !rounded-xl">
                  <div className="flex items-start gap-2">
                    <Brain className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {results.explanation}
                    </p>
                  </div>
                </div>

                {/* Extracted Filters */}
                {Object.keys(results.extracted_filters).length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {results.extracted_filters.max_price && (
                      <span className="glass-orange px-3 py-1 rounded-full text-xs font-medium text-orange-600 dark:text-orange-400">
                        {t('search.upTo', 'تا')} {formatCurrency(results.extracted_filters.max_price as number)}
                      </span>
                    )}
                    {results.extracted_filters.brand && (
                      <span className="glass-card px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                        {results.extracted_filters.brand as string}
                      </span>
                    )}
                    {results.extracted_filters.category && (
                      <span className="glass-card px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                        {results.extracted_filters.category as string}
                      </span>
                    )}
                  </div>
                )}

                {/* Results List */}
                <div className="space-y-2">
                  {results.results.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      {t('search.no_results', 'محصولی یافت نشد')}
                    </div>
                  ) : (
                    results.results.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 rounded-xl
                                   hover:bg-orange-500/10 transition-colors cursor-pointer"
                      >
                        {/* Product Image */}
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title_en}
                            className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
                        )}

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {product.title_en}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {product.description_en?.substring(0, 50)}...
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-bold text-orange-500">
                              {formatCurrency(product.price)}
                            </span>
                            {product.discount && product.discount > 0 && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatCurrency(product.price * (1 + product.discount / 100))}
                              </span>
                            )}
                            {product.rating && (
                              <span className="text-xs text-yellow-500">
                                ⭐ {product.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* View All Results */}
                {results.results.length > 5 && (
                  <div className="mt-4 pt-3 border-t border-white/10 text-center">
                    <button
                      type="button"
                      onClick={() => setShowResults(false)}
                      className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                    >
                      {t('search.viewAll', 'مشاهده همه')} ({results.total_results})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SmartSearchBar;