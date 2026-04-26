// Shared types that cross multiple mock modules.

export type OperatorCategory =
  | 'source'
  | 'transform'
  | 'dq'
  | 'privacy'
  | 'identity'
  | 'routing'
  | 'sink';

export type PipelineStatus = 'running' | 'lagging' | 'failed' | 'idle';
export type PipelineState = 'draft' | 'staging' | 'prod';
export type Env = 'prod' | 'staging' | 'dev';
export type EventLevel = 'info' | 'success' | 'warning' | 'error';
export type UserStatus = 'active' | 'invited' | 'suspended';
export type UserRole = 'admin' | 'editor' | 'viewer' | 'pipeline-operator';
export type LogStatus = 'success' | 'warning' | 'error';

// Operator field schema — used to generate the Configure tab form at runtime.
export type OperatorFieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'segmented'
  | 'toggle';

export interface OperatorField {
  name: string;
  label: string;
  type: OperatorFieldType;
  required?: boolean;
  mono?: boolean;
  default?: string | number | boolean;
  options?: readonly string[];
  hint?: string;
  placeholder?: string;
  group?: 'required' | 'advanced';
}

export interface Operator {
  id: string;
  name: string;
  category: OperatorCategory;
  subtitle: string;
  tags: readonly string[];
  inSchema: string;
  outSchema: string;
  multiInput?: boolean;
  wide?: boolean;
  fields: readonly OperatorField[];
}

export interface PipelineNode {
  id: string;
  operatorId: string;
  position: { x: number; y: number };
  data: Record<string, string | number | boolean>;
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  type: OperatorCategory;
  status: PipelineStatus;
  state: PipelineState;
  env: Env;
  version: string;
  throughput: number;
  lastRun: string;
  owner: string;
  ownerEmail: string;
  dirty: boolean;
  description: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  throughputSeries: number[];
}

export interface SchemaField {
  name: string;
  type: string;
  nullable: boolean;
  pii?: boolean;
  description?: string;
}

export interface Schema {
  id: string;
  name: string;
  version: string;
  owner: string;
  description: string;
  fields: SchemaField[];
  usedBy: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  avatarUrl: string;
  group: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  pipelineIds: string[];
}

export interface RolePermission {
  resource: string;
  read: boolean;
  write: boolean;
  admin: boolean;
}

export interface Role {
  id: UserRole;
  name: string;
  description: string;
  permissions: RolePermission[];
  userCount: number;
}

export interface PipelineEvent {
  id: string;
  timestamp: string;
  pipelineId: string;
  pipelineName: string;
  level: EventLevel;
  status: PipelineStatus;
  message: string;
  records?: number;
  errored?: number;
}

export interface KafkaTopic {
  id: string;
  name: string;
  partitions: number;
  replication: number;
  lagMs: number;
  throughput: number;
  retentionDays: number;
  consumerGroups: string[];
  partitionLags: number[];
}

export interface CacheKey {
  id: string;
  pattern: string;
  description: string;
  ttlSeconds: number;
  hitRate: number;
  sizeBytes: number;
  lastAccessed: string;
  hotKeys: number;
}

export interface SyntheticJob {
  id: string;
  name: string;
  schemaId: string;
  recordCount: number;
  generated: number;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  estimatedFinish?: string;
  piiMasking: boolean;
}

export interface LineageNode {
  id: string;
  name: string;
  operatorId: string;
}

export interface LineageColumn {
  upstream: string;
  current: string;
  downstream: string;
}

export interface LineageGraph {
  upstream: LineageNode[];
  current: LineageNode;
  downstream: LineageNode[];
  columns: LineageColumn[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  status: LogStatus;
  records: number;
  errored: number;
  durationMs: number;
  message: string;
}
