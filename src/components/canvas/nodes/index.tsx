import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import { cn } from '@/lib/cn';
import type { NodeData } from '@/stores/usePipelineStore';
import type { OperatorCategory } from '@/lib/types';

/**
 * One thin wrapper per category, registered in PipelineCanvas's `nodeTypes`.
 * RoutingNode adds dual source handles (success / dlq); IdentityNode is wider.
 */

type CanvasNodeProps = NodeProps & { data: NodeData };

const HANDLE_BASE =
  '!w-3 !h-3 !rounded-full !border-2 !border-surface !shadow-sm transition-colors';

const SourceNode = memo(({ id, data, selected }: CanvasNodeProps) => (
  <BaseNode id={id} data={data} selected={selected ?? false} category="source" />
));
SourceNode.displayName = 'SourceNode';

const TransformNode = memo(({ id, data, selected }: CanvasNodeProps) => (
  <BaseNode id={id} data={data} selected={selected ?? false} category="transform" />
));
TransformNode.displayName = 'TransformNode';

const DataQualityNode = memo(({ id, data, selected }: CanvasNodeProps) => (
  <BaseNode id={id} data={data} selected={selected ?? false} category="dq" />
));
DataQualityNode.displayName = 'DataQualityNode';

const PrivacyNode = memo(({ id, data, selected }: CanvasNodeProps) => (
  <BaseNode id={id} data={data} selected={selected ?? false} category="privacy" />
));
PrivacyNode.displayName = 'PrivacyNode';

const IdentityNode = memo(({ id, data, selected }: CanvasNodeProps) => (
  <BaseNode id={id} data={data} selected={selected ?? false} category="identity" wide />
));
IdentityNode.displayName = 'IdentityNode';

const SinkNode = memo(({ id, data, selected }: CanvasNodeProps) => (
  <BaseNode id={id} data={data} selected={selected ?? false} category="sink" />
));
SinkNode.displayName = 'SinkNode';

/**
 * Routing node — dual source handles (success on top half, dlq on bottom half).
 * Hides BaseNode's default source handle and renders its own pair.
 */
const RoutingNode = memo(({ id, data, selected }: CanvasNodeProps) => (
  <div className="relative">
    <BaseNode id={id} data={data} selected={selected ?? false} category="routing" hideDefaultSourceHandle />
    <Handle
      type="source"
      position={Position.Right}
      id="success"
      className={cn(HANDLE_BASE, '!bg-success !border-surface hover:!bg-success/80', '!-right-[7px]')}
      style={{ top: '34px' }}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="dlq"
      className={cn(HANDLE_BASE, '!bg-warning !border-surface hover:!bg-warning/80', '!-right-[7px]')}
      style={{ top: '62px' }}
    />
  </div>
));
RoutingNode.displayName = 'RoutingNode';

export const NODE_TYPES: Record<OperatorCategory, React.ComponentType<CanvasNodeProps>> = {
  source: SourceNode,
  transform: TransformNode,
  dq: DataQualityNode,
  privacy: PrivacyNode,
  identity: IdentityNode,
  routing: RoutingNode,
  sink: SinkNode,
};
