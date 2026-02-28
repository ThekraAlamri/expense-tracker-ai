'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { CategorySummary, MonthlyData } from '@/lib/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { CATEGORY_COLORS } from '@/lib/categories';

interface PieProps {
  summaries: CategorySummary[];
}

export function CategoryPieChart({ summaries }: PieProps) {
  if (summaries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          No expense data yet
        </div>
      </Card>
    );
  }

  const data = summaries.map((s) => ({
    name: s.category,
    value: s.total,
    color: CATEGORY_COLORS[s.category],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <div className="flex gap-6 items-center">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={68}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number | undefined) => [val != null ? formatCurrency(val) : '$0.00', 'Amount']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {summaries.slice(0, 6).map((s) => (
            <div key={s.category} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[s.category] }}
              />
              <span className="text-xs text-gray-600 flex-1 truncate">{s.category}</span>
              <span className="text-xs font-semibold text-gray-900">{formatCurrency(s.total)}</span>
              <span className="text-xs text-gray-400 w-10 text-right">{s.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

interface BarProps {
  monthly: MonthlyData[];
}

export function MonthlyBarChart({ monthly }: BarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <span className="text-xs text-gray-400">Last 6 months</span>
      </CardHeader>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              formatter={(val: number | undefined) => [val != null ? formatCurrency(val) : '$0.00', 'Spending']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              cursor={{ fill: '#f5f3ff' }}
            />
            <Bar dataKey="total" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
