import type { Transition, Variants } from 'framer-motion';

/**
 * Calm & polished motion language for the DTX demo.
 *
 * Springs with low-ish stiffness + medium-high damping read as "glide."
 * Cubic-béziers with strong deceleration read as "settled."
 *
 * Rule of thumb: exits should be ~30% faster than entries.
 *   entry  ≈ 240–320ms
 *   exit   ≈ 160–200ms
 */

export const SPRING = {
  default: { type: 'spring', stiffness: 180, damping: 22, mass: 0.9 } satisfies Transition,
  soft:    { type: 'spring', stiffness: 140, damping: 24, mass: 1.0 } satisfies Transition,
  snappy:  { type: 'spring', stiffness: 260, damping: 26, mass: 0.7 } satisfies Transition,
  layout:  { type: 'spring', stiffness: 220, damping: 24, mass: 0.85 } satisfies Transition,
} as const;

export const EASE = {
  out:    [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut:  [0.65, 0, 0.35, 1] as [number, number, number, number],
  // Material "emphasized decelerate" — the entry standard
  enter:  [0.16, 1, 0.3, 1]  as [number, number, number, number],
  // Sharp exit — quicker to disappear than to arrive
  exit:   [0.4, 0, 1, 1]     as [number, number, number, number],
} as const;

export const DURATION = {
  fast: 0.18,
  base: 0.26,
  slow: 0.32,
} as const;

// Convenience transition presets (use these in `transition={...}` props)
export const T = {
  pageEnter:   { duration: DURATION.base, ease: EASE.enter } satisfies Transition,
  pageExit:    { duration: DURATION.fast, ease: EASE.exit }  satisfies Transition,
  drawerEnter: { duration: DURATION.base, ease: EASE.enter } satisfies Transition,
  drawerExit:  { duration: 0.2,           ease: EASE.exit }  satisfies Transition,
  hover:       { duration: DURATION.fast, ease: EASE.out }   satisfies Transition,
  fade:        { duration: 0.2,           ease: EASE.out }   satisfies Transition,
};

// Variants — co-locate with the motion primitives that consume them
export const fadeUp: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: T.pageEnter },
  exit:    { opacity: 0, y: -6, transition: T.pageExit },
};

export const slideRight: Variants = {
  initial: { x: 32, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: T.drawerEnter },
  exit:    { x: 32, opacity: 0, transition: T.drawerExit },
};

export const slideLeft: Variants = {
  initial: { x: -32, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: T.drawerEnter },
  exit:    { x: -32, opacity: 0, transition: T.drawerExit },
};

export const popIn: Variants = {
  initial: { scale: 0.94, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: SPRING.snappy },
  exit:    { scale: 0.94, opacity: 0, transition: T.pageExit },
};

export const pulseOnce: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.04, 1],
    transition: { duration: 0.45, ease: EASE.inOut },
  },
};

export const stagger: Variants = {
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

// Legacy alias — old code referenced `transition.easeOut` etc.
export const transition = {
  spring: SPRING.default,
  springSoft: SPRING.soft,
  easeOut: T.fade,
};
