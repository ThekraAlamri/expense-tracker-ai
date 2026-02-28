'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Your financial overview' },
  '/expenses': { title: 'Expenses', subtitle: 'Manage and track your spending' },
};

export default function Header() {
  const pathname = usePathname();
  const meta = titles[pathname] ?? { title: 'SpendSmart', subtitle: '' };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{meta.title}</h1>
        <p className="text-xs text-gray-400">{meta.subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
