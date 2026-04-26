import { SiApachekafka, SiPostgresql } from 'react-icons/si';
import {
  LuShieldCheck,
  LuShuffle,
  LuShieldAlert,
  LuFingerprint,
  LuGitBranch,
} from 'react-icons/lu';
import type { ComponentType } from 'react';
import { cn } from '@/lib/cn';
import type { OperatorCategory } from '@/lib/types';

interface IconSpec {
  Icon: ComponentType<{ className?: string; size?: number | string }>;
  /** Brand-accurate hex (Kafka black, Postgres blue, etc) — used only when `branded` is true */
  brandColor?: string;
  branded: boolean;
}

/**
 * Per-operator icon mapping. Real brand logos for operators that *are* a
 * specific brand (Kafka, JDBC=Postgres). Tasteful generic glyphs for abstract
 * operators (DQ / Transform / Privacy / Identity / Routing).
 *
 * Keyed by operator id so adding a new operator means adding a row here.
 */
const OPERATOR_ICONS: Record<string, IconSpec> = {
  'SRC-01': { Icon: SiApachekafka, brandColor: '#231F20', branded: true },
  'SRC-02': { Icon: SiPostgresql, brandColor: '#336791', branded: true },
  'DQ-01':  { Icon: LuShieldCheck,  branded: false },
  'TR-01':  { Icon: LuShuffle,      branded: false },
  'PV-02':  { Icon: LuShieldAlert,  branded: false },
  'ID-01':  { Icon: LuFingerprint,  branded: false },
  'RT-02':  { Icon: LuGitBranch,    branded: false },
  'SNK-01': { Icon: SiApachekafka, brandColor: '#231F20', branded: true },
};

/**
 * Categorical color is used for the icon tint when the operator is *not*
 * branded. Keeps abstract operators visually consistent with their category.
 */
const CATEGORY_COLOR: Record<OperatorCategory, string> = {
  source:    'text-cat-source',
  transform: 'text-cat-transform',
  dq:        'text-cat-dq',
  privacy:   'text-cat-privacy',
  identity:  'text-cat-identity',
  routing:   'text-cat-routing',
  sink:      'text-cat-sink',
};

interface OperatorIconProps {
  operatorId: string;
  category: OperatorCategory;
  size?: number;
  className?: string;
  /** When true, render as flat monochrome (e.g. inside palette tiles where the tile chrome carries the color) */
  flat?: boolean;
}

export function OperatorIcon({
  operatorId,
  category,
  size = 32,
  className,
  flat = false,
}: OperatorIconProps) {
  const spec = OPERATOR_ICONS[operatorId];
  if (!spec) {
    return (
      <div
        className={cn('rounded-md bg-surface-2', className)}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  const { Icon, brandColor, branded } = spec;

  if (branded && !flat && brandColor) {
    return (
      <span style={{ color: brandColor, lineHeight: 0 }} aria-hidden="true">
        <Icon size={size} className={cn('shrink-0', className)} />
      </span>
    );
  }

  return (
    <span
      className={cn('shrink-0', flat ? 'text-text-muted' : CATEGORY_COLOR[category])}
      style={{ lineHeight: 0 }}
      aria-hidden="true"
    >
      <Icon size={size} {...(className ? { className } : {})} />
    </span>
  );
}

export function isBrandedOperator(operatorId: string): boolean {
  return OPERATOR_ICONS[operatorId]?.branded ?? false;
}
