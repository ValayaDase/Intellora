'use client';

import { Citation } from '@/types/answer';
import { getLanguageBadgeColor, getLanguageLabel } from '@/lib/utils';
import { FileText, ExternalLink, Bookmark } from 'lucide-react';

interface CitationCardProps {
  citation: Citation;
  index: number;
  onSelect?: (citation: Citation) => void;
}

export function CitationCard({ citation, index, onSelect }: CitationCardProps) {
  const langBadge = getLanguageBadgeColor(citation.language);

  return (
    <div
      onClick={() => onSelect && onSelect(citation)}
      className="p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer group"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              [{index + 1}]
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${langBadge.bg} ${langBadge.text} ${langBadge.border}`}
            >
              {getLanguageLabel(citation.language)}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-500">
            Page {citation.pageNumber}
          </span>
        </div>

        <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
          {citation.documentTitle}
        </h4>

        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
          &ldquo;{citation.snippetPreview}&rdquo;
        </p>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Confidence: {(citation.confidence * 100).toFixed(0)}%</span>
        <span className="text-blue-600 font-medium group-hover:underline flex items-center gap-0.5">
          View passage
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
}
