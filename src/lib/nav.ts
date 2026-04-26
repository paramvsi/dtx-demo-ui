import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Database,
  GitBranch,
  Layers,
  KeyRound,
  Network,
  Shapes,
  Sparkles,
  UserCog,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'data',
    label: 'Data',
    items: [
      { label: 'Schemas', to: '/schemas', icon: Shapes },
      { label: 'Synthetic data', to: '/synthetic-data', icon: Sparkles },
    ],
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    items: [
      { label: 'Pipelines', to: '/pipelines', icon: Workflow },
      { label: 'Designer', to: '/pipeline-designer', icon: GitBranch },
    ],
  },
  {
    id: 'infra',
    label: 'Infra',
    items: [
      { label: 'Kafka', to: '/kafka', icon: Zap },
      { label: 'Cache', to: '/cache', icon: Layers },
    ],
  },
  {
    id: 'observability',
    label: 'Observability',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
      { label: 'Pipeline events', to: '/observability', icon: Activity },
    ],
  },
  {
    id: 'access',
    label: 'Access',
    items: [
      { label: 'Users', to: '/access/users', icon: Users },
      { label: 'Groups', to: '/access/groups', icon: Network },
      { label: 'Roles', to: '/access/roles', icon: KeyRound },
    ],
  },
];

// Re-export for ad-hoc imports
export { Database, UserCog };
