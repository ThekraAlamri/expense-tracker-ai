'use client';

import { useState } from 'react';
import { Layers } from 'lucide-react';
import { useExpenses } from '@/lib/useExpenses';
import SummaryCards from '@/components/dashboard/SummaryCards';
import { CategoryPieChart, MonthlyBarChart } from '@/components/dashboard/SpendingChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import ExportHubDrawer from '@/components/export-hub/ExportHubDrawer';

export default function DashboardPage() {
  const { expenses, loaded, categorySummaries, monthlyTotals } = useExpenses();
  const [hubOpen, setHubOpen] = useState(false);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setHubOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Layers size={15} />
          Export Hub
        </button>
      </div>
      <SummaryCards expenses={expenses} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPieChart summaries={categorySummaries} />
        <MonthlyBarChart monthly={monthlyTotals} />
      </div>
      <RecentTransactions expenses={expenses} />
      <ExportHubDrawer open={hubOpen} onClose={() => setHubOpen(false)} expenses={expenses} />
    </div>
  );
}
