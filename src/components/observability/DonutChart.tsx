import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface DonutSegment {
  name: string;
  value: number;
  /** CSS var literal (e.g. 'var(--color-brand-accent-2)') for theme-driven fill */
  colorVar?: string | undefined;
}

interface DonutChartProps {
  data: DonutSegment[];
  height?: number;
  centerValue?: string;
  centerLabel?: string;
  /** Default palette pulls from the categorical operator tokens — re-paints on theme switch. */
  defaultColors?: string[];
}

const DEFAULT_PALETTE = [
  'var(--color-cat-source)',
  'var(--color-brand-accent-2)',
  'var(--color-cat-dq)',
  'var(--color-cat-routing)',
  'var(--color-cat-privacy)',
  'var(--color-cat-identity)',
  'var(--color-cat-sink)',
];

export function DonutChart({
  data,
  height = 240,
  centerValue,
  centerLabel,
  defaultColors = DEFAULT_PALETTE,
}: DonutChartProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            dataKey="value"
            stroke="var(--color-surface)"
            strokeWidth={2}
            isAnimationActive
            animationDuration={600}
          >
            {data.map((segment, i) => (
              <Cell
                key={segment.name}
                fill={segment.colorVar ?? defaultColors[i % defaultColors.length] ?? 'var(--color-primary)'}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--color-text)',
              boxShadow: '0 8px 24px -8px color-mix(in srgb, var(--color-primary) 18%, transparent)',
            }}
            formatter={(v) => [Number(v).toLocaleString(), '']}
            labelStyle={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerValue || centerLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && (
            <div className="font-mono text-2xl font-bold tabular-nums leading-none text-text">
              {centerValue}
            </div>
          )}
          {centerLabel && (
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
              {centerLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
