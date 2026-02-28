'use client';

import { useState, useCallback } from 'react';
import { LayoutGrid, Globe, Repeat, History, Share2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Expense } from '@/lib/types';
import { ExportRecord } from '@/lib/exportHubStore';
import TemplatesTab from './TemplatesTab';
import DestinationsTab from './DestinationsTab';
import ScheduleTab from './ScheduleTab';
import HistoryTab from './HistoryTab';
import ShareTab from './ShareTab';

type TabId = 'templates' | 'destinations' | 'schedule' | 'history' | 'share';

interface NavItem {
  id: TabId;
  label: string;
  Icon: React.ElementType;
}

const NAV: NavItem[] = [
  { id: 'templates', label: 'Templates', Icon: LayoutGrid },
  { id: 'destinations', label: 'Destinations', Icon: Globe },
  { id: 'schedule', label: 'Schedule', Icon: Repeat },
  { id: 'history', label: 'History', Icon: History },
  { id: 'share', label: 'Share', Icon: Share2 },
];

const TAB_META: Record<TabId, { title: string; desc: string }> = {
  templates: {
    title: 'Export Templates',
    desc: 'Pre-built reports for common use cases',
  },
  destinations: {
    title: 'Destinations',
    desc: 'Cloud integrations, email, and local downloads',
  },
  schedule: {
    title: 'Scheduled Exports',
    desc: 'Automate recurring exports to any destination',
  },
  history: {
    title: 'Export History',
    desc: 'View and re-download your previous exports',
  },
  share: {
    title: 'Share & Collaborate',
    desc: 'Generate links and QR codes to share your data',
  },
};

interface Props {
  open: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export default function ExportHubDrawer({ open, onClose, expenses }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('templates');
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleExportComplete = useCallback((_record: Omit<ExportRecord, 'id'>) => {
    setHistoryRefreshKey((k) => k + 1);
  }, []);

  const meta = TAB_META[activeTab];

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex transition-all duration-300',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          'relative ml-auto flex h-full w-full max-w-[540px] shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Left nav strip */}
        <nav className="w-[64px] bg-gray-950 flex flex-col items-center py-5 gap-1 shrink-0">
          {/* Brand mark */}
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center mb-4">
            <Share2 size={16} className="text-white" />
          </div>

          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={label}
              className={cn(
                'flex flex-col items-center gap-1 w-full py-3 px-1 transition-all',
                activeTab === id
                  ? 'text-violet-400 bg-gray-800'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900',
              )}
            >
              <Icon size={18} />
              <span className="text-[9px] font-medium leading-none">{label}</span>
            </button>
          ))}

          {/* Close at bottom */}
          <button
            onClick={onClose}
            className="mt-auto flex flex-col items-center gap-1 w-full py-3 px-1 text-gray-600 hover:text-gray-300 transition-colors"
            title="Close"
          >
            <X size={18} />
            <span className="text-[9px] font-medium">Close</span>
          </button>
        </nav>

        {/* Content area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Tab header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-bold text-gray-900">{meta.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{meta.desc}</p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'templates' && (
              <TemplatesTab expenses={expenses} onExportComplete={handleExportComplete} />
            )}
            {activeTab === 'destinations' && (
              <DestinationsTab expenses={expenses} onExportComplete={handleExportComplete} />
            )}
            {activeTab === 'schedule' && <ScheduleTab />}
            {activeTab === 'history' && <HistoryTab refreshKey={historyRefreshKey} />}
            {activeTab === 'share' && <ShareTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
