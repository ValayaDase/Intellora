'use client';

import { GraphEntity, GraphRelation } from '@/types/graph';
import { getLanguageBadgeColor, getLanguageLabel } from '@/lib/utils';
import {
  User,
  Building2,
  FileText,
  Compass,
  X,
  ExternalLink,
  Tag,
  Link as LinkIcon,
  BookOpen,
} from 'lucide-react';

interface EntityDetailsProps {
  entity: GraphEntity | null;
  relationships: GraphRelation[];
  onClose: () => void;
  onSelectRelatedEntity?: (entityId: string) => void;
}

export function EntityDetails({
  entity,
  relationships,
  onClose,
  onSelectRelatedEntity,
}: EntityDetailsProps) {
  if (!entity) return null;

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'company':
        return <Building2 className="w-4 h-4 text-purple-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-amber-600" />;
      default:
        return <Compass className="w-4 h-4 text-slate-600" />;
    }
  };

  const getEntityTypeBadge = (type: string) => {
    switch (type) {
      case 'person':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'company':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'document':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Connected relationships for this entity
  const connectedRelations = relationships.filter(
    (rel) => rel.source === entity.id || rel.target === entity.id
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-md p-5 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-slate-100 shrink-0">
            {getEntityIcon(entity.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium border capitalize ${getEntityTypeBadge(
                  entity.type
                )}`}
              >
                {entity.type}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {entity.degree} connections
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mt-1">
              {entity.name}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-4 space-y-5 flex-1">
        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Entity Summary
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
            {entity.description}
          </p>
        </div>

        {/* Multilingual Aliases */}
        {entity.aliasLanguages && (
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Cross-Lingual Aliases
            </h4>
            <div className="space-y-1.5">
              {entity.aliasLanguages.en && (
                <div className="flex items-center justify-between text-xs p-2 bg-blue-50/50 border border-blue-100 rounded-md">
                  <span className="text-slate-500 font-medium">English (EN):</span>
                  <span className="font-semibold text-slate-800">{entity.aliasLanguages.en}</span>
                </div>
              )}
              {entity.aliasLanguages.hi && (
                <div className="flex items-center justify-between text-xs p-2 bg-amber-50/50 border border-amber-100 rounded-md">
                  <span className="text-slate-500 font-medium">Hindi (हिन्दी):</span>
                  <span className="font-semibold text-slate-800">{entity.aliasLanguages.hi}</span>
                </div>
              )}
              {entity.aliasLanguages.mr && (
                <div className="flex items-center justify-between text-xs p-2 bg-emerald-50/50 border border-emerald-100 rounded-md">
                  <span className="text-slate-500 font-medium">Marathi (मराठी):</span>
                  <span className="font-semibold text-slate-800">{entity.aliasLanguages.mr}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connected Relationships */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Connected Edges ({connectedRelations.length})</span>
          </h4>
          <div className="space-y-2">
            {connectedRelations.map((rel) => {
              const isSource = rel.source === entity.id;
              const otherEntityId = isSource ? rel.target : rel.source;

              return (
                <div
                  key={rel.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 transition-colors text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-blue-600 font-semibold">{rel.label}</span>
                    <span className="text-[10px] text-slate-400">
                      {(rel.confidence * 100).toFixed(0)}% conf
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 italic">
                    &ldquo;{rel.evidence}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                    <span className="truncate max-w-[180px]">{rel.documentTitle}</span>
                    <button
                      onClick={() => onSelectRelatedEntity && onSelectRelatedEntity(otherEntityId)}
                      className="text-blue-600 font-medium hover:underline flex items-center gap-0.5"
                    >
                      Inspect Node
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evidence Citations & Source Documents */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Grounding Evidence ({entity.sourceDocuments.length})
          </h4>
          <div className="space-y-2">
            {entity.sourceDocuments.map((src, i) => {
              const langBadge = getLanguageBadgeColor(src.language);
              return (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 truncate max-w-[180px]" title={src.documentTitle}>
                      {src.documentTitle}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[10px]">p. {src.page}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium border ${langBadge.bg} ${langBadge.text} ${langBadge.border}`}
                      >
                        {getLanguageLabel(src.language)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-mono bg-white p-2 rounded border border-slate-200">
                    {src.contextSnippet}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
