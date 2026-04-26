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
        if (state?.theme) {
          applyToDom(state.theme);
        } else {
          applyToDom(DEFAULT_THEME);
        }
      },
    },
  ),
);
