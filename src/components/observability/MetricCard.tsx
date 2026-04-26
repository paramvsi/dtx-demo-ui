import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CountUp } from '@/components/ui/count-up';
import { T } from '@/lib/motion';

interface MetricCardProps {
  label: string;
  value: number;
  delta?: { value: number; positive: boolean };
  icon: LucideIcon;
  variant: 'neutral' | 'success' | 'warning' | 'danger';
  format?: (n: number) => string;
  subtitle?: string;
}

const VARIANT_STYLES: Record<MetricCardProps['variant'], { wash: string; fg: string; iconBg: string; iconFg: string }> = {
  // neutral now uses primary-soft + primary for the icon — manager's KPI pattern from launchpad-v4 line 275
  neutral: { wash: 'bg-surface', fg: 'text-text', iconBg: 'bg-primary-soft', iconFg: 'text-primary' },
  success: { wash: 'bg-success-wash', fg: 'text-success-fg', iconBg: 'bg-success/15', iconFg: 'text-success-fg' },
  warning: { wash: 'bg-warning-wash', fg: 'text-warning-fg', iconBg: 'bg-warning/15', iconFg: 'text-warning-fg' },
  danger: { wash: 'bg-danger-wash', fg: 'text-danger-fg', iconBg: 'bg-danger/15', iconFg: 'text-danger-fg' },
};

export function MetricCard({ label, value, icon: Icon, variant, format, subtitle, delta }: MetricCardProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={T.hover}
      className={cn('rounded-lg border border-border p-4 shadow-xs', styles.wash)}
    >
      <div className="flex items-start justify-between">
        <div className={cn('font-mono text-[10px] uppercase tracking-wider', styles.fg, 'opacity-80')}>
          {label}
        </div>
        <div className={cn('rounded-md p-1.5', styles.iconBg)}>
          <Icon className={cn('h-3.5 w-3.5', styles.iconFg)} strokeWidth={2} />
        </div>
      </div>
      <div className={cn('mt-3 text-3xl font-semibold tabular-nums', styles.fg)}>
        <CountUp value={value} {...(format ? { format } : {})} />
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        {subtitle && (
          <span className={cn('text-xs', styles.fg, 'opacity-70')}>{subtitle}</span>
        )}
        {delta && (
          <span className={cn('font-mono text-[11px]', delta.positive ? 'text-success-fg' : 'text-danger-fg')}>
            {delta.positive ? '↑' : '↓'} {Math.abs(delta.value).toFixed(1)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
