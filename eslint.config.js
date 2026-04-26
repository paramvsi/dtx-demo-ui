import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * Theme-contract guardrail: components MUST use semantic tokens (`bg-canvas`,
 * `text-text`, `bg-primary`, `border-border`, `bg-cat-source`, etc.). Using raw
 * Tailwind colors silently breaks the live theme switcher because raw colors
 * don't change when `data-theme` flips.
 *
 * This rule fails if any string literal in a component file contains a raw
 * Tailwind color class. Theme CSS files are exempt via globalIgnores below.
 */
const FORBIDDEN_COLOR_RE =
  /\b(?:bg|text|border|ring|fill|stroke|outline|divide|placeholder|from|via|to|shadow|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'src/styles/**', 'src/pages/ThemeSandbox.tsx']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=/${FORBIDDEN_COLOR_RE.source}/]`,
          message:
            'Raw Tailwind color classes break the theme switcher. Use semantic tokens (bg-primary, text-text, border-border, bg-cat-source, bg-success-wash, etc.) defined in src/styles/globals.css.',
        },
        {
          selector: `TemplateElement[value.cooked=/${FORBIDDEN_COLOR_RE.source}/]`,
          message:
            'Raw Tailwind color classes break the theme switcher. Use semantic tokens (bg-primary, text-text, border-border, bg-cat-source, bg-success-wash, etc.) defined in src/styles/globals.css.',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
  {
    // shadcn primitives commonly co-export variants alongside components.
    // Canvas node registry exports a typed map alongside the components.
    files: [
      'src/components/ui/**/*.{ts,tsx}',
      'src/components/canvas/nodes/index.tsx',
      'src/components/canvas/OperatorIcon.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
]);
