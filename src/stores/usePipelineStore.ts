import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { Edge, Node } from '@xyflow/react';
import { applyNodeChanges, applyEdgeChanges, addEdge, type NodeChange, type EdgeChange, type Connection } from '@xyflow/react';
import { nanoid } from 'nanoid';
import { OPERATORS, getOperator } from '@/lib/mock/operators';
import type { Operator, OperatorCategory } from '@/lib/types';

export interface NodeData extends Record<string, unknown> {
  operatorId: string;
  config: Record<string, string | number | boolean>;
  status: 'idle' | 'running' | 'success' | 'warning' | 'error';
  metrics?: { in: number; out: number; dlq?: number };
}

export type FlowNode = Node<NodeData, OperatorCategory>;
export type FlowEdge = Edge & { data?: { state?: 'flowing' | 'active' | 'paused' } };

export interface PipelineTab {
  id: string;
  name: string;
  state: 'draft' | 'staging' | 'prod';
  version: string;
  dirty: boolean;
}

interface HistoryEntry {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface PipelineState {
  // tabs
  tabs: PipelineTab[];
  activeTabId: string;

  // canvas state
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // run state
  dryRunActive: boolean;

  // history
  history: HistoryEntry[];
  historyIndex: number;

  // actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  addNodeFromOperator: (operatorId: string, position: { x: number; y: number }) => void;
  updateNodeConfig: (id: string, config: Record<string, string | number | boolean>) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;

  // tabs
  newTab: () => void;
  switchTab: (id: string) => void;
  closeTab: (id: string) => void;

