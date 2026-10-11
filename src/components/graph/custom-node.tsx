'use client';

import { Handle, Position } from '@xyflow/react';
import { User, Building2, FileText, Compass, Landmark } from 'lucide-react';
import { EntityType } from '@/types/graph';

interface CustomNodeProps {
  data: {
    label: string;
    type: EntityType;
    degree: number;
    sublabel?: string;
    isSelected?: boolean;
  };
}

export function CustomGraphNode({ data }: CustomNodeProps) {
  const getNodeStyle = (type: EntityType) => {
    switch (type) {
      case 'person':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-400',
          selectedBorder: 'ring-3 ring-blue-500/30 border-blue-600',
          text: 'text-blue-900',
          iconBg: 'bg-blue-600 text-white',
          tag: 'bg-blue-100 text-blue-700',
          Icon: User,
        };
      case 'company':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-400',
          selectedBorder: 'ring-3 ring-purple-500/30 border-purple-600',
          text: 'text-purple-900',
          iconBg: 'bg-purple-600 text-white',
          tag: 'bg-purple-100 text-purple-700',
          Icon: Building2,
        };
      case 'document':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-400',
          selectedBorder: 'ring-3 ring-amber-500/30 border-amber-600',
          text: 'text-amber-900',
          iconBg: 'bg-amber-600 text-white',
          tag: 'bg-amber-100 text-amber-700',
          Icon: FileText,
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-400',
          selectedBorder: 'ring-3 ring-slate-500/30 border-slate-600',
          text: 'text-slate-900',
          iconBg: 'bg-slate-700 text-white',
          tag: 'bg-slate-200 text-slate-700',
          Icon: Landmark,
        };
    }
  };

  const style = getNodeStyle(data.type);
  const Icon = style.Icon;

  return (
    <div
      className={`relative px-3.5 py-2.5 rounded-xl border-2 shadow-xs bg-white transition-all duration-150 min-w-[190px] max-w-[240px] cursor-pointer ${
        data.isSelected ? style.selectedBorder : style.border
      }`}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-blue-500" />

      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-lg ${style.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${style.tag}`}>
              {data.type}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">deg: {data.degree}</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5" title={data.label}>
            {data.label}
          </h4>
          {data.sublabel && (
            <p className="text-[10px] text-slate-500 truncate">{data.sublabel}</p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-blue-500" />
    </div>
  );
}
