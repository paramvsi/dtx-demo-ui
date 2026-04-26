import type { Pipeline, PipelineEdge, PipelineNode } from '@/lib/types';

/**
 * 12 pipelines flavored as a UAE Telco deployment (fictitious "EmiratesNet").
 * Names span all status × type × env combinations so every state on the
 * Pipelines list page populates believably.
 *
 * Each pipeline carries a real nodes[] + edges[] graph so opening the Designer
 * with any pipeline ID renders a wired flow.
 */

// ---- helpers ----
function series(base: number, jitter: number, points = 24, trend: 'flat' | 'rising' | 'declining' = 'flat'): number[] {
  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1);
    const trendMul = trend === 'rising' ? 1 + t * 0.4 : trend === 'declining' ? 1.3 - t * 0.6 : 1;
    const wave = Math.sin((i / points) * Math.PI * 2) * jitter * 0.5;
    const noise = (Math.sin(i * 13.37) * 0.5 + Math.cos(i * 7.31) * 0.5) * jitter * 0.5;
    return Math.max(0, Math.round(base * trendMul + wave + noise));
  });
}

// Common 4-node graph: Source → DQ → Identity → Sink (linear at y=120)
function linearGraph(prefix: string): { nodes: PipelineNode[]; edges: PipelineEdge[] } {
  const nodes: PipelineNode[] = [
    { id: `${prefix}-n1`, operatorId: 'SRC-01', position: { x: 80, y: 120 }, data: {} },
    { id: `${prefix}-n2`, operatorId: 'DQ-01', position: { x: 320, y: 120 }, data: {} },
    { id: `${prefix}-n3`, operatorId: 'ID-01', position: { x: 560, y: 120 }, data: {} },
    { id: `${prefix}-n4`, operatorId: 'SNK-01', position: { x: 880, y: 120 }, data: {} },
  ];
  const edges: PipelineEdge[] = [
    { id: `${prefix}-e1`, source: `${prefix}-n1`, target: `${prefix}-n2` },
    { id: `${prefix}-e2`, source: `${prefix}-n2`, target: `${prefix}-n3` },
    { id: `${prefix}-e3`, source: `${prefix}-n3`, target: `${prefix}-n4` },
  ];
  return { nodes, edges };
}

// 5-node graph with privacy gate before identity
function consentGraph(prefix: string): { nodes: PipelineNode[]; edges: PipelineEdge[] } {
  const nodes: PipelineNode[] = [
    { id: `${prefix}-n1`, operatorId: 'SRC-01', position: { x: 80, y: 120 }, data: {} },
    { id: `${prefix}-n2`, operatorId: 'DQ-01', position: { x: 320, y: 120 }, data: {} },
    { id: `${prefix}-n3`, operatorId: 'PV-02', position: { x: 560, y: 120 }, data: {} },
    { id: `${prefix}-n4`, operatorId: 'TR-01', position: { x: 800, y: 120 }, data: {} },
    { id: `${prefix}-n5`, operatorId: 'SNK-01', position: { x: 1040, y: 120 }, data: {} },
  ];
  const edges: PipelineEdge[] = [
    { id: `${prefix}-e1`, source: `${prefix}-n1`, target: `${prefix}-n2` },
    { id: `${prefix}-e2`, source: `${prefix}-n2`, target: `${prefix}-n3` },
    { id: `${prefix}-e3`, source: `${prefix}-n3`, target: `${prefix}-n4` },
    { id: `${prefix}-e4`, source: `${prefix}-n4`, target: `${prefix}-n5` },
  ];
  return { nodes, edges };
}

// JDBC source instead of Kafka
function jdbcGraph(prefix: string): { nodes: PipelineNode[]; edges: PipelineEdge[] } {
  const nodes: PipelineNode[] = [
    { id: `${prefix}-n1`, operatorId: 'SRC-02', position: { x: 80, y: 120 }, data: {} },
    { id: `${prefix}-n2`, operatorId: 'DQ-01', position: { x: 320, y: 120 }, data: {} },
    { id: `${prefix}-n3`, operatorId: 'TR-01', position: { x: 560, y: 120 }, data: {} },
    { id: `${prefix}-n4`, operatorId: 'SNK-01', position: { x: 800, y: 120 }, data: {} },
  ];
  const edges: PipelineEdge[] = [
    { id: `${prefix}-e1`, source: `${prefix}-n1`, target: `${prefix}-n2` },
    { id: `${prefix}-e2`, source: `${prefix}-n2`, target: `${prefix}-n3` },
    { id: `${prefix}-e3`, source: `${prefix}-n3`, target: `${prefix}-n4` },
  ];
  return { nodes, edges };
}

