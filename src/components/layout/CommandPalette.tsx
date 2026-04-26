import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import {
  Activity,
  BarChart3,
  Database,
  GitBranch,
  KeyRound,
  Layers,
  Network,
  Search,
  Shapes,
  Sparkles,
  Users,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { PIPELINES } from '@/lib/mock/pipelines';
import { USERS } from '@/lib/mock/users';
import { SCHEMAS } from '@/lib/mock/schemas';
import { OPERATORS } from '@/lib/mock/operators';
import { useThemeStore } from '@/stores/useThemeStore';
import { THEMES, type ThemeId } from '@/lib/themes';
import { cn } from '@/lib/cn';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROUTES: Array<{ label: string; to: string; icon: LucideIcon; group: string }> = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3, group: 'Navigate' },
  { label: 'Pipelines', to: '/pipelines', icon: Workflow, group: 'Navigate' },
  { label: 'Pipeline Designer', to: '/pipeline-designer', icon: GitBranch, group: 'Navigate' },
  { label: 'Schemas', to: '/schemas', icon: Shapes, group: 'Navigate' },
  { label: 'Synthetic data', to: '/synthetic-data', icon: Sparkles, group: 'Navigate' },
  { label: 'Kafka', to: '/kafka', icon: Zap, group: 'Navigate' },
  { label: 'Cache', to: '/cache', icon: Layers, group: 'Navigate' },
  { label: 'Pipeline events', to: '/observability', icon: Activity, group: 'Navigate' },
  { label: 'Users', to: '/access/users', icon: Users, group: 'Navigate' },
  { label: 'Groups', to: '/access/groups', icon: Network, group: 'Navigate' },
  { label: 'Roles', to: '/access/roles', icon: KeyRound, group: 'Navigate' },
];

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const setTheme = useThemeStore((s) => s.setTheme);
  const [queryState, setQueryState] = useState<{ open: boolean; q: string }>({ open: false, q: '' });

  // Reset query when the palette closes — derived state, no effect needed
  if (queryState.open !== open) {
    setQueryState({ open, q: open ? queryState.q : '' });
  }
  const query = queryState.q;
  const setQuery = (q: string) => setQueryState((s) => ({ ...s, q }));

  const go = (to: string) => {
    onOpenChange(false);
    navigate(to);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-text/20 backdrop-blur-[1px] pt-[15vh]"
      onClick={() => onOpenChange(false)}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface shadow-2xl"
        role="dialog"
        aria-label="Command palette"
      >
        <Command label="Command palette" className={cn('flex flex-col')}>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 text-text-subtle" strokeWidth={1.75} />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Type a command or search…"
              className="h-11 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-text-subtle"
            />
            <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              esc
            </kbd>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-xs text-text-subtle">
              No results. Try a pipeline name or operator code.
            </Command.Empty>

            <Group label="Navigate">
              {ROUTES.map((r) => (
                <Item
                  key={r.to}
                  icon={r.icon}
                  label={r.label}
                  hint={r.to}
                  onSelect={() => go(r.to)}
                />
              ))}
            </Group>

            <Group label="Theme">
              {THEMES.map((t) => (
                <Item
                  key={t.id}
                  label={`Switch to ${t.name}`}
                  hint={t.description}
                  swatch={t.swatches}
                  onSelect={() => {
                    setTheme(t.id as ThemeId);
                    onOpenChange(false);
                  }}
                />
              ))}
            </Group>

            <Group label="Pipelines">
              {PIPELINES.slice(0, 12).map((p) => (
                <Item
                  key={p.id}
                  icon={Workflow}
                  label={p.name}
                  hint={`${p.status} · ${p.version} · ${p.owner}`}
                  onSelect={() => go(`/pipeline-designer?p=${p.id}`)}
                />
              ))}
            </Group>

            <Group label="Schemas">
              {SCHEMAS.map((s) => (
                <Item
                  key={s.id}
                  icon={Shapes}
                  label={s.name}
                  hint={`${s.version} · ${s.fields.length} fields`}
                  onSelect={() => go('/schemas')}
                />
              ))}
            </Group>

            <Group label="Users">
              {USERS.slice(0, 8).map((u) => (
                <Item
                  key={u.id}
                  icon={Users}
                  label={u.name}
                  hint={`${u.role} · ${u.email}`}
                  onSelect={() => go('/access/users')}
                />
              ))}
            </Group>

            <Group label="Operators">
              {OPERATORS.map((op) => (
                <Item
                  key={op.id}
                  icon={Database}
                  label={op.name}
                  hint={`${op.id} · ${op.subtitle}`}
                  onSelect={() => go('/pipeline-designer')}
                />
              ))}
            </Group>
          </Command.List>

          <div className="border-t border-border px-3 py-1.5 font-mono text-[10px] text-text-subtle flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ select</span>
            <span>esc close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={label}
      className="mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-text-subtle"
    >
      {children}
    </Command.Group>
  );
}

function Item({
  icon: Icon,
  label,
  hint,
  swatch,
  onSelect,
}: {
  icon?: LucideIcon;
  label: string;
  hint?: string;
  swatch?: readonly string[];
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[selected=true]:bg-surface-2"
    >
      {Icon && <Icon className="h-3.5 w-3.5 text-text-muted shrink-0" strokeWidth={1.75} />}
      {swatch && (
        <div className="flex gap-0.5 overflow-hidden rounded-sm border border-border shrink-0">
          {swatch.slice(0, 5).map((c, i) => (
            <span key={i} aria-hidden="true" style={{ backgroundColor: c }} className="block h-3 w-3" />
          ))}
        </div>
      )}
      <span className="flex-1 truncate text-text">{label}</span>
      {hint && (
        <span className="font-mono text-[10px] text-text-subtle truncate max-w-[40%]">{hint}</span>
      )}
    </Command.Item>
  );
}
