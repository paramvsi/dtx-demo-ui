import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_THEME, THEMES, type ThemeId } from '@/lib/themes';

interface ThemeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  cycleTheme: () => void;
}

function applyToDom(theme: ThemeId): void {
  document.documentElement.dataset.theme = theme;
}

function isValidTheme(id: string): id is ThemeId {
  return THEMES.some((t) => t.id === id);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => {
        applyToDom(theme);
        set({ theme });
      },
      cycleTheme: () => {
        const current = get().theme;
        const idx = THEMES.findIndex((t) => t.id === current);
        const nextIdx = (idx + 1) % THEMES.length;
        const next = THEMES[nextIdx];
        if (next) {
          applyToDom(next.id);
          set({ theme: next.id });
        }
      },
    }),
    {
      name: 'dtx-theme',
      onRehydrateStorage: () => (state) => {
        // Persisted IDs may belong to deleted themes (e.g. scuderia, electric-purple).
        // Fall back to default cleanly so the dropdown stays in sync with the DOM.
        if (state?.theme && isValidTheme(state.theme)) {
          applyToDom(state.theme);
        } else {
          if (state) state.theme = DEFAULT_THEME;
          applyToDom(DEFAULT_THEME);
        }
      },
    },
  ),
);
