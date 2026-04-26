import { cn } from '@/lib/cn';

export type BrandSurface = 'light' | 'dark';

/**
 * Brand glyph — three stacked rhombuses with descending opacity.
 *
 * `surface` selects the brand color variant:
 *  - 'light' (default) → text-brand: canvas-safe variant (passes WCAG on
 *    light surfaces). Use anywhere the glyph sits on TopBar / canvas / cards.
 *  - 'dark' → text-brand-on-dark: iconic saturated mood-board color. Use
 *    when the glyph sits on the dark sidebar.
 *
 * For most themes the two tokens hold the same color; the split exists for
 * Phosphor / Light Teal / Lime Neon where the iconic brand color is too
 * light to pass contrast against a white surface.
 */
export function BrandGlyph({
  className,
  size = 20,
  surface = 'light',
}: {
  className?: string;
  size?: number;
  surface?: BrandSurface;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(surface === 'dark' ? 'text-brand-on-dark' : 'text-brand', className)}
      aria-hidden="true"
    >
      <path d="M4 6 L12 2 L20 6 L12 10 Z" fill="currentColor" />
      <path d="M4 11 L12 7 L20 11 L12 15 Z" fill="currentColor" opacity="0.7" />
      <path d="M4 16 L12 12 L20 16 L12 20 Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

/**
 * Wordmark + glyph. Wordmark uses font-serif (Instrument Serif) — the only
 * place serif appears in the entire app. Hides the wordmark when collapsed.
 */
export function Brand({
  collapsed = false,
  surface = 'light',
  className,
}: {
  collapsed?: boolean;
  surface?: BrandSurface;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <BrandGlyph surface={surface} />
      {!collapsed && (
        <span
          className={cn(
            'font-serif text-lg leading-none',
            surface === 'dark' ? 'text-brand-on-dark' : 'text-brand',
          )}
        >
          DTX
        </span>
      )}
    </div>
  );
}
