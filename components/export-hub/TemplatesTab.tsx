'use client';

import { useState, useMemo } from 'react';
import {
  Receipt, BarChart3, PieChart, TrendingUp,
  Download, Mail, FileSpreadsheet, Cloud, HardDrive,
  Loader2, CheckCircle2, ArrowLeft, ChevronRight,
} from 'lucide-react';
import { cn, formatCurrency, getTodayString, getMonthStart } from '@/lib/utils';
import { Expense, Category } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { ExportRecord, addExportRecord } from '@/lib/exportHubStore';

interface Props {
  expenses: Expense[];
  onExportComplete: (record: Omit<ExportRecord, 'id'>) => void;
}

const COLOR_MAP = {
  emerald: {
    bg: 'bg-emerald-100',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    border: 'border-emerald-200',
    ring: 'ring-emerald-400',
  },
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    border: 'border-blue-200',
    ring: 'ring-blue-400',
  },
  violet: {
    bg: 'bg-violet-100',
    icon: 'text-violet-600',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    border: 'border-violet-200',
    ring: 'ring-violet-400',
  },
  amber: {
    bg: 'bg-amber-100',
    icon: 'text-amber-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    border: 'border-amber-200',
    ring: 'ring-amber-400',
  },
} as const;
type ColorKey = keyof typeof COLOR_MAP;

interface Template {
  id: string;
  name: string;
  desc: string;
  format: 'CSV' | 'JSON' | 'PDF';
  color: ColorKey;
  Icon: React.ElementType;
  filter: (expenses: Expense[]) => Expense[];
}

const TEMPLATES: Template[] = [
  {
    id: 'tax-report',
    name: 'Tax Report',
    desc: 'All expenses sorted by category for tax filing',
    format: 'PDF',
    color: 'emerald',
    Icon: Receipt,
    filter: (e) => [...e].sort((a, b) => a.category.localeCompare(b.category) || a.date.localeCompare(b.date)),
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    desc: 'Current month expenses by category',
    format: 'CSV',
    color: 'blue',
    Icon: BarChart3,
    filter: (e) => e.filter((x) => x.date >= getMonthStart(0)),
  },
  {
    id: 'category-analysis',
    name: 'Category Analysis',
    desc: 'Spending patterns and category breakdown',
    format: 'JSON',
    color: 'violet',
    Icon: PieChart,
    filter: (e) => e,
  },
  {
    id: 'quarterly-review',
    name: 'Quarterly Review',
    desc: 'Last 90 days for business reporting',
    format: 'CSV',
    color: 'amber',
    Icon: TrendingUp,
    filter: (e) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      return e.filter((x) => x.date >= cutoff.toISOString().slice(0, 10));
    },
  },
];

const DESTINATIONS = [
  { id: 'Download', label: 'Download', Icon: Download },
  { id: 'Email', label: 'Email', Icon: Mail },
  { id: 'Google Sheets', label: 'Sheets', Icon: FileSpreadsheet },
  { id: 'Dropbox', label: 'Dropbox', Icon: Cloud },
  { id: 'OneDrive', label: 'OneDrive', Icon: HardDrive },
];

