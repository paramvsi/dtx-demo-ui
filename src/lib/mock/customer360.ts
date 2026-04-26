/**
 * Customer 360 aggregates — synthetic UAE Telco "EmiratesNet" deployment.
 * Used by the Home page for the executive view: subscriber growth, customer
 * segments, revenue per emirate, identity-confidence histogram, consent
 * adoption, channel reach, top campaigns.
 *
 * Numbers are realistic for a mid-size GCC telco (~5M subscribers).
 * Anyone in the sales motion can read these and trust the scale.
 */

export interface SubscriberGrowthPoint {
  month: string;
  postpaid: number;
  prepaid: number;
  enterprise: number;
  iot: number;
}

export interface CustomerSegment {
  id: 'postpaid' | 'prepaid' | 'enterprise' | 'iot' | 'm2m';
  label: string;
  count: number;
  arpu: number;        // average revenue per user (AED / month)
  growth: number;      // % YoY
}

export interface RevenueByEmirate {
  emirate: string;
  code: string;
  revenue: number;     // AED, monthly
  subscribers: number;
}

export interface IdentityBucket {
  range: string;       // e.g. "0.95–1.00"
  count: number;
  label: string;       // human label
}

export interface ConsentPurpose {
  purpose: string;
  granted: number;     // count
  denied: number;
  pending: number;
}

export interface ChannelReach {
  channel: string;
  reach: number;       // % of customers reachable
  active30d: number;   // % active in last 30 days
}

export interface TopCampaign {
  id: string;
  name: string;
  channel: 'voice' | 'sms' | 'push' | 'email' | 'whatsapp';
  status: 'live' | 'scheduled' | 'completed';
  segment: string;
  reach: number;
  conversion: number;  // %
}

// Subscriber growth — 12-month series, slight upward trend with seasonality
export const SUBSCRIBER_GROWTH: SubscriberGrowthPoint[] = [
  { month: 'Apr',  postpaid: 1_820_000, prepaid: 2_640_000, enterprise: 38_400, iot:   720_000 },
  { month: 'May',  postpaid: 1_834_000, prepaid: 2_658_000, enterprise: 39_100, iot:   742_000 },
  { month: 'Jun',  postpaid: 1_851_000, prepaid: 2_675_000, enterprise: 39_700, iot:   768_000 },
  { month: 'Jul',  postpaid: 1_868_000, prepaid: 2_692_000, enterprise: 40_300, iot:   795_000 },
  { month: 'Aug',  postpaid: 1_883_000, prepaid: 2_705_000, enterprise: 40_800, iot:   821_000 },
  { month: 'Sep',  postpaid: 1_902_000, prepaid: 2_719_000, enterprise: 41_400, iot:   848_000 },
  { month: 'Oct',  postpaid: 1_924_000, prepaid: 2_733_000, enterprise: 41_950, iot:   876_000 },
  { month: 'Nov',  postpaid: 1_948_000, prepaid: 2_745_000, enterprise: 42_600, iot:   905_000 },
  { month: 'Dec',  postpaid: 1_976_000, prepaid: 2_758_000, enterprise: 43_180, iot:   934_000 },
  { month: 'Jan',  postpaid: 1_991_000, prepaid: 2_771_000, enterprise: 43_700, iot:   962_000 },
  { month: 'Feb',  postpaid: 2_008_000, prepaid: 2_784_000, enterprise: 44_220, iot:   994_000 },
  { month: 'Mar',  postpaid: 2_032_000, prepaid: 2_798_000, enterprise: 44_900, iot: 1_028_000 },
];

export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  { id: 'postpaid',   label: 'Postpaid',   count: 2_032_000, arpu: 142, growth: 11.6 },
  { id: 'prepaid',    label: 'Prepaid',    count: 2_798_000, arpu:  46, growth:  6.0 },
  { id: 'enterprise', label: 'Enterprise', count:    44_900, arpu: 920, growth: 16.9 },
  { id: 'iot',        label: 'IoT',        count: 1_028_000, arpu:   8, growth: 42.7 },
  { id: 'm2m',        label: 'M2M',        count:   312_000, arpu:  14, growth: 28.3 },
];

