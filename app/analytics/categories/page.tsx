'use client';

import { useExpenses } from '@/lib/useExpenses';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/categories';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

export default function TopCategoriesPage() {
  const { categorySummaries, loaded } = useExpenses();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (categorySummaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-gray-700 font-semibold text-lg">No spending data yet</p>
        <p className="text-gray-400 text-sm mt-1">Add some expenses to see your top categories.</p>
      </div>
    );
  }

  const totalSpend = categorySummaries.reduce((sum, s) => sum + s.total, 0);
  const topAmount = categorySummaries[0]?.total ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Top Expense Categories</h1>
        <p className="text-gray-500 text-sm mt-1">
          Spending breakdown across {categorySummaries.length} categories — {formatCurrency(totalSpend)} total
        </p>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Spend</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalSpend)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Categories</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{categorySummaries.length}</p>
        </Card>
        <Card className="p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Top Category</p>
          <p className="text-lg font-bold text-gray-900 mt-1 truncate">
            {CATEGORY_ICONS[categorySummaries[0].category]} {categorySummaries[0].category}
          </p>
        </Card>
      </div>

      {/* Ranked list */}
      <Card className="divide-y divide-gray-100">
        {categorySummaries.map((summary, index) => {
          const color = CATEGORY_COLORS[summary.category];
          const barWidth = topAmount > 0 ? (summary.total / topAmount) * 100 : 0;

          return (
            <div key={summary.category} className="flex items-center gap-4 p-4">
              {/* Rank */}
              <span className="w-7 text-center text-sm font-bold text-gray-400 shrink-0">
                #{index + 1}
              </span>

              {/* Icon */}
              <span className="text-2xl shrink-0">{CATEGORY_ICONS[summary.category]}</span>

              {/* Name + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900">{summary.category}</p>
                  <p className="text-sm font-bold text-gray-900 ml-2 shrink-0">
                    {formatCurrency(summary.total)}
                  </p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                  />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{summary.count} transaction{summary.count !== 1 ? 's' : ''}</span>
                  <span className="text-xs font-medium" style={{ color }}>
                    {summary.percentage.toFixed(1)}% of total
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