// Routing graph with error router
function errorRoutedGraph(prefix: string): { nodes: PipelineNode[]; edges: PipelineEdge[] } {
  const nodes: PipelineNode[] = [
    { id: `${prefix}-n1`, operatorId: 'SRC-01', position: { x: 80, y: 200 }, data: {} },
    { id: `${prefix}-n2`, operatorId: 'DQ-01', position: { x: 320, y: 200 }, data: {} },
    { id: `${prefix}-n3`, operatorId: 'RT-02', position: { x: 560, y: 200 }, data: {} },
    { id: `${prefix}-n4`, operatorId: 'SNK-01', position: { x: 820, y: 100 }, data: { topic: 'cdr.voice.dxb.identity_resolved' } },
    { id: `${prefix}-n5`, operatorId: 'SNK-01', position: { x: 820, y: 320 }, data: { topic: 'cdr.voice.dxb.dlq' } },
  ];
  const edges: PipelineEdge[] = [
    { id: `${prefix}-e1`, source: `${prefix}-n1`, target: `${prefix}-n2` },
    { id: `${prefix}-e2`, source: `${prefix}-n2`, target: `${prefix}-n3` },
    { id: `${prefix}-e3`, source: `${prefix}-n3`, target: `${prefix}-n4`, sourceHandle: 'success' },
    { id: `${prefix}-e4`, source: `${prefix}-n3`, target: `${prefix}-n5`, sourceHandle: 'dlq' },
  ];
  return { nodes, edges };
}

