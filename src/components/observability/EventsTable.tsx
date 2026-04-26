import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { StatusPill } from '@/components/ui/status-pill';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import type { PipelineEvent } from '@/lib/types';

interface EventsTableProps {
  events: PipelineEvent[];
  limit?: number;
  showPipeline?: boolean;
}

export function EventsTable({ events, limit, showPipeline = true }: EventsTableProps) {
  const [selected, setSelected] = useState<PipelineEvent | null>(null);
  const data = limit ? events.slice(0, limit) : events;

  const columns = useMemo<ColumnDef<PipelineEvent>[]>(() => {
    const base: ColumnDef<PipelineEvent>[] = [
      {
        accessorKey: 'timestamp',
        header: 'When',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-muted">{row.original.timestamp}</span>
        ),
      },
      {
        accessorKey: 'level',
        header: 'Level',
        cell: ({ row }) => <StatusPill status={row.original.level} withIcon />,
      },
    ];
    if (showPipeline) {
      base.push({
        accessorKey: 'pipelineName',
        header: 'Pipeline',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-text">{row.original.pipelineName}</span>
        ),
      });
    }
    base.push(
      {
        accessorKey: 'message',
        header: 'Message',
        cell: ({ row }) => (
          <span className="text-xs text-text-muted line-clamp-1">{row.original.message}</span>
        ),
      },
      {
        accessorKey: 'records',
        header: 'Records',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] tabular-nums text-text-muted">
            {row.original.records?.toLocaleString() ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'errored',
        header: 'Errored',
        cell: ({ row }) =>
          row.original.errored ? (
            <span className="font-mono text-[11px] tabular-nums text-danger-fg">
              {row.original.errored}
            </span>
          ) : (
            <span className="font-mono text-[11px] text-text-subtle">0</span>
          ),
      },
    );
    return base;
  }, [showPipeline]);

  return (
    <>
      <DataTable columns={columns} data={data} onRowClick={setSelected} />
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent>
          {selected && <EventDetail event={selected} />}
        </SheetContent>
      </Sheet>
    </>
  );
}

function EventDetail({ event }: { event: PipelineEvent }) {
  return (
    <div className="space-y-5 p-1">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          Event · {event.id}
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <StatusPill status={event.level} withIcon size="md" />
          <span className="font-mono text-xs text-text-muted">{event.timestamp}</span>
        </div>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Pipeline</div>
        <div className="mt-1.5 font-mono text-sm text-text">{event.pipelineName}</div>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Message</div>
        <div className="mt-1.5 text-sm text-text">{event.message}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md border border-border bg-surface p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Records</div>
          <div className="mt-1 text-lg font-semibold tabular-nums">
            {event.records?.toLocaleString() ?? '—'}
          </div>
        </div>
        <div className="rounded-md border border-border bg-surface p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Errored</div>
          <div className={`mt-1 text-lg font-semibold tabular-nums ${event.errored ? 'text-danger-fg' : 'text-text-muted'}`}>
            {event.errored ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
}
