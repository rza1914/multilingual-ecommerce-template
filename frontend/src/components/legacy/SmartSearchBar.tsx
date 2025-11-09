import React, { useState, useEffect, useRef } from 'react';
import { API_CONFIG } from '../../config/api.config';
import { getFullApiUrl } from '../../config/api';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  discount?: number;
  stock: number;
  rating: number;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
  category?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
}

interface SmartSearchResult {
  results: Product[];
  explanation: string;
  extracted_filters: Record<string, any>;
  total_results: number;
}

interface SmartSearchBarProps {
  onSearch?: (results: Product[], query?: string) => void;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SmartSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sample suggestions for autocomplete
  const sampleSuggestions = [
    'گوشی سامسونگ زیر 20 میلیون',
    'لپ تاپ گیمینگ تا 40 میلیون',
    'هدفون بی‌سیم با کیفیت',
    'ساعت اپل با قیمت مناسب',
    'تبلت برای کار و تفریح'
  ];

  // Handle clicks outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as HTMLElement)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter suggestions based on input
  useEffect(() => {
    if (query.trim()) {
      const filtered = sampleSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Show only first 5 suggestions
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SmartSearchResult = await response.json();
      setResults(data);
      
      // Call the onSearch callback if provided
      if (onSearch) {
        onSearch(data.results, searchQuery);
      }
    } catch (error) {
      console.error('Error performing smart search:', error);
      const errorResult: SmartSearchResult = {
        results: [],
        explanation: 'متاسفانه خطایی در پردازش جستجو رخ داد. لطفاً دوباره امتحان کنید.',
        extracted_filters: {},
        total_results: 0
      };
      setResults(errorResult);
      
      // Call the onSearch callback with empty results if provided
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

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <div className="w-full max-w-3xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی هوشمند محصولات... (مثلاً 'گوشی سامسونگ زیر 20 میلیون')"
            className="flex-1 p-4 pr-12 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
            onFocus={() => query && setShowResults(true)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جستجو
              </span>
            ) : (
              'جستجو'
            )}
          </button>
        </div>

        {/* Suggestions dropdown */}
        {query && suggestions.length > 0 && !loading && !results && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}

        {/* Results dropdown */}
        {showResults && (results || loading) && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            {loading ? (
              <div className="p-4 flex justify-center items-center">
                <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : results && (
              <div className="p-4">
                <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                  {results.explanation}
                </div>
                
                {/* Display extracted filters */}
                {Object.keys(results.extracted_filters).length > 0 && (
                  <div className="mb-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1">
                    {results.extracted_filters.max_price && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">تا {formatPrice(results.extracted_filters.max_price)} تومان</span>
                    )}
                    {results.extracted_filters.brand && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{results.extracted_filters.brand}</span>
                    )}
                    {results.extracted_filters.category && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{results.extracted_filters.category}</span>
                    )}
                  </div>
                )}
                
                {/* Results list */}
                <div className="space-y-3">
                  {results.results.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">محصولی یافت نشد</div>
                  ) : (
                    results.results.map((product) => (
                      <div 
                        key={product.id} 
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                      >
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.title} 
                            className="w-16 h-16 object-contain rounded mr-3"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl mr-3" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate dark:text-white">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {product.description?.substring(0, 60)}...
                          </p>
                          <div className="mt-1 flex items-center">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {formatPrice(product.price)} تومان
                            </span>
                            {product.discount_price && product.discount_price < product.price && (
                              <span className="ml-2 text-sm text-red-500 line-through">
                                {formatPrice(product.price)} تومان
                              </span>
                            )}
                            {product.rating && (
                              <span className="ml-2 text-sm text-yellow-500">
                                ⭐ {product.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SmartSearchBar;