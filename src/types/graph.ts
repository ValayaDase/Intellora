export type EntityType = 'person' | 'company' | 'document' | 'concept' | 'location';

export interface GraphEntity {
  id: string;
  name: string;
  type: EntityType;
  aliasLanguages?: {
    en?: string;
    hi?: string;
    mr?: string;
  };
  degree: number;
  description: string;
  sourceDocuments: {
    documentId: string;
    documentTitle: string;
    page: number;
    language: 'en' | 'hi' | 'mr';
    contextSnippet: string;
  }[];
}

export interface GraphRelation {
  id: string;
  source: string;
  target: string;
  relationType: string;
  label: string;
  confidence: number;
  evidence: string;
  languageSource: ('en' | 'hi' | 'mr')[];
  documentId: string;
  documentTitle: string;
}

export interface KnowledgeGraphData {
  entities: GraphEntity[];
  relationships: GraphRelation[];
}
