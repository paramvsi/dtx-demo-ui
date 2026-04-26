import type { PipelineEvent } from '@/lib/types';

/**
 * 50 events spanning the last ~48h with realistic UAE-telco messages.
 * Covers running / lagging / failed / idle states evenly so the dashboard
 * and observability page populate believably.
 */

const MESSAGES = {
  running: [
    'Batch processed: {n} voice CDRs from {topic}',
    '{n} records identity-resolved · avg confidence 0.94',
    '{n} records emitted to {topic} · zero errors',
    'Schema validation passed for {n} records',
    'Consent gate: {n} records cleared · {err} blocked (TRA purpose mismatch)',
    'Identity resolver matched {n} records to graph_production',
    'Rebalanced {n} consumer group offsets after partition reassignment',
  ],
  warning: [
    'Lag exceeded 5s threshold · partition rebalance in progress',
    '{n} records routed to DLQ (consent missing — TRA flag)',
    'Identity match confidence below 0.85 threshold for {err} records',
    'Schema drift detected in upstream feed — {err} fields auto-coerced',
    'Backpressure detected on {topic} consumer group',
    'Roaming partner feed delayed · falling back to last-known graph snapshot',
  ],
  error: [
    'Pipeline halted: missing column charge_aed in upstream cdr_voice_v2',
    '{err} records failed schema validation against cdr_voice_v2',
    'Roaming partner reconciliation failed: schema mismatch with Etihad partner feed',
    'Identity graph write rejected: graph_staging at capacity',
    'JDBC source timeout — bss-prod-auh did not respond within 30s',
    'Unable to reach kafka-broker-01.dxb.emiratesnet.ae:9092 · retrying',
  ],
  deployed: [
    '{pipeline} deployed to {env} · v{ver}',
    '{pipeline} rolled back from {env} · reverted to v{prev}',
    '{pipeline} schema_ref updated to {schema}',
  ],
};

function fmt(template: string, ctx: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(ctx[k] ?? `{${k}}`));
}

const PIPE_REFS = [
  { id: 'p-001', name: 'cdr.voice.dxb → identity_resolved', topic: 'cdr.voice.dxb.raw' },
  { id: 'p-002', name: 'cdr.voice.auh → identity_resolved', topic: 'cdr.voice.auh.raw' },
  { id: 'p-005', name: '5g.session.events → warehouse', topic: '5g.sessions.events' },
  { id: 'p-006', name: 'roaming.partner.cdr → reconciliation', topic: 'roaming.partner.cdr' },
  { id: 'p-007', name: 'iot.m2m.telemetry → kafka', topic: 'iot.m2m.telemetry' },
  { id: 'p-008', name: 'prepaid.recharge.events', topic: 'prepaid.recharge' },
  { id: 'p-009', name: 'consent.tra.audit → archive', topic: 'consent.audit.tra' },
  { id: 'p-010', name: 'voice.minutes.aggregator', topic: 'cdr.voice.dxb.raw' },
  { id: 'p-011', name: 'data.usage.5g.realtime', topic: '5g.sessions.events' },
];

function pickPipe(seed: number) {
  return PIPE_REFS[seed % PIPE_REFS.length]!;
}

function pickMsg(level: keyof typeof MESSAGES, seed: number) {
  const list = MESSAGES[level];
  return list[seed % list.length]!;
}

function relativeTimestamp(minutesAgo: number): string {
  if (minutesAgo < 1) return 'just now';
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hours = Math.floor(minutesAgo / 60);
  if (hours < 24) {
    const mins = minutesAgo % 60;
    return mins ? `${hours}h ${mins}m ago` : `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function eventAt(i: number, minutesAgo: number): PipelineEvent {
  const pipe = pickPipe(i * 7);
  const levels: Array<'success' | 'warning' | 'error' | 'info'> = ['success', 'success', 'success', 'success', 'warning', 'warning', 'error', 'info'];
  const level = levels[i % levels.length]!;
  const status =
    level === 'error' ? 'failed' : level === 'warning' ? 'lagging' : level === 'info' ? 'idle' : 'running';
  const records = level === 'error' ? 0 : 200 + ((i * 137) % 1500);
  const errored = level === 'success' ? 0 : level === 'warning' ? (i * 3) % 30 + 1 : (i * 7) % 50 + 5;

  const msgKey = level === 'error' ? 'error' : level === 'warning' ? 'warning' : level === 'info' ? 'deployed' : 'running';
  const tpl = pickMsg(msgKey, i * 11);
  const message = fmt(tpl, {
    n: records.toLocaleString(),
    err: errored,
    topic: pipe.topic,
    pipeline: pipe.name,
    env: ['prod', 'staging'][i % 2]!,
    ver: `${1 + (i % 3)}.${i % 10}.${(i * 3) % 10}`,
    prev: `${i % 3}.${(i * 2) % 10}.0`,
    schema: ['cdr_voice_v2', 'crm_customer_v4', 'identity_resolved_v1'][i % 3]!,
  });

  return {
    id: `e-${String(i + 1).padStart(3, '0')}`,
    timestamp: relativeTimestamp(minutesAgo),
    pipelineId: pipe.id,
    pipelineName: pipe.name,
    level,
    status,
    message,
    records,
    errored,
  };
}

// Generate 50 events with timestamps across last 48h, weighted toward recent
export const EVENTS: PipelineEvent[] = Array.from({ length: 50 }, (_, i) => {
  // Compress most events into the last 6 hours, scatter rest across 48h
  const minutesAgo = i < 30 ? Math.round(i * 12 + Math.sin(i) * 5) : Math.round(360 + (i - 30) * 130 + Math.cos(i) * 40);
  return eventAt(i, Math.max(1, minutesAgo));
});
