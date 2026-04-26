import { cn } from '@/lib/cn';

interface SegmentedProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = 'sm',
  className,
}: SegmentedProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-border bg-surface-2 p-0.5',
        className,
      )}
      role="tablist"
    >
      {options.map((opt) => {
        const isActive = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'rounded transition-colors',
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
              isActive
                ? 'bg-surface text-text shadow-xs'
                : 'text-text-muted hover:text-text',
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
