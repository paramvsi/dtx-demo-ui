import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react';
import { getOperator } from '@/lib/mock/operators';
import { OperatorIcon } from '@/components/canvas/OperatorIcon';
import { cn } from '@/lib/cn';
import { SPRING, T } from '@/lib/motion';
import { usePipelineStore, type NodeData } from '@/stores/usePipelineStore';
import type { OperatorCategory } from '@/lib/types';

interface BaseNodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
  category: OperatorCategory;
  /** ID-01 (Identity resolver) is wider — keep the square but enlarge slightly */
  wide?: boolean;
  /** Routing node provides its own handles via children */
  hideDefaultSourceHandle?: boolean;
}

const CATEGORY_ACCENT_BG: Record<OperatorCategory, string> = {
  source:    'bg-cat-source/10',
  transform: 'bg-cat-transform/10',
  dq:        'bg-cat-dq/10',
  privacy:   'bg-cat-privacy/10',
  identity:  'bg-cat-identity/10',
  routing:   'bg-cat-routing/10',
  sink:      'bg-cat-sink/10',
};

const CATEGORY_ACCENT_BORDER: Record<OperatorCategory, string> = {
  source:    'group-hover:border-cat-source/40',
  transform: 'group-hover:border-cat-transform/40',
  dq:        'group-hover:border-cat-dq/40',
  privacy:   'group-hover:border-cat-privacy/40',
  identity:  'group-hover:border-cat-identity/40',
  routing:   'group-hover:border-cat-routing/40',
  sink:      'group-hover:border-cat-sink/40',
};

const STATUS_DOT: Record<NodeData['status'], string> = {
  idle:    'bg-text-subtle',
  running: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-danger',
};

const STATUS_RING: Record<NodeData['status'], string> = {
  idle:    'shadow-none',
  running: 'shadow-[0_0_0_2px_var(--color-info)]',
  success: 'shadow-[0_0_0_2px_var(--color-success)]',
  warning: 'shadow-[0_0_0_2px_var(--color-warning)]',
  error:   'shadow-[0_0_0_2px_var(--color-danger)]',
};

const HANDLE_BASE =
  '!w-3 !h-3 !rounded-full !border-2 !border-surface !bg-text-subtle !shadow-sm transition-colors';
const HANDLE_HOVER = 'hover:!bg-primary hover:!border-primary';

