import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/cn';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

const VARIANTS = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, max = 100, variant = 'primary', ...props }, ref) => {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-surface-2', className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn('h-full transition-[width] duration-500 ease-out', VARIANTS[variant])}
          style={{ width: `${pct}%` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);
Progress.displayName = 'Progress';

export { Progress };
