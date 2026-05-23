import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

interface ThreatSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const ThreatSearch: React.FC<ThreatSearchProps> = ({
  onSearch,
  placeholder = 'Search phishing URLs/domains...',
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceTimer) window.clearTimeout(debounceTimer);

      const timer = window.setTimeout(() => {
        onSearch(value);
      }, debounceMs);

      setDebounceTimer(timer);
    },
    [debounceMs, debounceTimer, onSearch]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="w-full">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 blur group-focus-within:opacity-100 transition-all duration-300" />
        
        <div className="relative flex items-center bg-gray-900 border border-gray-700 rounded-lg hover:border-gray-600 focus-within:border-cyan-500 transition-colors">
          <Search className="w-5 h-5 text-gray-500 ml-3 flex-shrink-0" />
          
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
            aria-label="Threat search"
          />

          {query && (
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-gray-300 pr-3 transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatSearch;
