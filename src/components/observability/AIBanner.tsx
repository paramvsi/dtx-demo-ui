import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface AIBannerProps {
  label?: string;
  title: string;
  description: string;
  stats?: Array<{ value: string; label: string }>;
  cta?: { label: string; onClick?: () => void };
  className?: string;
}

/**
 * Hero AI banner — themed 3-stop gradient driven by --color-grad-from / via / to.
 * Each theme paints a different gradient story (violet→pink, mint→violet,
 * burgundy→gold, etc.). Mounted at the top of the Dashboard so the modern
 * design language reads on first load.
 *
 * Pattern from launchpad-v4.html lines 254–269.
 */
export function AIBanner({
  label = 'AI signal · live',
  title,
  description,
  stats,
  cta,
  className,
}: AIBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl px-7 py-6 mb-6 text-white shadow-ai-glow-lg bg-brand-gradient',
        className,
      )}
    >
      {/* Soft radial highlight in top-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18) 0%, transparent 50%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 backdrop-blur-md mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white ai-pulse" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.08em]">{label}</span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight md:text-2xl mb-1.5">
            {title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white/90">
            {description}
          </p>
        </div>

        {stats && stats.length > 0 && (
          <div className="flex shrink-0 items-center gap-7">
            {stats.map((s) => (
              <div key={s.label} className="text-right">
                <div className="font-mono text-2xl font-bold tabular-nums leading-none">
                  {s.value}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-white/80">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {cta && (
          <Button
            onClick={cta.onClick}
            size="md"
            className="shrink-0 border-0 bg-white text-text hover:bg-white/95 font-bold"
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
            {cta.label}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
