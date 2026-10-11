'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { BrandLogo } from '@/components/layout/brand-logo';
import { LanguageSelector } from '@/components/search/language-selector';
import { SupportedLanguage } from '@/types/answer';
import { SUGGESTED_QUERIES } from '@/lib/constants';
import {
  Search,
  X,
  ArrowRight,
  FileText,
  Network,
  BarChart2,
  Globe,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('auto');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const params = new URLSearchParams();
    params.set('q', trimmed);
    if (language !== 'auto') params.set('lang', language);
    router.push(`/ask?${params.toString()}`);
  };

  const handleSelectExample = (exampleText: string) => {
    setQuery(exampleText);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      {/* Google-style minimal header */}
      <AppHeader />

      {/* Main Central Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-5xl mx-auto w-full text-center">
        {/* Brand Hero */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4">
            <BrandLogo size="lg" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 max-w-2xl mt-2 leading-tight">
            Discover connections, <span className="text-blue-600">not just answers.</span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Cross-Lingual GraphRAG discovers verified, evidence-backed relationships across English, Hindi, and Marathi documents.
          </p>
        </div>

        {/* Central Search Box */}
        <div className="w-full max-w-2xl mb-8">
          <form
            onSubmit={handleSearch}
            className="w-full flex items-center bg-white border border-slate-300 hover:border-slate-400 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100/70 rounded-full p-2 shadow-xs hover:shadow-md transition-all duration-200"
          >
            <div className="pl-3.5 pr-2 text-slate-400 shrink-0">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question or enter entities to trace connections..."
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base focus:outline-none px-2 py-1"
              autoFocus
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 mr-2"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="shrink-0 mr-1.5">
              <LanguageSelector value={language} onChange={setLanguage} size="sm" />
            </div>

            <button
              type="submit"
              className="shrink-0 flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-xs"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Example Suggestions */}
          <div className="mt-6 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 px-1 font-medium">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Suggested cross-lingual queries:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUERIES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleSelectExample(example)}
                  className="group flex items-center gap-1.5 text-xs text-left bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-3.5 py-1.5 rounded-full transition-all duration-150"
                >
                  <span>{example}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards / Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
          <Link
            href="/documents"
            className="group p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                Multilingual Documents
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ingest PDF & text corpora in English, Hindi, and Marathi with automated entity extraction.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600">
              <span>Manage documents</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/graph"
            className="group p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                Knowledge Graph
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Traverse interconnected entities, cross-border corporate ties, and evidence-backed edges.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600">
              <span>Explore graph</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/evaluation"
            className="group p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                RAG Evaluation
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Benchmark Recall@K, MRR, nDCG, and cross-lingual grounding faithfulness against ground truth.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600">
              <span>View benchmarks</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      {/* Minimal Google-style footer */}
      <footer className="w-full border-t border-slate-200 bg-slate-50/70 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-700">RelateRAG Research Platform</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              English, हिन्दी, मराठी
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/documents" className="hover:text-slate-900">Documents</Link>
            <Link href="/graph" className="hover:text-slate-900">Graph</Link>
            <Link href="/evaluation" className="hover:text-slate-900">Evaluation</Link>
            <Link href="/settings" className="hover:text-slate-900">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
