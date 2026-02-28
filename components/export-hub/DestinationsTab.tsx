'use client';

import { useState } from 'react';
import {
  FileSpreadsheet, Cloud, HardDrive, Mail, Download,
  Loader2, CheckCircle2, Unplug, Plug, Table2, Braces, FileText,
} from 'lucide-react';
import { cn, getTodayString } from '@/lib/utils';
import { Expense } from '@/lib/types';
import { ExportRecord, addExportRecord } from '@/lib/exportHubStore';

interface Props {
  expenses: Expense[];
  onExportComplete: (record: Omit<ExportRecord, 'id'>) => void;
}

type ConnState = 'disconnected' | 'connecting' | 'connected';
type ExportFmt = 'CSV' | 'JSON' | 'PDF';

interface Integration {
  id: string;
  name: string;
  desc: string;
  Icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    desc: 'Sync expenses to a new or existing spreadsheet',
    Icon: FileSpreadsheet,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    desc: 'Save exports automatically to your Dropbox folder',
    Icon: Cloud,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    desc: 'Back up exports to Microsoft OneDrive storage',
    Icon: HardDrive,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-100',
  },
];

function downloadFile(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

function openPrintPDF(expenses: Expense[], title: string) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const rows = expenses
    .map((e) => `<tr><td>${e.date}</td><td>${e.category}</td><td style="text-align:right">$${e.amount.toFixed(2)}</td><td>${e.description}</td></tr>`)
    .join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:-apple-system,sans-serif;margin:40px}table{width:100%;border-collapse:collapse;font-size:13px}
th{background:#7c3aed;color:#fff;padding:8px 12px;text-align:left}td{padding:7px 12px;border-bottom:1px solid #e5e7eb}
.foot{text-align:right;padding:10px;font-weight:700;border-top:2px solid #7c3aed}</style></head>
<body><h2>${title}</h2><table><thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th></tr></thead>
<tbody>${rows}</tbody></table><div class="foot">Total: $${total.toFixed(2)}</div></body></html>`;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
}

export default function DestinationsTab({ expenses, onExportComplete }: Props) {
  const [connections, setConnections] = useState<Record<string, ConnState>>(
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, 'disconnected'])),
  );
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [dlFmt, setDlFmt] = useState<ExportFmt>('CSV');
  const [dlState, setDlState] = useState<'idle' | 'loading' | 'success'>('idle');

  async function toggleConnection(id: string) {
    const cur = connections[id];
    if (cur === 'connecting') return;
    if (cur === 'connected') {
      setConnections((p) => ({ ...p, [id]: 'disconnected' }));
      return;
    }
    setConnections((p) => ({ ...p, [id]: 'connecting' }));
    await new Promise((r) => setTimeout(r, 1400));
    setConnections((p) => ({ ...p, [id]: 'connected' }));
  }

  async function sendEmail() {
    if (!email) return;
    setEmailState('loading');
    await new Promise((r) => setTimeout(r, 900));
    const record: Omit<ExportRecord, 'id'> = {
      timestamp: new Date().toISOString(),
      templateName: 'All Expenses',
      destination: 'Email',
      format: 'CSV',
      recordCount: expenses.length,
      status: 'success',
    };
    addExportRecord(record);
    onExportComplete(record);
    setEmailState('success');
    setTimeout(() => setEmailState('idle'), 2500);
  }

  async function quickDownload() {
    setDlState('loading');
    await new Promise((r) => setTimeout(r, 500));
    const today = getTodayString();
    const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

    if (dlFmt === 'CSV') {
      const hdr = 'Date,Category,Amount,Description';
      const rows = sorted.map(
        (e) => `${e.date},"${e.category}",${e.amount.toFixed(2)},"${e.description.replace(/"/g, '""')}"`,
      );
      downloadFile([hdr, ...rows].join('\n'), `all-expenses-${today}.csv`, 'text/csv');
    } else if (dlFmt === 'JSON') {
      downloadFile(
        JSON.stringify({ exportedAt: new Date().toISOString(), count: sorted.length, expenses: sorted.map((e) => ({ date: e.date, category: e.category, amount: e.amount, description: e.description })) }, null, 2),
        `all-expenses-${today}.json`,
        'application/json',
      );
    } else {
      openPrintPDF(sorted, 'All Expenses');
    }

    const record: Omit<ExportRecord, 'id'> = {
      timestamp: new Date().toISOString(),
      templateName: 'All Expenses',
      destination: 'Download',
      format: dlFmt,
      recordCount: expenses.length,
      status: 'success',
    };
    addExportRecord(record);
    onExportComplete(record);
    setDlState('success');
    setTimeout(() => setDlState('idle'), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Cloud integrations */}
      <section>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cloud Integrations</p>
        <div className="space-y-2">
          {INTEGRATIONS.map((intg) => {
            const state = connections[intg.id];
            return (
              <div
                key={intg.id}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-white"
              >
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', intg.iconBg)}>
                  <intg.Icon size={18} className={intg.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">{intg.name}</p>
                    {state === 'connected' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{intg.desc}</p>
                </div>
                <button
                  onClick={() => toggleConnection(intg.id)}
                  disabled={state === 'connecting'}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    state === 'connected'
                      ? 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
                      : 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100',
                    state === 'connecting' && 'opacity-60',
                  )}
                >
                  {state === 'connecting' && <Loader2 size={12} className="animate-spin" />}
                  {state === 'connected' && <Unplug size={12} />}
                  {state === 'disconnected' && <Plug size={12} />}
                  {state === 'connecting' ? 'Connecting…' : state === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Email */}
      <section>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Send by Email</p>
        <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={sendEmail}
              disabled={!email || emailState !== 'idle'}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                emailState === 'success'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40',
              )}
            >
              {emailState === 'loading' && <Loader2 size={13} className="animate-spin" />}
              {emailState === 'success' && <CheckCircle2 size={13} />}
              {emailState === 'idle' && <Mail size={13} />}
              {emailState === 'success' ? 'Sent!' : emailState === 'loading' ? 'Sending…' : 'Send'}
            </button>
          </div>
          <p className="text-xs text-gray-400">Sends a CSV of all expenses to the specified address</p>
        </div>
      </section>

      {/* Quick download */}
      <section>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Download</p>
        <div className="p-4 rounded-xl border border-gray-100 bg-white space-y-3">
          <div className="flex gap-2">
            {(['CSV', 'JSON', 'PDF'] as ExportFmt[]).map((fmt) => {
              const Icon = fmt === 'CSV' ? Table2 : fmt === 'JSON' ? Braces : FileText;
              return (
                <button
                  key={fmt}
                  onClick={() => setDlFmt(fmt)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 text-xs font-semibold transition-all',
                    dlFmt === fmt
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300',
                  )}
                >
                  <Icon size={13} /> {fmt}
                </button>
              );
            })}
          </div>
          <button
            onClick={quickDownload}
            disabled={dlState !== 'idle'}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all',
              dlState === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50',
            )}
          >
            {dlState === 'loading' && <Loader2 size={14} className="animate-spin" />}
            {dlState === 'success' && <CheckCircle2 size={14} />}
            {dlState === 'idle' && <Download size={14} />}
            {dlState === 'idle' && `Download ${dlFmt} (${expenses.length} records)`}
            {dlState === 'loading' && 'Preparing file…'}
            {dlState === 'success' && 'Downloaded!'}
          </button>
        </div>
      </section>
    </div>
  );
}
