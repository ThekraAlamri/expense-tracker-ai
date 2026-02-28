export type Category =
  | 'Food & Dining'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Health & Medical'
  | 'Travel'
  | 'Education'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string; // ISO datetime string
}

export interface ExpenseFilters {
  category: Category | 'All';
  dateFrom: string;
  dateTo: string;
  search: string;
}

export interface CategorySummary {
  category: Category;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyData {
  month: string; // "Jan", "Feb", etc.
  total: number;
}
