import { generateId } from './utils';

export interface ExportRecord {
  id: string;
  timestamp: string;       // ISO datetime
  templateName: string;
  destination: string;     // 'Download' | 'Email' | 'Google Sheets' | 'Dropbox' | 'OneDrive'
  format: string;          // 'CSV' | 'JSON' | 'PDF'
  recordCount: number;
  status: 'success' | 'failed';
}

export interface ExportSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  destination: string;
  templateId: string;
  nextRun: string;   // ISO datetime
  lastRun?: string;  // ISO datetime
}

const HISTORY_KEY = 'export_hub_history';
const SCHEDULE_KEY = 'export_hub_schedule';

export function getExportHistory(): ExportRecord[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function addExportRecord(record: Omit<ExportRecord, 'id'>): void {
  const history = getExportHistory();
  const entry: ExportRecord = { ...record, id: generateId() };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...history].slice(0, 50)));
}

export function clearExportHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function getSchedule(): ExportSchedule {
  try {
    return JSON.parse(localStorage.getItem(SCHEDULE_KEY) ?? 'null') ?? makeDefault();
  } catch {
    return makeDefault();
  }
}

export function saveSchedule(s: ExportSchedule): void {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(s));
}

function makeDefault(): ExportSchedule {
  return {
    enabled: false,
    frequency: 'monthly',
    destination: 'Email',
    templateId: 'monthly-summary',
    nextRun: nextRunISO('monthly'),
  };
}

export function nextRunISO(freq: 'daily' | 'weekly' | 'monthly'): string {
  const d = new Date();
  if (freq === 'daily') d.setDate(d.getDate() + 1);
  else if (freq === 'weekly') d.setDate(d.getDate() + 7);
  else { d.setMonth(d.getMonth() + 1); d.setDate(1); }
  return d.toISOString();
}