export const BaseNode = memo(
  ({ id, data, selected, category, wide = false, hideDefaultSourceHandle = false }: BaseNodeProps) => {
    const [hovered, setHovered] = useState(false);
    const op = getOperator(data.operatorId);
    const removeNode = usePipelineStore((s) => s.removeNode);

    if (!op) return null;

    const StatusIcon =
      data.status === 'running' ? Loader2 :
      data.status === 'success' ? CheckCircle2 :
      data.status === 'warning' ? AlertTriangle :
      data.status === 'error'   ? AlertCircle :
      null;

    const subLabel = computeSubLabel(data);
    const sizeClass = wide ? 'w-[120px] h-24' : 'w-24 h-24';

    return (
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING.snappy}
        className="group relative flex flex-col items-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Input handle */}
        <Handle
          type="target"
          position={Position.Left}
          className={cn(HANDLE_BASE, HANDLE_HOVER, '!-left-[7px]')}
        />

        {/* Node card */}
        <div
          className={cn(
            'relative rounded-2xl border bg-surface flex items-center justify-center transition-shadow',
            sizeClass,
            CATEGORY_ACCENT_BG[category],
            selected
              ? 'border-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-primary)_25%,transparent),0_8px_24px_-8px_color-mix(in_srgb,var(--color-primary)_40%,transparent)]'
              : cn(
                  'border-border',
                  CATEGORY_ACCENT_BORDER[category],
                  data.status !== 'idle' ? STATUS_RING[data.status] : 'shadow-[0_2px_8px_-4px_color-mix(in_srgb,var(--color-text)_20%,transparent)]',
                ),
          )}
        >
          {/* Status dot top-right */}
          {data.status !== 'idle' && (
            <span
              className={cn(
                'absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full border-2 border-surface',
                STATUS_DOT[data.status],
              )}
              aria-label={`status ${data.status}`}
            >
              {StatusIcon && data.status === 'running' && (
                <Loader2 className="h-3 w-3 animate-spin text-info opacity-0" />
              )}
            </span>
          )}

          {/* Brand or generic icon */}
          <OperatorIcon operatorId={op.id} category={category} size={wide ? 56 : 48} />

          {/* Hover action cluster — top-right floating */}
          <AnimatePresence>
            {hovered && !selected && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: T.hover }}
                exit={{ opacity: 0, y: -4, scale: 0.92, transition: { duration: 0.12 } }}
                className="absolute -top-3 right-0 translate-x-[calc(100%-12px)] flex items-center gap-0.5 rounded-md border border-border bg-surface p-0.5 shadow-md z-10"
              >
                <NodeAction
                  icon={Pencil}
                  label="Edit"
                  onClick={() => usePipelineStore.getState().selectNode(id)}
                />
                <NodeAction icon={Copy} label="Duplicate" onClick={() => duplicateNode(id)} />
                <NodeAction
                  icon={Trash2}
                  label="Delete"
                  variant="danger"
                  onClick={() => removeNode(id)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metrics chip — appears post-dry-run */}
          {data.metrics && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full mt-1 flex items-center gap-1 rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[9px] tabular-nums shadow-sm whitespace-nowrap z-10">
              <span className="text-text-muted">{data.metrics.in.toLocaleString()}</span>
              <span className="text-text-subtle">→</span>
              <span className="text-success-fg">{data.metrics.out.toLocaleString()}</span>
              {data.metrics.dlq !== undefined && data.metrics.dlq > 0 && (
                <span className="text-warning-fg">⚠{data.metrics.dlq}</span>
              )}
            </div>
          )}
        </div>

        {/* Label below the node */}
        <div className="mt-2 flex flex-col items-center text-center max-w-[140px]">
          <div className={cn(
            'text-[12px] font-medium leading-tight',
            selected ? 'text-text' : 'text-text',
          )}>
            {op.name}
          </div>
          <div className="font-mono text-[10px] leading-tight text-text-subtle truncate max-w-[140px]">
            {subLabel}
          </div>
        </div>

        {/* Output handle */}
        {!hideDefaultSourceHandle && (
          <Handle
            type="source"
            position={Position.Right}
            className={cn(HANDLE_BASE, HANDLE_HOVER, '!-right-[7px]')}
            // Keep handle vertically centered on the *square*, not the whole node+label group.
            style={{ top: '48px' }}
          />
        )}
      </motion.div>
    );
  },
  (prev, next) =>
    prev.id === next.id &&
    prev.selected === next.selected &&
    prev.data === next.data &&
    prev.category === next.category &&
    prev.wide === next.wide &&
    prev.hideDefaultSourceHandle === next.hideDefaultSourceHandle,
);
BaseNode.displayName = 'BaseNode';

function NodeAction({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        'inline-flex h-6 w-6 items-center justify-center rounded transition-colors',
        variant === 'danger'
          ? 'text-text-muted hover:bg-danger-wash hover:text-danger-fg'
          : 'text-text-muted hover:bg-surface-2 hover:text-text',
      )}
      title={label}
      aria-label={label}
    >
      <Icon className="h-3 w-3" strokeWidth={2} />
    </button>
  );
}

function duplicateNode(sourceId: string) {
  const { nodes, addNodeFromOperator } = usePipelineStore.getState();
  const source = nodes.find((n) => n.id === sourceId);
  if (!source) return;
  addNodeFromOperator(source.data.operatorId, {
    x: source.position.x + 60,
    y: source.position.y + 60,
  });
}

function computeSubLabel(data: NodeData): string {
  if (data.config['topic']) return String(data.config['topic']);
  if (data.config['schema_ref']) return String(data.config['schema_ref']);
  if (data.config['connection']) return String(data.config['connection']);
  if (data.config['identifier_field']) return String(data.config['identifier_field']);
  if (data.config['condition']) return String(data.config['condition']);
  return data.operatorId.toLowerCase();
}
