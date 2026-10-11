'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './brand-logo';
import { FileText, Network, BarChart2, Settings, Search } from 'lucide-react';

interface AppHeaderProps {
  minimal?: boolean;
}

export function AppHeader({ minimal = false }: AppHeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/ask', label: 'Ask', icon: Search },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/graph', label: 'Knowledge Graph', icon: Network },
    { href: '/evaluation', label: 'Evaluation', icon: BarChart2 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <BrandLogo size="md" />

          {/* Secondary nav for desktop */}
          {!minimal && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-700 bg-blue-50/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right side status indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>EN • HI • MR</span>
          </div>
          <Link
            href="/ask"
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-xs"
          >
            Launch Query
          </Link>
        </div>
      </div>
    </header>
  );
}
