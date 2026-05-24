import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap, BackgroundVariant } from 'reactflow';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { APINode } from './nodes/apiNode';
import { MergeNode } from './nodes/mergeNode';
import { NoteNode } from './nodes/noteNode';
import { TransformNode } from './nodes/transformNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode, llm: LLMNode, customOutput: OutputNode, text: TextNode,
  conditional: ConditionalNode, api: APINode, merge: MergeNode, note: NoteNode, transform: TransformNode,
};

const selector = (state) => ({
  nodes: state.nodes, edges: state.edges,
  getNodeID: state.getNodeID, addNode: state.addNode,
  onNodesChange: state.onNodesChange, onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect, undo: state.undo, redo: state.redo,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect, undo, redo } = useStore(useShallow(selector));

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    if (event?.dataTransfer?.getData('application/reactflow')) {
      const { nodeType: type } = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      if (!type) return;
      const position = reactFlowInstance.project({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    }
  }, [reactFlowInstance, addNode, getNodeID]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const ctrl = navigator.platform.toUpperCase().includes('MAC') ? e.metaKey : e.ctrlKey;
      if (!ctrl) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key.toLowerCase() === 'z' && e.shiftKey)  { e.preventDefault(); redo(); }
      if (e.key.toLowerCase() === 'y')                 { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onConnect={onConnect} onDrop={onDrop} onDragOver={onDragOver}
        onInit={setReactFlowInstance} nodeTypes={nodeTypes}
        proOptions={proOptions} snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep' fitView
      >
        <Background color="#1e2535" gap={24} size={1} variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};