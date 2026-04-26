import type { Group } from '@/lib/types';
import { USERS } from '@/lib/mock/users';
import { PIPELINES } from '@/lib/mock/pipelines';

function membersByGroup(groupName: string): string[] {
  return USERS.filter((u) => u.group === groupName).map((u) => u.id);
}

function pipelinesByOwners(emails: string[]): string[] {
  return PIPELINES.filter((p) => emails.includes(p.ownerEmail)).map((p) => p.id);
}

export const GROUPS: Group[] = [
  {
    id: 'g-001',
    name: 'DXB-Voice-Engineering',
    description: 'Owners of all Dubai-region voice CDR pipelines.',
    memberIds: membersByGroup('DXB-Voice-Engineering'),
    pipelineIds: pipelinesByOwners(['aisha.almansoori@emiratesnet.ae', 'ahmed.alshamsi@emiratesnet.ae']),
  },
  {
    id: 'g-002',
    name: 'AUH-Billing-Ops',
    description: 'Abu Dhabi billing and revenue assurance.',
    memberIds: membersByGroup('AUH-Billing-Ops'),
    pipelineIds: pipelinesByOwners(['khalid.alhashimi@emiratesnet.ae', 'omar.alsuwaidi@emiratesnet.ae', 'rashid.almazrouei@emiratesnet.ae']),
  },
  {
    id: 'g-003',
    name: 'Identity-Platform',
    description: 'DTX_ID identity graph, schema, and resolution strategy.',
    memberIds: membersByGroup('Identity-Platform'),
    pipelineIds: pipelinesByOwners(['hamad.alnuaimi@emiratesnet.ae', 'priya.sharma@emiratesnet.ae']),
  },
  {
    id: 'g-004',
    name: 'CRM-Onboarding',
    description: 'Customer onboarding flows from BSS into the data platform.',
    memberIds: membersByGroup('CRM-Onboarding'),
    pipelineIds: pipelinesByOwners(['layla.khoury@emiratesnet.ae', 'noura.alkaabi@emiratesnet.ae']),
  },
  {
    id: 'g-005',
    name: '5G-Platform',
    description: '5G session events, usage, and analytics warehouse sinks.',
    memberIds: membersByGroup('5G-Platform'),
    pipelineIds: pipelinesByOwners(['hessa.alfalasi@emiratesnet.ae']),
  },
  {
    id: 'g-006',
    name: 'IoT-Telemetry',
    description: 'M2M, fleet, and smart-city device telemetry.',
    memberIds: membersByGroup('IoT-Telemetry'),
    pipelineIds: pipelinesByOwners(['mariam.alzaabi@emiratesnet.ae']),
  },
  {
    id: 'g-007',
    name: 'Roaming-Partners',
    description: 'Cross-network roaming reconciliation with regional carriers.',
    memberIds: membersByGroup('Roaming-Partners'),
    pipelineIds: pipelinesByOwners(['yousef.alotaiba@emiratesnet.ae']),
  },
  {
    id: 'g-008',
    name: 'TRA-Compliance',
    description: 'TRA regulatory reporting and consent audit trail.',
    memberIds: membersByGroup('TRA-Compliance'),
    pipelineIds: pipelinesByOwners(['fatima.almarri@emiratesnet.ae']),
  },
  {
    id: 'g-009',
    name: 'Prepaid-Ops',
    description: 'Prepaid recharge, top-ups, and retail digital channels.',
    memberIds: membersByGroup('Prepaid-Ops'),
    pipelineIds: pipelinesByOwners(['saif.alqubaisi@emiratesnet.ae']),
  },
  {
    id: 'g-010',
    name: 'On-Call-NOC',
    description: '24/7 on-call team — pipeline operators with deploy + revert rights.',
    memberIds: membersByGroup('On-Call-NOC'),
    pipelineIds: [],
  },
];

export function getGroup(id: string): Group | undefined {
  return GROUPS.find((g) => g.id === id);
}
