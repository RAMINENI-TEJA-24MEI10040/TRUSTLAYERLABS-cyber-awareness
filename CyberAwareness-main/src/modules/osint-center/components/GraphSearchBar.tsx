import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface GraphSearchBarProps {
  onSearch: (query: string, type: string) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const searchTypes = ['email', 'username', 'domain', 'ip', 'wallet', 'mobile'];

export default function GraphSearchBar({ onSearch, onClear, isLoading }: GraphSearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('email');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, selectedType);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-cyan-400/60" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search entities..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900/50 border border-cyan-700/60 rounded-lg text-sm text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-cyan-300"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {searchTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-2 py-1 text-xs rounded transition-all ${
              selectedType === type
                ? 'bg-cyan-600/80 text-cyan-50 border border-cyan-400'
                : 'bg-slate-900/40 text-slate-300 border border-cyan-700/40 hover:border-cyan-600/60'
            }`}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>

      <button
        onClick={handleSearch}
        disabled={!query.trim() || isLoading}
        className="w-full px-3 py-2 bg-cyan-600/60 hover:bg-cyan-600/80 disabled:opacity-50 disabled:cursor-not-allowed text-cyan-50 font-medium text-sm rounded-lg transition-all border border-cyan-500/40"
        type="button"
      >
        {isLoading ? 'Searching...' : 'Search Graph'}
      </button>
    </div>
  );
}
