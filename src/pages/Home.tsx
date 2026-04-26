import { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Coins,
  Layers,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from '@/components/observability/MetricCard';
import { AIBanner } from '@/components/observability/AIBanner';
import { LineChartViz } from '@/components/observability/LineChartViz';
import { DonutChart } from '@/components/observability/DonutChart';
import { BarChartViz } from '@/components/observability/BarChartViz';
import { FilterBar, type Region, type Segment, type TimeRange } from '@/components/observability/FilterBar';
import { StatusPill } from '@/components/ui/status-pill';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import {
  CHANNEL_REACH,
  CONSENT_PURPOSES,
  CUSTOMER_SEGMENTS,
  IDENTITY_CONFIDENCE,
  REGION_CODES,
  REGION_SHARE,
  REVENUE_BY_EMIRATE,
  SUBSCRIBER_GROWTH,
  TOP_CAMPAIGNS,
  computeKPIs,
} from '@/lib/mock/customer360';

// How many trailing months of subscriber data to show for each range.
const RANGE_MONTHS: Record<TimeRange, number> = {
  '24h': 1,
  '7d': 1,
  '30d': 3,
  '90d': 4,
  YTD: SUBSCRIBER_GROWTH.length,
};

const SEGMENT_COLORS = [
  'var(--color-cat-source)',      // postpaid
  'var(--color-brand-accent-2)',  // prepaid
  'var(--color-cat-privacy)',     // enterprise
  'var(--color-cat-routing)',     // iot
  'var(--color-cat-dq)',          // m2m
];

export default function Home() {
  const [range, setRange] = useState<TimeRange>('30d');
  const [region, setRegion] = useState<Region>('all');
  const [segment, setSegment] = useState<Segment>('all');

  const kpis = useMemo(() => computeKPIs(region, segment), [region, segment]);

  // Combined region+segment scaling factor — used on bar charts and identity histogram
  // so absolute counts visibly drop when filters narrow the view.
  const scale = useMemo(() => {
    const regionFactor = REGION_SHARE[region];
    if (segment === 'all') return regionFactor;
    const seg = CUSTOMER_SEGMENTS.find((s) => s.id === segment);
    const total = CUSTOMER_SEGMENTS.reduce((sum, s) => sum + s.count, 0);
    return regionFactor * (seg ? seg.count / total : 1);
  }, [region, segment]);

  const subscriberSeries = useMemo(() => {
    const months = RANGE_MONTHS[range];
    const sliced = SUBSCRIBER_GROWTH.slice(-months);
    const factor = REGION_SHARE[region];
    return sliced.map((p) => {
      // When a segment is picked, zero the others so the line chart visibly collapses to one line.
      const keep = (id: 'postpaid' | 'prepaid' | 'enterprise' | 'iot') =>
        segment === 'all' || segment === id;
      return {
        label: p.month,
        postpaid:   keep('postpaid')   ? Math.round(p.postpaid   * factor) : 0,
        prepaid:    keep('prepaid')    ? Math.round(p.prepaid    * factor) : 0,
        enterprise: keep('enterprise') ? Math.round(p.enterprise * factor) : 0,
        iot:        keep('iot')        ? Math.round(p.iot        * factor) : 0,
      };
    });
  }, [range, region, segment]);

  const segmentDonut = useMemo(() => {
    const factor = REGION_SHARE[region];
    return CUSTOMER_SEGMENTS
      // When a segment is picked, only show that wedge.
      .filter((s) => segment === 'all' || s.id === segment)
      .map((s, i) => ({
        name: s.label,
        value: Math.round(s.count * factor),
        colorVar: SEGMENT_COLORS[CUSTOMER_SEGMENTS.findIndex((x) => x.id === s.id)] ?? SEGMENT_COLORS[i],
      }));
  }, [region, segment]);

  const revenueBars = useMemo(() => {
    const codes = REGION_CODES[region];
    const list = codes ? REVENUE_BY_EMIRATE.filter((r) => codes.includes(r.code)) : REVENUE_BY_EMIRATE;
    // Apply segment factor on top of the region slice.
    const segFactor = scale / REGION_SHARE[region];
    return list.map((r) => ({
      label: r.code,
      value: Math.round(r.revenue * segFactor),
    }));
  }, [region, scale]);

  const identityBars = useMemo(
    () => IDENTITY_CONFIDENCE.map((b, i) => ({
      label: b.label,
      value: Math.round(b.count * scale),
      colorVar: [
        'var(--color-success)',
        'var(--color-brand-accent-2)',
        'var(--color-info)',
        'var(--color-warning)',
        'var(--color-danger)',
      ][i],
    })),
    [scale],
  );

  const channelBars = useMemo(() => {
    // Channel reach is a percentage — region/segment shift it modestly,
    // not multiplicatively. Approximate by nudging based on the active segment.
    const segNudge: Record<typeof segment, number> = {
      all: 0, postpaid: 4, prepaid: -2, enterprise: 8, iot: -10,
    } as Record<Segment, number>;
    const nudge = segNudge[segment] ?? 0;
    return CHANNEL_REACH.map((c) => ({
      label: c.channel,
      value: Math.max(0, Math.min(100, c.reach + nudge)),
    }));
  }, [segment]);

  return (
    <div>
      <PageHeader
        title={
          <span>
            <span className="text-gradient-brand">Customer 360</span>
            <span className="text-text"> · EmiratesNet</span>
          </span>
        }
        subtitle={`Aggregated view across ${kpis.totalCustomers.toLocaleString()} customers · ${kpis.livePipelines} pipelines feeding the identity graph`}
      />

      <FilterBar
        range={range}
        region={region}
        segment={segment}
        onRangeChange={setRange}
        onRegionChange={setRegion}
        onSegmentChange={setSegment}
        onReset={() => {
          setRange('30d');
          setRegion('all');
          setSegment('all');
        }}
      />

      <AIBanner
        title="Customer signal copilot is active"
        description="Anomaly detection across the identity graph and consent ledger. Flags churn risk, unresolved DTX_IDs, and TRA-relevant consent drops the moment they appear."
        stats={[
          { value: `${kpis.identityResolved}%`, label: 'identity resolved' },
          { value: `${kpis.consentCompliance}%`, label: 'consent valid' },
        ]}
        cta={{ label: 'Open Copilot' }}
      />

      {/* KPI grid — 6 cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-6 mb-6">
        <MetricCard
          label="Total customers"
          value={kpis.totalCustomers}
          icon={Users}
          variant="neutral"
          subtitle="across all segments"
        />
        <MetricCard
          label="Active 30d"
          value={kpis.activeSubscribers}
          icon={CheckCircle2}
          variant="success"
          subtitle={`${Math.round((kpis.activeSubscribers / kpis.totalCustomers) * 100)}% of base`}
        />
        <MetricCard
          label="DTX_IDs resolved"
          value={kpis.identityResolved}
          icon={ShieldCheck}
          variant="neutral"
          format={(n) => `${n}%`}
          subtitle="match confidence ≥ 0.85"
        />
        <MetricCard
          label="Consent valid"
          value={kpis.consentCompliance}
          icon={ShieldCheck}
          variant="neutral"
          format={(n) => `${n}%`}
          subtitle="TRA-compliant"
        />
        <MetricCard
          label="Avg ARPU"
          value={kpis.avgArpu}
          icon={Coins}
          variant="neutral"
          format={(n) => `${n} AED`}
          subtitle="monthly, across base"
        />
        <MetricCard
          label="Pipelines live"
          value={kpis.livePipelines}
          icon={Layers}
          variant="neutral"
          subtitle="feeding 360 view"
        />
      </div>

      {/* Charts row 1 — subscriber growth + segments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-5">
          <ChartHeader
            title="Subscriber growth"
            subtitle={`${RANGE_MONTHS[range]}-month window · ${range}${region !== 'all' ? ` · ${region}` : ''}${segment !== 'all' ? ` · ${segment}` : ''}`}
            badge="Live"
          />
          <LineChartViz
            data={subscriberSeries}
            series={[
              { key: 'postpaid',   label: 'Postpaid',   colorVar: SEGMENT_COLORS[0]! },
              { key: 'prepaid',    label: 'Prepaid',    colorVar: SEGMENT_COLORS[1]! },
              { key: 'enterprise', label: 'Enterprise', colorVar: SEGMENT_COLORS[2]! },
              { key: 'iot',        label: 'IoT',        colorVar: SEGMENT_COLORS[3]! },
            ].filter((s) => segment === 'all' || s.key === segment)}
          />
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <ChartHeader title="Customer segments" subtitle="By active subscribers" />
          <DonutChart
            data={segmentDonut}
            centerValue={`${(kpis.totalCustomers / 1e6).toFixed(2)}M`}
            centerLabel="customers"
            height={220}
          />
          <ul className="mt-4 space-y-2">
            {CUSTOMER_SEGMENTS
              .filter((s) => segment === 'all' || s.id === segment)
              .map((s) => {
                const i = CUSTOMER_SEGMENTS.findIndex((x) => x.id === s.id);
                const scaled = Math.round(s.count * REGION_SHARE[region]);
                return (
                  <li key={s.id} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-text">
                      <span
                        className="h-2 w-2 rounded-sm"
                        style={{ backgroundColor: SEGMENT_COLORS[i] }}
                        aria-hidden="true"
                      />
                      {s.label}
                    </span>
                    <span className="font-mono tabular-nums text-text-muted">
                      {scaled.toLocaleString()}
                      <span className={cn('ml-2 font-semibold', s.growth > 0 ? 'text-success-fg' : 'text-danger-fg')}>
                        {s.growth > 0 ? '+' : ''}{s.growth.toFixed(1)}%
                      </span>
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      {/* Charts row 2 — revenue / identity / channel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-surface p-5">
          <ChartHeader title="Revenue · by emirate" subtitle="AED, monthly" />
          <BarChartViz
            data={revenueBars}
            height={240}
            format={(n) => `${(n / 1e6).toFixed(1)}M AED`}
          />
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <ChartHeader title="Identity confidence" subtitle={`Distribution across ${(kpis.totalCustomers / 1e6).toFixed(2)}M records`} />
          <BarChartViz
            data={identityBars}
            layout="horizontal"
            height={240}
          />
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <ChartHeader title="Channel reach" subtitle="% of customers reachable" />
          <BarChartViz
            data={channelBars}
            height={240}
            format={(n) => `${n.toFixed(1)}%`}
          />
        </div>
      </div>

      {/* Consent purposes — stacked-style row */}
      <div className="rounded-lg border border-border bg-surface p-5 mb-6">
        <ChartHeader
          title="Consent · by purpose"
          subtitle="TRA-registered purposes; granted / denied / pending across the customer base"
        />
        <div className="space-y-3">
          {CONSENT_PURPOSES.map((p) => {
            const total = p.granted + p.denied + p.pending;
            const grantedPct = (p.granted / total) * 100;
            const deniedPct = (p.denied / total) * 100;
            const pendingPct = (p.pending / total) * 100;
            return (
              <div key={p.purpose}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-text">{p.purpose}</span>
                  <span className="font-mono tabular-nums text-text-subtle">
                    {grantedPct.toFixed(1)}% granted · {deniedPct.toFixed(1)}% denied
                  </span>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div className="bg-success" style={{ width: `${grantedPct}%` }} title={`Granted: ${p.granted.toLocaleString()}`} />
                  <div className="bg-danger" style={{ width: `${deniedPct}%` }} title={`Denied: ${p.denied.toLocaleString()}`} />
                  <div className="bg-warning" style={{ width: `${pendingPct}%` }} title={`Pending: ${p.pending.toLocaleString()}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top campaigns table */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-sm font-semibold text-text">Top campaigns · this period</h2>
            <p className="mt-0.5 text-xs text-text-muted">
              Live and scheduled customer engagements driven by the 360 view.
            </p>
          </div>
          <Button variant="soft" size="sm">
            <Activity className="h-3 w-3" />
            View all
          </Button>
        </div>
        <table className="w-full text-xs">
          <thead className="border-b border-border bg-surface-2">
            <tr>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-text-muted">Campaign</th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-text-muted">Channel</th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-text-muted">Segment</th>
              <th className="px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-text-muted">Status</th>
              <th className="px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-wider text-text-muted">Reach</th>
              <th className="px-4 py-2.5 text-right font-mono text-[10px] uppercase tracking-wider text-text-muted">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {TOP_CAMPAIGNS.map((c, i) => (
              <tr
                key={c.id}
                className={cn('border-b border-border last:border-b-0 hover:bg-primary-soft', i % 2 === 0 ? '' : 'bg-surface-2/30')}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-text">{c.name}</div>
                  <div className="font-mono text-[10px] text-text-subtle">{c.id}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                    {c.channel}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">{c.segment}</td>
                <td className="px-4 py-3">
                  <StatusPill
                    status={c.status === 'live' ? 'running' : c.status === 'scheduled' ? 'idle' : 'success'}
                    label={c.status}
                    withIcon
                  />
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-text">
                  {c.reach.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {c.conversion > 0 ? (
                    <span className="font-mono tabular-nums font-semibold text-success-fg">
                      {c.conversion.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="font-mono text-text-subtle">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChartHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>}
      </div>
      {badge && (
        <div className="flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary ai-pulse" aria-hidden="true" />
          {badge}
        </div>
      )}
    </div>
  );
}
