'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import { KnowledgeGraphData, GraphEntity, EntityType } from '@/types/graph';
import { CustomGraphNode } from './custom-node';
import { Search, Filter, ZoomIn, ZoomOut, Maximize2, RotateCcw, X, Layers } from 'lucide-react';

interface KnowledgeGraphProps {
  data: KnowledgeGraphData;
  selectedEntityId: string | null;
  onSelectEntity: (entity: GraphEntity | null) => void;
}

const nodeTypes = {
  custom: CustomGraphNode,
};

// Initial position coordinates layout for clear presentation
const DEFAULT_COORDINATES: Record<string, { x: number; y: number }> = {
  'ent-1': { x: 340, y: 50 },    // Apex Global Holdings (Company)
  'ent-2': { x: 60, y: 160 },    // Rajesh Sharma (Person)
  'ent-3': { x: 340, y: 220 },   // Vortex Energy India (Company)
  'ent-4': { x: 640, y: 230 },   // Pune Municipal Corporation (Gov)
  'ent-5': { x: 640, y: 390 },   // Dr. Sunita Deshmukh (Person)
  'ent-6': { x: 80, y: 30 },     // Singapore Tech Ventures (Company)
  'ent-7': { x: 340, y: 400 },   // Solar Concession Agreement (Doc)
};

function FlowCanvas({
  data,
  selectedEntityId,
  onSelectEntity,
  searchFilter,
  typeFilter,
}: KnowledgeGraphProps & { searchFilter: string; typeFilter: 'all' | EntityType }) {
  const { zoomIn, zoomOut, fitView, setCenter } = useReactFlow();

  // Convert entities to React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    return data.entities.map((entity, index) => {
      const coord = DEFAULT_COORDINATES[entity.id] || {
        x: 100 + (index % 3) * 260,
        y: 100 + Math.floor(index / 3) * 160,
      };

      const matchesSearch = entity.name.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesType = typeFilter === 'all' || entity.type === typeFilter;
      const isVisible = matchesSearch && matchesType;
      const isSelected = entity.id === selectedEntityId;

      return {
        id: entity.id,
        type: 'custom',
        position: coord,
        data: {
          label: entity.name,
          type: entity.type,
          degree: entity.degree,
          sublabel: entity.aliasLanguages?.hi || entity.aliasLanguages?.mr,
          isSelected,
        },
        hidden: !isVisible,
      };
    });
  }, [data.entities, searchFilter, typeFilter, selectedEntityId]);

  // Convert relationships to React Flow edges
  const initialEdges: Edge[] = useMemo(() => {
    return data.relationships.map((rel) => {
      const isConnectedToSelected =
        rel.source === selectedEntityId || rel.target === selectedEntityId;

      return {
        id: rel.id,
        source: rel.source,
        target: rel.target,
        label: rel.label,
        type: 'smoothstep',
        animated: isConnectedToSelected,
        style: {
          stroke: isConnectedToSelected ? '#1a73e8' : '#94a3b8',
          strokeWidth: isConnectedToSelected ? 2.5 : 1.5,
        },
        labelStyle: {
          fill: isConnectedToSelected ? '#1a73e8' : '#475569',
          fontWeight: 600,
          fontSize: 10,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
          stroke: isConnectedToSelected ? '#1a73e8' : '#e2e8f0',
          strokeWidth: 1,
          rx: 4,
          ry: 4,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isConnectedToSelected ? '#1a73e8' : '#94a3b8',
          width: 16,
          height: 16,
        },
      };
    });
  }, [data.relationships, selectedEntityId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Keep nodes in sync when filters or selection change
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const found = data.entities.find((e) => e.id === node.id) || null;
      onSelectEntity(found);
    },
    [data.entities, onSelectEntity]
  );

  const handlePaneClick = useCallback(() => {
    onSelectEntity(null);
  }, [onSelectEntity]);

  const handleResetView = () => {
    fitView({ padding: 0.2, duration: 400 });
  };

  return (
    <div className="relative w-full h-full min-h-[540px] bg-slate-50/70 border border-slate-200 rounded-xl overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.4}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={20} size={1} variant={BackgroundVariant.Dots} />

        {/* Floating Custom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
          <button
            onClick={() => zoomIn({ duration: 200 })}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => zoomOut({ duration: 200 })}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
            title="Fit View"
            aria-label="Fit View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-xs border border-slate-200 px-3 py-1.5 rounded-lg text-[11px] shadow-xs text-slate-600">
          <span className="font-semibold text-slate-400 uppercase text-[10px]">Nodes:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Person
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            Company / Org
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Document
          </span>
        </div>
      </ReactFlow>
    </div>
  );
}

export function KnowledgeGraphCanvas({
  data,
  selectedEntityId,
  onSelectEntity,
}: KnowledgeGraphProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | EntityType>('all');

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search entities by English, Hindi or Marathi name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="all">All Entity Types</option>
            <option value="company">Companies</option>
            <option value="person">Persons</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </div>

      {/* React Flow Container */}
      <div className="flex-1 w-full min-h-[540px]">
        <ReactFlowProvider>
          <FlowCanvas
            data={data}
            selectedEntityId={selectedEntityId}
            onSelectEntity={onSelectEntity}
            searchFilter={searchFilter}
            typeFilter={typeFilter}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
