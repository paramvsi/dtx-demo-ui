# DTX UI Demo

Standalone React demo of the **DTX Portal** — Data Infrastructure Management Portal. Built as a no-backend, production-grade reference that the team aligns on before changes land in the real `apps/portal` codebase.

This is the canonical sign-off surface for design, theming, and core flows. It runs entirely on in-memory mock data styled as a UAE Telco deployment (fictitious "EmiratesNet" tenant) and ships with four switchable themes (Strata · Slate · Phosphor · Plate) toggleable live in the TopBar.

> This is a **demo**, not the production codebase.

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # type-check + production build
pnpm lint         # ESLint with theme-contract guardrail
```

## Stack

React 19 · TypeScript 5.7 strict · Vite 7 · Tailwind v4 (Vite plugin, no postcss) · shadcn/ui (Radix primitives) · @xyflow/react 12 · framer-motion · zustand · @tanstack/react-query · react-hook-form + zod · sonner · cmdk · Geist + Instrument Serif. **pnpm**, lockfile committed.

## Highlights to demo

- `/dashboard` — 4 metric cards with count-up animations, throughput area chart bound to `--color-primary`, recent events table.
- `/pipelines` — 12 pipelines (UAE Telco flavored), filters by status/type, click any row to open in the Designer.
- `/pipeline-designer` — full-screen XYFlow canvas with HTML5 drag-and-drop from the operator palette, animated edges, dry-run animation, 4-tab Inspector (Configure/Execute/Logs/Lineage), pipeline tabs reorderable via framer, all keyboard shortcuts wired up.
- `/access/users` — 24 users with DiceBear avatars, role pills, drawer with role-assignment form (react-hook-form + zod).
- `/observability` — events table + per-pipeline last-24h sparkline view.
- `/schemas`, `/synthetic-data`, `/kafka`, `/cache` — full pages with detail drawers.
- TopBar **Cmd+K** — command palette searching pipelines/users/schemas/operators/themes.

## How to switch theme

Three ways:

1. **TopBar dropdown** — click the 4-dot circle and pick a theme. The choice persists in `localStorage`.
2. **Keyboard shortcut** — `Cmd+Shift+T` (or `Ctrl+Shift+T`) cycles forward through the four themes.
3. **DOM attribute** — set `data-theme="phosphor"` on `<html>` directly. Useful for screenshot automation.

The contract is in [`src/styles/globals.css`](./src/styles/globals.css). Each theme file under [`src/styles/themes/`](./src/styles/themes/) declares values for the same set of tokens; component code never references raw colors.

## How to add a new theme

Three steps. **No component changes.**

1. Create `src/styles/themes/{id}.css` matching the token contract from `globals.css`. Copy `strata.css` as a starting point.
2. Import the new file from `globals.css` (`@import "./themes/{id}.css";`).
3. Add an entry to `THEMES` in [`src/lib/themes.ts`](./src/lib/themes.ts) with `id`, `name`, `description`, and a 5-color preview swatch (canvas / sidebar / brand / primary / success).

The TopBar `ThemeSwitcher` and `Cmd+K` palette pick it up automatically.

## How to add a new operator

1. Add the entry to [`src/lib/mock/operators.ts`](./src/lib/mock/operators.ts) — id, name, category, subtitle, tags, in/out schema, full `fields[]` definition.
2. The Designer canvas auto-renders it via the matching `category` → node component map in [`src/components/canvas/nodes/index.tsx`](./src/components/canvas/nodes/index.tsx). All seven categories (`source` / `transform` / `dq` / `privacy` / `identity` / `routing` / `sink`) are covered; new categories require a new node component + `--color-cat-{id}` CSS token.
3. The Inspector's Configure tab generates the form from `fields[]` automatically — no code change there either.

## Architecture notes

- **No backend.** Mock data lives in [`src/lib/mock/`](./src/lib/mock/). React Query hooks in [`src/lib/queries/`](./src/lib/queries/) wrap each module with 200–600ms artificial latency so loading states actually render. Swapping to real APIs is a per-hook change.
- **Theme contract.** The ESLint rule in [`eslint.config.js`](./eslint.config.js) blocks raw Tailwind color classes (`bg-blue-500`, `text-slate-700`, …) in component files. Use semantic tokens (`bg-canvas`, `text-text`, `bg-primary`, `border-border`, `bg-cat-source`, etc.) only.
- **Bundle splitting.** Each route is `React.lazy()`-loaded; XYFlow and Recharts are isolated chunks via `manualChunks` in [`vite.config.ts`](./vite.config.ts). Initial JS gzipped is ~190KB before lazy chunks load.
- **Canvas DnD.** HTML5 `draggable` + `application/reactflow` payload + XYFlow's `screenToFlowPosition`. Pattern documented inline in [`PipelineCanvas.tsx`](./src/components/canvas/PipelineCanvas.tsx).
- **State.** Zustand for theme, sidebar collapse, canvas state (with undo/redo). React Query for everything that comes from `lib/mock/*`. No global redux.
- **Types.** `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` all on. No `any`.

## What's intentionally out of scope

- Vitest unit tests + Playwright canvas smoke test are scaffolded as deps but not yet authored.
- The Designer's JSON-view toggle button is wired to a tooltip; the JSON pane lands when needed.

## Project structure

See [`src/`](./src/) — directory layout matches the plan in `dtx-ui-demo-claude-code-prompt.md` section 3.
