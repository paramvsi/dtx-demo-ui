import type { LineageGraph, LineageNode } from '@/lib/types';
import { getOperator } from '@/lib/mock/operators';

const COLUMN_FLOWS = [
  { upstream: 'msisdn', current: 'msisdn_hashed', downstream: 'dtx_id' },
  { upstream: 'event_ts', current: 'event_ts', downstream: 'event_ts' },
  { upstream: 'duration_s', current: 'duration_s', downstream: 'duration_s' },
  { upstream: 'cell_site_id', current: 'cell_site_id', downstream: 'emirate' },
  { upstream: 'charge_aed', current: 'charge_aed', downstream: 'charge_aed' },
  { upstream: 'emirates_id', current: 'emirates_id_hash', downstream: 'customer_segment' },
];

/**
 * Build a small lineage graph for a node in a pipeline.
 * Walks the pipeline edges to find upstream and downstream operators.
 */
export function buildLineage(
  pipelineNodes: Array<{ id: string; operatorId: string }>,
  edges: Array<{ source: string; target: string }>,
  selectedNodeId: string,
): LineageGraph {
  const nodeMap = new Map(pipelineNodes.map((n) => [n.id, n]));

  const upstreamIds = edges.filter((e) => e.target === selectedNodeId).map((e) => e.source);
  const downstreamIds = edges.filter((e) => e.source === selectedNodeId).map((e) => e.target);

  const toLineageNode = (id: string): LineageNode | null => {
    const n = nodeMap.get(id);
    if (!n) return null;
    const op = getOperator(n.operatorId);
    return {
      id: n.id,
      name: op?.name ?? n.operatorId,
      operatorId: n.operatorId,
    };
  };

  const upstream = upstreamIds.map(toLineageNode).filter((n): n is LineageNode => n !== null);
  const downstream = downstreamIds.map(toLineageNode).filter((n): n is LineageNode => n !== null);
  const current = toLineageNode(selectedNodeId) ?? {
    id: selectedNodeId,
    name: 'unknown',
    operatorId: '?',
  };

  // Pick column flows that match the operator category
  const op = getOperator(current.operatorId);
  const columns =
    op?.category === 'identity'
      ? COLUMN_FLOWS.slice(0, 4)
      : op?.category === 'privacy'
        ? COLUMN_FLOWS.slice(0, 3)
        : COLUMN_FLOWS.slice(1, 4);

  return { upstream, current, downstream, columns };
}
