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
 * Wordmark + glyph. On dark sidebars, the glyph is wrapped in a gradient
 * "brand mark" tile (primary → brand-accent-2) with a soft AI-glow shadow —
 * matches manager's launchpad-v4 .brand-mark pattern.
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
    <div className={cn('flex items-center gap-2.5', className)}>
      {surface === 'dark' ? (
        <span
          className="bg-brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-ai-glow"
          aria-hidden="true"
        >
          <BrandGlyph surface="dark" size={18} className="!text-white" />
        </span>
      ) : (
        <BrandGlyph surface="light" />
      )}
      {!collapsed && (
        <span
          className={cn(
            'font-serif leading-none',
            surface === 'dark' ? 'text-base font-bold text-sidebar-text' : 'text-lg text-brand',
          )}
        >
          DTX
        </span>
      )}
    </div>
  );
}
