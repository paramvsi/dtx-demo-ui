import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

export interface BarRow {
  label: string;
  value: number;
  /** Optional per-row color override (CSS var literal). Falls back to --color-primary. */
  colorVar?: string | undefined;
}

interface BarChartVizProps {
  data: BarRow[];
  height?: number;
  /** 'horizontal' = bars laid out horizontally (categories on Y axis). Default 'vertical' (categories on X) */
  layout?: 'vertical' | 'horizontal';
  /** Format the bar value (e.g. for currency / abbreviations) */
  format?: (n: number) => string;
  /** Override the default brand gradient with a single color (CSS var literal). Optional. */
  defaultColor?: string;
}

export function BarChartViz({
  data,
  height = 260,
  layout = 'vertical',
  format,
  defaultColor,
}: BarChartVizProps) {
  const isHorizontal = layout === 'horizontal';
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isHorizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 8, right: 12, bottom: 4, left: isHorizontal ? 16 : 0 }}
        >
          <defs>
            {/* Default bar fill = the brand 3-stop gradient from --color-grad-from / via / to.
                Matches the AI banner gradient so all hero data viz speaks the same visual language.
                Caller can override via per-row colorVar (for semantic bars like identity-confidence)
                or the defaultColor prop (for single-color overrides). */}
            <linearGradient id="bar-gradient" x1={isHorizontal ? '0' : '0'} y1={isHorizontal ? '0' : '0'} x2={isHorizontal ? '1' : '0'} y2={isHorizontal ? '0' : '1'}>
              {defaultColor ? (
                <>
                  <stop offset="0%" stopColor={defaultColor} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={defaultColor} stopOpacity={0.55} />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="var(--color-grad-from)" stopOpacity={0.95} />
                  <stop offset="50%" stopColor="var(--color-grad-via)" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="var(--color-grad-to)" stopOpacity={0.7} />
                </>
              )}
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" {...(isHorizontal ? { horizontal: false } : { vertical: false })} />
          {isHorizontal ? (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'var(--color-text-subtle)' }}
                tickLine={false}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickFormatter={(n: number) => abbreviate(n)}
              />
              <YAxis
                dataKey="label"
                type="category"
                tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                tickLine={false}
                axisLine={false}
                width={88}
              />
            </>
          ) : (
            <>
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
                width={48}
                tickFormatter={(n: number) => abbreviate(n)}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--color-text)',
              boxShadow: '0 8px 24px -8px color-mix(in srgb, var(--color-primary) 18%, transparent)',
            }}
            cursor={{ fill: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }}
            labelStyle={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase' }}
            formatter={(v) => [format ? format(Number(v)) : Number(v).toLocaleString(), '']}
          />
          <Bar
            dataKey="value"
            fill="url(#bar-gradient)"
            radius={isHorizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
            isAnimationActive
            animationDuration={700}
          >
            {data.map((row, i) => (
              <Cell
                key={i}
                fill={row.colorVar ? row.colorVar : 'url(#bar-gradient)'}
              />
            ))}
          </Bar>
        </BarChart>
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
