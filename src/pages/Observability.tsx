import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, XCircle, Layers } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from '@/components/observability/MetricCard';
import { EventsTable } from '@/components/observability/EventsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { StatusPill, CategoryPill } from '@/components/ui/status-pill';
import { Sparkline } from '@/components/ui/sparkline';
import { useEvents, usePipelines } from '@/lib/queries';
import type { Pipeline } from '@/lib/types';

export default function Observability() {
  const { data: pipelines } = usePipelines();
  const { data: events } = useEvents();
  const [tab, setTab] = useState('events');

  const counts = useMemo(() => {
    if (!events) return { total: 0, success: 0, warning: 0, error: 0 };
    return {
      total: events.length,
      success: events.filter((e) => e.level === 'success').length,
      warning: events.filter((e) => e.level === 'warning').length,
      error: events.filter((e) => e.level === 'error').length,
    };
  }, [events]);

  return (
    <div>
      <PageHeader
        title="Pipeline events"
        subtitle={`${events?.length ?? 0} events from the last 48 hours · ${pipelines?.length ?? 0} pipelines monitored`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <MetricCard label="Events (48h)" value={counts.total} icon={Layers} variant="neutral" subtitle="across all pipelines" />
        <MetricCard label="Successes" value={counts.success} icon={CheckCircle2} variant="success" />
        <MetricCard label="Warnings" value={counts.warning} icon={AlertTriangle} variant="warning" />
        <MetricCard label="Errors" value={counts.error} icon={XCircle} variant="danger" subtitle="needs attention" />
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="border-b border-border px-4">
            <TabsList>
              <TabsTrigger value="events">
                <Activity className="h-3 w-3" /> Events
              </TabsTrigger>
              <TabsTrigger value="per-pipeline">
                <Layers className="h-3 w-3" /> Per-pipeline
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="events">
            {events && <EventsTable events={events} />}
          </TabsContent>
          <TabsContent value="per-pipeline" className="p-0">
            {pipelines && <PerPipelineTable pipelines={pipelines} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PerPipelineTable({ pipelines }: { pipelines: Pipeline[] }) {
  const columns = useMemo<ColumnDef<Pipeline>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Pipeline',
        cell: ({ row }) => (
          <div>
            <div className="font-mono text-xs text-text">{row.original.name}</div>
            <div className="text-[11px] text-text-subtle">{row.original.owner}</div>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => <CategoryPill category={row.original.type} />,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusPill status={row.original.status} withIcon />,
      },
      {
        accessorKey: 'throughput',
        header: 'Throughput · last 24h',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-32 shrink-0">
              <Sparkline data={row.original.throughputSeries} height={28} />
            </div>
            <span className="font-mono text-[11px] tabular-nums text-text">
              {row.original.throughput.toLocaleString()}
              <span className="text-text-subtle"> rec/s</span>
            </span>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'lastRun',
        header: 'Last run',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-muted">{row.original.lastRun}</span>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  return <DataTable columns={columns} data={pipelines} />;
}
