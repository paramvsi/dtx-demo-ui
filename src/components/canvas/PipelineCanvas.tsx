import { useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  type EdgeTypes,
  type NodeTypes,
} from '@xyflow/react';
import { useShallow } from 'zustand/react/shallow';
import { NODE_TYPES } from '@/components/canvas/nodes';
import { AnimatedEdge } from '@/components/canvas/edges/AnimatedEdge';
import { usePipelineStore } from '@/stores/usePipelineStore';

const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

const nodeTypes = NODE_TYPES as unknown as NodeTypes;

function CanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    selectEdge,
    addNodeFromOperator,
  } = usePipelineStore(
    useShallow((s) => ({
      nodes: s.nodes,
      edges: s.edges,
      onNodesChange: s.onNodesChange,
      onEdgesChange: s.onEdgesChange,
      onConnect: s.onConnect,
      selectNode: s.selectNode,
      selectEdge: s.selectEdge,
      addNodeFromOperator: s.addNodeFromOperator,
    })),
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData('application/reactflow');
      if (!raw) return;
      try {
        const { operatorId } = JSON.parse(raw) as { operatorId: string };
        const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        addNodeFromOperator(operatorId, position);
      } catch {
        // ignored — bad payload
      }
    },
    [screenToFlowPosition, addNodeFromOperator],
  );

  // Subtle highlight when an edge or node is selected — driven by xyflow events
  const memoNodeTypes = useMemo(() => nodeTypes, []);
  const memoEdgeTypes = useMemo(() => edgeTypes, []);

  return (
    <div ref={reactFlowWrapper} className="relative h-full w-full canvas-grid">
      {/* Theme-tinted ambient overlay — sits above the dot grid, below the flow */}
      <div className="canvas-tint" aria-hidden="true" />
      <div className="canvas-vignette" aria-hidden="true" />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={(_, n) => selectNode(n.id)}
        onEdgeClick={(_, ed) => selectEdge(ed.id)}
        onPaneClick={() => {
          selectNode(null);
          selectEdge(null);
        }}
        nodeTypes={memoNodeTypes}
        edgeTypes={memoEdgeTypes}
        defaultEdgeOptions={{ type: 'animated' }}
        fitView
        fitViewOptions={{ padding: 0.25, maxZoom: 1.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={0.7}
          color="var(--color-border)"
        />
        <MiniMap
          pannable
          zoomable
          nodeStrokeWidth={2}
          nodeBorderRadius={6}
          nodeColor={() => 'var(--color-primary)'}
          maskColor="color-mix(in srgb, var(--color-canvas) 80%, transparent)"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            boxShadow: '0 8px 24px -12px color-mix(in srgb, var(--color-primary) 22%, transparent)',
          }}
        />
        <Controls
          position="bottom-right"
          showInteractive={false}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            color: 'var(--color-text)',
            boxShadow: '0 8px 24px -12px color-mix(in srgb, var(--color-primary) 22%, transparent)',
            overflow: 'hidden',
          }}
        />
      </ReactFlow>
    </div>
  );
}

/**
 * The Designer canvas. Wraps CanvasInner in ReactFlowProvider so
 * `screenToFlowPosition` (used by the drop handler) resolves correctly.
 */
export function PipelineCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
