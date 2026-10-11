'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { DocumentUploader } from '@/components/documents/document-uploader';
import { DocumentList } from '@/components/documents/document-list';
import { DocumentItem } from '@/types/document';
import { apiClient } from '@/lib/api-client';
import { Plus } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [showUploader, setShowUploader] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiClient.getDocuments().then((docs) => {
      if (isMounted) setDocuments(docs);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDocumentUploaded = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDocument = async (id: string) => {
    await apiClient.deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <AppShell
      title="Multilingual Document Ingestion"
      description="Ingest English, Hindi, and Marathi documents for GraphRAG entity and triple extraction."
      actions={
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showUploader ? 'Hide Uploader' : 'Add Document'}</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Upload Zone */}
        {showUploader && (
          <DocumentUploader onDocumentUploaded={handleDocumentUploaded} />
        )}

        {/* Document Listing & Management */}
        <DocumentList
          documents={documents}
          onDeleteDocument={handleDeleteDocument}
        />
      </div>
    </AppShell>
  );
}
