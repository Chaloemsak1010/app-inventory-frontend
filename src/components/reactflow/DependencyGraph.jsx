import { useCallback, useMemo , useEffect } from 'react';
import  {ReactFlow, Controls, Background, useNodesState, useEdgesState, } from '@xyflow/react';

import '@xyflow/react/dist/style.css';


import AppNode from '@/components/reactflow/nodes/AppNode';
import ServerNode from '@/components/reactflow/nodes/ServerNode';
import ModuleNode from '@/components/reactflow/nodes/ModuleNode';
import CustomNode from '@/components/reactflow/CustomNode';

import CustomEdge from '@/components/reactflow/CustomEdge';

import DownloadButton from '@/components/reactflow/DownloadButton';
import Resetbutton from '@/components/reactflow/ResetButton';
;

const DependencyGraph = ({ nodes, edges }) => {

  const nodeTypes = useMemo(() => (
    {
      application: AppNode,
      server: ServerNode,
      module: ModuleNode,
      custom: CustomNode,
    }
  ), []);
  
  const [nodesState, setNodes, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);

  const edgeTypes = {
    custom: CustomEdge,
  };

  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);
  
  // if (!nodes || nodes.length === 0) {
  //   return (
  //     <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
  //       <p className="text-slate-400 text-lg">Please select application or module to analyze impact</p>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        // onNodeMouseEnter={(event , node) => console.log("Mouse Enter" , event , node ) } It work when I hover on node.
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        attributionPosition="bottom-right"
        defaultViewport={{zoom: 3 }}
        edgeTypes={edgeTypes}
   
      >
        <Background color="#cbd5e1" gap={16} size={1}/>
        <DownloadButton />
        <Resetbutton initialNodes={nodes} initialEdges={edges} />
        <Controls className="bg-white border-slate-200 fill-slate-500 text-slate-500" />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;