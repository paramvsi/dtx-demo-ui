import type { User } from '@/lib/types';

function dicebear(seed: string): string {
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * 24 users — predominantly Emirati and broader MENA names with a realistic
 * minority of expats (Indian, British, Filipino) reflecting actual UAE telco
 * workforces. Distribution: 3 admins, 8 editors, 9 viewers, 4 pipeline-operators.
 * Status: 18 active, 4 invited, 2 suspended.
 *
 * Avatar URLs use DiceBear's `notionists` style; seeded random pastels for
 * avatars are content (not chrome) and so are exempt from the theme contract.
 */
export const USERS: User[] = [
  // 3 admins
  { id: 'u-001', name: 'Aisha Al Mansoori', email: 'aisha.almansoori@emiratesnet.ae', role: 'admin', status: 'active', lastLogin: '4m ago', avatarUrl: dicebear('aisha-almansoori'), group: 'DXB-Voice-Engineering' },
  { id: 'u-002', name: 'Khalid Al Hashimi', email: 'khalid.alhashimi@emiratesnet.ae', role: 'admin', status: 'active', lastLogin: '17m ago', avatarUrl: dicebear('khalid-alhashimi'), group: 'AUH-Billing-Ops' },
  { id: 'u-003', name: 'Hamad Al Nuaimi', email: 'hamad.alnuaimi@emiratesnet.ae', role: 'admin', status: 'active', lastLogin: '2h ago', avatarUrl: dicebear('hamad-alnuaimi'), group: 'Identity-Platform' },

  // 8 editors
  { id: 'u-004', name: 'Layla Khoury', email: 'layla.khoury@emiratesnet.ae', role: 'editor', status: 'active', lastLogin: '12m ago', avatarUrl: dicebear('layla-khoury'), group: 'CRM-Onboarding' },
  { id: 'u-005', name: 'Omar Al Suwaidi', email: 'omar.alsuwaidi@emiratesnet.ae', role: 'editor', status: 'active', lastLogin: '38m ago', avatarUrl: dicebear('omar-alsuwaidi'), group: 'AUH-Billing-Ops' },
  { id: 'u-006', name: 'Hessa Al Falasi', email: 'hessa.alfalasi@emiratesnet.ae', role: 'editor', status: 'active', lastLogin: '1h ago', avatarUrl: dicebear('hessa-alfalasi'), group: '5G-Platform' },
  { id: 'u-007', name: 'Yousef Al Otaiba', email: 'yousef.alotaiba@emiratesnet.ae', role: 'editor', status: 'active', lastLogin: '3h ago', avatarUrl: dicebear('yousef-alotaiba'), group: 'Roaming-Partners' },
  { id: 'u-008', name: 'Mariam Al Zaabi', email: 'mariam.alzaabi@emiratesnet.ae', role: 'editor', status: 'active', lastLogin: '24m ago', avatarUrl: dicebear('mariam-alzaabi'), group: 'IoT-Telemetry' },
  { id: 'u-009', name: 'Priya Sharma', email: 'priya.sharma@emiratesnet.ae', role: 'editor', status: 'active', lastLogin: '6m ago', avatarUrl: dicebear('priya-sharma'), group: 'Identity-Platform' },
  { id: 'u-010', name: 'Ahmed Al Shamsi', email: 'ahmed.alshamsi@emiratesnet.ae', role: 'editor', status: 'active', lastLogin: '52m ago', avatarUrl: dicebear('ahmed-alshamsi'), group: 'DXB-Voice-Engineering' },
  { id: 'u-011', name: 'James Whitaker', email: 'james.whitaker@emiratesnet.ae', role: 'editor', status: 'invited', lastLogin: 'never', avatarUrl: dicebear('james-whitaker'), group: 'Data-Platform' },

  // 9 viewers
  { id: 'u-012', name: 'Fatima Al Marri', email: 'fatima.almarri@emiratesnet.ae', role: 'viewer', status: 'active', lastLogin: '5h ago', avatarUrl: dicebear('fatima-almarri'), group: 'TRA-Compliance' },
  { id: 'u-013', name: 'Reem Al Romaithi', email: 'reem.alromaithi@emiratesnet.ae', role: 'viewer', status: 'active', lastLogin: '1d ago', avatarUrl: dicebear('reem-alromaithi'), group: 'TRA-Compliance' },
  { id: 'u-014', name: 'Noura Al Kaabi', email: 'noura.alkaabi@emiratesnet.ae', role: 'viewer', status: 'active', lastLogin: '2d ago', avatarUrl: dicebear('noura-alkaabi'), group: 'CRM-Onboarding' },
  { id: 'u-015', name: 'Maria Santos', email: 'maria.santos@emiratesnet.ae', role: 'viewer', status: 'active', lastLogin: '3d ago', avatarUrl: dicebear('maria-santos'), group: 'Customer-Care' },
  { id: 'u-016', name: 'Saif Al Qubaisi', email: 'saif.alqubaisi@emiratesnet.ae', role: 'viewer', status: 'invited', lastLogin: 'never', avatarUrl: dicebear('saif-alqubaisi'), group: 'Prepaid-Ops' },
  { id: 'u-017', name: 'Rashid Al Mazrouei', email: 'rashid.almazrouei@emiratesnet.ae', role: 'viewer', status: 'active', lastLogin: '4d ago', avatarUrl: dicebear('rashid-almazrouei'), group: 'AUH-Billing-Ops' },
  { id: 'u-018', name: 'Karen Estrella', email: 'karen.estrella@emiratesnet.ae', role: 'viewer', status: 'invited', lastLogin: 'never', avatarUrl: dicebear('karen-estrella'), group: 'Customer-Care' },
  { id: 'u-019', name: 'Vikram Patel', email: 'vikram.patel@emiratesnet.ae', role: 'viewer', status: 'suspended', lastLogin: '21d ago', avatarUrl: dicebear('vikram-patel'), group: 'Data-Platform' },
  { id: 'u-020', name: 'Mohamed Al Beloushi', email: 'mohamed.albeloushi@emiratesnet.ae', role: 'viewer', status: 'suspended', lastLogin: '32d ago', avatarUrl: dicebear('mohamed-albeloushi'), group: 'Customer-Care' },

  // 4 pipeline-operators
  { id: 'u-021', name: 'Asma Al Ali', email: 'asma.alali@emiratesnet.ae', role: 'pipeline-operator', status: 'active', lastLogin: '8m ago', avatarUrl: dicebear('asma-alali'), group: 'On-Call-NOC' },
  { id: 'u-022', name: 'Sultan Al Dhaheri', email: 'sultan.aldhaheri@emiratesnet.ae', role: 'pipeline-operator', status: 'active', lastLogin: '21m ago', avatarUrl: dicebear('sultan-aldhaheri'), group: 'On-Call-NOC' },
  { id: 'u-023', name: 'Anjali Krishnan', email: 'anjali.krishnan@emiratesnet.ae', role: 'pipeline-operator', status: 'active', lastLogin: '46m ago', avatarUrl: dicebear('anjali-krishnan'), group: 'On-Call-NOC' },
  { id: 'u-024', name: 'Tariq Al Marri', email: 'tariq.almarri@emiratesnet.ae', role: 'pipeline-operator', status: 'invited', lastLogin: 'never', avatarUrl: dicebear('tariq-almarri'), group: 'On-Call-NOC' },
];

export function getUser(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}
