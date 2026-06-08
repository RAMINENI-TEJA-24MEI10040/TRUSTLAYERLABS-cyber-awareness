import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface GraphFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  riskLevel: 'all' | 'critical' | 'high' | 'medium' | 'low';
  entityTypes: string[];
  dateRange: { start: string; end: string } | null;
}

const entityTypeOptions = ['ip', 'domain', 'email', 'username', 'wallet', 'mobile', 'source'];
const riskLevels: Array<'all' | 'critical' | 'high' | 'medium' | 'low'> = ['all', 'critical', 'high', 'medium', 'low'];

export default function GraphFilters({ onFilterChange }: GraphFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    riskLevel: 'all',
    entityTypes: [],
    dateRange: null,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleRiskLevelChange = (level: typeof riskLevels[0]) => {
    const newFilters = { ...filters, riskLevel: level };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleEntityTypeToggle = (type: string) => {
    const newTypes = filters.entityTypes.includes(type)
      ? filters.entityTypes.filter((t) => t !== type)
      : [...filters.entityTypes, type];
    const newFilters = { ...filters, entityTypes: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newRange = filters.dateRange || { start: '', end: '' };
    newRange[field] = value;
    const newFilters = { ...filters, dateRange: newRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const activeFilterCount = [
    filters.riskLevel !== 'all' ? 1 : 0,
    filters.entityTypes.length > 0 ? 1 : 0,
    filters.dateRange?.start || filters.dateRange?.end ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/40 border border-cyan-700/60 rounded-lg text-sm text-cyan-100 hover:border-cyan-600 transition-all"
        type="button"
      >
        <span className="flex items-center gap-2">
          Filters
          {activeFilterCount > 0 && <span className="text-xs bg-cyan-600/60 px-2 py-0.5 rounded-full">{activeFilterCount}</span>}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-slate-950/95 border border-cyan-700/60 rounded-lg shadow-lg shadow-cyan-900/40 backdrop-blur-sm z-10 p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Risk Level</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {riskLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleRiskLevelChange(level)}
                  className={`px-2 py-1 text-xs rounded transition-all capitalize ${
                    filters.riskLevel === level
                      ? 'bg-cyan-600/70 text-cyan-50 border border-cyan-400'
                      : 'bg-slate-800/40 text-slate-300 border border-slate-600/40 hover:border-cyan-600/40'
                  }`}
                  type="button"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Entity Types</label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
              {entityTypeOptions.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.entityTypes.includes(type)}
                    onChange={() => handleEntityTypeToggle(type)}
                    className="w-3 h-3 accent-cyan-500 bg-slate-800 border-slate-600 rounded"
                  />
                  <span className="text-xs text-cyan-100 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Date Range</label>
            <div className="mt-2 space-y-2">
              <input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full px-2 py-1 bg-slate-800/60 border border-slate-600 rounded text-xs text-cyan-100"
              />
              <input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full px-2 py-1 bg-slate-800/60 border border-slate-600 rounded text-xs text-cyan-100"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setFilters({
                riskLevel: 'all',
                entityTypes: [],
                dateRange: null,
              });
              onFilterChange({
                riskLevel: 'all',
                entityTypes: [],
                dateRange: null,
              });
            }}
            className="w-full px-2 py-1 text-xs bg-slate-800/40 border border-slate-600/60 rounded text-slate-300 hover:text-cyan-300 hover:border-cyan-600/40 transition-all"
            type="button"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
