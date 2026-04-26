import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { T } from '@/lib/motion';

/**
 * AppShell — used by every page EXCEPT /pipeline-designer (full-screen canvas).
 */
export function AppShell() {
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas text-text">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:border focus:border-border-focus focus:bg-surface focus:px-3 focus:py-1.5 focus:text-xs focus:text-text"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="main-content" className="relative flex-1 overflow-y-auto scroll-smooth" tabIndex={-1}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: T.pageEnter }}
              exit={{ opacity: 0, y: -6, transition: T.pageExit }}
              className="px-6 py-6 md:px-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
