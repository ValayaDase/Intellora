'use client';

import { SUGGESTED_QUERIES } from '@/lib/constants';
import { ArrowUpRight, HelpCircle } from 'lucide-react';

interface ExampleQueriesProps {
  onSelectQuery: (query: string) => void;
}

export function ExampleQueries({ onSelectQuery }: ExampleQueriesProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2.5 px-1 font-medium">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
        <span>Try these cross-lingual relationship queries:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUERIES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onSelectQuery(example)}
            className="group flex items-center gap-1.5 text-xs text-left bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-3.5 py-2 rounded-full transition-all duration-150 shadow-2xs hover:shadow-xs"
          >
            <span>{example}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
