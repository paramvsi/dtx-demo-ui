import { useEffect } from 'react';
import { Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { THEMES, type ThemeId } from '@/lib/themes';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/lib/cn';

/**
 * Theme switcher — investor-facing control.
 * Cmd+Shift+T cycles forward through the theme list.
 * The trigger is a 28×28 button showing 4 dots in a 2×2 grid representing
 * the active theme (canvas / sidebar / brand / success).
 */
export function ThemeSwitcher() {
  const { theme, setTheme, cycleTheme } = useThemeStore();
  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0]!;

  // Cmd+Shift+T cycles forward
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'T' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        cycleTheme();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cycleTheme]);

  // Indices in active.swatches: [canvas, sidebar, brand, primary, success]
  const dotColors = [active.swatches[0], active.swatches[1], active.swatches[2], active.swatches[4]];

  return (
    <DropdownMenu>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger
            aria-label={`Theme · ${active.name}`}
            className="grid h-7 w-7 shrink-0 cursor-pointer grid-cols-2 gap-px overflow-hidden rounded-full border border-border-strong p-px transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {dotColors.map((c, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{ backgroundColor: c }}
                className="block"
              />
            ))}
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Theme · {active.name}</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="min-w-[18rem] p-2">
        <DropdownMenuLabel>Color theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((t) => {
          const isActive = t.id === theme;
          return (
            <DropdownMenuItem
              key={t.id}
              onSelect={() => setTheme(t.id as ThemeId)}
              className="flex flex-col items-start gap-1.5 px-2.5 py-2"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base leading-none">{t.name}</span>
                </div>
                {isActive && <Check className="h-3.5 w-3.5 text-text-muted" />}
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="flex gap-0.5 overflow-hidden rounded-sm border border-border">
                  {t.swatches.map((c, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      style={{ backgroundColor: c }}
                      className="block h-4 w-4"
                    />
                  ))}
                </div>
                <span className={cn('text-xs italic text-text-subtle', isActive && 'text-text-muted')}>
                  {t.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-text-subtle">
          ⇧⌘T cycles
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
