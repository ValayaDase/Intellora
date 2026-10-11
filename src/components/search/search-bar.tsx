'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { LanguageSelector } from './language-selector';
import { SupportedLanguage } from '@/types/answer';

interface SearchBarProps {
  initialQuery?: string;
  initialLanguage?: SupportedLanguage;
  size?: 'lg' | 'default';
  autoFocus?: boolean;
  onSearch?: (query: string, language: SupportedLanguage) => void;
}

export function SearchBar({
  initialQuery = '',
  initialLanguage = 'auto',
  size = 'lg',
  autoFocus = false,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (onSearch) {
      onSearch(trimmed, language);
    } else {
      const searchParams = new URLSearchParams();
      searchParams.set('q', trimmed);
      if (language !== 'auto') {
        searchParams.set('lang', language);
      }
      router.push(`/ask?${searchParams.toString()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setQuery('');
    }
  };

  const isLarge = size === 'lg';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div
        className={`relative flex items-center bg-white border border-slate-300 hover:border-slate-400 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 rounded-full transition-all duration-150 ${
          isLarge ? 'p-2 sm:p-2.5 shadow-sm hover:shadow-md' : 'p-1.5 shadow-xs'
        }`}
      >
        {/* Search icon */}
        <div className="pl-3.5 pr-2 text-slate-400 flex items-center shrink-0">
          <Search className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder="Ask a question or enter entities to discover relationships..."
          className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none px-1 py-1"
        />

        {/* Clear button if has text */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 mr-2 transition-colors"
            title="Clear query"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Language selector */}
        <div className="shrink-0 mr-1 sm:mr-2">
          <LanguageSelector value={language} onChange={setLanguage} size={isLarge ? 'md' : 'sm'} />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`shrink-0 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-xs ${
            isLarge ? 'px-4 sm:px-5 py-2.5 text-sm gap-2' : 'px-3 py-1.5 text-xs gap-1.5'
          }`}
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
