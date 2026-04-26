/**
 * Themes for the DTX UI demo.
 *
 * Order is intentional: newest palette explorations first (top of dropdown),
 * then the four "palette image" themes from the second batch, then the four
 * original archetypes for reference.
 *
 * Adding a new theme is a 3-step job (no component changes):
 *   1. Create src/styles/themes/{id}.css matching the @theme contract in globals.css
 *   2. Import it from src/styles/globals.css
 *   3. Add the entry below
 *
 * The 5-swatch preview shows: canvas / sidebar / brand / primary / success
 * — the colors that catch the most theme-related component bugs at a glance.
 *
 * Every theme below is WCAG AA-validated:
 *   - body text on canvas ≥ 4.5:1
 *   - sidebar text on sidebar ≥ 4.5:1
 *   - brand wordmark on canvas ≥ 4.5:1 (via --brand-on-light, the canvas-safe variant)
 *   - focus ring on canvas ≥ 3:1
 *   - --brand-on-dark holds the iconic mood-board color for use on dark sidebars
 */
export const THEMES = [
  // ── Palette-image themes (third batch) ────────────────────────────────────
  {
    id: 'xanthous',
    name: 'Xanthous',
    description: 'Burgundy chrome with golden brand on warm cream. Vintage upscale.',
    swatches: ['#FAF7F0', '#780115', '#92580E', '#780115', '#15803D'],
  },
  {
    id: 'tricolor',
    name: 'Tricolor',
    description: 'Cherry red, navy, and steel on cream. Editorial / Americana.',
    swatches: ['#FDF0D5', '#003049', '#C1121F', '#003049', '#15803D'],
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Monochromatic deep-to-light purple ramp. Luxe / fragrance.',
    swatches: ['#FFFFFF', '#5A189A', '#5A189A', '#5A189A', '#15803D'],
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    description: 'Deep wine on white. Heritage / wine-list mood.',
    swatches: ['#FFFFFF', '#95122C', '#95122C', '#95122C', '#15803D'],
  },
  {
    id: 'cherry-cola',
    name: 'Cherry Cola',
    description: 'Cherry red on vanilla cream. Vintage soda-shop heritage.',
    swatches: ['#F0E8DD', '#940002', '#940002', '#940002', '#15803D'],
  },
  {
    id: 'scuderia',
    name: 'Scuderia',
    description: 'Ferrari livery: Scuderia red sidebar with Modena yellow accents.',
    swatches: ['#FFFCF0', '#DC0000', '#DC0000', '#DC0000', '#15803D'],
  },
  {
    id: 'audi',
    name: 'Audi',
    description: 'Premium auto: Audi red on near-black + metallic silver surfaces.',
    swatches: ['#F5F5F5', '#1A1A1A', '#BB0A30', '#1A1A1A', '#15803D'],
  },
  {
    id: 'juniper',
    name: 'Juniper',
    description: 'Forest green chrome with mustard gold brand. Library / herbarium.',
    swatches: ['#F5F0E0', '#2D4F35', '#92580E', '#2D4F35', '#2D4F35'],
  },
  {
    id: 'vesper',
    name: 'Vesper',
    description: 'Deep purple gradient fading to near-black. Tech / luxe.',
    swatches: ['#FFFFFF', '#4A0080', '#4A0080', '#4A0080', '#15803D'],
  },
  {
    id: 'electric-purple',
    name: 'Electric Purple',
    description: 'Pure tech-purple #8000FF on cream canvas. SaaS-AI energy.',
    swatches: ['#F5F0E8', '#8000FF', '#8000FF', '#8000FF', '#15803D'],
  },
  {
    id: 'indigo-butter',
    name: 'Indigo Butter',
    description: 'Deep indigo with butter-yellow accent. Bold complementary.',
    swatches: ['#FBF8E8', '#200A5E', '#200A5E', '#200A5E', '#15803D'],
  },

  // ── Second batch (palette images) ─────────────────────────────────────────
  {
    id: 'blue',
    name: 'Blue',
    description: 'Brilliant primary blue on near-black sidebar. Amplitude / Stripe territory.',
    swatches: ['#FFFFFF', '#13171A', '#0052F2', '#0052F2', '#16A34A'],
  },
  {
    id: 'light-teal',
    name: 'Light Teal',
    description: 'Mint accent on pure-black chrome. Apple Watch / Oryx mood.',
    swatches: ['#FFFFFF', '#141414', '#3BECB9', '#141414', '#1A5C33'],
  },
  {
    id: 'lime-neon',
    name: 'Lime Neon',
    description: 'Chartreuse brand on near-black sidebar. MIRA / bespoke-AI energy.',
    swatches: ['#FFFFFF', '#171717', '#A3E635', '#171717', '#00786F'],
  },
  {
    id: 'purple-orange',
    name: 'Purple Orange',
    description: 'Deep purple chrome with vivid orange CTAs. Job-board / data product mood.',
    swatches: ['#FFFFFF', '#691E74', '#E34B31', '#691E74', '#71D732'],
  },

  // ── Original four ─────────────────────────────────────────────────────────
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
