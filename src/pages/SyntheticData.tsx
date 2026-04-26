import { useState } from 'react';
import { Sparkles, Lock, Play, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSyntheticJobs, useSchemas } from '@/lib/queries';
import { cn } from '@/lib/cn';

export default function SyntheticData() {
  const { data: jobs, isLoading } = useSyntheticJobs();
  const { data: schemas } = useSchemas();
  const [generating, setGenerating] = useState(false);
  const [recordCount, setRecordCount] = useState(10000);
  const [schemaId, setSchemaId] = useState<string>('cdr_voice_v2');
  const [piiMasking, setPiiMasking] = useState(true);

  const onGenerate = () => {
    toast.success(`Synthetic job queued · ${recordCount.toLocaleString()} records`, {
      description: `Schema ${schemaId} · TRA-compliant PII masking ${piiMasking ? 'on' : 'off'}`,
    });
    setGenerating(false);
  };

  return (
    <div>
      <PageHeader
        title="Synthetic data"
        subtitle="Generate realistic synthetic datasets with TRA-compliant PII masking."
        actions={
          <Button onClick={() => setGenerating(true)}>
            <Sparkles className="h-4 w-4" />
            Generate dataset
          </Button>
        }
      />

      {isLoading ? (
        <SyntheticSkeleton />
      ) : (
        <div className="space-y-3">
          {jobs?.map((job) => {
            const pct = job.recordCount > 0 ? (job.generated / job.recordCount) * 100 : 0;
            const StatusIcon =
              job.status === 'running' ? Play : job.status === 'completed' ? CheckCircle2 : XCircle;
            const variant: 'primary' | 'success' | 'danger' =
              job.status === 'completed' ? 'success' : job.status === 'failed' ? 'danger' : 'primary';

            return (
              <motion.div
                key={job.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          job.status === 'completed'
                            ? 'text-success-fg'
                            : job.status === 'failed'
                              ? 'text-danger-fg'
                              : 'text-info-fg',
                        )}
                        strokeWidth={2}
                      />
                      <div className="text-sm font-medium text-text truncate">{job.name}</div>
                      {job.piiMasking && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cat-privacy/15 px-1.5 py-0 text-[10px] text-cat-privacy">
                          <Lock className="h-2.5 w-2.5" strokeWidth={2.5} />
                          PII masked
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 font-mono text-[11px] text-text-subtle">
                      <span>schema · {job.schemaId}</span>
                      <span>started {job.startedAt}</span>
                      {job.estimatedFinish && job.status === 'running' && <span>ETA {job.estimatedFinish}</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-sm font-semibold tabular-nums text-text">
                      {job.generated.toLocaleString()}
                      <span className="text-text-subtle"> / {job.recordCount.toLocaleString()}</span>
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">
                      {pct.toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={pct} variant={variant} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Sheet open={generating} onOpenChange={setGenerating}>
        <SheetContent>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-text-subtle">Generate</div>
            <div className="mt-1 text-base font-semibold text-text">New synthetic dataset</div>
            <p className="mt-1 text-xs text-text-muted">
              Synthesizes records matching the chosen schema with TRA-compliant masking.
            </p>
          </div>

          <div className="my-4 border-t border-border" />

          <div className="space-y-4">
            <div>
              <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
                Schema
              </div>
              <Select value={schemaId} onValueChange={setSchemaId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {schemas?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
                Record count
              </div>
              <Input
                type="number"
                value={recordCount}
                onChange={(e) => setRecordCount(parseInt(e.target.value || '0', 10))}
                mono
                min={100}
                max={10_000_000}
                step={1000}
              />
            </div>

            <label className="flex items-start gap-2 rounded-md border border-border bg-surface p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={piiMasking}
                onChange={(e) => setPiiMasking(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-current text-primary"
              />
              <div className="flex-1">
                <div className="text-xs font-medium text-text">TRA-compliant PII masking</div>
                <div className="mt-0.5 text-[11px] text-text-muted">
                  Hash all PII fields per UAE TRA data protection guidelines (msisdn, emirates_id, name_ar, name_en, dob).
                </div>
              </div>
            </label>
          </div>

          <div className="mt-auto flex gap-2 pt-5">
            <Button onClick={onGenerate}>
              <Sparkles className="h-4 w-4" />
              Queue generation
            </Button>
            <Button variant="outline" onClick={() => setGenerating(false)}>Cancel</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SyntheticSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-lg border border-border bg-surface animate-pulse" />
      ))}
    </div>
  );
}
