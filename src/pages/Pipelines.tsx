import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Search, Workflow } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { StatusPill, CategoryPill } from '@/components/ui/status-pill';
import { EmptyState } from '@/components/ui/empty-state';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePipelines } from '@/lib/queries';
import { cn } from '@/lib/cn';
import type { Pipeline, PipelineStatus, OperatorCategory } from '@/lib/types';

const STATUS_FILTERS: PipelineStatus[] = ['running', 'lagging', 'failed', 'idle'];
const TYPE_FILTERS: OperatorCategory[] = ['identity', 'transform', 'sink', 'privacy'];

export default function Pipelines() {
  const navigate = useNavigate();
  const { data, isLoading } = usePipelines();
  const [statusFilter, setStatusFilter] = useState<Set<PipelineStatus>>(new Set());
  const [typeFilter, setTypeFilter] = useState<Set<OperatorCategory>>(new Set());
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => {
      if (statusFilter.size > 0 && !statusFilter.has(p.status)) return false;
      if (typeFilter.size > 0 && !typeFilter.has(p.type)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.owner.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, statusFilter, typeFilter, search]);

  const columns = useMemo<ColumnDef<Pipeline>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-mono text-xs text-text">{row.original.name}</span>
            <span className="text-[11px] text-text-subtle truncate max-w-md">
              {row.original.description}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => <CategoryPill category={row.original.type} />,
        enableSorting: false,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusPill status={row.original.status} withIcon />,
      },
      {
        accessorKey: 'env',
        header: 'Env',
        cell: ({ row }) => (
          <StatusPill
            status={row.original.env === 'prod' ? 'prod' : row.original.env === 'staging' ? 'staging' : 'draft'}
            label={row.original.env.toUpperCase()}
          />
        ),
      },
      {
        accessorKey: 'throughput',
        header: 'Throughput',
        cell: ({ row }) => (
          <div className="font-mono text-xs tabular-nums text-text">
            {row.original.throughput === 0 ? (
              <span className="text-text-subtle">—</span>
            ) : (
              <>
                {row.original.throughput.toLocaleString()}
                <span className="ml-1 text-text-subtle">rec/s</span>
              </>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'version',
        header: 'Version',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-muted">{row.original.version}</span>
        ),
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        cell: ({ row }) => (
          <span className="text-xs text-text-muted">{row.original.owner}</span>
        ),
      },
      {
        accessorKey: 'lastRun',
        header: 'Last run',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-muted">{row.original.lastRun}</span>
        ),
        enableSorting: false,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="iconSm" aria-label="Actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{row.original.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate(`/pipeline-designer?p=${row.original.id}`)}>
                  Open in Designer
                </DropdownMenuItem>
                <DropdownMenuItem>Pause</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-danger">Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [navigate],
  );

  const toggleSet = <T,>(set: Set<T>, item: T): Set<T> => {
    const next = new Set(set);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    return next;
  };

  return (
    <div>
      <PageHeader
        title="Pipelines"
        subtitle="Every active and draft pipeline across this deployment."
        actions={
          <Button onClick={() => navigate('/pipeline-designer')}>
            <Plus className="h-4 w-4" />
            New pipeline
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-subtle" strokeWidth={1.75} />
          <Input
            placeholder="Search by name or owner…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            mono
            className="w-72 pl-8"
          />
        </div>

        <FilterChipGroup
          label="Status"
          options={STATUS_FILTERS}
          active={statusFilter}
          onToggle={(v) => setStatusFilter((s) => toggleSet(s, v))}
          renderOption={(s) => <StatusPill status={s} size="sm" />}
        />

        <FilterChipGroup
          label="Type"
          options={TYPE_FILTERS}
          active={typeFilter}
          onToggle={(v) => setTypeFilter((s) => toggleSet(s, v))}
          renderOption={(t) => <CategoryPill category={t} />}
        />

        {(statusFilter.size > 0 || typeFilter.size > 0 || search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStatusFilter(new Set());
              setTypeFilter(new Set());
              setSearch('');
            }}
          >
            Clear filters
          </Button>
        )}

        <div className="ml-auto font-mono text-[11px] text-text-subtle">
          {isLoading ? '— loading —' : `${filtered.length} of ${data?.length ?? 0}`}
        </div>
      </div>

      {isLoading ? (
        <PipelinesSkeleton />
      ) : filtered.length === 0 && data && data.length > 0 ? (
        <EmptyState
          icon={Search}
          title="No pipelines match these filters"
          description="Try clearing one of the filters or adjusting your search."
        />
      ) : data?.length === 0 ? (
        <EmptyState
          icon={Workflow}
          title="No pipelines yet"
          description="Create your first pipeline in the Designer."
          action={{
            label: 'New pipeline',
            onClick: () => navigate('/pipeline-designer'),
            icon: Plus,
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(p) => navigate(`/pipeline-designer?p=${p.id}`)}
        />
      )}
    </div>
  );
}

function FilterChipGroup<T extends string>({
  label,
  options,
  active,
  onToggle,
  renderOption,
}: {
  label: string;
  options: readonly T[];
  active: Set<T>;
  onToggle: (value: T) => void;
  renderOption: (value: T) => React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isActive = active.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={cn(
                'rounded-full border transition-colors',
                isActive
                  ? 'border-border-focus bg-surface-2'
                  : 'border-border hover:border-border-strong',
              )}
            >
              {renderOption(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PipelinesSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden animate-pulse">
      <div className="h-10 bg-surface-2 border-b border-border" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border-b border-border last:border-b-0 p-3">
          <div className="h-4 w-1/3 rounded bg-surface-2" />
          <div className="mt-2 h-3 w-1/2 rounded bg-surface-2" />
        </div>
      ))}
    </div>
  );
}
