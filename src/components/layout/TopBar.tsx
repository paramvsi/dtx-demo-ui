import { useEffect, useState } from 'react';
import { Bell, ChevronRight, PanelLeft, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { CommandPalette } from '@/components/layout/CommandPalette';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { cn } from '@/lib/cn';

type Env = 'prod' | 'staging' | 'dev';

const ENV_STYLES: Record<Env, { dot: string; wash: string; fg: string }> = {
  prod: { dot: 'bg-success', wash: 'bg-success-wash', fg: 'text-success-fg' },
  staging: { dot: 'bg-warning', wash: 'bg-warning-wash', fg: 'text-warning-fg' },
  dev: { dot: 'bg-info', wash: 'bg-info-wash', fg: 'text-info-fg' },
};

function useBreadcrumb(): string[] {
  const { pathname } = useLocation();
  if (pathname === '/' || pathname === '/dashboard') return ['Dashboard'];
  const segments = pathname.split('/').filter(Boolean);
  // Pretty: "access/users" -> ["Access", "Users"]
  return segments.map((s) =>
    s
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
  );
}

export function TopBar() {
  const { toggle } = useSidebarStore();
  const [env, setEnv] = useState<Env>('prod');
  const navigate = useNavigate();
  const crumbs = useBreadcrumb();
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd+K opens search (placeholder; real cmdk in Phase 9)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={toggle}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Toggle sidebar</TooltipContent>
      </Tooltip>

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
        {crumbs.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-subtle" />}
            <span
              className={cn(
                'truncate text-sm',
                i === crumbs.length - 1 ? 'text-text font-medium' : 'text-text-muted',
              )}
            >
              {c}
            </span>
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="hidden md:flex h-9 w-72 items-center gap-2 rounded-md border border-border bg-surface-2 px-3 text-left text-text-subtle transition-colors hover:border-border-strong"
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
        <span className="font-mono text-xs">Search pipelines, users…</span>
        <kbd className="ml-auto rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
          ⌘K
        </kbd>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium font-mono uppercase tracking-wider transition-colors',
              ENV_STYLES[env].wash,
              ENV_STYLES[env].fg,
            )}
            aria-label={`Environment ${env}`}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', ENV_STYLES[env].dot)} />
            {env}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Environment</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(['prod', 'staging', 'dev'] as const).map((e) => (
            <DropdownMenuItem key={e} onSelect={() => setEnv(e)}>
              <span className={cn('mr-2 h-1.5 w-1.5 rounded-full', ENV_STYLES[e].dot)} />
              <span className="font-mono text-xs uppercase tracking-wider">{e}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ThemeSwitcher />

      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="iconSm" aria-label="Notifications">
            <Bell className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Notifications</TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            aria-label="Account"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Paramveer"
                alt="Paramveer"
              />
              <AvatarFallback>PV</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[14rem]">
          <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
          <div className="px-2 pb-2 text-sm">
            <div className="font-medium">Paramveer</div>
            <div className="font-mono text-xs text-text-muted">paramveer@dtx.io</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => navigate('/access/users')}>
            Account settings
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
            Switch tenant
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-danger">Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
