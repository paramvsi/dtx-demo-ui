import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Code2,
  FlaskConical,
  GitBranch,
  ScrollText,
  X,
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Segmented } from '@/components/ui/segmented';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusPill } from '@/components/ui/status-pill';
import { OperatorIcon } from '@/components/canvas/OperatorIcon';
import { getOperator } from '@/lib/mock/operators';
import { generateLogs, generateLogTick } from '@/lib/mock/logs';
import { buildLineage } from '@/lib/mock/lineage';
import { usePipelineStore, useSelectedNode } from '@/stores/usePipelineStore';
import { cn } from '@/lib/cn';
import { T, EASE, DURATION, SPRING } from '@/lib/motion';
import { toast } from 'sonner';
import type { LogEntry, OperatorField } from '@/lib/types';

const DEFAULT_HEIGHT = 440;
const MIN_HEIGHT = 240;
const MAX_HEIGHT_FRACTION = 0.78; // up to 78% of viewport height

/**
 * Bottom-docked inspector drawer (n8n-style).
 *
 * Anchored at the bottom of the canvas. Slides up from below when a node is
 * selected, resizable via the drag-handle on the top edge, hides entirely
 * when no node is selected.
 *
 * The canvas itself is responsible for leaving room (or not) below it — this
 * component sits as a sibling, positioned absolute over the canvas viewport.
 */
export function Inspector() {
  const selectedNode = useSelectedNode();
  const selectNode = usePipelineStore((s) => s.selectNode);

  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [collapsed, setCollapsed] = useState(false);

  // Resize via top edge drag
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);
  const onResizeStart = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, startH: height };
  };
  const onResizeMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const delta = dragRef.current.startY - e.clientY;
    const max = Math.round(window.innerHeight * MAX_HEIGHT_FRACTION);
    const next = Math.max(MIN_HEIGHT, Math.min(max, dragRef.current.startH + delta));
    setHeight(next);
  };
  const onResizeEnd = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

  return (
    <AnimatePresence>
      {selectedNode && (
        <motion.div
          key="inspector-drawer"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { ...SPRING.layout, duration: DURATION.slow } }}
          exit={{ y: 24, opacity: 0, transition: T.drawerExit }}
          className="absolute inset-x-0 bottom-0 z-30 border-t border-border bg-surface shadow-[0_-12px_32px_-12px_color-mix(in_srgb,var(--color-text)_18%,transparent)]"
          style={{ height: collapsed ? 44 : height }}
        >
          {/* Top resize handle */}
          {!collapsed && (
            <div
              onPointerDown={onResizeStart}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeEnd}
              onPointerCancel={onResizeEnd}
              className="group absolute -top-1 left-0 right-0 h-2 cursor-ns-resize z-10"
              role="separator"
              aria-orientation="horizontal"
              aria-label="Resize inspector"
            >
              <div className="mx-auto mt-0.5 h-1 w-12 rounded-full bg-border-strong/0 group-hover:bg-border-strong transition-colors" />
            </div>
          )}

          <InspectorBody
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed(!collapsed)}
            onClose={() => {
              selectNode(null);
              setCollapsed(false);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InspectorBody({
  collapsed,
  onToggleCollapsed,
  onClose,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onClose: () => void;
}) {
  const node = useSelectedNode();
  if (!node) return null;
  const op = getOperator(node.data.operatorId);
  if (!op) return null;

  const status = node.data.status === 'idle' ? 'idle' : node.data.status === 'running' ? 'running' : node.data.status === 'success' ? 'success' : node.data.status === 'warning' ? 'warning' : 'error';

  return (
    <Tabs defaultValue="configure" className="flex h-full flex-col overflow-hidden">
      {/* Header bar */}
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border bg-surface-2/50 px-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
            <OperatorIcon operatorId={op.id} category={op.category} size={16} />
          </div>
          <div className="min-w-0 flex flex-col leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text truncate">{op.name}</span>
              <span className="font-mono text-[10px] text-text-subtle shrink-0">{op.id}</span>
            </div>
            <span className="font-mono text-[10px] text-text-subtle truncate">{op.subtitle}</span>
          </div>
          <StatusPill status={status} withIcon />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {!collapsed && (
            <TabsList className="h-9 border-b-0 px-0">
              <TabsTrigger value="configure">
                <Code2 className="h-3 w-3" /> Configure
              </TabsTrigger>
              <TabsTrigger value="execute">
                <FlaskConical className="h-3 w-3" /> Execute
              </TabsTrigger>
              <TabsTrigger value="logs">
                <ScrollText className="h-3 w-3" /> Logs
              </TabsTrigger>
              <TabsTrigger value="lineage">
                <GitBranch className="h-3 w-3" /> Lineage
              </TabsTrigger>
            </TabsList>
          )}

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? 'Expand inspector' : 'Collapse inspector'}
            >
              {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="iconSm" onClick={onClose} aria-label="Close inspector">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <TabsContent value="configure" className="p-4">
            <ConfigureTab />
          </TabsContent>
          <TabsContent value="execute" className="p-4">
            <ExecuteTab />
          </TabsContent>
          <TabsContent value="logs" className="p-0">
            <LogsTab />
          </TabsContent>
          <TabsContent value="lineage" className="p-4">
            <LineageTab />
          </TabsContent>
        </div>
      )}
    </Tabs>
  );
}

