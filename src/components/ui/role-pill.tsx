import { cn } from '@/lib/cn';
import type { UserRole } from '@/lib/types';

const ROLE_STYLES: Record<UserRole, { wash: string; fg: string; dot: string; label: string }> = {
  admin: { wash: 'bg-cat-privacy/15', fg: 'text-cat-privacy', dot: 'bg-cat-privacy', label: 'Admin' },
  editor: { wash: 'bg-info-wash', fg: 'text-info-fg', dot: 'bg-info', label: 'Editor' },
  viewer: { wash: 'bg-surface-2', fg: 'text-text-muted', dot: 'bg-text-subtle', label: 'Viewer' },
  'pipeline-operator': { wash: 'bg-warning-wash', fg: 'text-warning-fg', dot: 'bg-warning', label: 'Operator' },
};

export function RolePill({ role, className }: { role: UserRole; className?: string }) {
  const s = ROLE_STYLES[role];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium',
        s.wash,
        s.fg,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} aria-hidden="true" />
      {s.label}
    </span>
  );
}
