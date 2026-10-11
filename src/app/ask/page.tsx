'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { AnswerPanel } from '@/components/answer/answer-panel';
import { LanguageSelector } from '@/components/search/language-selector';
import { apiClient } from '@/lib/api-client';
import { AnswerResponse, SupportedLanguage } from '@/types/answer';
import { SUGGESTED_QUERIES } from '@/lib/constants';
import { Search, X, ArrowRight, AlertTriangle } from 'lucide-react';

function AskContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams.get('q') || '';
  const initialLang = (searchParams.get('lang') as SupportedLanguage) || 'auto';

  const [query, setQuery] = useState(initialQ);
  const [language, setLanguage] = useState<SupportedLanguage>(initialLang);
  const [answer, setAnswer] = useState<AnswerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noEvidenceFound, setNoEvidenceFound] = useState(false);

  const performSearch = async (targetQuery: string, targetLang: SupportedLanguage) => {
    if (!targetQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    setNoEvidenceFound(false);

    try {
      const res = await apiClient.askQuestion(targetQuery, targetLang);
      if (
        (!res.discoveredRelationships || res.discoveredRelationships.length === 0) &&
        (!res.passages || res.passages.length === 0) &&
        (!res.summary || res.summary.trim() === '')
      ) {
        setNoEvidenceFound(true);
        setAnswer(null);
      } else {
        setAnswer(res);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve relationships';
      setError(message);
      setAnswer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ) {
      setQuery(initialQ);
      performSearch(initialQ, initialLang);
    }
  }, [initialQ, initialLang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams();
    params.set('q', query.trim());
    if (language !== 'auto') params.set('lang', language);
    router.push(`/ask?${params.toString()}`);
    performSearch(query.trim(), language);
  };

  return (
    <div className="space-y-6">
      {/* Top Query Input Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-300 rounded-lg focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about cross-lingual entities, corporate links, or contract clauses..."
              className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <LanguageSelector value={language} onChange={setLanguage} size="sm" />

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
            >
              <span>{isLoading ? 'Tracing...' : 'Trace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Query Inspirations */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium mr-1 text-slate-400">Suggestions:</span>
          {SUGGESTED_QUERIES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setQuery(ex);
                performSearch(ex, language);
              }}
              className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded-md text-[11px] text-slate-600 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* No Evidence State */}
      {noEvidenceFound && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-8 text-center max-w-xl mx-auto space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900">No Verified Evidence Found</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The cross-lingual GraphRAG index returned no verified entity triples or documentary evidence connecting the terms in &ldquo;{query}&rdquo;.
          </p>
        </div>
      )}

      {/* Answer Panel */}
      {!noEvidenceFound && (
        <AnswerPanel
          answer={answer}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}

export default function AskPage() {
  return (
    <AppShell
      title="Ask & Discover"
      description="Cross-lingual multi-hop question answering backed by document citations."
    >
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading query workspace...</div>}>
        <AskContent />
      </Suspense>
    </AppShell>
  );
}
