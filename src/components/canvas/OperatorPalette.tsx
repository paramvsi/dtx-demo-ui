import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, GripVertical, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { OperatorIcon } from '@/components/canvas/OperatorIcon';
import { OPERATORS, OPERATORS_BY_CATEGORY } from '@/lib/mock/operators';
import { cn } from '@/lib/cn';
import { EASE, DURATION } from '@/lib/motion';
import type { Operator, OperatorCategory } from '@/lib/types';

const CATEGORY_ORDER: OperatorCategory[] = [
  'source',
  'dq',
  'transform',
  'privacy',
  'identity',
  'routing',
  'sink',
];

const CATEGORY_LABEL: Record<OperatorCategory, string> = {
  source: 'Sources',
  transform: 'Transforms',
  dq: 'Data quality',
  privacy: 'Privacy',
  identity: 'Identity',
  routing: 'Routing',
  sink: 'Sinks',
};

const CATEGORY_DOT: Record<OperatorCategory, string> = {
  source: 'bg-cat-source',
  transform: 'bg-cat-transform',
  dq: 'bg-cat-dq',
  privacy: 'bg-cat-privacy',
  identity: 'bg-cat-identity',
  routing: 'bg-cat-routing',
  sink: 'bg-cat-sink',
};

interface OperatorPaletteProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

/**
 * Right-side operator library — n8n-style.
 * Pinned search at top, collapsible category sections, drag-to-canvas tiles.
 * The whole panel collapses to a thin 48px rail when not in use.
 */
export function OperatorPalette({ collapsed, onCollapsedChange }: OperatorPaletteProps) {
  const [search, setSearch] = useState('');
  const [openCats, setOpenCats] = useState<Set<OperatorCategory>>(
    () => new Set(CATEGORY_ORDER),
  );

  const filtered = useMemo(() => {
    if (!search) return null;
    const q = search.toLowerCase();
    return OPERATORS.filter(
      (op) =>
        op.name.toLowerCase().includes(q) ||
        op.id.toLowerCase().includes(q) ||
        op.subtitle.toLowerCase().includes(q) ||
        op.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [search]);

  const toggleCat = (c: OperatorCategory) => {
    const next = new Set(openCats);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    setOpenCats(next);
  };

  if (collapsed) {
    return (
      <aside className="flex h-full w-12 shrink-0 flex-col border-l border-border bg-surface">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => onCollapsedChange(false)}
              className="flex h-12 w-full items-center justify-center border-b border-border text-text-muted hover:bg-surface-2 hover:text-text"
              aria-label="Open operator library"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">Operator library</TooltipContent>
        </Tooltip>
        <div className="flex flex-col items-center gap-2 px-1 py-3">
          {CATEGORY_ORDER.map((c) => (
            <Tooltip key={c} delayDuration={300}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onCollapsedChange(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-surface-2"
                  aria-label={CATEGORY_LABEL[c]}
                >
                  <span className={cn('h-2 w-2 rounded-sm', CATEGORY_DOT[c])} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">{CATEGORY_LABEL[c]}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-surface">
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold text-text">Operators</h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
            {OPERATORS.length} day-1
          </span>
        </div>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => onCollapsedChange(true)}
              aria-label="Collapse operator library"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Collapse</TooltipContent>
        </Tooltip>
      </div>

      {/* Pinned search */}
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-subtle" strokeWidth={1.75} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search operators…"
            mono
            className="pl-8"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scroll-smooth p-2">
        {filtered ? (
          <ul className="space-y-1.5">
            {filtered.length === 0 ? (
              <li className="rounded-md border border-dashed border-border p-6 text-center text-xs text-text-subtle">
                No operators match
              </li>
            ) : (
              filtered.map((op) => <PaletteTile key={op.id} op={op} />)
            )}
          </ul>
        ) : (
          CATEGORY_ORDER.map((cat) => {
            const ops = OPERATORS_BY_CATEGORY[cat] ?? [];
            if (ops.length === 0) return null;
            const open = openCats.has(cat);
            return (
              <div key={cat} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleCat(cat)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-text-muted hover:bg-surface-2 hover:text-text"
                >
                  <span className="flex items-center gap-2">
                    <span className={cn('h-1.5 w-1.5 rounded-sm', CATEGORY_DOT[cat])} />
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                      {CATEGORY_LABEL[cat]}
                    </span>
                    <span className="font-mono text-[10px] text-text-subtle">{ops.length}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-3 w-3 transition-transform',
                      open ? 'rotate-0' : '-rotate-90',
                    )}
                    strokeWidth={2}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: DURATION.base, ease: EASE.enter },
                          opacity: { duration: DURATION.base, ease: EASE.enter, delay: 0.05 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.16, ease: EASE.exit },
                          opacity: { duration: 0.1, ease: EASE.exit },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1.5 px-1 pb-1.5 pt-1">
                        {ops.map((op) => (
                          <PaletteTile key={op.id} op={op} />
                        ))}
                      </div>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function PaletteTile({ op }: { op: Operator }) {
  const onDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    e.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ operatorId: op.id }),
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <li
      draggable
      onDragStart={onDragStart}
      className="group flex cursor-grab items-center gap-3 rounded-md border border-border bg-surface p-2 active:cursor-grabbing hover:border-border-strong shadow-xs transition-[transform,border-color] duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2">
        <OperatorIcon operatorId={op.id} category={op.category} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[12px] font-medium text-text truncate">{op.name}</div>
          <span className="font-mono text-[9px] text-text-subtle shrink-0">{op.id}</span>
        </div>
        <div className="mt-0.5 text-[11px] text-text-muted leading-tight truncate">
          {op.subtitle}
        </div>
      </div>
      <GripVertical className="h-3.5 w-3.5 shrink-0 text-text-subtle opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.75} />
    </li>
  );
}
