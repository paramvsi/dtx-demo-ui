/**
 * Day-one themes for the DTX UI demo.
 * Adding a new theme is a 3-step job (no component changes):
 *   1. Create src/styles/themes/{id}.css matching the @theme contract in globals.css
 *   2. Import it from src/styles/globals.css
 *   3. Add the entry below
 *
 * The 5-swatch preview shows: canvas / sidebar / brand / primary / success
 * — the colors that catch the most theme-related component bugs at a glance.
 */
export const THEMES = [
  {
    id: 'strata',
    name: 'Strata',
    description: 'Deep navy-teal with orange brand identity. Databricks territory.',
    swatches: ['#F5F5F5', '#0E2A3A', '#FF3621', '#0E2A3A', '#16A34A'],
  },
  {
    id: 'slate',
    name: 'Slate',
    description: 'Modern slate grays with a single blue accent. Linear / Vercel territory.',
    swatches: ['#FFFFFF', '#0F172A', '#2563EB', '#0F172A', '#16A34A'],
  },
  {
    id: 'phosphor',
    name: 'Phosphor',
    description: 'Near-black with electric green. Terminal / observability territory.',
    swatches: ['#FAFAF9', '#09090B', '#22C55E', '#09090B', '#22C55E'],
  },
  {
    id: 'plate',
    name: 'Plate',
    description: 'Warm porcelain with muted bronze. Editorial / print territory.',
    swatches: ['#FAFAF7', '#3F3F46', '#B45309', '#3F3F46', '#15803D'],
  },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeId = 'strata';

export function getTheme(id: ThemeId): Theme {
  const found = THEMES.find((t) => t.id === id);
  if (!found) throw new Error(`Unknown theme: ${id}`);
  return found;
}
