import { Panel, useReactFlow } from '@xyflow/react';
import { RefreshCw } from 'lucide-react';
import { useCallback } from 'react';

const ResetButton = ({ initialNodes, initialEdges }) => {
  const { fitView, setNodes, setEdges } = useReactFlow();

  const handleReset = useCallback(() => {
    // console.log('Resetting graph to initial state');
    // 1. Reset node positions
    setNodes(initialNodes);

    // 2. Reset edges (optional)
    if (initialEdges) {
      setEdges(initialEdges);
    }
    fitView({ duration: 800 , padding: 0.5 });
  }, [fitView, setNodes, setEdges, initialNodes, initialEdges]);

  return (
    <Panel position="bottom-center">
      <button title='Reset' className='mb-20 lg:mb-10 hover:scale-105 transition' onClick={handleReset}>
        <RefreshCw color='#009dff' />
      </button>
    </Panel>
  );
};

export default ResetButton;