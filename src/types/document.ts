export type DocumentLanguage = 'en' | 'hi' | 'mr';

export type DocumentProcessingStatus = 'indexed' | 'processing' | 'extracting_entities' | 'failed';

export interface DocumentItem {
  id: string;
  name: string;
  fileType: 'pdf' | 'txt' | 'docx';
  sizeBytes: number;
  language: DocumentLanguage;
  uploadedAt: string;
  status: DocumentProcessingStatus;
  totalPages?: number;
  extractedEntitiesCount?: number;
  extractedTriplesCount?: number;
  description?: string;
}

export interface DocumentFilter {
  query: string;
  language: 'all' | DocumentLanguage;
  status: 'all' | DocumentProcessingStatus;
}
