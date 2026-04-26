import type { Schema } from '@/lib/types';

/**
 * 8 schemas reflecting the UAE Telco demo deployment.
 * PII fields are flagged so the Schemas page can highlight them and the
 * Privacy operator can warn about TRA compliance.
 */
export const SCHEMAS: Schema[] = [
  {
    id: 'cdr_voice_v2',
    name: 'cdr_voice_v2',
    version: 'v2.3.1',
    owner: 'Aisha Al Mansoori',
    description: 'Voice CDR records emitted by network probes across DXB / AUH / SHJ.',
    fields: [
      { name: 'msisdn_hashed', type: 'string', nullable: false, pii: true, description: 'SHA-256 of caller MSISDN (UAE +971)' },
      { name: 'called_number_hashed', type: 'string', nullable: false, pii: true },
      { name: 'duration_s', type: 'int32', nullable: false },
      { name: 'cell_site_id', type: 'string', nullable: false, description: 'Format: {emirate}-{tower}-{sector}' },
      { name: 'event_ts', type: 'timestamp', nullable: false },
      { name: 'charge_aed', type: 'decimal(10,3)', nullable: true },
      { name: 'roaming_partner', type: 'string', nullable: true },
    ],
    usedBy: ['cdr.voice.dxb → identity_resolved', 'cdr.voice.auh → identity_resolved', 'voice.minutes.aggregator'],
  },
  {
    id: 'crm_customer_v4',
    name: 'crm_customer_v4',
    version: 'v4.0.2',
    owner: 'Layla Khoury',
    description: 'Master customer record from BSS/CRM. Source of truth for billing identity.',
    fields: [
      { name: 'customer_id', type: 'string', nullable: false },
      { name: 'emirates_id_hash', type: 'string', nullable: false, pii: true, description: 'SHA-256 of Emirates ID (15 digits)' },
      { name: 'name_ar', type: 'string', nullable: true, pii: true },
      { name: 'name_en', type: 'string', nullable: false, pii: true },
      { name: 'dob', type: 'date', nullable: true, pii: true },
      { name: 'nationality', type: 'string', nullable: true },
      { name: 'plan_type', type: 'string', nullable: false },
      { name: 'consent_purposes', type: 'array<string>', nullable: false },
      { name: 'created_at', type: 'timestamp', nullable: false },
    ],
    usedBy: ['crm.customer.onboarding', 'churn.signals.identity_graph'],
  },
  {
    id: 'billing_v1',
    name: 'billing_v1',
    version: 'v1.4.0',
    owner: 'Omar Al Suwaidi',
    description: 'Invoice line items, AED-denominated, post-tax.',
    fields: [
      { name: 'invoice_id', type: 'string', nullable: false },
      { name: 'customer_id', type: 'string', nullable: false },
      { name: 'amount_aed', type: 'decimal(12,2)', nullable: false },
      { name: 'currency', type: 'string', nullable: false, description: 'Always AED' },
      { name: 'billing_period', type: 'string', nullable: false },
      { name: 'due_date', type: 'date', nullable: false },
      { name: 'status', type: 'string', nullable: false },
    ],
    usedBy: ['billing.enrichment.aed'],
  },
  {
    id: 'bss_subscriber_v2',
    name: 'bss_subscriber_v2',
    version: 'v2.1.0',
    owner: 'Khalid Al Hashimi',
    description: 'Active and dormant subscribers, per-emirate activation tracking.',
    fields: [
      { name: 'subscriber_id', type: 'string', nullable: false },
      { name: 'msisdn_hashed', type: 'string', nullable: false, pii: true },
      { name: 'plan', type: 'string', nullable: false },
      { name: 'activation_emirate', type: 'string', nullable: false, description: 'DXB | AUH | SHJ | AJM | RAK | FUJ | UAQ' },
      { name: 'status', type: 'string', nullable: false },
      { name: 'activated_at', type: 'timestamp', nullable: false },
    ],
    usedBy: ['crm.customer.onboarding', 'prepaid.recharge.events'],
  },
  {
    id: 'identity_resolved_v1',
    name: 'identity_resolved_v1',
    version: 'v1.0.4',
    owner: 'Hamad Al Nuaimi',
    description: 'Cross-source identity graph node — output of the Identity Resolver operator.',
    fields: [
      { name: 'dtx_id', type: 'string', nullable: false, description: 'Format: DTX_xxxxxxxx' },
      { name: 'source_ids', type: 'array<string>', nullable: false },
      { name: 'confidence', type: 'float', nullable: false },
      { name: 'emirate', type: 'string', nullable: true },
      { name: 'last_seen', type: 'timestamp', nullable: false },
      { name: 'match_strategy', type: 'string', nullable: false },
    ],
    usedBy: ['cdr.voice.dxb → identity_resolved', 'cdr.voice.auh → identity_resolved', '5g.session.events → warehouse'],
  },
  {
    id: 'cdr_enriched_v1',
    name: 'cdr_enriched_v1',
    version: 'v1.2.0',
    owner: 'Aisha Al Mansoori',
    description: 'CDR enriched with DTX identity and customer segment.',
    fields: [
      { name: 'msisdn_hashed', type: 'string', nullable: false, pii: true },
      { name: 'dtx_id', type: 'string', nullable: false },
      { name: 'customer_segment', type: 'string', nullable: true },
      { name: 'duration_s', type: 'int32', nullable: false },
      { name: 'cell_site_id', type: 'string', nullable: false },
      { name: 'event_ts', type: 'timestamp', nullable: false },
      { name: 'charge_aed', type: 'decimal(10,3)', nullable: true },
    ],
    usedBy: ['cdr.voice.dxb → identity_resolved'],
  },
  {
    id: 'graph_production',
    name: 'graph_production',
    version: 'v3.1.0',
    owner: 'Hamad Al Nuaimi',
    description: 'Production identity graph — read by every Identity operator in prod.',
    fields: [
      { name: 'dtx_id', type: 'string', nullable: false },
      { name: 'identifier_kind', type: 'string', nullable: false },
      { name: 'identifier_value_hashed', type: 'string', nullable: false, pii: true },
      { name: 'confidence', type: 'float', nullable: false },
      { name: 'graph_version', type: 'string', nullable: false },
    ],
    usedBy: ['cdr.voice.dxb → identity_resolved', 'cdr.voice.auh → identity_resolved', 'churn.signals.identity_graph'],
  },
  {
    id: 'graph_staging',
    name: 'graph_staging',
    version: 'v3.2.0-rc1',
    owner: 'Hamad Al Nuaimi',
    description: 'Staging identity graph — used by candidate pipelines pre-deploy.',
    fields: [
      { name: 'dtx_id', type: 'string', nullable: false },
      { name: 'identifier_kind', type: 'string', nullable: false },
      { name: 'identifier_value_hashed', type: 'string', nullable: false, pii: true },
      { name: 'confidence', type: 'float', nullable: false },
      { name: 'graph_version', type: 'string', nullable: false },
    ],
    usedBy: ['churn.signals.identity_graph'],
  },
];

export function getSchema(id: string): Schema | undefined {
  return SCHEMAS.find((s) => s.id === id);
}
