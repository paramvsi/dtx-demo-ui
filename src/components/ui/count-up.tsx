import { useEffect, useState } from 'react';
import { animate, useMotionValue, useTransform, motion } from 'framer-motion';

interface CountUpProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

/**
 * Count-up number animation. Counts from 0 to `value` on mount.
 * Re-counts whenever `value` changes (e.g. live metric updates).
 */
export function CountUp({ value, duration = 0.9, format, className }: CountUpProps) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(format ? format(0) : '0');
  const rounded = useTransform(motionValue, (n) => Math.round(n));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [value, duration, motionValue]);

  useEffect(() => {
    return rounded.on('change', (n) => {
      setDisplay(format ? format(n) : n.toLocaleString());
    });
  }, [rounded, format]);

  return <motion.span className={className}>{display}</motion.span>;
}
