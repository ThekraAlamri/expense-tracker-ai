'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, RefreshCw, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExportSchedule, getSchedule, saveSchedule, nextRunISO } from '@/lib/exportHubStore';

const FREQUENCIES: { value: ExportSchedule['frequency']; label: string; desc: string }[] = [
  { value: 'daily', label: 'Daily', desc: 'Every day at midnight' },
  { value: 'weekly', label: 'Weekly', desc: 'Every Monday morning' },
  { value: 'monthly', label: 'Monthly', desc: 'First day of each month' },
];

const TEMPLATE_OPTIONS = [
  { id: 'tax-report', label: 'Tax Report' },
  { id: 'monthly-summary', label: 'Monthly Summary' },
  { id: 'category-analysis', label: 'Category Analysis' },
  { id: 'quarterly-review', label: 'Quarterly Review' },
];

const DEST_OPTIONS = ['Email', 'Google Sheets', 'Dropbox', 'OneDrive', 'Download'];

function formatNextRun(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatLastRun(iso?: string): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ScheduleTab() {
  const [schedule, setSchedule] = useState<ExportSchedule>(() => getSchedule());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSchedule(getSchedule());
  }, []);

  function update(patch: Partial<ExportSchedule>) {
    setSchedule((prev) => {
      const next = { ...prev, ...patch };
      if (patch.frequency) next.nextRun = nextRunISO(patch.frequency);
      return next;
    });
    setSaved(false);
  }

  function handleSave() {
    saveSchedule(schedule);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Enable toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
            <RefreshCw size={18} className="text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Automated Exports</p>
            <p className="text-xs text-gray-500">
              {schedule.enabled ? 'Active — exports running on schedule' : 'Disabled — no exports scheduled'}
            </p>
          </div>
        </div>
        <button
          onClick={() => update({ enabled: !schedule.enabled })}
          className={cn(
            'relative w-11 h-6 rounded-full transition-colors duration-200',
            schedule.enabled ? 'bg-violet-600' : 'bg-gray-200',
          )}
          aria-label="Toggle scheduled exports"
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
              schedule.enabled && 'translate-x-5',
            )}
          />
        </button>
      </div>

      {/* Config form */}
      <div className={cn('space-y-5 transition-opacity duration-200', !schedule.enabled && 'opacity-40 pointer-events-none')}>
        {/* Frequency */}
        <section>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock size={12} /> Frequency
          </p>
          <div className="grid grid-cols-3 gap-2">
            {FREQUENCIES.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => update({ frequency: value })}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all',
                  schedule.frequency === value
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-gray-300',
                )}
              >
                <span className={cn('text-sm font-semibold', schedule.frequency === value ? 'text-violet-700' : 'text-gray-700')}>
                  {label}
                </span>
                <span className="text-xs text-gray-400">{desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Template */}
        <section>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Template</p>
          <select
            value={schedule.templateId}
            onChange={(e) => update({ templateId: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {TEMPLATE_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </section>

        {/* Destination */}
        <section>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Destination</p>
          <select
            value={schedule.destination}
            onChange={(e) => update({ destination: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {DEST_OPTIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </section>

        {/* Run info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarCheck size={13} className="text-violet-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Next run</p>
            </div>
            <p className="text-sm font-medium text-gray-800">{formatNextRun(schedule.nextRun)}</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={13} className="text-gray-400" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last run</p>
            </div>
            <p className="text-sm font-medium text-gray-800">{formatLastRun(schedule.lastRun)}</p>
          </div>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
          saved
            ? 'bg-emerald-500 text-white'
            : 'bg-violet-600 text-white hover:bg-violet-700',
        )}
      >
        {saved ? <CheckCircle2 size={15} /> : <RefreshCw size={15} />}
        {saved ? 'Schedule saved!' : 'Save schedule'}
      </button>
    </div>
  );
}
