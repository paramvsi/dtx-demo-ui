import { THEMES, type ThemeId } from '@/lib/themes';
import { useThemeStore } from '@/stores/useThemeStore';

/**
 * Phase 0 sandbox — every semantic token rendered as a swatch.
 * If switching theme repaints all swatches smoothly, the contract is sound.
 * Replaced by AppShell routing in Phase 1; kept here for the demo verification step.
 */

const SURFACE_TOKENS = [
  'bg-canvas',
  'bg-surface',
  'bg-surface-2',
  'bg-sidebar',
  'bg-sidebar-elevated',
] as const;

const TEXT_TOKENS = [
  'text-text',
  'text-text-muted',
  'text-text-subtle',
] as const;

const BORDER_TOKENS = [
  'border-border',
  'border-border-strong',
  'border-border-focus',
] as const;

const FUNCTIONAL_TOKENS = [
  'bg-primary text-primary-fg',
  'bg-info text-white',
  'bg-success text-white',
  'bg-warning text-white',
  'bg-danger text-white',
] as const;

const WASH_TOKENS = [
  'bg-info-wash text-info-fg',
  'bg-success-wash text-success-fg',
  'bg-warning-wash text-warning-fg',
  'bg-danger-wash text-danger-fg',
] as const;

const CATEGORICAL_TOKENS = [
  'bg-cat-source',
  'bg-cat-transform',
  'bg-cat-dq',
  'bg-cat-privacy',
  'bg-cat-identity',
  'bg-cat-routing',
  'bg-cat-sink',
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-text-subtle mb-3">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {children}
      </div>
    </section>
  );
}

function Swatch({ classes, label }: { classes: string; label: string }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-surface">
      <div className={`${classes} h-16 flex items-center justify-center font-mono text-xs`}>
        {label.includes('text-') ? label : null}
      </div>
      <div className="px-3 py-2 text-xs font-mono text-text-muted truncate">{label}</div>
    </div>
  );
}

export default function ThemeSandbox() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-canvas text-text">
      <header className="border-b border-border bg-surface px-8 py-5 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-serif text-2xl text-brand">DTX</div>
            <div className="font-mono text-xs uppercase tracking-wider text-text-subtle mt-0.5">
              dtx · theme contract sandbox · phase 0
            </div>
          </div>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as ThemeId)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                  theme === t.id
                    ? 'bg-primary text-primary-fg border-primary'
                    : 'bg-surface text-text border-border hover:border-border-strong'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-8 p-5 rounded-lg bg-surface border border-border">
          <div className="font-serif text-xl text-brand mb-1">DTX wordmark — brand color</div>
          <p className="text-sm text-text-muted">
            The brand color (<span className="font-mono">--color-brand</span>) appears only in the
            wordmark and the brand glyph. In Strata it&apos;s orange; in Slate it collapses with
            primary blue; in Phosphor it&apos;s electric green; in Plate it&apos;s muted bronze.
            Toggle themes above and watch all chrome repaint while the structure holds.
          </p>
        </div>

        <Section title="Surfaces">
          {SURFACE_TOKENS.map((c) => (
            <Swatch key={c} classes={c} label={c} />
          ))}
        </Section>

        <Section title="Text colors">
          {TEXT_TOKENS.map((c) => (
            <div key={c} className="rounded-lg border border-border overflow-hidden bg-surface">
              <div className={`${c} h-16 px-3 flex items-center font-medium`}>The quick brown fox</div>
              <div className="px-3 py-2 text-xs font-mono text-text-muted truncate">{c}</div>
            </div>
          ))}
        </Section>

        <Section title="Borders">
          {BORDER_TOKENS.map((c) => (
            <div key={c} className="rounded-lg overflow-hidden bg-surface">
              <div className={`${c} border-2 h-16 flex items-center justify-center font-mono text-xs text-text-muted`}>
                {c}
              </div>
            </div>
          ))}
        </Section>

        <Section title="Functional">
          {FUNCTIONAL_TOKENS.map((c) => (
            <Swatch key={c} classes={c} label={c} />
          ))}
        </Section>

        <Section title="Status washes">
          {WASH_TOKENS.map((c) => (
            <Swatch key={c} classes={c} label={c} />
          ))}
        </Section>

        <Section title="Categorical (operator types)">
          {CATEGORICAL_TOKENS.map((c) => (
            <Swatch key={c} classes={`${c} text-white`} label={c} />
          ))}
        </Section>
      </main>
    </div>
  );
}
