import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/cn';

export type TimeRange = '24h' | '7d' | '30d' | '90d' | 'YTD';
export type Region = 'all' | 'DXB' | 'AUH' | 'SHJ' | 'NORTH';
export type Segment = 'all' | 'postpaid' | 'prepaid' | 'enterprise' | 'iot';

/** Shared "active filter" treatment — matches sidebar active and Segmented active.
   Uses the gradient-end accent (coral on Strata, hot pink on Electric Violet, etc.)
   so every selected control speaks the same theme-secondary language across the app. */
const ACTIVE_FILTER_CLASS =
  'border-[color-mix(in_srgb,var(--color-grad-to)_55%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-grad-to)_22%,transparent)] text-text font-medium';

interface FilterBarProps {
  range: TimeRange;
  region: Region;
  segment: Segment;
  onRangeChange: (r: TimeRange) => void;
  onRegionChange: (r: Region) => void;
  onSegmentChange: (s: Segment) => void;
  onReset?: () => void;
  className?: string;
}

export function FilterBar({
  range,
  region,
  segment,
  onRangeChange,
  onRegionChange,
  onSegmentChange,
  onReset,
  className,
}: FilterBarProps) {
  const isFiltered = region !== 'all' || segment !== 'all' || range !== '30d';

  return (
    <div
      className={cn(
        'mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 shadow-tinted',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 pr-2 border-r border-border">
        <Filter className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.75} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          Filters
        </span>
      </div>

      <FilterGroup label="Range">
        <Segmented
          options={['24h', '7d', '30d', '90d', 'YTD'] as const satisfies readonly TimeRange[]}
          value={range}
          onChange={onRangeChange}
        />
      </FilterGroup>

      <FilterGroup label="Region">
        <Select value={region} onValueChange={(v) => onRegionChange(v as Region)}>
          <SelectTrigger
            className={cn(
              'h-8 w-[140px] text-xs',
              region !== 'all' && ACTIVE_FILTER_CLASS,
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All emirates</SelectItem>
            <SelectItem value="DXB">Dubai</SelectItem>
            <SelectItem value="AUH">Abu Dhabi</SelectItem>
            <SelectItem value="SHJ">Sharjah</SelectItem>
            <SelectItem value="NORTH">Northern emirates</SelectItem>
          </SelectContent>
        </Select>
      </FilterGroup>

      <FilterGroup label="Segment">
        <Select value={segment} onValueChange={(v) => onSegmentChange(v as Segment)}>
          <SelectTrigger
            className={cn(
              'h-8 w-[140px] text-xs',
              segment !== 'all' && ACTIVE_FILTER_CLASS,
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All segments</SelectItem>
            <SelectItem value="postpaid">Postpaid</SelectItem>
            <SelectItem value="prepaid">Prepaid</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="iot">IoT</SelectItem>
          </SelectContent>
        </Select>
      </FilterGroup>

      {isFiltered && onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      )}

      <div className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-success ai-pulse" aria-hidden="true" />
        Live · auto-refresh 30s
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
        {label}
      </span>
      {children}
    </div>
  );
}
