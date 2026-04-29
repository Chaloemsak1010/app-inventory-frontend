import React from 'react';
import { Layers } from 'lucide-react';
import { Handle, Position } from '@xyflow/react';

export default function AppNode({ data }) {
  return (
    <div className="px-4 py-3 rounded-md shadow-md border-2 bg-white min-w-[160px]">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center border border-blue-200">
          <Layers className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-slate-800 truncate">{data.label}</div>
          {data.data?.application_name && (
            <div className="text-xs text-slate-500">{data.data.application_name}</div>
          )}
        </div>
      </div>
      <div className="mt-2 text-[10px] text-slate-500">Type: Application</div>
    </div>
  );
}