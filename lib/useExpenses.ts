'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseFilters } from './types';
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getCategorySummaries,
  getMonthlyTotals,
} from './store';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    setExpenses(getExpenses());
  }, []);

  useEffect(() => {
    refresh();
    setLoaded(true);
  }, [refresh]);

  const handleAdd = useCallback((data: Omit<Expense, 'id' | 'createdAt'>) => {
    addExpense(data);
    refresh();
  }, [refresh]);

  const handleUpdate = useCallback((id: string, data: Omit<Expense, 'id' | 'createdAt'>) => {
    updateExpense(id, data);
    refresh();
  }, [refresh]);

  const handleDelete = useCallback((id: string) => {
    deleteExpense(id);
    refresh();
  }, [refresh]);

  return {
    expenses,
    loaded,
    addExpense: handleAdd,
    updateExpense: handleUpdate,
    deleteExpense: handleDelete,
    categorySummaries: getCategorySummaries(expenses),
    monthlyTotals: getMonthlyTotals(expenses),
  };
}

export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter((e) => {
    if (filters.category !== 'All' && e.category !== filters.category) return false;
    if (filters.dateFrom && e.date < filters.dateFrom) return false;
    if (filters.dateTo && e.date > filters.dateTo) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!e.description.toLowerCase().includes(q) && !e.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}
