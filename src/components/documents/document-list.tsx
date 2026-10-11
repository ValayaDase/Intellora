'use client';

import { useState } from 'react';
import { DocumentItem, DocumentLanguage, DocumentProcessingStatus } from '@/types/document';
import { formatBytes, formatDate, getLanguageBadgeColor, getLanguageLabel } from '@/lib/utils';
import {
  Search,
  Filter,
  Trash2,
  FileText,
  FileCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  AlertTriangle,
} from 'lucide-react';

interface DocumentListProps {
  documents: DocumentItem[];
  onDeleteDocument: (id: string) => void;
}

export function DocumentList({ documents, onDeleteDocument }: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | DocumentLanguage>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | DocumentProcessingStatus>('all');
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLanguage === 'all' || doc.language === selectedLanguage;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    return matchesSearch && matchesLang && matchesStatus;
  });

  const getStatusBadge = (status: DocumentProcessingStatus) => {
    switch (status) {
      case 'indexed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Indexed
          </span>
        );
      case 'extracting_entities':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600 animate-spin" />
            Extracting Triples
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Parsing
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Failed
          </span>
        );
    }
  };

  const confirmDelete = () => {
    if (docToDelete) {
      onDeleteDocument(docToDelete.id);
      setDocToDelete(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Search & Filter Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by filename..."
            className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Language filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Lang:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="mr">Marathi (मराठी)</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="indexed">Indexed</option>
              <option value="extracting_entities">Extracting Triples</option>
              <option value="processing">Parsing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Document Name</th>
              <th className="py-3 px-4">Language</th>
              <th className="py-3 px-4">Size & Pages</th>
              <th className="py-3 px-4">Extracted Triples</th>
              <th className="py-3 px-4">Ingestion Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-600">No documents found</p>
                    <p className="text-[11px] text-slate-400">
                      Try adjusting your search criteria or upload a new file above.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => {
                const langBadge = getLanguageBadgeColor(doc.language);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2.5 max-w-xs">
                        <div className="p-1.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {doc.fileType === 'pdf' ? (
                            <FileText className="w-4 h-4 text-red-500" />
                          ) : (
                            <FileCode className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="truncate font-medium text-slate-900" title={doc.name}>
                            {doc.name}
                          </p>
                          {doc.description && (
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${langBadge.bg} ${langBadge.text} ${langBadge.border}`}
                      >
                        {getLanguageLabel(doc.language)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <span>{formatBytes(doc.sizeBytes)}</span>
                      {doc.totalPages && (
                        <span className="text-slate-400 ml-1">({doc.totalPages} pp.)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {doc.extractedTriplesCount ? (
                        <span className="font-semibold text-slate-700">
                          {doc.extractedTriplesCount} <span className="text-slate-400 font-normal">triples</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(doc.uploadedAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(doc.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setDocToDelete(doc)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete document"
                        aria-label={`Delete ${doc.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>Showing {filteredDocs.length} of {documents.length} document(s)</span>
        <span className="text-slate-400">Index storage: {formatBytes(documents.reduce((acc, d) => acc + d.sizeBytes, 0))}</span>
      </div>

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-red-100 text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Remove Document from Index?</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to remove <span className="font-semibold text-slate-800">&ldquo;{docToDelete.name}&rdquo;</span>? This will purge its extracted entity triples and embeddings from the index.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors shadow-xs"
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
