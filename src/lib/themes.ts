/**
 * Themes for the DTX UI demo.
 *
 * Curated dropdown order (per user request):
 *   1. Studio Mono · 2. Neural Midnight · 3. Electric Violet · 4. Sunset Coral
 *   5. Strata · 6. Burgundy Gold · 7. Phosphor · then everything else.
 *
 * Adding a new theme is a 3-step job (no component changes):
 *   1. Create src/styles/themes/{id}.css matching the @theme contract in globals.css
 *   2. Import it from src/styles/globals.css
 *   3. Add the entry below
 *
 * The 5-swatch preview shows: canvas / sidebar / brand / primary / success
 * — the colors that catch the most theme-related component bugs at a glance.
 *
 * Every theme is WCAG AA-validated:
 *   - body text on canvas ≥ 4.5:1
 *   - sidebar text on sidebar ≥ 4.5:1
 *   - brand wordmark on canvas ≥ 4.5:1 (via --brand, the canvas-safe variant)
 *   - focus ring on canvas ≥ 3:1
 *   - --brand-on-dark holds the iconic mood-board color for use on dark sidebars
 *
 * Each theme also defines:
 *   - --brand-accent-1/2/3 (gradient stops + sidebar active bar)
 *   - --grad-from / via / to (3-stop gradient for hero AI banners + bar charts)
 *   - --primary-soft / soft-strong (semi-transparent primary for icons + soft buttons)
 *   - --ai-signal / ai-glow (pulse dots, glowing CTA shadows)
 *   - --surface-3 (4th depth layer)
 *   - --brand-deep / brand-deep-2 (sidebar pattern gradient stops)
 */
