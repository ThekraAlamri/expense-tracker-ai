'use client';

import { useExpenses } from '@/lib/useExpenses';
import SummaryCards from '@/components/dashboard/SummaryCards';
import { CategoryPieChart, MonthlyBarChart } from '@/components/dashboard/SpendingChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

export default function DashboardPage() {
  const { expenses, loaded, categorySummaries, monthlyTotals } = useExpenses();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SummaryCards expenses={expenses} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart summaries={categorySummaries} />
        <MonthlyBarChart monthly={monthlyTotals} />
      </div>
      <RecentTransactions expenses={expenses} />
    </div>
  );
}