export const REVENUE_BY_EMIRATE: RevenueByEmirate[] = [
  { emirate: 'Dubai',          code: 'DXB', revenue: 184_300_000, subscribers: 1_840_000 },
  { emirate: 'Abu Dhabi',      code: 'AUH', revenue: 156_900_000, subscribers: 1_580_000 },
  { emirate: 'Sharjah',        code: 'SHJ', revenue:  68_400_000, subscribers:   720_000 },
  { emirate: 'Ajman',          code: 'AJM', revenue:  19_800_000, subscribers:   208_000 },
  { emirate: 'Ras Al Khaimah', code: 'RAK', revenue:  16_200_000, subscribers:   174_000 },
  { emirate: 'Fujairah',       code: 'FUJ', revenue:  10_400_000, subscribers:   112_000 },
  { emirate: 'Umm Al Quwain',  code: 'UAQ', revenue:   6_300_000, subscribers:    68_000 },
];

export const IDENTITY_CONFIDENCE: IdentityBucket[] = [
  { range: '0.95–1.00', label: 'Verified',          count: 4_124_000 },
  { range: '0.85–0.94', label: 'High confidence',   count: 1_287_000 },
  { range: '0.70–0.84', label: 'Medium confidence', count:   492_000 },
  { range: '0.50–0.69', label: 'Low confidence',    count:   188_000 },
  { range: '0.00–0.49', label: 'Unresolved',        count:    71_000 },
];

export const CONSENT_PURPOSES: ConsentPurpose[] = [
  { purpose: 'Service ops',         granted: 6_140_000, denied:    18_000, pending:    4_000 },
  { purpose: 'Marketing analytics', granted: 4_280_000, denied: 1_690_000, pending:  192_000 },
  { purpose: 'AI processing',       granted: 3_410_000, denied: 2_290_000, pending:  462_000 },
  { purpose: 'Fraud detection',     granted: 5_988_000, denied:   142_000, pending:   32_000 },
  { purpose: '3rd party sharing',   granted: 1_890_000, denied: 4_140_000, pending:  132_000 },
  { purpose: 'Personalization',     granted: 3_870_000, denied: 2_140_000, pending:  152_000 },
];

export const CHANNEL_REACH: ChannelReach[] = [
  { channel: 'Voice',    reach: 99.2, active30d: 87.4 },
  { channel: 'SMS',      reach: 98.8, active30d: 92.6 },
  { channel: 'Email',    reach: 71.3, active30d: 38.2 },
  { channel: 'Push',     reach: 64.8, active30d: 47.5 },
  { channel: 'WhatsApp', reach: 58.1, active30d: 51.3 },
  { channel: 'In-app',   reach: 49.6, active30d: 33.7 },
  { channel: 'Web',      reach: 76.4, active30d: 28.9 },
];

export const TOP_CAMPAIGNS: TopCampaign[] = [
  { id: 'c-001', name: '5G upgrade · Dubai postpaid',         channel: 'sms',      status: 'live',      segment: 'Postpaid · DXB',  reach: 184_000, conversion: 7.4 },
  { id: 'c-002', name: 'Roaming pack · Q1 promo',             channel: 'push',     status: 'live',      segment: 'Postpaid',         reach: 412_000, conversion: 4.8 },
  { id: 'c-003', name: 'Recharge · Ramadan',                  channel: 'whatsapp', status: 'live',      segment: 'Prepaid',          reach: 1_280_000, conversion: 12.1 },
  { id: 'c-004', name: 'Enterprise SIM consolidation',        channel: 'email',    status: 'scheduled', segment: 'Enterprise',       reach:  18_400, conversion: 0 },
  { id: 'c-005', name: 'IoT fleet refresh · Q4',              channel: 'email',    status: 'completed', segment: 'IoT',              reach:  62_000, conversion: 18.6 },
];

