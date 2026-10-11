export type SupportedLanguage = 'auto' | 'en' | 'hi' | 'mr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag?: string;
}

export interface RetrievedPassage {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  language: 'en' | 'hi' | 'mr';
  textSnippet: string;
  translatedSnippet?: string;
  relevanceScore: number;
  entityMentions: string[];
}

export interface Citation {
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  language: 'en' | 'hi' | 'mr';
  passageId: string;
  confidence: number;
  snippetPreview: string;
}

export interface DiscoveredRelationship {
  id: string;
  sourceEntity: string;
  sourceType: 'person' | 'company' | 'document' | 'concept';
  targetEntity: string;
  targetType: 'person' | 'company' | 'document' | 'concept';
  relationType: string;
  evidenceCount: number;
  confidence: number;
  summary: string;
}

export interface AnswerResponse {
  query: string;
  language: SupportedLanguage;
  timestamp: string;
  summary: string;
  discoveredRelationships: DiscoveredRelationship[];
  detailedAnswer: string[];
  citations: Citation[];
  passages: RetrievedPassage[];
  executionTimeMs: number;
  graphHops: number;
}
