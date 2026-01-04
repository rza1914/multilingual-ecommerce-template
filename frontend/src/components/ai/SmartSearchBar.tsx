/**
 * Smart Search Bar Component
 * AI-powered search with Quick Actions that open ChatBot
 * Updated: Removed redundant search button, Brain → Sparkles, Quick Actions → ChatBot
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Loader2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types/product.types';
import { API_CONFIG } from '../../config/api.config';

interface SmartSearchResult {
  results: Product[];
  total_results: number;
  explanation: string;
  extracted_filters: Record<string, unknown>;
}

interface SmartSearchBarProps {
  onSearch: (results: Product[], query?: string) => void;
}

// Quick Actions configuration
const QUICK_ACTIONS = [
  {
    id: 'compare_prices',
    labelKey: 'ai.actions.comparePrices',
    prompt: 'Compare prices of similar products and find the best deal'
  },
  {
    id: 'find_size',
    labelKey: 'ai.actions.findSize',
    prompt: 'Help me find the correct size based on my preferences'
  },
  {
    id: 'summarize_reviews',
    labelKey: 'ai.actions.summarizeReviews',
    prompt: 'Summarize customer reviews and highlight pros and cons'
  },
  {
    id: 'worth_buying',
    labelKey: 'ai.actions.worthBuying',
    prompt: 'Is this product worth buying? Analyze value for money'
  },
  {
    id: 'suggest_alternatives',
    labelKey: 'ai.actions.suggestAlternatives',
    prompt: 'Suggest better alternatives to this product'
  }
];

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ onSearch }) => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SmartSearchResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [suggestions] = useState<string[]>([
    'گوشی موبایل',
    'لپ تاپ گیمینگ',
    'هدفون بی سیم',
    'ساعت هوشمند'
  ]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  // Format currency based on locale
  const formatCurrency = useCallback((price: number) => {
    return new Intl.NumberFormat(i18n.language === 'fa' ? 'fa-IR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  }, [i18n.language]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowQuickActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowResults(false);
        setShowQuickActions(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  /**
   * Handle Quick Action click - dispatch event to open ChatBot with prompt
   */
  const handleQuickActionClick = (action: typeof QUICK_ACTIONS[0]) => {
    setShowQuickActions(false);
    
    // Dispatch custom event to open ChatBot with this prompt
    const event = new CustomEvent('openChatWithPrompt', {
      detail: {
        prompt: action.prompt,
        actionId: action.id
      }
    });
    window.dispatchEvent(event);
  };

  /**
   * Handle search submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setShowResults(true);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS.SMART_SEARCH}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() })
        }
      );

      if (!response.ok) throw new Error('Search failed');

      const data: SmartSearchResult = await response.json();
      setResults(data);
      onSearch(data.results, query);
    } catch (error) {
      console.error('Smart search error:', error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-3xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input Container - Glass Card Style */}
        <div className="glass-card !rounded-2xl border-2 border-orange-500/30 flex items-center overflow-hidden">
          {/* AI Icon - Sparkles (clickable for Quick Actions) */}
          <button
            type="button"
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="glass-orange p-3 m-1.5 rounded-xl flex-shrink-0 hover:scale-105 transition-transform"
            aria-label={t('ai.quickActions.title', 'AI Quick Actions')}
            aria-expanded={showQuickActions}
          >
            <Sparkles className="w-5 h-5 text-orange-500" />
          </button>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder={t('search.placeholder', 'جستجوی هوشمند محصولات...')}
            className="flex-1 py-3 px-2 bg-transparent border-none outline-none
                       text-gray-900 dark:text-white
                       placeholder:text-gray-500 dark:placeholder:text-gray-400"
            onFocus={() => query && setShowResults(true)}
          />

          {/* Loading indicator inside input */}
          {loading && (
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin me-3" />
          )}
        </div>

        {/* AI Hint */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t('search.aiHint', 'کلیک روی آیکون برای دستیار هوشمند')}
          </span>
        </div>

        {/* Quick Actions Dropdown */}
        {showQuickActions && (
          <div
            ref={quickActionsRef}
            className="absolute z-50 w-full mt-2 glass-card !rounded-2xl border-2 border-orange-500/30 overflow-hidden animate-scale-in"
            role="menu"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {t('ai.quickActions.title', 'دستیار هوشمند')}
              </span>
            </div>

            {/* Actions List */}
            <div className="py-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleQuickActionClick(action)}
                  className="w-full px-4 py-3 flex items-center gap-3
                             hover:bg-orange-500/10 transition-colors
                             text-start"
                  role="menuitem"
                >
                  <div className="glass-orange p-2 rounded-lg flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t(action.labelKey, action.id.replace(/_/g, ' '))}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/10 bg-orange-500/5">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t('ai.quickActions.hint', 'کلیک کنید تا چت‌بات باز شود')}
              </p>
            </div>
          </div>
        )}

        {/* Suggestions Dropdown */}
        {query && suggestions.length > 0 && !loading && !results && !showQuickActions && (
          <div className="absolute z-50 w-full mt-2 glass-card !rounded-2xl border-2 border-orange-500/30 overflow-hidden animate-scale-in">
            {suggestions
              .filter(s => s.includes(query))
              .map((suggestion, index) => (
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
        {showResults && (results || loading) && !showQuickActions && (
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
                    <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
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