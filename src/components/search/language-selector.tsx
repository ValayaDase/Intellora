'use client';

import { SupportedLanguage, LanguageOption } from '@/types/answer';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
  size?: 'sm' | 'md';
}

const LANGUAGES: LanguageOption[] = [
  { code: 'auto', name: 'Auto Detect', nativeName: 'Multi-Lingual' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

export function LanguageSelector({ value, onChange, size = 'md' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = LANGUAGES.find((l) => l.code === value) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-2 text-sm'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-slate-400`} />
        <span className="font-medium text-slate-700">{selected.name}</span>
        <span className="text-slate-400 text-xs hidden sm:inline">({selected.nativeName})</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 z-50 focus:outline-none">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Target Query Language
          </div>
          {LANGUAGES.map((lang) => {
            const isCurrent = lang.code === value;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left hover:bg-slate-50 transition-colors ${
                  isCurrent ? 'bg-blue-50/70 text-blue-700 font-medium' : 'text-slate-700'
                }`}
              >
                <span>{lang.name}</span>
                <span className="text-xs text-slate-400">{lang.nativeName}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