export const THEMES = [
  // ── Curated top-of-dropdown sequence ─────────────────────────────────────
  {
    id: 'studio-mono',
    name: 'Studio Mono',
    description: 'Neutral gray, near-black brand with magenta + violet accents. Design-tool mood.',
    swatches: ['#EEEEEF', '#18181B', '#18181B', '#18181B', '#00A878'],
  },
  {
    id: 'neural-midnight',
    name: 'Neural Midnight',
    description: 'Cool gray canvas, violet + cyan accents, near-black sidebar. Tech / AI mood.',
    swatches: ['#F2F2F5', '#0A0B0F', '#7C5CFF', '#7C5CFF', '#00A878'],
  },
  {
    id: 'electric-violet',
    name: 'Electric Violet',
    description: 'Cream canvas, violet brand, hot pink accents, deep plum sidebar. The launchpad-v4 default.',
    swatches: ['#F5F0E6', '#1A0E33', '#7B2CFF', '#7B2CFF', '#00A878'],
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral',
    description: 'Coral-pink cream, electric coral brand with pink + violet accents. Warm-modern.',
    swatches: ['#FBE5E0', '#2A0820', '#C73D2A', '#FF5A57', '#00B886'],
  },
  {
    id: 'strata',
    name: 'Strata',
    description: 'Deep navy-teal with orange brand identity. Databricks territory.',
    swatches: ['#F5F5F5', '#0E2A3A', '#FF3621', '#0E2A3A', '#16A34A'],
  },
  {
    id: 'burgundy-gold',
    name: 'Burgundy Gold',
    description: 'Gold-cream canvas, burgundy brand, champagne accent. Heritage with gradient.',
    swatches: ['#F8EDD8', '#2A0508', '#95122C', '#95122C', '#7A8B3E'],
  },
  {
    id: 'phosphor',
    name: 'Phosphor',
    description: 'Near-black with electric green. Terminal / observability territory.',
    swatches: ['#FAFAF9', '#09090B', '#22C55E', '#09090B', '#22C55E'],
  },

  // ── The rest ──────────────────────────────────────────────────────────────
  {
    id: 'atlas-blue',
    name: 'Atlas Blue',
    description: 'Cool blue-gray canvas, royal blue brand with violet + green accents. Corporate-modern.',
    swatches: ['#ECF0F5', '#0B1220', '#0F4C9C', '#0F4C9C', '#00875A'],
  },
  {
    id: 'quantum-mint',
    name: 'Quantum Mint',
    description: 'Pale mint canvas, deep mint brand with violet accent. Biotech / AI-life-sciences.',
    swatches: ['#E2F5EC', '#052013', '#00786F', '#00B886', '#00B886'],
  },
  {
    id: 'cobalt-electric',
    name: 'Cobalt Electric',
    description: 'Pale lavender canvas, electric cobalt brand. High-energy SaaS.',
    swatches: ['#E5E5FB', '#00033D', '#0033FF', '#0033FF', '#00B886'],
  },
  {
    id: 'indigo-butter',
    name: 'Indigo Butter',
    description: 'Cream canvas, deep indigo brand, butter-yellow accent. Bold complementary.',
    swatches: ['#F4EFDE', '#0E0833', '#1A0B4D', '#1A0B4D', '#15803D'],
  },
  {
    id: 'cherry-vanilla',
    name: 'Cherry Vanilla',
    description: 'Warm cream canvas, deep cherry brand, coral + camel accents. Refined heritage.',
    swatches: ['#EFE5D6', '#2A0A0E', '#8B0A1F', '#8B0A1F', '#5C7C5A'],
  },
  {
    id: 'juniper-gold',
    name: 'Juniper Gold',
    description: 'Cream canvas, deep forest brand with sage + gold accents. Library / herbarium.',
    swatches: ['#EEE8D2', '#0F2818', '#1F3D2B', '#1F3D2B', '#5B8C6E'],
  },
  {
    id: 'sage-inverted',
    name: 'Sage Inverted',
    description: 'White canvas with deep teal-green sidebar. Sage as brand + primary accent.',
    swatches: ['#FFFFFF', '#142A22', '#4A6F58', '#4A6F58', '#15803D'],
  },
  {
    id: 'boomi',
    name: 'Boomi',
    description: 'Boomi.com palette: deep navy sidebar, periwinkle indigo brand + CTAs, white canvas.',
    swatches: ['#FFFFFF', '#0E2347', '#5B5FE5', '#5B5FE5', '#15803D'],
  },
  {
    id: 'omniforce',
    name: 'Omniforce',
    description: 'Indigo-black sidebar with magenta-pink brand. SaaS-AI energy.',
    swatches: ['#FFFFFF', '#0A0E2A', '#B8336B', '#0A0E2A', '#15803D'],
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    description: 'Royal violet sidebar with vivid lemon-yellow accent. Bold complementary.',
    swatches: ['#FFFFFF', '#5B1F8E', '#5B1F8E', '#5B1F8E', '#15803D'],
  },
  {
    id: 'unimax',
    name: 'UniMax',
    description: 'Dark teal-navy sidebar with champagne gold on warm cream. Editorial luxury.',
    swatches: ['#FAF7F0', '#0A2E2C', '#92580E', '#0A2E2C', '#15803D'],
  },
  {
    id: 'ov-teal',
    name: 'OV Teal',
    description: 'Muted teal sidebar with cream wordmark on white. Calm editorial-tech.',
    swatches: ['#FFFFFF', '#2D5A56', '#2D5A56', '#2D5A56', '#15803D'],
  },
  {
    id: 'gravitas',
    name: 'Gravitas',
    description: 'Deep navy sidebar with vivid coral brand on white. Recruitment-energetic.',
    swatches: ['#FFFFFF', '#1A2756', '#C73D1F', '#1A2756', '#15803D'],
  },
  {
    id: 'audi',
    name: 'Audi',
    description: 'Premium auto: Audi red on near-black + metallic silver surfaces.',
    swatches: ['#F5F5F5', '#1A1A1A', '#BB0A30', '#1A1A1A', '#15803D'],
  },
  {
    id: 'sage',
    name: 'Sage',
    description: 'Pale sky-mint canvas with sage-green primary. Calm professional / health-tech.',
    swatches: ['#ECF2EE', '#DDE7E2', '#4A6F58', '#4A6F58', '#15803D'],
  },
  {
    id: 'xanthous',
    name: 'Xanthous',
    description: 'Burgundy chrome with golden brand on warm cream. Vintage upscale.',
    swatches: ['#FAF7F0', '#780115', '#92580E', '#780115', '#15803D'],
  },
  {
    id: 'tricolor',
    name: 'Tricolor',
    description: 'Cherry red, navy, and steel on white. Editorial / Americana.',
    swatches: ['#FFFFFF', '#003049', '#C1121F', '#003049', '#15803D'],
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Monochromatic deep-to-light purple ramp. Luxe / fragrance.',
    swatches: ['#FFFFFF', '#5A189A', '#5A189A', '#5A189A', '#15803D'],
  },
  {
    id: 'vesper',
    name: 'Vesper',
    description: 'Deep purple gradient fading to near-black. Tech / luxe.',
    swatches: ['#FFFFFF', '#4A0080', '#4A0080', '#4A0080', '#15803D'],
  },
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
  {
    id: 'slate',
    name: 'Slate',
    description: 'Modern slate grays with a single blue accent. Linear / Vercel territory.',
    swatches: ['#FFFFFF', '#0F172A', '#2563EB', '#0F172A', '#16A34A'],
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

export const DEFAULT_THEME: ThemeId = 'electric-violet';

export function getTheme(id: ThemeId): Theme {
  const found = THEMES.find((t) => t.id === id);
  if (!found) throw new Error(`Unknown theme: ${id}`);
  return found;
}