// ---- CONFIGURE TAB ----
function ConfigureTab() {
  const node = useSelectedNode();
  const updateConfig = usePipelineStore((s) => s.updateNodeConfig);
  if (!node) return null;
  const op = getOperator(node.data.operatorId);
  if (!op) return null;

  const required = op.fields.filter((f) => f.group !== 'advanced');
  const advanced = op.fields.filter((f) => f.group === 'advanced');

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
      {required.length > 0 && (
        <div className="lg:col-span-2">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
            Required
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {required.map((field) => (
              <div
                key={field.name}
                className={cn(field.type === 'textarea' && 'md:col-span-2')}
              >
                <FieldRenderer
                  field={field}
                  value={node.data.config[field.name]}
                  onChange={(v) => updateConfig(node.id, { [field.name]: v })}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {advanced.length > 0 && (
        <div className="lg:col-span-2">
          <CollapsibleAdvanced fields={advanced} nodeId={node.id} config={node.data.config} />
        </div>
      )}
    </div>
  );
}

function CollapsibleAdvanced({
  fields,
  nodeId,
  config,
}: {
  fields: readonly OperatorField[];
  nodeId: string;
  config: Record<string, string | number | boolean>;
}) {
  const [open, setOpen] = useState(false);
  const updateConfig = usePipelineStore((s) => s.updateNodeConfig);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md border border-dashed border-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle hover:border-border-strong hover:text-text"
      >
        <span>Advanced ({fields.length})</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
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
                height: { duration: 0.18, ease: EASE.exit },
                opacity: { duration: 0.12, ease: EASE.exit },
              },
            }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={cn(field.type === 'textarea' && 'md:col-span-2')}
                >
                  <FieldRenderer
                    field={field}
                    value={config[field.name]}
                    onChange={(v) => updateConfig(nodeId, { [field.name]: v })}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: OperatorField;
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
}) {
  const label = (
    <label htmlFor={field.name} className="mb-1.5 block text-xs font-medium text-text">
      {field.label}
      {field.required && <span className="ml-1 text-danger-fg">*</span>}
      {field.hint && <span className="ml-2 font-normal text-text-subtle">{field.hint}</span>}
    </label>
  );

  switch (field.type) {
    case 'text':
      return (
        <div>
          {label}
          <Input
            id={field.name}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            mono={field.mono ?? false}
            {...(field.placeholder ? { placeholder: field.placeholder } : {})}
          />
        </div>
      );
    case 'number':
      return (
        <div>
          {label}
          <Input
            id={field.name}
            type="number"
            value={Number(value ?? 0)}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            mono
          />
        </div>
      );
    case 'textarea':
      return (
        <div>
          {label}
          <textarea
            id={field.name}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            {...(field.placeholder ? { placeholder: field.placeholder } : {})}
            className={cn(
              'flex min-h-[80px] w-full rounded-md border border-border bg-surface px-3 py-2 text-xs text-text shadow-xs transition-colors placeholder:text-text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-1',
              field.mono && 'font-mono',
            )}
          />
        </div>
      );
    case 'select':
      return (
        <div>
          {label}
          <Select value={String(value ?? '')} onValueChange={(v) => onChange(v)}>
            <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case 'segmented':
      return (
        <div>
          {label}
          <Segmented
            options={field.options ?? []}
            value={String(value ?? field.default ?? field.options?.[0] ?? '')}
            onChange={onChange}
          />
        </div>
      );
    case 'toggle':
      return (
        <div className="flex items-start justify-between gap-3 rounded-md border border-border bg-surface p-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-text">{field.label}</div>
            {field.hint && (
              <div className="mt-0.5 text-[11px] text-text-muted">{field.hint}</div>
            )}
          </div>
          <Switch
            checked={Boolean(value ?? field.default)}
            onCheckedChange={onChange}
          />
        </div>
      );
  }
}

// ---- EXECUTE TAB ----
const SAMPLE_INPUT = [
  { msisdn_hashed: '7f3e9a…', event_ts: '2026-04-25T10:14:22Z', duration_s: 47, cell_site_id: 'DXB-1421-A' },
  { msisdn_hashed: '8a2c1d…', event_ts: '2026-04-25T10:14:23Z', duration_s: 132, cell_site_id: 'DXB-1421-B' },
  { msisdn_hashed: '9b4f7e…', event_ts: '2026-04-25T10:14:25Z', duration_s: 8, cell_site_id: 'AUH-0892-C' },
];
const SAMPLE_OUTPUT = [
  { msisdn_hashed: '7f3e9a…', dtx_id: 'DTX_a4f72e91', confidence: 0.97, emirate: 'DXB' },
  { msisdn_hashed: '8a2c1d…', dtx_id: 'DTX_b8c14f23', confidence: 0.94, emirate: 'DXB' },
  { msisdn_hashed: '9b4f7e…', dtx_id: 'DTX_c2e889ab', confidence: 0.86, emirate: 'AUH' },
];

function ExecuteTab() {
  const [source, setSource] = useState<'Synthetic (100)' | 'Upstream capture' | 'Upload'>('Synthetic (100)');
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState<{ processed: number; succeeded: number; errored: number; latencyMs: number } | null>(null);

  const onRun = () => {
    setRunning(true);
    setStats(null);
    toast.message('Executing on 100 synthetic records…', { description: source });
    setTimeout(() => {
      setRunning(false);
      setStats({ processed: 100, succeeded: 98, errored: 2, latencyMs: 18 });
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
            Input source
          </span>
          <Segmented
            options={['Synthetic (100)', 'Upstream capture', 'Upload'] as const}
            value={source}
            onChange={setSource}
          />
        </div>
        <Button onClick={onRun} disabled={running} size="sm">
          <FlaskConical className="h-3.5 w-3.5" />
          {running ? 'Running…' : 'Run on sample'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <SamplePanel title="Input · 3 of 100" schema="record" rows={SAMPLE_INPUT} />
        <SamplePanel title="Output · 3 of 100" schema="record + DTX_ID" rows={SAMPLE_OUTPUT} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Processed" value={stats?.processed ?? '—'} />
        <Stat label="Succeeded" value={stats?.succeeded ?? '—'} variant="success" />
        <Stat label="Errored" value={stats?.errored ?? '—'} variant={stats && stats.errored > 0 ? 'warning' : 'neutral'} />
        <Stat label="Latency" value={stats ? `${stats.latencyMs}ms` : '—'} />
      </div>
    </div>
  );
}

function SamplePanel({
  title,
  schema,
  rows,
}: {
  title: string;
  schema: string;
  rows: Array<Record<string, unknown>>;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface-2">
      <div className="flex items-baseline justify-between border-b border-border px-2.5 py-1.5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          {title}
        </div>
        <div className="font-mono text-[10px] text-text-muted">{schema}</div>
      </div>
      <pre className="overflow-auto scroll-smooth p-2.5 font-mono text-[10px] leading-tight text-text-muted max-h-32">
        {rows.map((r) => JSON.stringify(r)).join('\n')}
      </pre>
    </div>
  );
}

function Stat({
  label,
  value,
  variant = 'neutral',
}: {
  label: string;
  value: string | number;
  variant?: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  const colors = {
    neutral: 'text-text',
    success: 'text-success-fg',
    warning: 'text-warning-fg',
    danger: 'text-danger-fg',
  };
  return (
    <div className="rounded-md border border-border bg-surface p-2 text-center">
      <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">{label}</div>
      <div className={cn('mt-0.5 font-mono text-sm font-semibold tabular-nums', colors[variant])}>
        {value}
      </div>
    </div>
  );
}

// ---- LOGS TAB ----
function LogsTab() {
  const node = useSelectedNode();
  const nodeId = node?.id ?? '';
  const [logState, setLogState] = useState<{ id: string; logs: LogEntry[] }>(() => ({
    id: nodeId,
    logs: nodeId ? generateLogs(nodeId, 30) : [],
  }));
  const [timeRange, setTimeRange] = useState<'Last 1h' | '24h' | '7d'>('Last 1h');

  if (logState.id !== nodeId) {
    setLogState({ id: nodeId, logs: nodeId ? generateLogs(nodeId, 30) : [] });
  }

  useEffect(() => {
    if (!nodeId) return;
    let seq = 0;
    const interval = setInterval(() => {
      const newEntry = generateLogTick(nodeId, seq++);
      setLogState((s) => (s.id === nodeId ? { ...s, logs: [newEntry, ...s.logs].slice(0, 50) } : s));
    }, 1500);
    return () => clearInterval(interval);
  }, [nodeId]);

  const logs = logState.logs;

  if (!node) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-2/40 px-4 py-2">
        <Segmented options={['Last 1h', '24h', '7d'] as const} value={timeRange} onChange={setTimeRange} />
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          {logs.length} entries · live
        </div>
      </div>
      <div className="overflow-y-auto scroll-smooth">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-surface-2 border-b border-border z-10">
            <tr>
              <th className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-wider text-text-muted w-24">Time</th>
              <th className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-wider text-text-muted w-16">Status</th>
              <th className="px-3 py-1.5 text-right font-mono text-[10px] uppercase tracking-wider text-text-muted w-24">Records</th>
              <th className="px-3 py-1.5 text-right font-mono text-[10px] uppercase tracking-wider text-text-muted w-24">Errored</th>
              <th className="px-3 py-1.5 text-right font-mono text-[10px] uppercase tracking-wider text-text-muted w-24">Duration</th>
              <th className="px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-wider text-text-muted">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-b-0 hover:bg-surface-2/40">
                <td className="px-3 py-1.5 font-mono text-[10px] text-text-muted">{log.timestamp}</td>
                <td className="px-3 py-1.5">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider',
                      log.status === 'success' ? 'text-success-fg' : log.status === 'warning' ? 'text-warning-fg' : 'text-danger-fg',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-1.5 w-1.5 rounded-full',
                        log.status === 'success' ? 'bg-success' : log.status === 'warning' ? 'bg-warning' : 'bg-danger',
                      )}
                    />
                    {log.status}
                  </span>
                </td>
                <td className="px-3 py-1.5 font-mono text-[10px] tabular-nums text-text-muted text-right">
                  {log.records.toLocaleString()}
                </td>
                <td className={cn('px-3 py-1.5 font-mono text-[10px] tabular-nums text-right', log.errored > 0 ? 'text-danger-fg' : 'text-text-subtle')}>
                  {log.errored}
                </td>
                <td className="px-3 py-1.5 font-mono text-[10px] tabular-nums text-text-muted text-right">
                  {log.durationMs}ms
                </td>
                <td className="px-3 py-1.5 text-[11px] text-text-muted truncate max-w-md">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- LINEAGE TAB ----
function LineageTab() {
  const node = useSelectedNode();
  const { nodes, edges } = usePipelineStore(useShallow((s) => ({ nodes: s.nodes, edges: s.edges })));

  const lineage = useMemo(() => {
    if (!node) return null;
    return buildLineage(
      nodes.map((n) => ({ id: n.id, operatorId: n.data.operatorId })),
      edges.map((e) => ({ source: e.source, target: e.target })),
      node.id,
    );
  }, [node, nodes, edges]);

  if (!lineage) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          Upstream → current → downstream
        </div>
        <div className="grid grid-cols-3 gap-2">
          <LineageColumn label="upstream" nodes={lineage.upstream} />
          <div className="flex flex-col gap-1.5 rounded-md border border-border-focus bg-info-wash/30 p-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-info-fg">current</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-text-subtle">{lineage.current.operatorId}</span>
              <span className="text-xs font-medium text-text">{lineage.current.name}</span>
            </div>
          </div>
          <LineageColumn label="downstream" nodes={lineage.downstream} />
        </div>
      </div>

      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          Column flow
        </div>
        <div className="rounded-md border border-border bg-surface-2 p-3 font-mono text-[10px] leading-relaxed text-text-muted">
          {lineage.columns.map((c, i) => (
            <div key={i}>
              {c.upstream} → <span className="text-text">{c.current}</span> → {c.downstream}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LineageColumn({
  label,
  nodes,
}: {
  label: string;
  nodes: Array<{ id: string; name: string; operatorId: string }>;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-border bg-surface p-2">
      <span className="font-mono text-[9px] uppercase tracking-wider text-text-subtle">{label}</span>
      {nodes.length === 0 && (
        <span className="text-[11px] italic text-text-subtle">— none —</span>
      )}
      {nodes.map((n) => (
        <div key={n.id} className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-text-subtle">{n.operatorId}</span>
          <span className="text-xs text-text">{n.name}</span>
        </div>
      ))}
    </div>
  );
}
