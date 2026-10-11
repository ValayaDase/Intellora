'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  FileText,
  Network,
  BarChart2,
  Settings,
  HelpCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
  { href: '/ask', label: 'Ask & Discover', description: 'Query cross-lingual corpus', icon: Search },
  { href: '/documents', label: 'Documents', description: 'Ingest & manage files', icon: FileText },
  { href: '/graph', label: 'Knowledge Graph', description: 'Explore entity relationships', icon: Network },
  { href: '/evaluation', label: 'Evaluation', description: 'RAG benchmark metrics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', description: 'Languages & configuration', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`border-r border-slate-200 bg-white flex flex-col transition-all duration-200 z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar nav items */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
              {!isCollapsed && (
                <div className="flex flex-col text-left truncate">
                  <span className="truncate">{item.label}</span>
                  <span className="text-[11px] font-normal text-slate-400 truncate">{item.description}</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer controls & collapse button */}
      <div className="p-3 border-t border-slate-100 flex flex-col gap-2">
        {!isCollapsed && (
          <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200/60">
            <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              RelateRAG Core
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              GraphRAG retrieval for English, Hindi & Marathi.
            </p>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg text-xs transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
