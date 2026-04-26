import { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
import { X } from 'lucide-react';
import { usePipelineStore } from '@/stores/usePipelineStore';

/**
 * n8n-inspired edge.
 *
 * - Smooth cubic bezier (gentler curvature than smoothstep).
 * - 2.5px stroke; default `border-strong`, active/selected `primary`,
 *   flowing animated dashes during dry-run.
 * - Visible endpoint circles at both source and target — the "circuit terminal" look.
 * - Hovering the edge surfaces a midpoint delete button.
 *
 * Stroke colors come straight from CSS vars so the edge re-paints when the
 * theme switches without remounting.
 */

type EdgeState = 'flowing' | 'active' | 'paused';

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps & { data?: { state?: EdgeState } }) {
  const removeEdge = usePipelineStore((s) => s.removeEdge);
  const [hover, setHover] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: 0.35,
  });

  const state: EdgeState = data?.state ?? 'paused';

  const stroke =
    state === 'paused'
      ? 'var(--color-border-strong)'
      : 'var(--color-primary)';

  const isFlowing = state === 'flowing';
  const isHighlighted = selected || hover;

  const strokeWidth = isHighlighted ? 3 : state === 'active' ? 2.5 : 2;
  const strokeDasharray = isFlowing ? '6 5' : 'none';

  return (
    <>
      {/* Wide invisible hit-area for easier hover/click */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={18}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ pointerEvents: 'stroke' }}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke,
          strokeWidth,
          strokeDasharray,
          strokeLinecap: 'round',
          ...(isFlowing
            ? { animation: 'dash-flow 1s linear infinite' }
            : {}),
          transition: 'stroke 180ms ease, stroke-width 180ms ease',
          pointerEvents: 'none',
        }}
      />

      {/* Endpoint circles — "circuit terminals" */}
      <circle
        cx={sourceX}
        cy={sourceY}
        r={4.5}
        fill="var(--color-surface)"
        stroke={stroke}
        strokeWidth={2}
        style={{ pointerEvents: 'none', transition: 'stroke 180ms ease' }}
      />
      <circle
        cx={targetX}
        cy={targetY}
        r={4.5}
        fill="var(--color-surface)"
        stroke={stroke}
        strokeWidth={2}
        style={{ pointerEvents: 'none', transition: 'stroke 180ms ease' }}
      />

      {/* Midpoint delete button on hover/select */}
      {isHighlighted && (
        <EdgeLabelRenderer>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeEdge(id);
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="absolute pointer-events-auto inline-flex h-5 w-5 items-center justify-center rounded-full border border-border-strong bg-surface text-text-muted shadow-md hover:border-danger hover:text-danger-fg hover:bg-danger-wash transition-colors"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
            aria-label="Delete edge"
          >
            <X className="h-2.5 w-2.5" strokeWidth={2.5} />
          </button>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
