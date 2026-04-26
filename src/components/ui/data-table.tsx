import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type Row,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  empty?: React.ReactNode;
  rowClassName?: (row: TData) => string | undefined;
  className?: string;
}

/**
 * Tanstack-table wrapper. No virtualization at this size (data sets <100).
 * Add virtualization once any single page exceeds that.
 */
export function DataTable<TData>({
  columns,
  data,
  onRowClick,
  empty,
  rowClassName,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;
  const rowCount = rows.length;

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <div className="overflow-x-auto scroll-smooth">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-2">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        'px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-text-muted',
                        canSort && 'cursor-pointer select-none hover:text-text',
                      )}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-1.5">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <SortIndicator state={sorted as 'asc' | 'desc' | false} />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rowCount === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  {empty ?? <span className="text-sm text-text-muted">No results</span>}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <DataTableRow
                  key={row.id}
                  row={row}
                  onClick={onRowClick}
                  rowClassName={rowClassName}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DataTableRow<TData>({
  row,
  onClick,
  rowClassName,
}: {
  row: Row<TData>;
  onClick: ((row: TData) => void) | undefined;
  rowClassName: ((row: TData) => string | undefined) | undefined;
}) {
  return (
    <tr
      onClick={onClick ? () => onClick(row.original) : undefined}
      className={cn(
        'border-b border-border last:border-b-0 transition-colors',
        onClick && 'cursor-pointer hover:bg-surface-2',
        rowClassName?.(row.original),
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-3 align-middle">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

function SortIndicator({ state }: { state: 'asc' | 'desc' | false }) {
  if (state === 'asc') return <ArrowUp className="h-3 w-3" strokeWidth={2} />;
  if (state === 'desc') return <ArrowDown className="h-3 w-3" strokeWidth={2} />;
  return <ChevronsUpDown className="h-3 w-3 opacity-50" strokeWidth={2} />;
}
