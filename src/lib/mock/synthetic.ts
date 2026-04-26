import type { SyntheticJob } from '@/lib/types';

/**
 * 4 synthetic data generation jobs spanning running / completed / failed states.
 * Used by /synthetic-data page and as a UAE-flavored "generate test data" demo.
 */
export const SYNTHETIC_JOBS: SyntheticJob[] = [
  {
    id: 'sj-001',
    name: 'Generate 100k synthetic voice CDRs (UAE distribution)',
    schemaId: 'cdr_voice_v2',
    recordCount: 100_000,
    generated: 67_240,
    status: 'running',
    startedAt: '4m ago',
    estimatedFinish: '~2m',
    piiMasking: true,
  },
  {
    id: 'sj-002',
    name: 'Synthetic CRM with TRA-compliant PII masking',
    schemaId: 'crm_customer_v4',
    recordCount: 25_000,
    generated: 25_000,
    status: 'completed',
    startedAt: '47m ago',
    piiMasking: true,
  },
  {
    id: 'sj-003',
    name: '5G session events (high-cardinality, 1M records)',
    schemaId: 'identity_resolved_v1',
    recordCount: 1_000_000,
    generated: 1_000_000,
    status: 'completed',
    startedAt: '2h ago',
    piiMasking: false,
  },
  {
    id: 'sj-004',
    name: 'Roaming partner CDR (Etihad partner schema v2)',
    schemaId: 'cdr_voice_v2',
    recordCount: 50_000,
    generated: 12_400,
    status: 'failed',
    startedAt: '38m ago',
    piiMasking: true,
  },
];

export function getSyntheticJob(id: string): SyntheticJob | undefined {
  return SYNTHETIC_JOBS.find((j) => j.id === id);
}
