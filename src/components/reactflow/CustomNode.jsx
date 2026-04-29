import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const CustomNode = ({ data }) => {
  console.log("CustomNode data:", data);
  return (
    <div className="group relative">
      {/* 
        Tooltip Container 
        - Positioned absolute above the node
        - Hidden by default, block on group-hover
      */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-slate-800 text-white text-xs rounded p-2 shadow-lg">
          <p className="font-semibold mb-1">{data.label}</p>
          <p className="text-slate-300">{data.description}</p>
        </div>
        {/* Triangle pointer */}
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 absolute left-1/2 -translate-x-1/2 top-full"></div>
      </div>

      {console.log("Rendering node:", data)}

      {/* Node Content */}
      <div className={`px-4 py-2 shadow-md rounded-md border-2 bg-white flex items-center justify-center min-w-[150px]
          ${data.type === 'APP' || data.type === 'App' ? 'border-blue-500' : 'border-emerald-500'}
      `}>
        <div className="text-center">
          <div className="text-sm font-bold text-slate-800">{data.label}</div>
          <div className={`text-[10px] uppercase font-bold mt-0.5
              ${data.type === 'APP' || data.type === 'App' ? 'text-blue-500' : 'text-emerald-500'}
          `}>
            {data.type}
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-slate-400" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-slate-400" />
    </div>
  );
};

export default memo(CustomNode);