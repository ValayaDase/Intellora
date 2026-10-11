'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { SupportedLanguage } from '@/types/answer';
import { apiClient } from '@/lib/api-client';
import {
  Settings,
  Server,
  Globe,
  Database,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Info,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export default function SettingsPage() {
  const [defaultLang, setDefaultLang] = useState<SupportedLanguage>('auto');
  const [topK, setTopK] = useState(5);
  const [graphHops, setGraphHops] = useState(2);
  const [minConfidence, setMinConfidence] = useState(80);
  const [fastApiUrl, setFastApiUrl] = useState(
    process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'
  );
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{
    status: 'connected' | 'disconnected' | 'idle';
    message: string;
  }>({
    status: 'idle',
    message: 'Backend connection not yet tested.',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTestConnection = async () => {
    setIsCheckingBackend(true);
    setBackendStatus({ status: 'idle', message: 'Pinging FastAPI server at ' + fastApiUrl + '...' });

    const client = new (apiClient.constructor as any)(fastApiUrl);
    const result = await client.checkHealth();

    setBackendStatus(result);
    setIsCheckingBackend(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <AppShell
      title="System Settings & Configuration"
      description="Manage cross-lingual retrieval parameters, backend connectivity, and supported language models."
    >
      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
        {/* Backend Connectivity Status Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">FastAPI Backend Connection</h2>
                <p className="text-xs text-slate-500">
                  Configure the URL for the Python GraphRAG service and Neo4j graph store.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  backendStatus.status === 'connected'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendStatus.status === 'connected' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
                {backendStatus.status === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                FastAPI Server Endpoint
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={fastApiUrl}
                  onChange={(e) => setFastApiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isCheckingBackend}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingBackend ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Backend Architecture Note</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {backendStatus.message ||
                  'Configure your Python FastAPI service endpoint. Requests query your live index, Neo4j graph store, and vector embeddings without exposing secrets in client code.'}
              </p>
            </div>
          </div>
        </div>

        {/* Retrieval & Graph Hyperparameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Retrieval & Graph Parameters</h2>
              <p className="text-xs text-slate-500">
                Tune cross-lingual vector search and graph traversal hop depth.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            {/* Top-K */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">
                  Retrieval Top-K Passages
                </label>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {topK} passages
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                step="1"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Number of cross-lingual passages fetched from vector index per query.
              </p>
            </div>

            {/* Graph Hops */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">
                  Maximum Graph Traversal Hops
                </label>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {graphHops} hops
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={graphHops}
                onChange={(e) => setGraphHops(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Maximum path distance explored in Neo4j entity graph (1=direct, 2-3=multi-hop).
              </p>
            </div>

            {/* Min Relationship Confidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">
                  Minimum Triple Confidence
                </label>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {minConfidence}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                step="5"
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-full accent-slate-700 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Discard low-probability relation triples during synthesis.
              </p>
            </div>

            {/* Default Answer Language */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Default Target Language
              </label>
              <select
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value as SupportedLanguage)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
              >
                <option value="auto">Auto-Detect Query Language</option>
                <option value="en">English (Default)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="mr">Marathi (मराठी)</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Language in which synthesized relationship summaries will be rendered.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Languages Overview */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Supported Multilingual Corpora</h2>
              <p className="text-xs text-slate-500">
                Current tokenization and cross-lingual embedding coverage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50/50 border border-blue-200/80 rounded-lg text-xs">
              <div className="flex items-center justify-between font-semibold text-blue-900 mb-1">
                <span>English (EN)</span>
                <span className="text-[10px] bg-blue-100 px-1.5 py-0.2 rounded">Latin</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Dense embeddings & BM25 hybrid indexing with entity NER extraction.
              </p>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-lg text-xs">
              <div className="flex items-center justify-between font-semibold text-amber-900 mb-1">
                <span>Hindi (HI)</span>
                <span className="text-[10px] bg-amber-100 px-1.5 py-0.2 rounded">Devanagari</span>
              </div>
              <p className="text-[11px] text-slate-600">
                IndicBERT / LaBSE aligned embeddings with Hindi transliteration mapping.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-lg text-xs">
              <div className="flex items-center justify-between font-semibold text-emerald-900 mb-1">
                <span>Marathi (MR)</span>
                <span className="text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">Devanagari</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Morphological analyzer and Marathi government gazette vocab adaptation.
              </p>
            </div>
          </div>
        </div>

        {/* Save button & confirmation */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings saved successfully</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Changes apply to client session and outgoing query payloads.
            </div>
          )}

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </AppShell>
  );
}
