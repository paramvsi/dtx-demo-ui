import { Circle, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import type { ComponentType } from 'react';
import { cn } from '@/lib/cn';

export type StatusKind =
  | 'running'
  | 'lagging'
  | 'failed'
  | 'idle'
  | 'draft'
  | 'staging'
  | 'prod'
  | 'active'
  | 'invited'
  | 'suspended'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

interface PillVariant {
  wash: string;
  fg: string;
  dot: string;
  Icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}

const VARIANTS: Record<StatusKind, PillVariant> = {
  running: { wash: 'bg-success-wash', fg: 'text-success-fg', dot: 'bg-success', Icon: CheckCircle2, label: 'Running' },
  lagging: { wash: 'bg-warning-wash', fg: 'text-warning-fg', dot: 'bg-warning', Icon: AlertTriangle, label: 'Lagging' },
  failed: { wash: 'bg-danger-wash', fg: 'text-danger-fg', dot: 'bg-danger', Icon: XCircle, label: 'Failed' },
  idle: { wash: 'bg-surface-2', fg: 'text-text-muted', dot: 'bg-text-subtle', Icon: Circle, label: 'Idle' },

  draft: { wash: 'bg-surface-2', fg: 'text-text-muted', dot: 'bg-text-subtle', label: 'Draft' },
  staging: { wash: 'bg-warning-wash', fg: 'text-warning-fg', dot: 'bg-warning', label: 'Staging' },
  prod: { wash: 'bg-success-wash', fg: 'text-success-fg', dot: 'bg-success', label: 'Prod' },

  active: { wash: 'bg-success-wash', fg: 'text-success-fg', dot: 'bg-success', label: 'Active' },
  invited: { wash: 'bg-info-wash', fg: 'text-info-fg', dot: 'bg-info', Icon: Clock, label: 'Invited' },
  suspended: { wash: 'bg-danger-wash', fg: 'text-danger-fg', dot: 'bg-danger', label: 'Suspended' },

  success: { wash: 'bg-success-wash', fg: 'text-success-fg', dot: 'bg-success', label: 'Success' },
  warning: { wash: 'bg-warning-wash', fg: 'text-warning-fg', dot: 'bg-warning', label: 'Warning' },
  error: { wash: 'bg-danger-wash', fg: 'text-danger-fg', dot: 'bg-danger', label: 'Error' },
  info: { wash: 'bg-info-wash', fg: 'text-info-fg', dot: 'bg-info', label: 'Info' },
};

interface StatusPillProps {
  status: StatusKind;
  label?: string;
  size?: 'sm' | 'md';
  withIcon?: boolean;
  className?: string;
}

/**
 * Color-plus-shape status indicator. Color is never the only signal —
 * every variant either has an Icon component or a dot, and a text label.
 */
export function StatusPill({ status, label, size = 'sm', withIcon = false, className }: StatusPillProps) {
  const v = VARIANTS[status];
  const Icon = withIcon && v.Icon;
  const text = label ?? v.label;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        v.wash,
        v.fg,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        className,
      )}
    >
      {Icon ? (
        <Icon className="h-3 w-3" strokeWidth={2} />
      ) : (
        <span className={cn('h-1.5 w-1.5 rounded-full', v.dot)} aria-hidden="true" />
      )}
      <span>{text}</span>
    </span>
  );
}

/**
 * Categorical type pill — uses the cat-{category} token color as a left bar.
 * Used in the Pipelines list to indicate operator/pipeline type.
 */
export function CategoryPill({
  category,
  className,
}: {
  category: 'source' | 'transform' | 'dq' | 'privacy' | 'identity' | 'routing' | 'sink';
  className?: string;
}) {
  const labels: Record<typeof category, string> = {
    source: 'Source',
    transform: 'Transform',
    dq: 'DQ',
    privacy: 'Privacy',
    identity: 'Identity',
    routing: 'Routing',
    sink: 'Sink',
  };
  const colorClass = `bg-cat-${category}`;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted',
        className,
      )}
    >
      <span className={cn('h-2 w-2 rounded-sm', colorClass)} aria-hidden="true" />
      {labels[category]}
    </span>
  );
}
