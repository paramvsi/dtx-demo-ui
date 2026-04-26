import type { KafkaTopic } from '@/lib/types';

/**
 * 6 Kafka topics — UAE Telco mix. Retention reflects TRA mandate
 * (180 days for CDR-related, 30 days for IoT, 365 days for consent audits).
 */
export const KAFKA_TOPICS: KafkaTopic[] = [
  {
    id: 'k-001',
    name: 'cdr.voice.dxb.raw',
    partitions: 24,
    replication: 3,
    lagMs: 12,
    throughput: 712,
    retentionDays: 180,
    consumerGroups: ['dtx-cdr-voice-resolver', 'analytics-cdr-mirror', 'tra-audit-tap'],
    partitionLags: [0, 1, 0, 2, 0, 1, 1, 0, 3, 0, 0, 1, 0, 0, 1, 2, 0, 0, 0, 1, 1, 0, 0, 0],
  },
  {
    id: 'k-002',
    name: 'cdr.voice.auh.raw',
    partitions: 18,
    replication: 3,
    lagMs: 8,
    throughput: 654,
    retentionDays: 180,
    consumerGroups: ['dtx-cdr-voice-resolver', 'analytics-cdr-mirror'],
    partitionLags: [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  },
  {
    id: 'k-003',
    name: '5g.sessions.events',
    partitions: 48,
    replication: 3,
    lagMs: 24,
    throughput: 12450,
    retentionDays: 90,
    consumerGroups: ['warehouse-sink', 'realtime-usage-rollup', 'churn-signals'],
    partitionLags: Array.from({ length: 48 }, (_, i) => Math.max(0, Math.round(Math.sin(i * 0.7) * 6 + 4))),
  },
  {
    id: 'k-004',
    name: 'iot.m2m.telemetry',
    partitions: 32,
    replication: 3,
    lagMs: 6,
    throughput: 8430,
    retentionDays: 30,
    consumerGroups: ['iot-warehouse-sink', 'fleet-tracker'],
    partitionLags: Array.from({ length: 32 }, (_, i) => Math.max(0, Math.round(Math.sin(i) * 3 + 2))),
  },
  {
    id: 'k-005',
    name: 'prepaid.recharge',
    partitions: 12,
    replication: 3,
    lagMs: 14,
    throughput: 195,
    retentionDays: 90,
    consumerGroups: ['recharge-aggregator', 'fraud-detection'],
    partitionLags: [0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
  },
  {
    id: 'k-006',
    name: 'consent.audit.tra',
    partitions: 6,
    replication: 3,
    lagMs: 4,
    throughput: 14,
    retentionDays: 365,
    consumerGroups: ['tra-archive-sink', 'compliance-dashboard'],
    partitionLags: [0, 0, 0, 0, 0, 0],
  },
];

export function getKafkaTopic(id: string): KafkaTopic | undefined {
  return KAFKA_TOPICS.find((t) => t.id === id);
}
