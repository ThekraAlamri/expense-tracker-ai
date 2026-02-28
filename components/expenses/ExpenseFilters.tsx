'use client';

import { ExpenseFilters } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { Input, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Search, X } from 'lucide-react';
import { getTodayString, getMonthStart } from '@/lib/utils';

interface Props {
  filters: ExpenseFilters;
  onChange: (f: ExpenseFilters) => void;
}

export default function ExpenseFilterBar({ filters, onChange }: Props) {
  const set = (patch: Partial<ExpenseFilters>) => onChange({ ...filters, ...patch });

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '' ||
    filters.search !== '';

  function handleReset() {
    onChange({ category: 'All', dateFrom: '', dateTo: '', search: '' });
  }

  function handleThisMonth() {
    set({ dateFrom: getMonthStart(0), dateTo: getTodayString() });
  }

  function handleLast30() {
    const to = getTodayString();
    const from = new Date();
    from.setDate(from.getDate() - 29);
    const fromStr = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`;
    set({ dateFrom: fromStr, dateTo: to });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      {/* Search + quick filters row */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <Select
          value={filters.category}
          onChange={(e) => set({ category: e.target.value as ExpenseFilters['category'] })}
          className="w-44"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Button variant="ghost" size="sm" onClick={handleThisMonth} type="button">
          This Month
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLast30} type="button">
          Last 30 Days
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset} type="button">
            <X size={14} /> Clear
          </Button>
        )}
      </div>

      {/* Date range */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <label className="text-xs font-medium text-gray-500 w-12 shrink-0">From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <label className="text-xs font-medium text-gray-500 w-12 shrink-0">To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
