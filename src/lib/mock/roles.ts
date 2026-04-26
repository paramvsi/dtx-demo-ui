import type { Role, UserRole } from '@/lib/types';
import { USERS } from '@/lib/mock/users';

const RESOURCES = ['Pipelines', 'Schemas', 'Users', 'Kafka', 'Cache', 'TRA Audit'];

function userCount(role: UserRole): number {
  return USERS.filter((u) => u.role === role).length;
}

export const ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access across every resource. Can manage other users and roles.',
    userCount: userCount('admin'),
    permissions: RESOURCES.map((resource) => ({ resource, read: true, write: true, admin: true })),
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Can design, deploy, and modify pipelines. Read-only on Users and TRA Audit.',
    userCount: userCount('editor'),
    permissions: [
      { resource: 'Pipelines', read: true, write: true, admin: false },
      { resource: 'Schemas', read: true, write: true, admin: false },
      { resource: 'Users', read: true, write: false, admin: false },
      { resource: 'Kafka', read: true, write: true, admin: false },
      { resource: 'Cache', read: true, write: true, admin: false },
      { resource: 'TRA Audit', read: true, write: false, admin: false },
    ],
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access. Can browse pipelines, schemas, and observability dashboards.',
    userCount: userCount('viewer'),
    permissions: RESOURCES.map((resource) => ({ resource, read: true, write: false, admin: false })),
  },
  {
    id: 'pipeline-operator',
    name: 'Pipeline Operator',
    description: 'On-call NOC role. Can deploy, revert, and pause pipelines but cannot modify schemas.',
    userCount: userCount('pipeline-operator'),
    permissions: [
      { resource: 'Pipelines', read: true, write: true, admin: false },
      { resource: 'Schemas', read: true, write: false, admin: false },
      { resource: 'Users', read: true, write: false, admin: false },
      { resource: 'Kafka', read: true, write: false, admin: false },
      { resource: 'Cache', read: true, write: false, admin: false },
      { resource: 'TRA Audit', read: true, write: false, admin: false },
    ],
  },
];

export function getRole(id: UserRole): Role | undefined {
  return ROLES.find((r) => r.id === id);
}
