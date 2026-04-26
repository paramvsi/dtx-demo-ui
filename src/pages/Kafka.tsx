import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Zap } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/ui/data-table';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Sparkline } from '@/components/ui/sparkline';
import { useKafkaTopics } from '@/lib/queries';
import type { KafkaTopic } from '@/lib/types';
import { cn } from '@/lib/cn';

export default function Kafka() {
  const { data, isLoading } = useKafkaTopics();
  const [selected, setSelected] = useState<KafkaTopic | null>(null);

  const columns = useMemo<ColumnDef<KafkaTopic>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Topic',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-text-subtle" strokeWidth={1.75} />
            <span className="font-mono text-xs text-text">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'partitions',
        header: 'Partitions',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] tabular-nums text-text-muted">
            {row.original.partitions} × {row.original.replication}
          </span>
        ),
      },
      {
        accessorKey: 'throughput',
        header: 'Throughput',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] tabular-nums text-text">
            {row.original.throughput.toLocaleString()}
            <span className="ml-1 text-text-subtle">rec/s</span>
          </span>
        ),
      },
      {
        accessorKey: 'lagMs',
        header: 'Lag',
        cell: ({ row }) => {
          const lag = row.original.lagMs;
          const variant =
            lag < 20 ? 'text-success-fg' : lag < 50 ? 'text-warning-fg' : 'text-danger-fg';
          return (
            <span className={cn('font-mono text-[11px] tabular-nums', variant)}>
              {lag}ms
            </span>
          );
        },
      },
      {
        accessorKey: 'retentionDays',
        header: 'Retention',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-muted">{row.original.retentionDays}d</span>
        ),
      },
      {
        accessorKey: 'consumerGroups',
        header: 'Consumers',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-subtle">
            {row.original.consumerGroups.length}
          </span>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Kafka"
        subtitle={`${data?.length ?? 0} topics across the streaming layer · cluster: kafka-broker-{01-12}.dxb.emiratesnet.ae`}
      />
      {isLoading ? (
        <div className="rounded-lg border border-border bg-surface h-64 animate-pulse" />
      ) : data && (
        <DataTable columns={columns} data={data} onRowClick={setSelected} />
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent width="w-[520px]">
          {selected && <KafkaDetail topic={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function KafkaDetail({ topic }: { topic: KafkaTopic }) {
  const maxLag = Math.max(...topic.partitionLags, 1);
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Topic</div>
      <div className="mt-1 font-mono text-base font-semibold text-text">{topic.name}</div>
      <div className="mt-1 font-mono text-[11px] text-text-muted">
        {topic.partitions} partitions · RF {topic.replication} · {topic.retentionDays}d retention
      </div>

      <div className="my-4 border-t border-border" />

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Throughput" value={`${topic.throughput.toLocaleString()}`} unit="rec/s" />
        <Stat label="Avg lag" value={`${topic.lagMs}`} unit="ms" />
        <Stat label="Consumers" value={`${topic.consumerGroups.length}`} unit="groups" />
      </div>

      <div className="my-4 border-t border-border" />

      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          Partition lag
        </div>
        <div className="grid grid-cols-12 gap-1 rounded-md border border-border bg-surface p-3">
          {topic.partitionLags.map((lag, i) => {
            const pct = (lag / maxLag) * 100;
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-end h-12"
                title={`Partition ${i} · ${lag}ms`}
              >
                <div
                  className={cn(
                    'w-full rounded-t-sm',
                    lag === 0 ? 'bg-surface-2' : lag < 5 ? 'bg-success' : 'bg-warning',
                  )}
                  style={{ height: `${Math.max(8, pct)}%` }}
                />
                <span className="mt-0.5 font-mono text-[8px] text-text-subtle">{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="my-4 border-t border-border" />

      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          Consumer groups
        </div>
        <div className="space-y-1.5">
          {topic.consumerGroups.map((g) => (
            <div key={g} className="rounded-md border border-border bg-surface p-2 font-mono text-[11px] text-text">
              {g}
            </div>
          ))}
        </div>
      </div>

      <div className="my-4 border-t border-border" />

      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          Throughput · last 24h
        </div>
        <Sparkline data={generateSparkline(topic.throughput)} height={48} />
      </div>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-2.5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">{label}</div>
      <div className="mt-0.5 font-mono text-base font-semibold tabular-nums">{value}</div>
      <div className="font-mono text-[10px] text-text-subtle">{unit}</div>
    </div>
  );
}

function generateSparkline(base: number): number[] {
  return Array.from({ length: 24 }, (_, i) =>
    Math.max(0, Math.round(base + Math.sin(i * 0.6) * base * 0.15 + Math.cos(i * 0.3) * base * 0.08)),
  );
}
