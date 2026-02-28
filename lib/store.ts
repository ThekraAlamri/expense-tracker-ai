'use client';

import { Expense, Category, CategorySummary, MonthlyData } from './types';
import { generateId, getTodayString, getMonthLabel } from './utils';
import { CATEGORIES } from './categories';

const STORAGE_KEY = 'expense-tracker-expenses';

// ─── Seed Data ────────────────────────────────────────────────────────────────

function createSeedExpenses(): Expense[] {
  const today = new Date();
  const d = (offsetDays: number): string => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - offsetDays);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  };

  return [
    { id: generateId(), amount: 42.5, category: 'Food & Dining', description: 'Grocery run at Whole Foods', date: d(0), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 15.0, category: 'Transportation', description: 'Uber to downtown', date: d(1), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 12.99, category: 'Entertainment', description: 'Netflix subscription', date: d(2), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 89.99, category: 'Shopping', description: 'New running shoes', date: d(3), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 120.0, category: 'Bills & Utilities', description: 'Electric bill', date: d(5), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 35.0, category: 'Food & Dining', description: 'Dinner with friends', date: d(6), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 250.0, category: 'Health & Medical', description: 'Doctor visit copay', date: d(8), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 9.99, category: 'Entertainment', description: 'Spotify premium', date: d(9), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 55.0, category: 'Transportation', description: 'Gas station fill-up', date: d(10), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 299.0, category: 'Travel', description: 'Flight booking', date: d(12), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 24.5, category: 'Food & Dining', description: 'Lunch at café', date: d(14), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 45.0, category: 'Education', description: 'Udemy course', date: d(15), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 78.0, category: 'Shopping', description: 'Amazon purchases', date: d(18), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 60.0, category: 'Bills & Utilities', description: 'Internet bill', date: d(20), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 18.0, category: 'Food & Dining', description: 'Pizza delivery', date: d(22), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 30.0, category: 'Transportation', description: 'Parking fees', date: d(25), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 150.0, category: 'Shopping', description: 'Clothing store', date: d(28), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 22.0, category: 'Food & Dining', description: 'Breakfast out', date: d(30), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 195.0, category: 'Travel', description: 'Hotel booking', date: d(35), createdAt: new Date().toISOString() },
    { id: generateId(), amount: 40.0, category: 'Health & Medical', description: 'Pharmacy run', date: d(38), createdAt: new Date().toISOString() },
  ];
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export function getExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = createSeedExpenses();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw) as Expense[];
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function addExpense(data: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const expenses = getExpenses();
  const newExpense: Expense = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  saveExpenses([newExpense, ...expenses]);
  return newExpense;
}

export function updateExpense(id: string, data: Omit<Expense, 'id' | 'createdAt'>): void {
  const expenses = getExpenses();
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx !== -1) {
    expenses[idx] = { ...expenses[idx], ...data };
    saveExpenses(expenses);
  }
}

export function deleteExpense(id: string): void {
  const expenses = getExpenses();
  saveExpenses(expenses.filter((e) => e.id !== id));
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function getCategorySummaries(expenses: Expense[]): CategorySummary[] {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const map: Partial<Record<Category, { total: number; count: number }>> = {};

  for (const e of expenses) {
    if (!map[e.category]) map[e.category] = { total: 0, count: 0 };
    map[e.category]!.total += e.amount;
    map[e.category]!.count += 1;
  }

  return CATEGORIES.filter((c) => map[c])
    .map((c) => ({
      category: c,
      total: map[c]!.total,
      count: map[c]!.count,
      percentage: total > 0 ? (map[c]!.total / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function getMonthlyTotals(expenses: Expense[], months = 6): MonthlyData[] {
  const now = new Date();
  const result: MonthlyData[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const total = expenses
      .filter((e) => e.date.startsWith(prefix))
      .reduce((sum, e) => sum + e.amount, 0);
    result.push({ month: getMonthLabel(`${prefix}-01`), total });
  }

  return result;
}
