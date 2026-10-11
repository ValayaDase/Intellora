export interface MetricScore {
  metric: string;
  name: string;
  score: number;
  maxScore: number;
  benchmarkTarget: number;
  description: string;
  trend: 'positive' | 'neutral' | 'negative';
  category: 'retrieval' | 'generation' | 'cross_lingual';
}

export interface LanguageEvalPerformance {
  languagePair: string;
  sourceDocCount: number;
  retrievalRecall: number;
  crossLingualAlignmentScore: number;
  mrr: number;
  faithfulnessScore: number;
}

export interface EvaluationReport {
  timestamp: string;
  totalEvaluatedQueries: number;
  datasetName: string;
  metrics: MetricScore[];
  languagePerformance: LanguageEvalPerformance[];
}

export interface AppSettings {
  defaultLanguage: 'auto' | 'en' | 'hi' | 'mr';
  topK: number;
  maxGraphHops: number;
  similarityThreshold: number;
  fastApiUrl: string;
  neo4jHost: string;
  isBackendConnected: boolean;
  theme: 'light' | 'system';
}
