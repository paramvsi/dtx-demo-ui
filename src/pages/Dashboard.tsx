import { useMemo } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Layers, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from '@/components/observability/MetricCard';
import { ThroughputChart } from '@/components/observability/ThroughputChart';
import { EventsTable } from '@/components/observability/EventsTable';
import { useEvents, usePipelines } from '@/lib/queries';

export default function Dashboard() {
  const { data: pipelines } = usePipelines();
  const { data: events } = useEvents();

  const counts = useMemo(() => {
    if (!pipelines) return { total: 0, running: 0, lagging: 0, failed: 0 };
    return {
      total: pipelines.length,
      running: pipelines.filter((p) => p.status === 'running').length,
      lagging: pipelines.filter((p) => p.status === 'lagging').length,
      failed: pipelines.filter((p) => p.status === 'failed').length,
    };
  }, [pipelines]);

  const totalThroughput = useMemo(() => {
    if (!pipelines) return 0;
    return pipelines.reduce((sum, p) => sum + p.throughput, 0);
  }, [pipelines]);

  // Aggregate the 24-point throughput series across all pipelines
  const aggregateSeries = useMemo(() => {
    if (!pipelines) return [];
    const points = 24;
    const summed = Array.from({ length: points }, (_, i) =>
      pipelines.reduce((sum, p) => sum + (p.throughputSeries[i] ?? 0), 0),
    );
    // Label points with hour offsets
    return summed.map((value, i) => ({
      label: `${24 - i}h`,
      value,
    }));
  }, [pipelines]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Glanceable overview · tenant: emiratesnet-prod · ${pipelines?.length ?? 0} pipelines`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <MetricCard
          label="Total pipelines"
          value={counts.total}
          icon={Layers}
          variant="neutral"
          subtitle="across all envs"
        />
        <MetricCard
          label="Running"
          value={counts.running}
          icon={CheckCircle2}
          variant="success"
          subtitle={`${totalThroughput.toLocaleString()} rec/s combined`}
        />
        <MetricCard
          label="Lagging"
          value={counts.lagging}
          icon={AlertTriangle}
          variant="warning"
          subtitle="exceeded 5s threshold"
        />
        <MetricCard
          label="Failed"
          value={counts.failed}
          icon={XCircle}
          variant="danger"
          subtitle="needs attention"
        />
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-text">Combined throughput · last 24h</h2>
            <p className="mt-0.5 text-xs text-text-muted">
              Records per second across every running pipeline.
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-muted">
            <Activity className="h-3 w-3" />
            live
          </div>
        </div>
        {aggregateSeries.length > 0 && <ThroughputChart data={aggregateSeries} />}
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border p-5">
          <h2 className="text-sm font-semibold text-text">Recent events</h2>
          <p className="mt-0.5 text-xs text-text-muted">
            Pipeline events from the last 6 hours. Click a row for full detail.
          </p>
        </div>
        {events && <EventsTable events={events} limit={12} />}
      </div>
    </div>
  );
}
