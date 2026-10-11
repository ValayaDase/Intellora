'use client';

import { useState } from 'react';
import { RetrievedPassage } from '@/types/answer';
import { getLanguageBadgeColor, getLanguageLabel } from '@/lib/utils';
import { ChevronDown, ChevronUp, FileText, Globe, Tag } from 'lucide-react';

interface RetrievedPassageProps {
  passage: RetrievedPassage;
  defaultExpanded?: boolean;
}

export function RetrievedPassageItem({ passage, defaultExpanded = false }: RetrievedPassageProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const langBadge = getLanguageBadgeColor(passage.language);

  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden transition-all duration-150">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 sm:p-4 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-slate-100 text-slate-600 shrink-0 mt-0.5">
            <FileText className="w-4 h-4" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-800 text-sm">{passage.documentTitle}</span>
              <span className="text-xs text-slate-500 font-medium">Page {passage.pageNumber}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${langBadge.bg} ${langBadge.text} ${langBadge.border}`}
              >
                {getLanguageLabel(passage.language)}
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
              {passage.textSnippet}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Relevance: {(passage.relevanceScore * 100).toFixed(0)}%
          </span>
          <button
            type="button"
            className="p-1 rounded text-slate-400 hover:text-slate-600"
            aria-label={isExpanded ? 'Collapse passage' : 'Expand passage'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/60 p-4 space-y-3">
          {/* Original Passage */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Original Document Text ({getLanguageLabel(passage.language)})</span>
            </div>
            <div className="bg-white p-3 rounded-md border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
              {passage.textSnippet}
            </div>
          </div>

          {/* Cross-Lingual Translation if present */}
          {passage.translatedSnippet && (
            <div>
              <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Cross-Lingual Alignment (English Translation)</span>
              </div>
              <div className="bg-blue-50/60 p-3 rounded-md border border-blue-200 text-xs text-blue-950 leading-relaxed">
                {passage.translatedSnippet}
              </div>
            </div>
          )}

          {/* Entity Mentions */}
          {passage.entityMentions.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                Extracted Entities:
              </span>
              {passage.entityMentions.map((entity, i) => (
                <span
                  key={i}
                  className="text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-medium"
                >
                  {entity}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
