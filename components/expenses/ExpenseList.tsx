'use client';

import { useState } from 'react';
import { Expense } from '@/lib/types';
import { CategoryBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORY_ICONS } from '@/lib/categories';
import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

type SortKey = 'date' | 'amount' | 'category';
type SortDir = 'asc' | 'desc';

interface Props {
  expenses: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'date', dir: 'desc' });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sorted = [...expenses].sort((a, b) => {
    let cmp = 0;
    if (sort.key === 'date') cmp = a.date.localeCompare(b.date);
    if (sort.key === 'amount') cmp = a.amount - b.amount;
    if (sort.key === 'category') cmp = a.category.localeCompare(b.category);
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  function toggleSort(key: SortKey) {
    setSort((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sort.key !== k) return <ChevronsUpDown size={13} className="text-gray-300" />;
    return sort.dir === 'asc' ? <ChevronUp size={13} className="text-violet-500" /> : <ChevronDown size={13} className="text-violet-500" />;
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
        <p className="text-4xl mb-3">💸</p>
        <p className="text-gray-900 font-semibold">No expenses found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or add a new expense.</p>
      </div>
    );
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Summary bar */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{expenses.length}</span> expense{expenses.length !== 1 ? 's' : ''}
        </p>
        <p className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
        </p>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider">
        <span className="w-9" />
        <button className="flex items-center gap-1 text-left hover:text-gray-700 transition-colors" onClick={() => toggleSort('date')}>
          Date / Description <SortIcon k="date" />
        </button>
        <button className="flex items-center gap-1 hover:text-gray-700 transition-colors" onClick={() => toggleSort('category')}>
          Category <SortIcon k="category" />
        </button>
        <button className="flex items-center gap-1 justify-end hover:text-gray-700 transition-colors" onClick={() => toggleSort('amount')}>
          Amount <SortIcon k="amount" />
        </button>
        <span className="w-16" />
      </div>

      {/* Rows */}
      <ul className="divide-y divide-gray-50">
        {sorted.map((e) => (
          <li key={e.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors group">
            {/* Icon */}
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-base">
              {CATEGORY_ICONS[e.category]}
            </div>

            {/* Description + date */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{e.description}</p>
              <p className="text-xs text-gray-400">{formatDate(e.date)}</p>
            </div>

            {/* Category */}
            <CategoryBadge category={e.category} />

            {/* Amount */}
            <p className="text-sm font-semibold text-gray-900 text-right">
              -{formatCurrency(e.amount)}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {deleteConfirm === e.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { onDelete(e.id); setDeleteConfirm(null); }}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="text-xs text-gray-500 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onEdit(e)}
                    className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(e.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
