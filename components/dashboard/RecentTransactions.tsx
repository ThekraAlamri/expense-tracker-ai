'use client';

import Link from 'next/link';
import { Expense } from '@/lib/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { CategoryBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/lib/categories';
import { ArrowRight } from 'lucide-react';

interface Props {
  expenses: Expense[];
}

export default function RecentTransactions({ expenses }: Props) {
  const recent = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  return (
    <Card padding="none">
      <div className="px-6 pt-6">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <Link
            href="/expenses"
            className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </CardHeader>
      </div>

      {recent.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-400 text-sm px-6 pb-6">
          No transactions yet. Add your first expense!
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {recent.map((e) => (
            <li key={e.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-base shrink-0">
                {CATEGORY_ICONS[e.category]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{e.description}</p>
                <p className="text-xs text-gray-400">{formatDate(e.date)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  -{formatCurrency(e.amount)}
                </p>
                <CategoryBadge category={e.category} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="h-4" />
    </Card>
  );
}
