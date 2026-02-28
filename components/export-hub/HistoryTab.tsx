'use client';

import { useState, useEffect } from 'react';
import {
  Download, Mail, FileSpreadsheet, Cloud, HardDrive,
  CheckCircle2, XCircle, Clock, Trash2, RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExportRecord, getExportHistory, clearExportHistory } from '@/lib/exportHubStore';

interface Props {
  refreshKey: number;
}

const DEST_ICON: Record<string, React.ElementType> = {
  Download: Download,
  Email: Mail,
  'Google Sheets': FileSpreadsheet,
  Dropbox: Cloud,
  OneDrive: HardDrive,
};

const DEST_COLOR: Record<string, string> = {
  Download: 'bg-gray-100 text-gray-600',
  Email: 'bg-blue-100 text-blue-600',
  'Google Sheets': 'bg-green-100 text-green-600',
  Dropbox: 'bg-blue-100 text-blue-500',
  OneDrive: 'bg-sky-100 text-sky-600',
};

const FORMAT_COLOR: Record<string, string> = {
  CSV: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  JSON: 'bg-violet-50 text-violet-700 border-violet-200',
  PDF: 'bg-red-50 text-red-700 border-red-200',
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function HistoryTab({ refreshKey }: Props) {
  const [history, setHistory] = useState<ExportRecord[]>([]);

  useEffect(() => {
    setHistory(getExportHistory());
  }, [refreshKey]);

  function handleClear() {
    clearExportHistory();
    setHistory([]);
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Clock size={24} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-1">No exports yet</p>
        <p className="text-xs text-gray-400 max-w-48">
          Your export history will appear here once you run your first export.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-2 flex-1">
        {history.map((record) => {
          const DestIcon = DEST_ICON[record.destination] ?? Download;
          const destColor = DEST_COLOR[record.destination] ?? 'bg-gray-100 text-gray-600';
          const fmtColor = FORMAT_COLOR[record.format] ?? 'bg-gray-50 text-gray-600 border-gray-200';
          return (
            <div
              key={record.id}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-white"
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', destColor)}>
                <DestIcon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-semibold text-gray-900 truncate">{record.templateName}</p>
                  <span className={cn('text-xs font-semibold px-1.5 py-0 rounded border shrink-0', fmtColor)}>
                    {record.format}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  via {record.destination} &bull; {record.recordCount} records &bull; {timeAgo(record.timestamp)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {record.status === 'success' ? (
                  <CheckCircle2 size={15} className="text-emerald-500" />
                ) : (
                  <XCircle size={15} className="text-red-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleClear}
        className="mt-5 flex items-center justify-center gap-1.5 w-full py-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={13} />
        Clear history ({history.length} entries)
      </button>
    </div>
  );
}