function downloadFile(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

function exportTemplatePDF(templateName: string, expenses: Expense[]) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const rows = expenses
    .map(
      (e) => `<tr><td>${e.date}</td><td>${e.category}</td><td class="amt">$${e.amount.toFixed(2)}</td><td>${e.description}</td></tr>`,
    )
    .join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${templateName}</title>
<style>body{font-family:-apple-system,sans-serif;color:#111;margin:40px}h1{font-size:20px;margin:0 0 4px}
.meta{color:#666;font-size:13px;margin-bottom:24px}table{width:100%;border-collapse:collapse;font-size:13px}
th{background:#7c3aed;color:#fff;padding:9px 12px;text-align:left}td{padding:8px 12px;border-bottom:1px solid #e5e7eb}
td.amt{text-align:right;font-weight:600}tr:nth-child(even)td{background:#f9fafb}
.foot{text-align:right;padding:10px 12px;font-weight:700;font-size:14px;border-top:2px solid #7c3aed}</style>
</head><body><h1>${templateName}</h1>
<div class="meta">Generated ${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} &bull; ${expenses.length} records</div>
<table><thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th></tr></thead>
<tbody>${rows}</tbody></table>
<div class="foot">Total: $${total.toFixed(2)}</div></body></html>`;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

type ActionState = 'idle' | 'loading' | 'success';

export default function TemplatesTab({ expenses, onExportComplete }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dest, setDest] = useState('Download');
  const [emailInput, setEmailInput] = useState('');
  const [actionState, setActionState] = useState<ActionState>('idle');

  const selected = TEMPLATES.find((t) => t.id === selectedId) ?? null;
  const filteredExpenses = useMemo(
    () => (selected ? selected.filter(expenses) : []),
    [selected, expenses],
  );

  function selectTemplate(id: string) {
    setSelectedId(id);
    setDest('Download');
    setEmailInput('');
    setActionState('idle');
  }

  async function runExport() {
    if (!selected) return;
    setActionState('loading');
    await new Promise((r) => setTimeout(r, 600));

    const today = getTodayString();
    const filename = `${selected.id}-${today}`;

    if (dest === 'Download') {
      if (selected.format === 'PDF') {
        exportTemplatePDF(selected.name, filteredExpenses);
      } else if (selected.format === 'CSV') {
        const header = 'Date,Category,Amount,Description';
        const rows = filteredExpenses.map(
          (e) => `${e.date},"${e.category}",${e.amount.toFixed(2)},"${e.description.replace(/"/g, '""')}"`,
        );
        downloadFile([header, ...rows].join('\n'), `${filename}.csv`, 'text/csv');
      } else {
        const totals = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
          acc[cat] = filteredExpenses
            .filter((e) => e.category === (cat as Category))
            .reduce((s, e) => s + e.amount, 0);
          return acc;
        }, {} as Record<string, number>);
        const data = {
          generatedAt: new Date().toISOString(),
          totalExpenses: filteredExpenses.length,
          totalAmount: filteredExpenses.reduce((s, e) => s + e.amount, 0),
          byCategory: totals,
          expenses: filteredExpenses.map((e) => ({
            date: e.date,
            category: e.category,
            amount: e.amount,
            description: e.description,
          })),
        };
        downloadFile(JSON.stringify(data, null, 2), `${filename}.json`, 'application/json');
      }
    }
    // For non-Download destinations: simulate (no real API)

    const record: Omit<ExportRecord, 'id'> = {
      timestamp: new Date().toISOString(),
      templateName: selected.name,
      destination: dest,
      format: selected.format,
      recordCount: filteredExpenses.length,
      status: 'success',
    };
    addExportRecord(record);
    onExportComplete(record);

    setActionState('success');
    setTimeout(() => {
      setSelectedId(null);
      setActionState('idle');
    }, 1800);
  }

  if (selected) {
    const c = COLOR_MAP[selected.color];
    return (
      <div className="flex flex-col h-full">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
        >
          <ArrowLeft size={15} /> Back to templates
        </button>

        {/* Selected template summary */}
        <div className={cn('flex items-center gap-4 p-4 rounded-xl border mb-6', c.border, 'bg-white')}>
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', c.bg)}>
            <selected.Icon size={20} className={c.icon} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{selected.name}</p>
            <p className="text-xs text-gray-500">{filteredExpenses.length} records &bull; {formatCurrency(filteredExpenses.reduce((s, e) => s + e.amount, 0))}</p>
          </div>
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded border', c.badge)}>
            {selected.format}
          </span>
        </div>

        {/* Destination picker */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Export via</p>
        <div className="grid grid-cols-5 gap-2 mb-5">
          {DESTINATIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setDest(id)}
              className={cn(
                'flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-xs font-medium transition-all',
                dest === id
                  ? 'border-violet-500 bg-violet-50 text-violet-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300',
              )}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>

        {dest === 'Email' && (
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Recipient email</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        )}

        {dest !== 'Download' && dest !== 'Email' && (
          <div className="mb-5 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700">
              <strong>{dest}</strong> integration will open a connection dialog and sync your data automatically.
            </p>
          </div>
        )}

        <div className="mt-auto">
          <button
            onClick={runExport}
            disabled={actionState === 'loading' || actionState === 'success' || filteredExpenses.length === 0}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
              actionState === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50',
            )}
          >
            {actionState === 'loading' && <Loader2 size={15} className="animate-spin" />}
            {actionState === 'success' && <CheckCircle2 size={15} />}
            {actionState === 'idle' && <Download size={15} />}
            {actionState === 'idle' && `Export ${selected.format} via ${dest}`}
            {actionState === 'loading' && 'Exporting…'}
            {actionState === 'success' && 'Done! Added to history'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {TEMPLATES.map((t) => {
        const c = COLOR_MAP[t.color];
        const count = t.filter(expenses).length;
        return (
          <button
            key={t.id}
            onClick={() => selectTemplate(t.id)}
            className="group text-left p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', c.bg)}>
                <t.Icon size={18} className={c.icon} />
              </div>
              <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded border', c.badge)}>
                {t.format}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-0.5">{t.name}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-400">{count} records</span>
              <span className="flex items-center gap-0.5 text-xs text-violet-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Export <ChevronRight size={12} />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
