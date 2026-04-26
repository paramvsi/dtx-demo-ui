import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Lock, Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSchemas } from '@/lib/queries';
import type { Schema } from '@/lib/types';
import { cn } from '@/lib/cn';

export default function Schemas() {
  const { data, isLoading } = useSchemas();
  const [selected, setSelected] = useState<Schema | null>(null);

  const columns = useMemo<ColumnDef<Schema>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Schema',
        cell: ({ row }) => (
          <div>
            <div className="font-mono text-xs text-text">{row.original.name}</div>
            <div className="text-[11px] text-text-subtle line-clamp-1 max-w-md">
              {row.original.description}
            </div>
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
        accessorKey: 'fields',
        header: 'Fields',
        cell: ({ row }) => {
          const piiCount = row.original.fields.filter((f) => f.pii).length;
          return (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="font-mono">{row.original.fields.length}</span>
              {piiCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cat-privacy/15 px-2 py-0.5 text-[10px] text-cat-privacy">
                  <Lock className="h-2.5 w-2.5" strokeWidth={2.5} />
                  {piiCount} PII
                </span>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'owner',
        header: 'Owner',
        cell: ({ row }) => (
          <span className="text-xs text-text-muted">{row.original.owner}</span>
        ),
      },
      {
        accessorKey: 'usedBy',
        header: 'Used by',
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-text-subtle">
            {row.original.usedBy.length} pipeline{row.original.usedBy.length === 1 ? '' : 's'}
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
        title="Schemas"
        subtitle={`${data?.length ?? 0} schemas in registry · TRA-compliant PII tagging`}
        actions={
          <Button>
            <Plus className="h-4 w-4" />
            Register schema
          </Button>
        }
      />

      {isLoading ? (
        <SchemasSkeleton />
      ) : data && (
        <DataTable columns={columns} data={data} onRowClick={setSelected} />
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent width="w-[520px]">
          {selected && <SchemaDetail schema={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SchemaDetail({ schema }: { schema: Schema }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Schema</div>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="font-mono text-base font-semibold text-text">{schema.name}</span>
        <span className="font-mono text-xs text-text-muted">{schema.version}</span>
      </div>
      <p className="mt-2 text-sm text-text-muted">{schema.description}</p>
      <div className="mt-2 font-mono text-[11px] text-text-subtle">Owner · {schema.owner}</div>

      <div className="my-4 border-t border-border" />

      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          Fields ({schema.fields.length})
        </div>
        <div className="overflow-hidden rounded-md border border-border">
          {schema.fields.map((f, i) => (
            <div
              key={f.name}
              className={cn(
                'flex items-center justify-between gap-3 px-3 py-2 text-xs',
                i > 0 && 'border-t border-border',
                f.pii && 'bg-cat-privacy/5',
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-text">{f.name}</span>
                  {f.pii && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-cat-privacy/15 px-1.5 py-0 text-[9px] uppercase tracking-wider text-cat-privacy">
                      <Lock className="h-2 w-2" strokeWidth={2.5} />
                      PII
                    </span>
                  )}
                  {!f.nullable && (
                    <span className="rounded-full border border-border px-1.5 py-0 text-[9px] uppercase tracking-wider text-text-subtle">
                      required
                    </span>
                  )}
                </div>
                {f.description && (
                  <div className="mt-0.5 text-[11px] text-text-subtle">{f.description}</div>
                )}
              </div>
              <span className="font-mono text-[10px] text-text-muted shrink-0">{f.type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="my-4 border-t border-border" />

      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          Used by ({schema.usedBy.length})
        </div>
        <div className="space-y-1.5">
          {schema.usedBy.map((p) => (
            <div key={p} className="rounded-md border border-border bg-surface p-2 font-mono text-[11px] text-text">
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SchemasSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden animate-pulse">
      <div className="h-10 bg-surface-2 border-b border-border" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border-b border-border last:border-b-0 p-3">
          <div className="h-3 w-1/3 rounded bg-surface-2" />
          <div className="mt-2 h-2.5 w-1/2 rounded bg-surface-2" />
        </div>
      ))}
    </div>
  );
}
