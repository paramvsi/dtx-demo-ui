import { Construction } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

interface PlaceholderProps {
  title: string;
  subtitle?: string;
  phase: string;
}

/**
 * Tasteful placeholder shown for routes whose page hasn't been built yet.
 * Replaced phase by phase per the plan file.
 */
export default function Placeholder({ title, subtitle, phase }: PlaceholderProps) {
  return (
    <div>
      <PageHeader title={title} {...(subtitle ? { subtitle } : {})} />
      <div className="rounded-lg border border-dashed border-border bg-surface p-10 text-center">
        <Construction
          className="mx-auto h-8 w-8 text-text-subtle"
          strokeWidth={1.5}
        />
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-text-subtle">
          {phase}
        </p>
        <p className="mt-2 text-sm text-text-muted">
          This surface lands in a later phase. The route is reserved.
        </p>
      </div>
    </div>
  );
}
