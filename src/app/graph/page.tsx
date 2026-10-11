'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { KnowledgeGraphCanvas } from '@/components/graph/knowledge-graph';
import { EntityDetails } from '@/components/graph/entity-details';
import { KnowledgeGraphData, GraphEntity, EntityType } from '@/types/graph';
import { apiClient } from '@/lib/api-client';
import {
  Network,
  Search,
  User,
  Building2,
  FileText,
  Compass,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function KnowledgeGraphPage() {
  const [graphData, setGraphData] = useState<KnowledgeGraphData>({
    entities: [],
    relationships: [],
  });
  const [selectedEntity, setSelectedEntity] = useState<GraphEntity | null>(null);
  const [entitySearch, setEntitySearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchGraph = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getKnowledgeGraph();
      setGraphData(data);
      if (data.entities.length > 0) {
        setSelectedEntity(data.entities[0]);
      } else {
        setSelectedEntity(null);
      }
    } catch {
      setGraphData({ entities: [], relationships: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const filteredEntities = graphData.entities.filter(
    (e) =>
      e.name.toLowerCase().includes(entitySearch.toLowerCase()) ||
      (e.aliasLanguages?.hi && e.aliasLanguages.hi.includes(entitySearch)) ||
      (e.aliasLanguages?.mr && e.aliasLanguages.mr.includes(entitySearch))
  );

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'person':
        return <User className="w-3.5 h-3.5 text-blue-600" />;
      case 'company':
        return <Building2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'document':
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const handleSelectRelatedEntity = (entityId: string) => {
    const found = graphData.entities.find((e) => e.id === entityId);
    if (found) setSelectedEntity(found);
  };

  return (
    <AppShell
      title="Knowledge Graph Explorer"
      description="Interactive multi-hop relationship exploration across English, Hindi, and Marathi corpora."
      actions={
        <button
          onClick={fetchGraph}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Graph</span>
        </button>
      }
    >
      <div className="space-y-4">
        {graphData.entities.length === 0 && !isLoading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">No Knowledge Graph Data Available</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Knowledge graph entities and relationships are constructed during document ingestion. Ingest documents to extract cross-lingual entity triples.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/documents"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
              >
                <span>Go to Documents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Explorer Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left Column: Entity Directory (3 cols) */}
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[640px]">
              <div className="p-3 border-b border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-800">Entity Directory</span>
                  <span className="text-[11px] text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                    {filteredEntities.length}
                  </span>
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={entitySearch}
                    onChange={(e) => setEntitySearch(e.target.value)}
                    placeholder="Filter entities..."
                    className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-1">
                {filteredEntities.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No matching entities found
                  </div>
                ) : (
                  filteredEntities.map((ent) => {
                    const isSelected = selectedEntity?.id === ent.id;
                    return (
                      <button
                        key={ent.id}
                        onClick={() => setSelectedEntity(ent)}
                        className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-blue-50/80 border border-blue-200 text-blue-900 font-medium'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="p-1.5 rounded bg-slate-100 shrink-0 mt-0.5">
                          {getEntityIcon(ent.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold truncate text-slate-900">
                              {ent.name}
                            </p>
                            <span className="text-[10px] text-slate-400 font-normal">
                              d:{ent.degree}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate capitalize mt-0.5">
                            {ent.type} {ent.aliasLanguages?.hi && `• ${ent.aliasLanguages.hi}`}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Middle: Canvas Area (6 cols if details open, else 9 cols) */}
            <div
              className={`transition-all duration-200 h-[640px] ${
                selectedEntity ? 'lg:col-span-5' : 'lg:col-span-9'
              }`}
            >
              <KnowledgeGraphCanvas
                data={graphData}
                selectedEntityId={selectedEntity?.id || null}
                onSelectEntity={setSelectedEntity}
              />
            </div>

            {/* Right Column: Entity Details Panel (4 cols) */}
            {selectedEntity && (
              <div className="lg:col-span-4 h-[640px]">
                <EntityDetails
                  entity={selectedEntity}
                  relationships={graphData.relationships}
                  onClose={() => setSelectedEntity(null)}
                  onSelectRelatedEntity={handleSelectRelatedEntity}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
