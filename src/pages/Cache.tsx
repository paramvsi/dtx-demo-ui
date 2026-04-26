import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Layers } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/ui/data-table';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { useCacheKeys } from '@/lib/queries';
import type { CacheKey } from '@/lib/types';
import { cn } from '@/lib/cn';

function formatBytes(b: number): string {
  if (b > 1024 ** 3) return `${(b / 1024 ** 3).toFixed(1)} GB`;
  if (b > 1024 ** 2) return `${(b / 1024 ** 2).toFixed(0)} MB`;
  if (b > 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
}

function formatTtl(s: number): string {
  if (s >= 86400) return `${Math.round(s / 86400)}d`;
  if (s >= 3600) return `${Math.round(s / 3600)}h`;
  if (s >= 60) return `${Math.round(s / 60)}m`;
  return `${s}s`;
}

export default function Cache() {
  const { data, isLoading } = useCacheKeys();
  const [selected, setSelected] = useState<CacheKey | null>(null);

  const columns = useMemo<ColumnDef<CacheKey>[]>(
    () => [
      {
        accessorKey: 'pattern',
        header: 'Pattern',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-text-subtle" strokeWidth={1.75} />
            <span className="font-mono text-xs text-text">{row.original.pattern}</span>
          </div>
        ),
      },
      {
        accessorKey: 'hitRate',
        header: 'Hit rate',
        cell: ({ row }) => {
          const pct = row.original.hitRate * 100;
          const variant: 'primary' | 'warning' | 'danger' = pct > 90 ? 'primary' : pct > 75 ? 'primary' : pct > 60 ? 'warning' : 'danger';
          return (
            <div className="w-32">
              <div className="flex items-center justify-between font-mono text-[10px] tabular-nums text-text-muted mb-0.5">
                <span>{pct.toFixed(0)}%</span>
              </div>
              <Progress value={pct} variant={variant} />
            </div>
          );
        },
      },
      {
        accessorKey: 'ttlSeconds',
        header: 'TTL',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-muted">{formatTtl(row.original.ttlSeconds)}</span>
        ),
      },
      {
        accessorKey: 'sizeBytes',
        header: 'Size',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] tabular-nums text-text">
            {formatBytes(row.original.sizeBytes)}
          </span>
        ),
      },
      {
        accessorKey: 'hotKeys',
        header: 'Hot keys',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] tabular-nums text-text-muted">
            {row.original.hotKeys.toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'lastAccessed',
        header: 'Last access',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-muted">{row.original.lastAccessed}</span>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  return (
    <div>
      <PageHeader
        title="Cache"
        subtitle={`${data?.length ?? 0} Redis key patterns · backed by redis-cluster.emiratesnet.ae:6379`}
      />
      {isLoading ? (
        <div className="rounded-lg border border-border bg-surface h-64 animate-pulse" />
      ) : data && (
        <DataTable columns={columns} data={data} onRowClick={setSelected} />
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent>
          {selected && <CacheDetail cacheKey={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CacheDetail({ cacheKey: c }: { cacheKey: CacheKey }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Pattern</div>
      <div className="mt-1 font-mono text-base font-semibold text-text">{c.pattern}</div>
      <p className="mt-2 text-sm text-text-muted">{c.description}</p>

      <div className="my-4 border-t border-border" />

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-border bg-surface p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Hit rate</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{(c.hitRate * 100).toFixed(0)}%</div>
          <Progress value={c.hitRate * 100} variant={c.hitRate > 0.9 ? 'success' : c.hitRate > 0.7 ? 'primary' : 'warning'} className="mt-2" />
        </div>
        <div className="rounded-md border border-border bg-surface p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Size</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{formatBytes(c.sizeBytes)}</div>
          <div className="mt-2 font-mono text-[10px] text-text-subtle">{c.hotKeys.toLocaleString()} hot keys</div>
        </div>
      </div>

      <div className="my-4 border-t border-border" />

      <div className="space-y-2.5 text-sm">
        <Detail label="TTL" value={formatTtl(c.ttlSeconds)} />
        <Detail label="Last accessed" value={c.lastAccessed} />
        <Detail label="Pattern" value={c.pattern} mono />
      </div>
    </div>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">{label}</span>
      <span className={cn('text-text', mono && 'font-mono text-xs')}>{value}</span>
    </div>
  );
}
