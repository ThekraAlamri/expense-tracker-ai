import { Category } from './types';

export const CATEGORIES: Category[] = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Health & Medical',
  'Travel',
  'Education',
  'Other',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Food & Dining': '#f97316',
  'Transportation': '#3b82f6',
  'Entertainment': '#a855f7',
  'Shopping': '#ec4899',
  'Bills & Utilities': '#6366f1',
  'Health & Medical': '#10b981',
  'Travel': '#f59e0b',
  'Education': '#14b8a6',
  'Other': '#6b7280',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  'Food & Dining': '🍽️',
  'Transportation': '🚗',
  'Entertainment': '🎬',
  'Shopping': '🛍️',
  'Bills & Utilities': '💡',
  'Health & Medical': '🏥',
  'Travel': '✈️',
  'Education': '📚',
  'Other': '📦',
};