// Aggregated KPIs
export interface CustomerKPIs {
  totalCustomers: number;
  activeSubscribers: number;
  identityResolved: number;     // % with DTX_ID resolved
  consentCompliance: number;    // % with valid TRA-compliant consent
  avgArpu: number;              // AED per month
  livePipelines: number;
}

export type RegionFilter = 'all' | 'DXB' | 'AUH' | 'SHJ' | 'NORTH';
export type SegmentFilter = 'all' | 'postpaid' | 'prepaid' | 'enterprise' | 'iot';

// Approximate share of total customers by region — used to scale aggregates
// when a region filter is applied. NORTH = AJM + RAK + FUJ + UAQ.
export const REGION_SHARE: Record<RegionFilter, number> = {
  all: 1,
  DXB: 0.38,
  AUH: 0.32,
  SHJ: 0.14,
  NORTH: 0.10,
};

export const REGION_CODES: Record<RegionFilter, string[] | null> = {
  all: null,
  DXB: ['DXB'],
  AUH: ['AUH'],
  SHJ: ['SHJ'],
  NORTH: ['AJM', 'RAK', 'FUJ', 'UAQ'],
};

// Share of each filterable segment within the customer base.
function segmentShare(segment: SegmentFilter): number {
  if (segment === 'all') return 1;
  const total = CUSTOMER_SEGMENTS.reduce((sum, s) => sum + s.count, 0);
  const seg = CUSTOMER_SEGMENTS.find((s) => s.id === segment);
  return seg ? seg.count / total : 1;
}

export function computeKPIs(
  region: RegionFilter = 'all',
  segment: SegmentFilter = 'all',
): CustomerKPIs {
  const factor = REGION_SHARE[region] * segmentShare(segment);
  const baseTotal = CUSTOMER_SEGMENTS.reduce((sum, s) => sum + s.count, 0);
  const totalCustomers = Math.round(baseTotal * factor);
  const activeSubscribers = Math.round(totalCustomers * 0.927);

  // ARPU shifts with segment filter — enterprise pulls up, prepaid pulls down.
  const baseRevenue = CUSTOMER_SEGMENTS.reduce((sum, s) => sum + s.count * s.arpu, 0);
  const baseArpu = Math.round(baseRevenue / baseTotal);
  const segArpu = segment === 'all'
    ? baseArpu
    : (CUSTOMER_SEGMENTS.find((s) => s.id === segment)?.arpu ?? baseArpu);

  const resolvedTotal = IDENTITY_CONFIDENCE
    .filter((b) => parseFloat(b.range.split('–')[0]!) >= 0.85)
    .reduce((sum, b) => sum + b.count, 0);
  const identityBase = Math.round((resolvedTotal / IDENTITY_CONFIDENCE.reduce((s, b) => s + b.count, 0)) * 1000) / 10;
  // Enterprise + postpaid carry better identity resolution than prepaid/iot — nudge accordingly.
  const segIdentityNudge: Record<SegmentFilter, number> = {
    all: 0, postpaid: 1.4, prepaid: -1.8, enterprise: 2.6, iot: -3.2,
  };
  const identityResolved = Math.max(0, Math.min(100, identityBase + segIdentityNudge[segment]));

  const consentTotal = CONSENT_PURPOSES.reduce((sum, p) => sum + p.granted + p.denied + p.pending, 0);
  const consentGranted = CONSENT_PURPOSES.reduce((sum, p) => sum + p.granted, 0);
  const consentCompliance = Math.round((consentGranted / consentTotal) * 1000) / 10;

  return {
    totalCustomers,
    activeSubscribers,
    identityResolved,
    consentCompliance,
    avgArpu: segArpu,
    livePipelines: 12,
  };
}