export const PIPELINES: Pipeline[] = [
  {
    id: 'p-001',
    name: 'cdr.voice.dxb → identity_resolved',
    type: 'identity',
    status: 'running',
    state: 'staging',
    env: 'staging',
    version: 'v1.2.0',
    throughput: 712,
    lastRun: '2m ago',
    owner: 'Aisha Al Mansoori',
    ownerEmail: 'aisha.almansoori@emiratesnet.ae',
    dirty: true,
    description: 'Voice CDRs from Dubai network probes — schema-validated, identity-resolved, sunk to enriched topic.',
    ...linearGraph('p001'),
    throughputSeries: series(700, 80),
  },
  {
    id: 'p-002',
    name: 'cdr.voice.auh → identity_resolved',
    type: 'identity',
    status: 'running',
    state: 'prod',
    env: 'prod',
    version: 'v2.0.1',
    throughput: 654,
    lastRun: '1m ago',
    owner: 'Khalid Al Hashimi',
    ownerEmail: 'khalid.alhashimi@emiratesnet.ae',
    dirty: false,
    description: 'Production Abu Dhabi voice CDR identity resolution.',
    ...linearGraph('p002'),
    throughputSeries: series(640, 70),
  },
  {
    id: 'p-003',
    name: 'crm.customer.onboarding',
    type: 'transform',
    status: 'idle',
    state: 'draft',
    env: 'dev',
    version: 'v0.4.0',
    throughput: 0,
    lastRun: '3d ago',
    owner: 'Layla Khoury',
    ownerEmail: 'layla.khoury@emiratesnet.ae',
    dirty: true,
    description: 'Onboarding flow for new BSS-registered customers — includes consent capture and Emirates ID hashing.',
    ...consentGraph('p003'),
    throughputSeries: series(0, 0),
  },
  {
    id: 'p-004',
    name: 'billing.enrichment.aed',
    type: 'transform',
    status: 'running',
    state: 'prod',
    env: 'prod',
    version: 'v2.1.3',
    throughput: 48,
    lastRun: '47s ago',
    owner: 'Omar Al Suwaidi',
    ownerEmail: 'omar.alsuwaidi@emiratesnet.ae',
    dirty: false,
    description: 'Enriches monthly invoice line items with customer segment, tax category, and AED totals.',
    ...jdbcGraph('p004'),
    throughputSeries: series(48, 6),
  },
  {
    id: 'p-005',
    name: '5g.session.events → warehouse',
    type: 'sink',
    status: 'running',
    state: 'prod',
    env: 'prod',
    version: 'v1.5.0',
    throughput: 12450,
    lastRun: '3s ago',
    owner: 'Hessa Al Falasi',
    ownerEmail: 'hessa.alfalasi@emiratesnet.ae',
    dirty: false,
    description: 'High-volume 5G session events sunk to the analytics warehouse.',
    ...linearGraph('p005'),
    throughputSeries: series(12000, 1500),
  },
  {
    id: 'p-006',
    name: 'roaming.partner.cdr → reconciliation',
    type: 'identity',
    status: 'lagging',
    state: 'prod',
    env: 'prod',
    version: 'v1.0.4',
    throughput: 280,
    lastRun: '5s ago',
    owner: 'Yousef Al Otaiba',
    ownerEmail: 'yousef.alotaiba@emiratesnet.ae',
    dirty: false,
    description: 'Reconciles roaming partner CDRs against EmiratesNet identity graph. Currently lagging due to partner feed schema drift.',
    ...errorRoutedGraph('p006'),
    throughputSeries: series(420, 100, 24, 'declining'),
  },
  {
    id: 'p-007',
    name: 'iot.m2m.telemetry → kafka',
    type: 'sink',
    status: 'running',
    state: 'prod',
    env: 'prod',
    version: 'v3.2.0',
    throughput: 8430,
    lastRun: '1s ago',
    owner: 'Mariam Al Zaabi',
    ownerEmail: 'mariam.alzaabi@emiratesnet.ae',
    dirty: false,
    description: 'M2M and IoT device telemetry — connected vehicles, smart meters, fleet trackers.',
    ...linearGraph('p007'),
    throughputSeries: series(8200, 800),
  },
  {
    id: 'p-008',
    name: 'prepaid.recharge.events',
    type: 'transform',
    status: 'running',
    state: 'prod',
    env: 'prod',
    version: 'v1.1.0',
    throughput: 195,
    lastRun: '4s ago',
    owner: 'Saif Al Qubaisi',
    ownerEmail: 'saif.alqubaisi@emiratesnet.ae',
    dirty: false,
    description: 'Top-up events from retail and digital channels.',
    ...consentGraph('p008'),
    throughputSeries: series(190, 40),
  },
  {
    id: 'p-009',
    name: 'consent.tra.audit → archive',
    type: 'privacy',
    status: 'running',
    state: 'prod',
    env: 'prod',
    version: 'v1.0.0',
    throughput: 14,
    lastRun: '12s ago',
    owner: 'Fatima Al Marri',
    ownerEmail: 'fatima.almarri@emiratesnet.ae',
    dirty: false,
    description: 'TRA-mandated consent audit trail — 6-month retention. All purpose changes and revocations sunk here.',
    ...consentGraph('p009'),
    throughputSeries: series(14, 4),
  },
  {
    id: 'p-010',
    name: 'voice.minutes.aggregator',
    type: 'transform',
    status: 'failed',
    state: 'staging',
    env: 'staging',
    version: 'v0.9.2',
    throughput: 0,
    lastRun: '34m ago',
    owner: 'Rashid Al Mazrouei',
    ownerEmail: 'rashid.almazrouei@emiratesnet.ae',
    dirty: true,
    description: 'Per-customer per-day voice minute aggregation. Failed: missing column charge_aed in upstream cdr_voice_v2.',
    ...linearGraph('p010'),
    throughputSeries: series(800, 100, 24, 'declining').map((v, i) => (i > 18 ? 0 : v)),
  },
  {
    id: 'p-011',
    name: 'data.usage.5g.realtime',
    type: 'transform',
    status: 'running',
    state: 'prod',
    env: 'prod',
    version: 'v2.4.1',
    throughput: 6210,
    lastRun: '2s ago',
    owner: 'Noura Al Kaabi',
    ownerEmail: 'noura.alkaabi@emiratesnet.ae',
    dirty: false,
    description: 'Real-time 5G data usage rollup for the customer-facing usage dashboard.',
    ...linearGraph('p011'),
    throughputSeries: series(6000, 700, 24, 'rising'),
  },
  {
    id: 'p-012',
    name: 'churn.signals.identity_graph',
    type: 'identity',
    status: 'idle',
    state: 'draft',
    env: 'dev',
    version: 'v0.2.0',
    throughput: 0,
    lastRun: '6h ago',
    owner: 'Hamad Al Nuaimi',
    ownerEmail: 'hamad.alnuaimi@emiratesnet.ae',
    dirty: true,
    description: 'Experimental churn signal scoring — joins CRM customer history with identity graph cluster size.',
    ...consentGraph('p012'),
    throughputSeries: series(0, 0),
  },
];

export function getPipeline(id: string): Pipeline | undefined {
  return PIPELINES.find((p) => p.id === id);
}
