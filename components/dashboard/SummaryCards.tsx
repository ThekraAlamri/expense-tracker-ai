'use client';

import { Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Calendar } from 'lucide-react';
import { CATEGORY_COLORS } from '@/lib/categories';

interface Props {
  expenses: Expense[];
}

export default function SummaryCards({ expenses }: Props) {
  const now = new Date();
  const thisMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthPrefix = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const thisMonth = expenses.filter((e) => e.date.startsWith(thisMonthPrefix));
  const lastMonth = expenses.filter((e) => e.date.startsWith(lastMonthPrefix));

  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
  const totalThisMonth = thisMonth.reduce((s, e) => s + e.amount, 0);
  const totalLastMonth = lastMonth.reduce((s, e) => s + e.amount, 0);

  const monthChange =
    totalLastMonth > 0
      ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
      : totalThisMonth > 0
      ? 100
      : 0;

  // Top category this month
  const catMap: Record<string, number> = {};
  for (const e of thisMonth) {
    catMap[e.category] = (catMap[e.category] ?? 0) + e.amount;
  }
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      label: 'Total Expenses',
      value: formatCurrency(totalAll),
      sub: `${expenses.length} transactions`,
      icon: DollarSign,
      color: '#6366f1',
      bgColor: '#6366f118',
    },
    {
      label: 'This Month',
      value: formatCurrency(totalThisMonth),
      sub:
        Math.abs(monthChange) < 0.1
          ? 'No change from last month'
          : `${monthChange > 0 ? '+' : ''}${monthChange.toFixed(1)}% vs last month`,
      icon: monthChange > 0 ? TrendingUp : TrendingDown,
      color: monthChange > 0 ? '#ef4444' : '#10b981',
      bgColor: monthChange > 0 ? '#ef444418' : '#10b98118',
      trend: monthChange,
    },
    {
      label: 'This Month Transactions',
      value: thisMonth.length.toString(),
      sub: `avg ${formatCurrency(thisMonth.length ? totalThisMonth / thisMonth.length : 0)} per expense`,
      icon: ShoppingCart,
      color: '#f97316',
      bgColor: '#f9731618',
    },
    {
      label: 'Top Category',
      value: topCat ? topCat[0] : '—',
      sub: topCat ? formatCurrency(topCat[1]) + ' this month' : 'No expenses this month',
      icon: Calendar,
      color: topCat ? CATEGORY_COLORS[topCat[0] as keyof typeof CATEGORY_COLORS] : '#6b7280',
      bgColor: topCat ? `${CATEGORY_COLORS[topCat[0] as keyof typeof CATEGORY_COLORS]}18` : '#6b728018',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: c.bgColor }}
            >
              <Icon size={20} style={{ color: c.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium">{c.label}</p>
              <p
                className="text-xl font-bold text-gray-900 mt-0.5 truncate"
                title={c.value}
              >
                {c.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
