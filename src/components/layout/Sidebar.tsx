import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brand } from '@/components/Brand';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { NAV_GROUPS } from '@/lib/nav';
import { cn } from '@/lib/cn';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { SPRING, EASE, DURATION } from '@/lib/motion';

const EXPANDED_W = 240;
const COLLAPSED_W = 56;

export function Sidebar() {
  const { collapsed } = useSidebarStore();

  return (
    <motion.aside
      animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
      transition={SPRING.layout}
      className="sidebar-pattern relative flex shrink-0 flex-col border-r border-sidebar-border text-sidebar-text"
    >
      <div className={cn('flex h-14 items-center px-4', collapsed && 'justify-center px-0')}>
        <Brand collapsed={collapsed} surface="dark" />
      </div>

      <nav className="flex-1 overflow-y-auto scroll-smooth px-2 py-2">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.id} className={cn(gi > 0 && 'mt-4')}>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  key="label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.18, ease: EASE.enter, delay: 0.08 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1, ease: EASE.exit } }}
                  className="px-2.5 pb-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-sidebar-text/55"
                >
                  {group.label}
                </motion.div>
              )}
            </AnimatePresence>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarLink key={item.to} item={item} collapsed={collapsed} />
              ))}
            </ul>
            {collapsed && gi < NAV_GROUPS.length - 1 && (
              <div className="my-2 mx-3 h-px bg-sidebar-border opacity-50" />
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border border-sidebar-border bg-sidebar-elevated/50 px-2 py-1 font-mono text-[10px] text-sidebar-text-muted',
            collapsed && 'justify-center w-full',
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          {!collapsed && <span>v0.1.0</span>}
        </div>
      </div>
    </motion.aside>
  );
}

function SidebarLink({
  item,
  collapsed,
}: {
  item: (typeof NAV_GROUPS)[number]['items'][number];
  collapsed: boolean;
}) {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
          collapsed && 'justify-center px-0 h-10 w-10 mx-auto',
          isActive
            // Active: gradient-end accent wash (the second prominent theme color — coral on Strata, hot pink on Electric Violet, champagne on Burgundy, etc.)
            ? 'bg-[color-mix(in_srgb,var(--color-grad-to)_35%,transparent)] text-sidebar-text font-semibold'
            // Inactive: white at 80% opacity, with hover preview of the same accent wash
            : 'text-sidebar-text/80 hover:bg-[color-mix(in_srgb,var(--color-grad-to)_16%,transparent)] hover:text-sidebar-text',
        )
      }
      aria-current={undefined /* let NavLink set it via render prop fn below */}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-bar"
              className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r"
              style={{ backgroundColor: 'var(--color-grad-to)' }}
              transition={SPRING.default}
            />
          )}
          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0, transition: { duration: DURATION.fast, ease: EASE.enter, delay: 0.06 } }}
                exit={{ opacity: 0, x: -4, transition: { duration: 0.1, ease: EASE.exit } }}
                className="truncate"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return <li>{link}</li>;

  return (
    <li>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    </li>
  );
}
