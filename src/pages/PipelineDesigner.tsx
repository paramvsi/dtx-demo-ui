import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { CanvasToolbar } from '@/components/canvas/CanvasToolbar';
import { OperatorPalette } from '@/components/canvas/OperatorPalette';
import { PipelineCanvas } from '@/components/canvas/PipelineCanvas';
import { Inspector } from '@/components/canvas/Inspector';
import { usePipelineStore } from '@/stores/usePipelineStore';

export default function PipelineDesigner() {
  const { nodes, undo, redo, triggerDryRun, newTab, dryRunActive } = usePipelineStore(
    useShallow((s) => ({
      nodes: s.nodes,
      undo: s.undo,
      redo: s.redo,
      triggerDryRun: s.triggerDryRun,
      newTab: s.newTab,
      dryRunActive: s.dryRunActive,
    })),
  );
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = e.metaKey;
      const mod = isMac || e.ctrlKey;
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (mod && e.key === 's') {
        e.preventDefault();
        toast.success('Pipeline saved');
        return;
      }
      if (mod && e.key === 'n' && !isTyping) {
        e.preventDefault();
        newTab();
        return;
      }
      if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (mod && (e.key === 'Z' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.shiftKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        if (!dryRunActive) triggerDryRun();
        return;
      }
      if (mod && e.key === 'Enter') {
        e.preventDefault();
        toast.success('Deploy queued');
        return;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo, triggerDryRun, newTab, dryRunActive]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-canvas text-text">
      <CanvasToolbar />
      <div className="flex min-h-0 flex-1">
        {/* Canvas + bottom inspector drawer (drawer overlays the canvas only) */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1">
            <PipelineCanvas />
            <Inspector />
          </div>
        </div>
        {/* Right operator library */}
        <OperatorPalette
          collapsed={paletteCollapsed}
          onCollapsedChange={setPaletteCollapsed}
        />
      </div>
      <StatusBar nodeCount={nodes.length} />
    </div>
  );
}

function StatusBar({ nodeCount }: { nodeCount: number }) {
  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t border-border bg-surface px-3 text-[10px] font-mono text-text-subtle">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          tenant: emiratesnet-prod
        </span>
        <span>last deploy 2h ago</span>
      </div>
      <div className="flex items-center gap-3">
        <span>{nodeCount} {nodeCount === 1 ? 'node' : 'nodes'}</span>
        <span>schema-registry v2.3.1</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> kafka
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> identity-graph
        </span>
        <span>⌘K</span>
      </div>
    </footer>
  );
}
