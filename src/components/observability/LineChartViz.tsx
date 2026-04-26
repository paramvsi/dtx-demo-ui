import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

export interface LineSeries {
  key: string;
  label: string;
  /** CSS variable literal — re-paints on theme switch */
  colorVar: string;
}

interface LineChartVizProps {
  /** Array of points, each with `label` (x-axis) and one numeric field per series key */
  data: Array<{ label: string } & Record<string, string | number>>;
  series: LineSeries[];
  height?: number;
  showLegend?: boolean;
}

export function LineChartViz({ data, series, height = 280, showLegend = true }: LineChartVizProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: showLegend ? 4 : 4, left: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'var(--color-text-subtle)' }}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(n: number) => abbreviate(n)}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--color-text)',
              boxShadow: '0 8px 24px -8px color-mix(in srgb, var(--color-primary) 18%, transparent)',
            }}
            cursor={{ stroke: 'var(--color-border-strong)', strokeWidth: 1 }}
            labelStyle={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' }}
            formatter={(v) => [Number(v).toLocaleString(), '']}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '11px', color: 'var(--color-text-muted)', paddingTop: '6px' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.colorVar}
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 4, fill: s.colorVar, stroke: 'var(--color-surface)', strokeWidth: 2 }}
              animationDuration={700}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function abbreviate(n: number): string {
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}
