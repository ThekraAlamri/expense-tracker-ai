'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useExpenses } from '@/lib/useExpenses';
import { formatCurrency, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

export default function TopVendorsPage() {
  const { expenses, loaded } = useExpenses();
  const [search, setSearch] = useState('');

  const vendors = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    for (const e of expenses) {
      const key = e.description.trim();
      if (!key) continue;
      const existing = map.get(key) ?? { total: 0, count: 0 };
      map.set(key, { total: existing.total + e.amount, count: existing.count + 1 });
    }
    return Array.from(map.entries())
      .map(([name, { total, count }]) => ({ name, total, count, avg: total / count }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 20);
  }, [expenses]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? vendors.filter((v) => v.name.toLowerCase().includes(q)) : vendors;
  }, [vendors, search]);

  const totalSpend = vendors.reduce((sum, v) => sum + v.total, 0);
  const topAmount = vendors[0]?.total ?? 1;

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-4xl mb-3">🏪</p>
        <p className="text-gray-700 font-semibold text-lg">No vendors found</p>
        <p className="text-gray-400 text-sm mt-1">Add some expenses to see your top vendors.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Top Vendors</h1>
        <p className="text-gray-500 text-sm mt-1">
          {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} — {formatCurrency(totalSpend)} total spend
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Spend</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalSpend)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Vendors</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{vendors.length}</p>
        </Card>
        <Card className="p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Top Vendor</p>
          <p className="text-lg font-bold text-gray-900 mt-1 truncate">{vendors[0]?.name}</p>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendors…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Vendor list */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-10 text-sm">No vendors match your search.</p>
      ) : (
        <Card className="divide-y divide-gray-100">
          {filtered.map((vendor, index) => {
            const rank = vendors.indexOf(vendor) + 1;
            const barWidth = (vendor.total / topAmount) * 100;
            return (
              <div key={vendor.name} className="flex items-center gap-4 p-4">
                {/* Rank */}
                <span className={cn(
                  'w-7 text-center text-sm font-bold shrink-0',
                  rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-400' : 'text-gray-300',
                )}>
                  #{rank}
                </span>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{vendor.name}</p>
                    <p className="text-sm font-bold text-gray-900 ml-2 shrink-0">{formatCurrency(vendor.total)}</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{vendor.count} transaction{vendor.count !== 1 ? 's' : ''}</span>
                    <span className="text-xs text-gray-400">avg {formatCurrency(vendor.avg)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
