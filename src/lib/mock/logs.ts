import type { LogEntry, LogStatus } from '@/lib/types';

const SUCCESS_MSGS = [
  'Batch processed successfully',
  'Schema validation passed',
  'Identity match completed · avg confidence 0.94',
  'Records emitted to downstream topic',
  'Consumer group offsets committed',
  'Consent gate cleared all records',
];

const WARNING_MSGS = [
  '{n} records routed to DLQ (consent missing)',
  '{n} records below identity confidence threshold',
  'Backpressure on partition · slowing producer',
  'Schema drift auto-coerced · {n} fields',
];

const ERROR_MSGS = [
  '{n} records failed schema validation',
  'Kafka producer timeout · retrying',
  'Identity graph write rejected · graph_staging at capacity',
  'JDBC source unreachable for 32s',
];

function fmtTime(secondsAgo: number): string {
  const d = new Date(Date.now() - secondsAgo * 1000);
  return d.toTimeString().slice(0, 8);
}

function pickStatus(seed: number): LogStatus {
  const r = (Math.abs(Math.sin(seed * 17.3)) * 100) | 0;
  if (r < 70) return 'success';
  if (r < 92) return 'warning';
  return 'error';
}

function pickMsg(status: LogStatus, seed: number, n: number): string {
  const list = status === 'success' ? SUCCESS_MSGS : status === 'warning' ? WARNING_MSGS : ERROR_MSGS;
  const tpl = list[seed % list.length]!;
  return tpl.replace(/\{n\}/g, String(n));
}

/**
 * Generate a per-pipeline log batch — deterministic by pipeline id + seed.
 * Used in the Inspector's Logs tab; new entries stream in via setInterval there.
 */
export function generateLogs(pipelineId: string, count = 200): LogEntry[] {
  const seed0 = pipelineId
    .split('')
    .reduce((acc, c) => (acc * 131 + c.charCodeAt(0)) % 1_000_003, 7);
  return Array.from({ length: count }, (_, i) => {
    const seed = seed0 + i * 23;
    const status = pickStatus(seed);
    const records = 200 + ((seed * 7) % 1500);
    const errored = status === 'success' ? 0 : status === 'warning' ? (seed % 25) + 1 : (seed % 80) + 5;
    const durationMs = 800 + ((seed * 13) % 1400);
    const secondsAgo = i * 7 + Math.abs(Math.sin(seed) * 3);
    return {
      id: `log-${pipelineId}-${i}`,
      timestamp: fmtTime(secondsAgo),
      status,
      records,
      errored,
      durationMs,
      message: pickMsg(status, seed, errored),
    };
  });
}

/**
 * Generate a single new log entry for a streaming feed.
 * Called from Inspector Logs tab via setInterval.
 */
export function generateLogTick(pipelineId: string, sequenceId: number): LogEntry {
  const seed = sequenceId * 31 + pipelineId.length * 17;
  const status = pickStatus(seed);
  const records = 200 + ((seed * 7) % 1500);
  const errored = status === 'success' ? 0 : status === 'warning' ? (seed % 25) + 1 : (seed % 80) + 5;
  return {
    id: `log-${pipelineId}-tick-${sequenceId}`,
    timestamp: new Date().toTimeString().slice(0, 8),
    status,
    records,
    errored,
    durationMs: 800 + ((seed * 13) % 1400),
    message: pickMsg(status, seed, errored),
  };
}
