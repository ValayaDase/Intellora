'use client';

import { MetricScore } from '@/types/evaluation';
import { TrendingUp, Info } from 'lucide-react';

interface MetricCardProps {
  metric: MetricScore;
}

export function MetricCard({ metric }: MetricCardProps) {
  const percentage = (metric.score / metric.maxScore) * 100;
  const targetPercentage = (metric.benchmarkTarget / metric.maxScore) * 100;
  const isAboveTarget = metric.score >= metric.benchmarkTarget;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {metric.category.replace('_', ' ')}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isAboveTarget
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            {isAboveTarget ? 'Target met' : 'Near target'}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-slate-800 mt-1">
          {metric.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-slate-900">
            {metric.score.toFixed(3)}
          </span>
          <span className="text-xs text-slate-400">
            / {metric.maxScore.toFixed(1)}
          </span>
        </div>

        {/* Progress vs target */}
        <div className="mt-3 space-y-1">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isAboveTarget ? 'bg-blue-600' : 'bg-amber-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Score: {percentage.toFixed(1)}%</span>
            <span>Target: {targetPercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{metric.description}</span>
        </p>
      </div>
    </div>
  );
}