  // history
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // run
  triggerDryRun: () => void;
  resetMetrics: () => void;
}

function defaultsFor(op: Operator): Record<string, string | number | boolean> {
  return op.fields.reduce<Record<string, string | number | boolean>>((acc, f) => {
    if (f.default !== undefined) acc[f.name] = f.default;
    return acc;
  }, {});
}

const initialNodes: FlowNode[] = [
  {
    id: 'n-src',
    type: 'source',
    position: { x: 80, y: 160 },
    data: { operatorId: 'SRC-01', config: defaultsFor(OPERATORS.find((o) => o.id === 'SRC-01')!), status: 'idle' },
  },
  {
    id: 'n-dq',
    type: 'dq',
    position: { x: 360, y: 160 },
    data: { operatorId: 'DQ-01', config: defaultsFor(OPERATORS.find((o) => o.id === 'DQ-01')!), status: 'idle' },
  },
  {
    id: 'n-id',
    type: 'identity',
    position: { x: 640, y: 144 },
    data: { operatorId: 'ID-01', config: defaultsFor(OPERATORS.find((o) => o.id === 'ID-01')!), status: 'idle' },
  },
  {
    id: 'n-snk',
    type: 'sink',
    position: { x: 960, y: 160 },
    data: { operatorId: 'SNK-01', config: defaultsFor(OPERATORS.find((o) => o.id === 'SNK-01')!), status: 'idle' },
  },
];

const initialEdges: FlowEdge[] = [
  { id: 'e1', source: 'n-src', target: 'n-dq', type: 'animated', data: { state: 'paused' } },
  { id: 'e2', source: 'n-dq', target: 'n-id', type: 'animated', data: { state: 'paused' } },
  { id: 'e3', source: 'n-id', target: 'n-snk', type: 'animated', data: { state: 'paused' } },
];

const initialTabs: PipelineTab[] = [
  { id: 'tab-1', name: 'Voice CDR · identity', state: 'staging', version: 'v1.2.0', dirty: false },
  { id: 'tab-2', name: 'CRM onboarding', state: 'draft', version: 'v0.4.0', dirty: true },
  { id: 'tab-3', name: 'Billing enrichment', state: 'prod', version: 'v2.1.3', dirty: false },
];

export const usePipelineStore = create<PipelineState>((set, get) => ({
  tabs: initialTabs,
  activeTabId: 'tab-1',
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  selectedEdgeId: null,
  dryRunActive: false,
  history: [{ nodes: initialNodes, edges: initialEdges }],
  historyIndex: 0,

  onNodesChange: (changes) => {
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as FlowNode[] }));
  },
  onEdgesChange: (changes) => {
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) as FlowEdge[] }));
  },
  onConnect: (connection) => {
    set((s) => ({
      edges: addEdge(
        { ...connection, type: 'animated', data: { state: 'paused' } } as FlowEdge,
        s.edges,
      ) as FlowEdge[],
    }));
    get().pushHistory();
  },

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  addNodeFromOperator: (operatorId, position) => {
    const op = getOperator(operatorId);
    if (!op) return;
    const node: FlowNode = {
      id: `n-${nanoid(6)}`,
      type: op.category,
      position,
      data: {
        operatorId,
        config: defaultsFor(op),
        status: 'idle',
      },
    };
    set((s) => ({ nodes: [...s.nodes, node], selectedNodeId: node.id }));
    get().pushHistory();
  },

  updateNodeConfig: (id, config) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, config: { ...n.data.config, ...config } } } : n,
      ),
    }));
  },

  removeNode: (id) => {
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: null,
    }));
    get().pushHistory();
  },

  removeEdge: (id) => {
    set((s) => ({ edges: s.edges.filter((e) => e.id !== id), selectedEdgeId: null }));
    get().pushHistory();
  },

  newTab: () => {
    const id = `tab-${nanoid(4)}`;
    set((s) => ({
      tabs: [...s.tabs, { id, name: 'Untitled pipeline', state: 'draft', version: 'v0.1.0', dirty: true }],
      activeTabId: id,
    }));
  },

  switchTab: (id) => set({ activeTabId: id }),

  closeTab: (id) => {
    set((s) => {
      const remaining = s.tabs.filter((t) => t.id !== id);
      const next: Partial<PipelineState> = { tabs: remaining };
      if (s.activeTabId === id) next.activeTabId = remaining[0]?.id ?? '';
      return next;
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    if (!prev) return;
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      historyIndex: historyIndex - 1,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    if (!next) return;
    set({
      nodes: next.nodes,
      edges: next.edges,
      historyIndex: historyIndex + 1,
    });
  },

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const trimmed = history.slice(0, historyIndex + 1);
    const newHistory = [...trimmed, { nodes: [...nodes], edges: [...edges] }].slice(-30);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  triggerDryRun: () => {
    const { edges, nodes } = get();
    set({
      dryRunActive: true,
      edges: edges.map((e) => ({ ...e, data: { ...e.data, state: 'flowing' as const } })),
      nodes: nodes.map((n) => ({ ...n, data: { ...n.data, status: 'running' as const } })),
    });
    setTimeout(() => {
      const updatedNodes = get().nodes.map((n) => {
        const records = 1000 + Math.floor(Math.random() * 500);
        const errored = Math.floor(Math.random() * 8);
        return {
          ...n,
          data: {
            ...n.data,
            status: errored > 5 ? ('warning' as const) : ('success' as const),
            metrics: {
              in: records,
              out: records - errored,
              dlq: errored,
            },
          },
        };
      });
      set({
        dryRunActive: false,
        nodes: updatedNodes,
        edges: get().edges.map((e) => ({ ...e, data: { ...e.data, state: 'active' as const } })),
      });
    }, 2000);
  },

  resetMetrics: () => {
    set((s) => ({
      nodes: s.nodes.map((n) => {
        const { metrics: _omit, ...rest } = n.data;
        void _omit;
        return { ...n, data: { ...rest, status: 'idle' as const } };
      }),
      edges: s.edges.map((e) => ({ ...e, data: { ...e.data, state: 'paused' as const } })),
    }));
  },
}));

// Convenience selectors using useShallow to prevent unrelated re-renders
export function useSelectedNode(): FlowNode | null {
  return usePipelineStore(
    useShallow((s) => (s.selectedNodeId ? s.nodes.find((n) => n.id === s.selectedNodeId) ?? null : null)),
  );
}

export function useActiveTab(): PipelineTab | undefined {
  return usePipelineStore(
    useShallow((s) => s.tabs.find((t) => t.id === s.activeTabId)),
  );
}
