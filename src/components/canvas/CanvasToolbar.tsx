import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reorder } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Plus, Play, Code2, Rocket, X } from 'lucide-react';
import { toast } from 'sonner';
import { Brand } from '@/components/Brand';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { usePipelineStore, type PipelineTab } from '@/stores/usePipelineStore';
import { cn } from '@/lib/cn';
import { SPRING } from '@/lib/motion';

export function CanvasToolbar() {
  const navigate = useNavigate();
  const {
    tabs,
    activeTabId,
    switchTab,
    closeTab,
    newTab,
    triggerDryRun,
    dryRunActive,
  } = usePipelineStore(
    useShallow((s) => ({
      tabs: s.tabs,
      activeTabId: s.activeTabId,
      switchTab: s.switchTab,
      closeTab: s.closeTab,
      newTab: s.newTab,
      triggerDryRun: s.triggerDryRun,
      dryRunActive: s.dryRunActive,
    })),
  );

  const [orderedTabs, setOrderedTabs] = useState<PipelineTab[]>(tabs);
  const [savedNote] = useState('saved 2s ago');

  // Keep local order in sync with store on add/remove
  if (orderedTabs.length !== tabs.length) {
    setOrderedTabs(tabs);
  }

  const active = tabs.find((t) => t.id === activeTabId);

  const onDeploy = () => {
    if (!active) return;
    toast.success(`${active.name} deploy queued`, {
      description: `→ ${active.state} · ${active.version}`,
    });
  };

  const onDryRun = () => {
    triggerDryRun();
    toast.message('Dry-run started · 100 synthetic records', {
      description: 'Animating flow for ~2s, then surfacing per-node counts.',
    });
  };

  return (
    <header className="relative z-20 flex h-13 shrink-0 items-center gap-3 border-b border-border bg-surface px-3 py-2 shadow-tinted">
      <button
        type="button"
        onClick={() => navigate('/pipelines')}
        className="rounded-md p-1 hover:bg-surface-2"
        aria-label="Back to pipelines"
      >
        <ArrowLeft className="h-4 w-4 text-text-muted" strokeWidth={1.75} />
      </button>

      <Brand />

      <div className="ml-2 h-5 w-px bg-border" />

      <Reorder.Group
        as="ol"
        axis="x"
        values={orderedTabs}
        onReorder={setOrderedTabs}
        className="flex min-w-0 items-center gap-1"
      >
        {orderedTabs.map((t) => (
          <Reorder.Item
            key={t.id}
            value={t}
            as="li"
            transition={SPRING.default}
            className="select-none"
          >
            <button
              type="button"
              onClick={() => switchTab(t.id)}
              className={cn(
                'group relative flex max-w-[200px] items-center gap-2 rounded-md px-2.5 py-1 text-xs transition-colors cursor-grab active:cursor-grabbing',
                t.id === activeTabId
                  ? 'bg-surface-2 text-text'
                  : 'text-text-muted hover:bg-surface-2 hover:text-text',
              )}
            >
              <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', t.dirty ? 'bg-warning' : 'bg-text-subtle')} />
              <span className="truncate font-mono text-[11px]">{t.name}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(t.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    closeTab(t.id);
                  }
                }}
                className="ml-1 hidden rounded p-0.5 hover:bg-surface group-hover:inline-flex"
                aria-label={`Close ${t.name}`}
              >
                <X className="h-2.5 w-2.5" />
              </span>
              {t.id === activeTabId && (
                <span className="absolute -bottom-2 left-2 right-2 h-[2px] rounded-full bg-primary" />
              )}
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="iconSm" onClick={newTab} aria-label="New pipeline">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">New pipeline · ⌘N</TooltipContent>
      </Tooltip>

      <div className="flex-1" />

      {active && (
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-text-muted">
            {active.version}
          </span>
          <StatusPill status={active.state} />
          <span className="font-mono text-[10px] text-text-subtle">
            {savedNote}
          </span>
        </div>
      )}

      <div className="ml-2 h-5 w-px bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="iconSm" aria-label="Toggle JSON">
            <Code2 className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">JSON view · ⌘/</TooltipContent>
      </Tooltip>

      <Button variant="secondary" size="sm" onClick={onDryRun} disabled={dryRunActive}>
        <Play className="h-3.5 w-3.5" />
        {dryRunActive ? 'Running…' : 'Dry-run'}
      </Button>

      <Button onClick={onDeploy} size="sm">
        <Rocket className="h-3.5 w-3.5" />
        Deploy
      </Button>

      <ThemeSwitcher />
    </header>
  );
}
