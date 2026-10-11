'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './brand-logo';
import { AppSidebar } from './app-sidebar';
import { Menu, X, Globe, Layers, ArrowLeft } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AppShell({ children, title, description, actions }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (title) return title;
    if (pathname.startsWith('/ask')) return 'Ask & Discover';
    if (pathname.startsWith('/documents')) return 'Document Ingestion';
    if (pathname.startsWith('/graph')) return 'Knowledge Graph';
    if (pathname.startsWith('/evaluation')) return 'RAG Evaluation';
    if (pathname.startsWith('/settings')) return 'System Settings';
    return 'RelateRAG Workspace';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <BrandLogo size="sm" />
          <span className="hidden sm:inline-block text-slate-300">/</span>
          <span className="hidden sm:inline-block text-sm font-medium text-slate-700">
            {getPageTitle()}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100/80 rounded-full border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>EN • HI • MR</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>
      </header>

      {/* Main workspace container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <AppSidebar />
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-900/20 backdrop-blur-xs flex">
            <div className="w-64 bg-white h-full shadow-xl flex flex-col">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <BrandLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AppSidebar />
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Workspace Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {(title || description || actions) && (
            <div className="bg-white border-b border-slate-200 px-6 py-4">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{title || getPageTitle()}</h1>
                  {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            </div>
          )}

          <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
