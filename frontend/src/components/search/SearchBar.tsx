/**
 * Search Bar Component
 * Debounced search input for products
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search products...',
  debounceMs = 500,
  loading = false,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Debounced search effect
   */
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout
    debounceTimeout.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, onSearch, debounceMs]);

  /**
   * Handle clear button click
   */
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  /**
   * Handle input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="relative w-full">
      {/* Search Input Container */}
      <div
        className={`
          relative flex items-center glass-card overflow-hidden
          transition-all duration-300
          ${isFocused ? 'ring-4 ring-orange-500/30 border-orange-500/50' : 'border-transparent'}
        `}
      >
        {/* Search Icon */}
        <div className="absolute left-4 pointer-events-none">
          <Search
            className={`w-5 h-5 transition-colors duration-300 ${
              isFocused ? 'text-orange-500' : 'text-gray-400'
            }`}
          />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            w-full pl-12 pr-20 py-4 bg-transparent
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none
            text-base
          "
        />

        {/* Loading / Clear Button */}
        <div className="absolute right-4 flex items-center gap-2">
          {loading && (
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
          )}

          {query && !loading && (
            <button
              onClick={handleClear}
              className="
                p-1.5 rounded-full
                hover:bg-gray-200 dark:hover:bg-gray-700
                transition-colors duration-200
                group
              "
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Search Hint */}
      {isFocused && !query && (
        <div className="absolute top-full mt-2 left-0 right-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Type to search products by name or description
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
