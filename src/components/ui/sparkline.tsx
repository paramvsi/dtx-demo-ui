import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  height?: number;
  width?: number | string;
}

/**
 * Tiny inline sparkline. Stroke and fill bound to var(--color-primary)
 * so theme switches re-paint without remounting.
 */
export function Sparkline({ data, height = 32, width = '100%' }: SparklineProps) {
  const series = data.map((value, i) => ({ i, value }));
  return (
    <div style={{ width, height }} className="pointer-events-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary)"
            strokeWidth={1.5}
            fill="url(#sparkline-fill)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
