import { cn } from '@/lib/cn';

/**
 * Brand glyph — three stacked rhombuses with descending opacity.
 * Color comes from `currentColor`, so wrapping in `text-brand` (or any token)
 * makes it adapt to whichever theme is active.
 */
export function BrandGlyph({ className, size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-brand', className)}
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
  className,
}: {
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <BrandGlyph />
      {!collapsed && (
        <span className="font-serif text-lg leading-none text-brand">DTX</span>
      )}
    </div>
  );
}
