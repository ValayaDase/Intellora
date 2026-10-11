'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { MetricCard } from '@/components/evaluation/metric-card';
import { EvaluationReport } from '@/types/evaluation';
import { apiClient } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import {
  BarChart2,
  Play,
  Globe,
  CheckCircle2,
  Clock,
  Layers,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function EvaluationPage() {
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [isRunningEval, setIsRunningEval] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState('RelateRAG-Benchmark-v1.2');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    apiClient.getEvaluationMetrics().then((data) => {
      if (isMounted) setReport(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRunEvaluation = async () => {
    setIsRunningEval(true);
    setErrorMessage(null);
    setEvalProgress(15);

    try {
      const data = await apiClient.getEvaluationMetrics();
      if (!data) {
        throw new Error('Evaluation service offline. Connect the FastAPI evaluation pipeline to execute benchmarks.');
      }
      setReport(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Evaluation run failed';
      setErrorMessage(msg);
    } finally {
      setIsRunningEval(false);
      setEvalProgress(0);
    }
  };

  return (
    <AppShell
      title="GraphRAG Evaluation & Benchmarks"
      description="Evaluate cross-lingual retrieval fidelity, multi-hop accuracy, and answer grounding faithfulness."
      actions={
        <button
          onClick={handleRunEvaluation}
          disabled={isRunningEval}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunningEval ? `Running Eval (${evalProgress}%)` : 'Run Benchmark Suite'}</span>
        </button>
      }
    >
      <div className="space-y-6">
        {errorMessage && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Evaluation Config Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">Evaluation Dataset:</span>
            <select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800 focus:outline-none"
            >
              <option value="RelateRAG-Benchmark-v1.2">RelateRAG-Benchmark-v1.2 (Multilingual Corporate Corpus)</option>
              <option value="LegalCross-100">LegalCross-100 (Bilingual Statutory QA)</option>
              <option value="CorporateGraph-Eval">CorporateGraph-Eval (Entity Disambiguation)</option>
            </select>
          </div>

          {report && (
            <div className="flex items-center gap-3 text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Last Run: {formatDate(report.timestamp)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                {report.totalEvaluatedQueries} Test Cases
              </span>
            </div>
          )}
        </div>

        {/* Empty State when no evaluation has run */}
        {!report ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">No Evaluation Benchmarks Run Yet</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Connect your FastAPI evaluation pipeline or trigger a benchmark suite above to evaluate Recall@K, MRR, and cross-lingual grounding faithfulness.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Primary Metrics Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  Core RAG Quality Metrics
                </h3>
                <span className="text-xs text-slate-500">Evaluated on cross-lingual test pairs</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.metrics.map((metric) => (
                  <MetricCard key={metric.metric} metric={metric} />
                ))}
              </div>
            </div>

            {/* Language-Wise Retrieval Performance Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Language-Wise Cross-Lingual Retrieval Performance
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Breakdown of alignment accuracy, MRR, and faithfulness by source document language pairs.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Multi-way Triangulation</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Language Pair</th>
                      <th className="py-3 px-4">Evaluation Docs</th>
                      <th className="py-3 px-4">Recall@5</th>
                      <th className="py-3 px-4">Cross-Lingual Alignment</th>
                      <th className="py-3 px-4">MRR</th>
                      <th className="py-3 px-4">Faithfulness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.languagePerformance.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {row.languagePair}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {row.sourceDocCount} docs
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">
                        {(row.retrievalRecall * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-blue-700">
                        {(row.crossLingualAlignmentScore * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono">
                      {row.mrr.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {(row.faithfulnessScore * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}
  </div>
</AppShell>
  );
}
