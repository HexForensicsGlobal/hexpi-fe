/**
 * Mock data for Investigation/Case Management feature
 * Used during frontend development before backend API is ready
 */

import type {
  Investigation,
  InvestigationDetail,
  InvestigationNote,
  InvestigationEntity,
  InvestigationTimelineEvent,
  InvestigationStats,
  InvestigationListResponse,
  OrganizationResult,
  AffiliateResult,
} from "@/services/types";

// =============================================================================
// HELPER: Generate UUIDs
// =============================================================================

let uuidCounter = 1000;
export const generateMockId = (): string => {
  uuidCounter += 1;
  return `mock-${uuidCounter}-${Date.now().toString(36)}`;
};

// =============================================================================
// HELPER: Generate Case Numbers
// =============================================================================

let caseCounter = 41;
export const generateCaseNumber = (): string => {
  caseCounter += 1;
  return `INV-2025-${String(caseCounter).padStart(4, "0")}`;
};

// =============================================================================
// MOCK USERS (for createdBy, triggeredBy fields)
// =============================================================================

export const mockUsers = [
  { id: "user-1", name: "Dani Rivera", initials: "DR" },
  { id: "user-2", name: "Kwame Mensah", initials: "KM" },
  { id: "user-3", name: "Alex Chen", initials: "AC" },
  { id: "user-4", name: "Lila Okoro", initials: "LO" },
];

export const currentUserId = "user-1"; // Simulates logged-in user

// =============================================================================
// MOCK ENTITY SNAPSHOTS
// =============================================================================

const mockOrgSnapshot1: OrganizationResult = {
  organization_id: 12345,
  rcNumber: "RC-1234567",
  approvedName: "Apex Global Ventures Ltd",
  objectives: "Import and export of general merchandise",
  address: "45 Marina Road, Victoria Island",
  state: "Lagos",
  city: "Lagos",
  email: "info@apexglobal.ng",
  status: "ACTIVE",
  registrationDate: "2018-03-15",
  match_score: null,
};

const mockOrgSnapshot2: OrganizationResult = {
  organization_id: 67890,
  rcNumber: "RC-9876543",
  approvedName: "Sterling Infrastructure Partners",
  objectives: "Construction and civil engineering services",
  address: "12 Ahmadu Bello Way, Central Business District",
  state: "Abuja",
  city: "Abuja",
  email: "contact@sterlinginfra.com",
  status: "ACTIVE",
  registrationDate: "2015-07-22",
  match_score: null,
};

const mockAffiliateSnapshot1: AffiliateResult = {
  affiliate_id: "aff-001",
  organization_id: 12345,
  surname: "Okonkwo",
  firstname: "Chukwuma",
  otherName: "Emmanuel",
  email: "c.okonkwo@apexglobal.ng",
  phoneNumber: "+234 803 456 7890",
  occupation: "Director",
  city: "Lagos",
  state: "Lagos",
  nationality: "Nigerian",
  affiliate_type: "DIRECTOR",
  date_of_birth: "1975-08-12",
  shares_allotted: "250000",
  share_type: "Ordinary",
  gender: "Male",
  identity_number: "A12345678",
  match_score: null,
};

const mockAffiliateSnapshot2: AffiliateResult = {
  affiliate_id: "aff-002",
  organization_id: 12345,
  surname: "Adeyemi",
  firstname: "Folake",
  otherName: null,
  email: "f.adeyemi@gmail.com",
  phoneNumber: "+234 705 123 4567",
  occupation: "Accountant",
  city: "Ikeja",
  state: "Lagos",
  nationality: "Nigerian",
  affiliate_type: "SHAREHOLDER",
  date_of_birth: "1982-11-30",
  shares_allotted: "100000",
  share_type: "Ordinary",
  gender: "Female",
  identity_number: "B98765432",
  match_score: null,
};

const mockAffiliateSnapshot3: AffiliateResult = {
  affiliate_id: "aff-003",
  organization_id: 67890,
  surname: "Ibrahim",
  firstname: "Musa",
  otherName: "Abdullahi",
  email: "m.ibrahim@sterlinginfra.com",
  phoneNumber: "+234 809 876 5432",
  occupation: "Managing Director",
  city: "Abuja",
  state: "Abuja",
  nationality: "Nigerian",
  affiliate_type: "DIRECTOR",
  date_of_birth: "1968-04-20",
  shares_allotted: "500000",
  share_type: "Ordinary",
  gender: "Male",
  identity_number: "C55667788",
  match_score: null,
};

// =============================================================================
// MOCK INVESTIGATIONS
// =============================================================================

export const mockInvestigations: Investigation[] = [
  {
    id: "inv-001",
    caseNumber: "INV-2025-0042",
    title: "Apex Global Ventures - Financial Irregularities",
    description:
      "Investigation into suspected fraudulent transactions and shell company networks connected to Apex Global Ventures Ltd. Initial red flags identified through political contribution disclosures.",
    status: "active",
    closureReason: null,
    priority: "high",
    tags: ["fraud", "shell-companies", "political-exposure"],
    assigneeId: "user-1",
    collaboratorIds: ["user-2", "user-3"],
    createdAt: "2025-11-15T09:30:00Z",
    updatedAt: "2025-12-07T14:22:00Z",
    closedAt: null,
    createdBy: "user-1",
  },
  {
    id: "inv-002",
    caseNumber: "INV-2025-0041",
    title: "Sterling Infrastructure - Contract Kickbacks",
    description:
      "Examining potential kickback schemes in government infrastructure contracts awarded to Sterling Infrastructure Partners. Focus on Abuja-based projects from 2020-2024.",
    status: "active",
    closureReason: null,
    priority: "critical",
    tags: ["corruption", "government-contracts", "infrastructure"],
    assigneeId: "user-2",
    collaboratorIds: ["user-1"],
    createdAt: "2025-11-08T11:45:00Z",
    updatedAt: "2025-12-06T16:10:00Z",
    closedAt: null,
    createdBy: "user-2",
  },
  {
    id: "inv-003",
    caseNumber: "INV-2025-0038",
    title: "Cross-Border Money Movement - West Africa",
    description:
      "Tracing suspicious cross-border fund transfers involving multiple Nigerian and Ghanaian entities. Possible trade-based money laundering through over/under invoicing.",
    status: "on-hold",
    closureReason: null,
    priority: "medium",
    tags: ["money-laundering", "cross-border", "trade-finance"],
    assigneeId: "user-3",
    collaboratorIds: [],
    createdAt: "2025-10-20T08:00:00Z",
    updatedAt: "2025-11-28T10:30:00Z",
    closedAt: null,
    createdBy: "user-3",
  },
  {
    id: "inv-004",
    caseNumber: "INV-2025-0035",
    title: "Dual Citizenship Due Diligence - Tarek I.",
    description:
      "Background verification for individual claiming dual Nigerian-Lebanese citizenship. Travel pattern anomalies detected requiring further investigation.",
    status: "draft",
    closureReason: null,
    priority: "low",
    tags: ["due-diligence", "travel-anomaly", "identity"],
    assigneeId: "user-1",
    collaboratorIds: [],
    createdAt: "2025-10-05T14:20:00Z",
    updatedAt: "2025-10-05T14:20:00Z",
    closedAt: null,
    createdBy: "user-1",
  },
  {
    id: "inv-005",
    caseNumber: "INV-2025-0028",
    title: "Political Network Analysis - Adewale E.",
    description:
      "Mapping political connections and influence networks for high-profile individual. Investigation completed with comprehensive report delivered to client.",
    status: "closed",
    closureReason: "resolved",
    priority: "high",
    tags: ["political-exposure", "network-analysis", "pep"],
    assigneeId: "user-4",
    collaboratorIds: ["user-1", "user-2"],
    createdAt: "2025-08-12T10:00:00Z",
    updatedAt: "2025-10-30T17:45:00Z",
    closedAt: "2025-10-30T17:45:00Z",
    createdBy: "user-4",
  },
  {
    id: "inv-006",
    caseNumber: "INV-2025-0022",
    title: "Oil & Gas Subsidy Fraud Ring",
    description:
      "Investigation into suspected petroleum subsidy fraud involving multiple downstream companies. Closed due to insufficient evidence after document subpoena was denied.",
    status: "closed",
    closureReason: "unresolved",
    priority: "critical",
    tags: ["fraud", "oil-gas", "subsidy"],
    assigneeId: "user-2",
    collaboratorIds: ["user-3"],
    createdAt: "2025-06-01T09:00:00Z",
    updatedAt: "2025-09-15T11:30:00Z",
    closedAt: "2025-09-15T11:30:00Z",
    createdBy: "user-2",
  },
];

// =============================================================================
// MOCK NOTES FOR INV-001
// =============================================================================

const mockNotesInv001: InvestigationNote[] = [
  {
    id: "note-001",
    investigationId: "inv-001",
    entryType: "hypothesis",
    title: "Initial Hypothesis: Shell Company Network",
    content: `Based on preliminary analysis, I believe Apex Global Ventures is the hub of a shell company network used to:

1. **Layer political contributions** - Donations appear to come from multiple "independent" companies
2. **Invoice manipulation** - Overpriced services between related entities
3. **Asset concealment** - Real estate holdings registered to nominee directors

Key evidence needed:
- Full beneficial ownership traces
- Bank statement analysis
- Cross-referencing of director networks`,
    createdAt: "2025-11-15T10:00:00Z",
    updatedAt: "2025-11-15T10:00:00Z",
    createdBy: "user-1",
    isPinned: true,
  },
  {
    id: "note-002",
    investigationId: "inv-001",
    entryType: "finding",
    title: "Director Overlap Confirmed",
    content: `Confirmed that Chukwuma Okonkwo serves as director in 7 different companies:

| Company | Role | Registration Date |
|---------|------|-------------------|
| Apex Global Ventures | Director | 2018-03-15 |
| Zenith Holdings | Director | 2019-01-22 |
| Cascade Imports | Secretary | 2019-06-10 |
| Pinnacle Trading | Director | 2020-02-14 |
| Sunrise Logistics | Director | 2020-08-30 |
| Golden Palm Estates | Shareholder | 2021-03-05 |
| Meridian Services | Director | 2022-11-18 |

All companies share the same registered address variation (45-47 Marina Road).`,
    createdAt: "2025-11-18T14:30:00Z",
    updatedAt: "2025-11-20T09:15:00Z",
    createdBy: "user-1",
    isPinned: false,
  },
  {
    id: "note-003",
    investigationId: "inv-001",
    entryType: "lead",
    title: "New Lead: Folake Adeyemi Bank Records",
    content: `Source indicates Folake Adeyemi may have additional bank accounts not disclosed in company filings.

**Action items:**
- [ ] Request formal bank search through legal channels
- [ ] Check for property registered in her name
- [ ] Interview former employees (pending legal review)

**Source reliability:** Medium (anonymous tip via compliance hotline)`,
    createdAt: "2025-11-25T11:00:00Z",
    updatedAt: "2025-11-25T11:00:00Z",
    createdBy: "user-2",
    isPinned: false,
  },
  {
    id: "note-004",
    investigationId: "inv-001",
    entryType: "decision",
    title: "Decision: Expand Scope to Include Zenith Holdings",
    content: `After team review, we've decided to formally expand the investigation scope to include Zenith Holdings Ltd.

**Rationale:**
- Common directorship with Apex Global
- Suspicious inter-company transactions totaling ₦450M
- Client approved expanded scope and budget

**Next steps:**
1. Formal scope amendment document
2. Pull Zenith Holdings CAC records
3. Request transaction history from compliance`,
    createdAt: "2025-12-02T16:00:00Z",
    updatedAt: "2025-12-02T16:00:00Z",
    createdBy: "user-1",
    isPinned: true,
  },
  {
    id: "note-005",
    investigationId: "inv-001",
    entryType: "general",
    title: "Client Call Notes - Dec 5",
    content: `Quick sync with client (Legal Counsel, ABC Bank):

- They're pleased with progress so far
- Requested interim report by Dec 15
- Mentioned potential regulatory filing if findings warrant
- Budget extension approved for Q1 2026

No changes to investigation direction.`,
    createdAt: "2025-12-05T15:30:00Z",
    updatedAt: "2025-12-05T15:30:00Z",
    createdBy: "user-1",
    isPinned: false,
  },
];

// =============================================================================
// MOCK ENTITIES FOR INV-001
// =============================================================================

const mockEntitiesInv001: InvestigationEntity[] = [
  {
    id: "ent-001",
    investigationId: "inv-001",
    entityType: "organization",
    organizationId: 12345,
    affiliateId: null,
    role: "company-of-interest",
    notes: "Primary subject company. Hub of suspected shell network.",
    linkedAt: "2025-11-15T09:35:00Z",
    linkedBy: "user-1",
    entitySnapshot: mockOrgSnapshot1,
  },
  {
    id: "ent-002",
    investigationId: "inv-001",
    entityType: "affiliate",
    organizationId: null,
    affiliateId: "aff-001",
    role: "subject",
    notes: "Key director with overlapping positions in 7 companies. Primary person of interest.",
    linkedAt: "2025-11-15T10:15:00Z",
    linkedBy: "user-1",
    entitySnapshot: mockAffiliateSnapshot1,
  },
  {
    id: "ent-003",
    investigationId: "inv-001",
    entityType: "affiliate",
    organizationId: null,
    affiliateId: "aff-002",
    role: "associate",
    notes: "Shareholder and accountant. May have knowledge of financial irregularities.",
    linkedAt: "2025-11-18T14:45:00Z",
    linkedBy: "user-1",
    entitySnapshot: mockAffiliateSnapshot2,
  },
];

// =============================================================================
// MOCK TIMELINE FOR INV-001
// =============================================================================

const mockTimelineInv001: InvestigationTimelineEvent[] = [
  {
    id: "evt-001",
    investigationId: "inv-001",
    eventType: "created",
    description: "Investigation created",
    metadata: null,
    occurredAt: "2025-11-15T09:30:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-002",
    investigationId: "inv-001",
    eventType: "entity_added",
    description: "Added organization: Apex Global Ventures Ltd",
    metadata: { entityType: "organization", entityId: 12345 },
    occurredAt: "2025-11-15T09:35:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-003",
    investigationId: "inv-001",
    eventType: "entity_added",
    description: "Added person: Chukwuma Emmanuel Okonkwo (Subject)",
    metadata: { entityType: "affiliate", entityId: "aff-001", role: "subject" },
    occurredAt: "2025-11-15T10:15:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-004",
    investigationId: "inv-001",
    eventType: "note_added",
    description: "Added hypothesis: Initial Hypothesis: Shell Company Network",
    metadata: { noteId: "note-001", entryType: "hypothesis" },
    occurredAt: "2025-11-15T10:00:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-005",
    investigationId: "inv-001",
    eventType: "status_changed",
    description: "Status changed from draft to active",
    metadata: { oldStatus: "draft", newStatus: "active" },
    occurredAt: "2025-11-15T10:30:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-006",
    investigationId: "inv-001",
    eventType: "entity_added",
    description: "Added person: Folake Adeyemi (Associate)",
    metadata: { entityType: "affiliate", entityId: "aff-002", role: "associate" },
    occurredAt: "2025-11-18T14:45:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-007",
    investigationId: "inv-001",
    eventType: "note_added",
    description: "Added finding: Director Overlap Confirmed",
    metadata: { noteId: "note-002", entryType: "finding" },
    occurredAt: "2025-11-18T14:30:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-008",
    investigationId: "inv-001",
    eventType: "collaborator_added",
    description: "Added collaborator: Kwame Mensah",
    metadata: { collaboratorId: "user-2" },
    occurredAt: "2025-11-20T09:00:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-009",
    investigationId: "inv-001",
    eventType: "note_added",
    description: "Added lead: New Lead: Folake Adeyemi Bank Records",
    metadata: { noteId: "note-003", entryType: "lead" },
    occurredAt: "2025-11-25T11:00:00Z",
    triggeredBy: "user-2",
  },
  {
    id: "evt-010",
    investigationId: "inv-001",
    eventType: "priority_changed",
    description: "Priority changed from medium to high",
    metadata: { oldPriority: "medium", newPriority: "high" },
    occurredAt: "2025-11-28T14:00:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-011",
    investigationId: "inv-001",
    eventType: "note_added",
    description: "Added decision: Decision: Expand Scope to Include Zenith Holdings",
    metadata: { noteId: "note-004", entryType: "decision" },
    occurredAt: "2025-12-02T16:00:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-012",
    investigationId: "inv-001",
    eventType: "collaborator_added",
    description: "Added collaborator: Alex Chen",
    metadata: { collaboratorId: "user-3" },
    occurredAt: "2025-12-03T10:00:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-013",
    investigationId: "inv-001",
    eventType: "note_added",
    description: "Added note: Client Call Notes - Dec 5",
    metadata: { noteId: "note-005", entryType: "general" },
    occurredAt: "2025-12-05T15:30:00Z",
    triggeredBy: "user-1",
  },
  {
    id: "evt-014",
    investigationId: "inv-001",
    eventType: "details_updated",
    description: "Updated investigation description",
    metadata: null,
    occurredAt: "2025-12-07T14:22:00Z",
    triggeredBy: "user-1",
  },
];

// =============================================================================
// MOCK DETAIL FOR INV-001
// =============================================================================

export const mockInvestigationDetailInv001: InvestigationDetail = {
  ...mockInvestigations[0],
  notes: mockNotesInv001,
  entities: mockEntitiesInv001,
  timeline: mockTimelineInv001.sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  ),
};

// =============================================================================
// MOCK STATS
// =============================================================================

export const mockInvestigationStats: InvestigationStats = {
  total: mockInvestigations.length,
  byStatus: {
    draft: mockInvestigations.filter((i) => i.status === "draft").length,
    active: mockInvestigations.filter((i) => i.status === "active").length,
    "on-hold": mockInvestigations.filter((i) => i.status === "on-hold").length,
    closed: mockInvestigations.filter((i) => i.status === "closed").length,
  },
  byPriority: {
    low: mockInvestigations.filter((i) => i.priority === "low").length,
    medium: mockInvestigations.filter((i) => i.priority === "medium").length,
    high: mockInvestigations.filter((i) => i.priority === "high").length,
    critical: mockInvestigations.filter((i) => i.priority === "critical").length,
  },
};

// =============================================================================
// MOCK LIST RESPONSE
// =============================================================================

export const mockInvestigationListResponse: InvestigationListResponse = {
  investigations: mockInvestigations,
  total: mockInvestigations.length,
  offset: 0,
  limit: 20,
  stats: mockInvestigationStats,
};

// =============================================================================
// IN-MEMORY DATA STORE (for mock CRUD operations)
// =============================================================================

// Clone arrays to allow mutations during mock operations
let investigationsStore = [...mockInvestigations];
let notesStore: Record<string, InvestigationNote[]> = {
  "inv-001": [...mockNotesInv001],
};
let entitiesStore: Record<string, InvestigationEntity[]> = {
  "inv-001": [...mockEntitiesInv001],
};
let timelineStore: Record<string, InvestigationTimelineEvent[]> = {
  "inv-001": [...mockTimelineInv001],
};

// =============================================================================
// MOCK SERVICE FUNCTIONS
// =============================================================================

/**
 * Simulates network delay
 */
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get investigation list with optional filters
 */
export async function mockGetInvestigations(
  params: import("@/services/types").InvestigationListParams = {}
): Promise<InvestigationListResponse> {
  await delay(400);

  let filtered = [...investigationsStore];

  // Apply status filter
  if (params.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status];
    filtered = filtered.filter((inv) => statuses.includes(inv.status));
  }

  // Apply priority filter
  if (params.priority) {
    const priorities = Array.isArray(params.priority) ? params.priority : [params.priority];
    filtered = filtered.filter((inv) => priorities.includes(inv.priority));
  }

  // Apply search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (inv) =>
        inv.title.toLowerCase().includes(searchLower) ||
        inv.description.toLowerCase().includes(searchLower) ||
        inv.caseNumber.toLowerCase().includes(searchLower)
    );
  }

  // Apply tags filter
  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter((inv) => params.tags!.some((tag) => inv.tags.includes(tag)));
  }

  // Apply sorting
  const sortBy = params.sortBy || "updatedAt";
  const sortOrder = params.sortOrder || "desc";
  filtered.sort((a, b) => {
    let aVal: string | number = a[sortBy as keyof Investigation] as string;
    let bVal: string | number = b[sortBy as keyof Investigation] as string;

    if (sortBy === "priority") {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      aVal = priorityOrder[a.priority];
      bVal = priorityOrder[b.priority];
    }

    if (sortOrder === "desc") {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
    return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
  });

  // Apply pagination
  const offset = params.offset || 0;
  const limit = params.limit || 20;
  const paginated = filtered.slice(offset, offset + limit);

  // Calculate stats from unfiltered data
  const stats: InvestigationStats = {
    total: investigationsStore.length,
    byStatus: {
      draft: investigationsStore.filter((i) => i.status === "draft").length,
      active: investigationsStore.filter((i) => i.status === "active").length,
      "on-hold": investigationsStore.filter((i) => i.status === "on-hold").length,
      closed: investigationsStore.filter((i) => i.status === "closed").length,
    },
    byPriority: {
      low: investigationsStore.filter((i) => i.priority === "low").length,
      medium: investigationsStore.filter((i) => i.priority === "medium").length,
      high: investigationsStore.filter((i) => i.priority === "high").length,
      critical: investigationsStore.filter((i) => i.priority === "critical").length,
    },
  };

  return {
    investigations: paginated,
    total: filtered.length,
    offset,
    limit,
    stats,
  };
}

/**
 * Get investigation detail by ID
 */
export async function mockGetInvestigation(id: string): Promise<InvestigationDetail | null> {
  await delay(300);

  const investigation = investigationsStore.find((inv) => inv.id === id);
  if (!investigation) return null;

  const notes = notesStore[id] || [];
  const entities = entitiesStore[id] || [];
  const timeline = (timelineStore[id] || []).sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  return {
    ...investigation,
    notes,
    entities,
    timeline,
  };
}

/**
 * Create a new investigation
 */
export async function mockCreateInvestigation(
  payload: import("@/services/types").CreateInvestigationPayload
): Promise<Investigation> {
  await delay(500);

  const now = new Date().toISOString();
  const newInvestigation: Investigation = {
    id: generateMockId(),
    caseNumber: generateCaseNumber(),
    title: payload.title,
    description: payload.description,
    status: payload.status || "draft",
    closureReason: null,
    priority: payload.priority || "medium",
    tags: payload.tags || [],
    assigneeId: currentUserId,
    collaboratorIds: [],
    createdAt: now,
    updatedAt: now,
    closedAt: null,
    createdBy: currentUserId,
  };

  investigationsStore = [newInvestigation, ...investigationsStore];
  notesStore[newInvestigation.id] = [];
  entitiesStore[newInvestigation.id] = [];
  timelineStore[newInvestigation.id] = [
    {
      id: generateMockId(),
      investigationId: newInvestigation.id,
      eventType: "created",
      description: "Investigation created",
      metadata: null,
      occurredAt: now,
      triggeredBy: currentUserId,
    },
  ];

  return newInvestigation;
}

/**
 * Update an investigation
 */
export async function mockUpdateInvestigation(
  id: string,
  payload: import("@/services/types").UpdateInvestigationPayload
): Promise<Investigation | null> {
  await delay(400);

  const index = investigationsStore.findIndex((inv) => inv.id === id);
  if (index === -1) return null;

  const existing = investigationsStore[index];
  const now = new Date().toISOString();

  // Track changes for timeline
  const timelineEvents: InvestigationTimelineEvent[] = [];

  if (payload.status && payload.status !== existing.status) {
    timelineEvents.push({
      id: generateMockId(),
      investigationId: id,
      eventType: "status_changed",
      description: `Status changed from ${existing.status} to ${payload.status}`,
      metadata: { oldStatus: existing.status, newStatus: payload.status },
      occurredAt: now,
      triggeredBy: currentUserId,
    });
  }

  if (payload.priority && payload.priority !== existing.priority) {
    timelineEvents.push({
      id: generateMockId(),
      investigationId: id,
      eventType: "priority_changed",
      description: `Priority changed from ${existing.priority} to ${payload.priority}`,
      metadata: { oldPriority: existing.priority, newPriority: payload.priority },
      occurredAt: now,
      triggeredBy: currentUserId,
    });
  }

  const updated: Investigation = {
    ...existing,
    ...payload,
    updatedAt: now,
    closedAt: payload.status === "closed" ? now : existing.closedAt,
  };

  investigationsStore[index] = updated;

  // Add timeline events
  if (!timelineStore[id]) timelineStore[id] = [];
  timelineStore[id].push(...timelineEvents);

  return updated;
}

/**
 * Delete an investigation
 */
export async function mockDeleteInvestigation(id: string): Promise<boolean> {
  await delay(300);

  const index = investigationsStore.findIndex((inv) => inv.id === id);
  if (index === -1) return false;

  investigationsStore.splice(index, 1);
  delete notesStore[id];
  delete entitiesStore[id];
  delete timelineStore[id];

  return true;
}

/**
 * Add a note to an investigation
 */
export async function mockAddNote(
  investigationId: string,
  payload: import("@/services/types").CreateInvestigationNotePayload
): Promise<InvestigationNote | null> {
  await delay(300);

  if (!investigationsStore.find((inv) => inv.id === investigationId)) return null;

  const now = new Date().toISOString();
  const newNote: InvestigationNote = {
    id: generateMockId(),
    investigationId,
    entryType: payload.entryType,
    title: payload.title,
    content: payload.content,
    createdAt: now,
    updatedAt: now,
    createdBy: currentUserId,
    isPinned: payload.isPinned || false,
  };

  if (!notesStore[investigationId]) notesStore[investigationId] = [];
  notesStore[investigationId].unshift(newNote);

  // Add timeline event
  if (!timelineStore[investigationId]) timelineStore[investigationId] = [];
  timelineStore[investigationId].push({
    id: generateMockId(),
    investigationId,
    eventType: "note_added",
    description: `Added ${payload.entryType}: ${payload.title}`,
    metadata: { noteId: newNote.id, entryType: payload.entryType },
    occurredAt: now,
    triggeredBy: currentUserId,
  });

  // Update investigation timestamp
  const invIndex = investigationsStore.findIndex((inv) => inv.id === investigationId);
  if (invIndex !== -1) {
    investigationsStore[invIndex].updatedAt = now;
  }

  return newNote;
}

/**
 * Update a note
 */
export async function mockUpdateNote(
  investigationId: string,
  noteId: string,
  payload: import("@/services/types").UpdateInvestigationNotePayload
): Promise<InvestigationNote | null> {
  await delay(300);

  const notes = notesStore[investigationId];
  if (!notes) return null;

  const noteIndex = notes.findIndex((n) => n.id === noteId);
  if (noteIndex === -1) return null;

  const now = new Date().toISOString();
  const updated: InvestigationNote = {
    ...notes[noteIndex],
    ...payload,
    updatedAt: now,
  };

  notesStore[investigationId][noteIndex] = updated;

  // Add timeline event
  if (!timelineStore[investigationId]) timelineStore[investigationId] = [];
  timelineStore[investigationId].push({
    id: generateMockId(),
    investigationId,
    eventType: "note_edited",
    description: `Edited note: ${updated.title}`,
    metadata: { noteId },
    occurredAt: now,
    triggeredBy: currentUserId,
  });

  return updated;
}

/**
 * Delete a note
 */
export async function mockDeleteNote(investigationId: string, noteId: string): Promise<boolean> {
  await delay(200);

  const notes = notesStore[investigationId];
  if (!notes) return false;

  const noteIndex = notes.findIndex((n) => n.id === noteId);
  if (noteIndex === -1) return false;

  const deletedNote = notes[noteIndex];
  notesStore[investigationId].splice(noteIndex, 1);

  // Add timeline event
  const now = new Date().toISOString();
  if (!timelineStore[investigationId]) timelineStore[investigationId] = [];
  timelineStore[investigationId].push({
    id: generateMockId(),
    investigationId,
    eventType: "note_deleted",
    description: `Deleted note: ${deletedNote.title}`,
    metadata: { noteId },
    occurredAt: now,
    triggeredBy: currentUserId,
  });

  return true;
}

/**
 * Link an entity to an investigation
 */
export async function mockLinkEntity(
  investigationId: string,
  payload: import("@/services/types").LinkEntityPayload,
  entitySnapshot: OrganizationResult | AffiliateResult
): Promise<InvestigationEntity | null> {
  await delay(400);

  if (!investigationsStore.find((inv) => inv.id === investigationId)) return null;

  const now = new Date().toISOString();
  const newEntity: InvestigationEntity = {
    id: generateMockId(),
    investigationId,
    entityType: payload.entityType,
    organizationId: payload.organizationId || null,
    affiliateId: payload.affiliateId || null,
    role: payload.role,
    notes: payload.notes || null,
    linkedAt: now,
    linkedBy: currentUserId,
    entitySnapshot,
  };

  if (!entitiesStore[investigationId]) entitiesStore[investigationId] = [];
  entitiesStore[investigationId].push(newEntity);

  // Add timeline event
  const entityName =
    payload.entityType === "organization"
      ? (entitySnapshot as OrganizationResult).approvedName
      : `${(entitySnapshot as AffiliateResult).firstname} ${(entitySnapshot as AffiliateResult).surname}`;

  if (!timelineStore[investigationId]) timelineStore[investigationId] = [];
  timelineStore[investigationId].push({
    id: generateMockId(),
    investigationId,
    eventType: "entity_added",
    description: `Added ${payload.entityType}: ${entityName} (${payload.role})`,
    metadata: {
      entityType: payload.entityType,
      entityId: payload.organizationId || payload.affiliateId,
      role: payload.role,
    },
    occurredAt: now,
    triggeredBy: currentUserId,
  });

  // Update investigation timestamp
  const invIndex = investigationsStore.findIndex((inv) => inv.id === investigationId);
  if (invIndex !== -1) {
    investigationsStore[invIndex].updatedAt = now;
  }

  return newEntity;
}

/**
 * Unlink an entity from an investigation
 */
export async function mockUnlinkEntity(investigationId: string, entityId: string): Promise<boolean> {
  await delay(200);

  const entities = entitiesStore[investigationId];
  if (!entities) return false;

  const entityIndex = entities.findIndex((e) => e.id === entityId);
  if (entityIndex === -1) return false;

  const removedEntity = entities[entityIndex];
  entitiesStore[investigationId].splice(entityIndex, 1);

  // Add timeline event
  const now = new Date().toISOString();
  const entityName =
    removedEntity.entityType === "organization"
      ? (removedEntity.entitySnapshot as OrganizationResult).approvedName
      : `${(removedEntity.entitySnapshot as AffiliateResult).firstname} ${(removedEntity.entitySnapshot as AffiliateResult).surname}`;

  if (!timelineStore[investigationId]) timelineStore[investigationId] = [];
  timelineStore[investigationId].push({
    id: generateMockId(),
    investigationId,
    eventType: "entity_removed",
    description: `Removed ${removedEntity.entityType}: ${entityName}`,
    metadata: {
      entityType: removedEntity.entityType,
      entityId: removedEntity.organizationId || removedEntity.affiliateId,
    },
    occurredAt: now,
    triggeredBy: currentUserId,
  });

  return true;
}

/**
 * Reset mock data to initial state (useful for testing)
 */
export function resetMockData(): void {
  investigationsStore = [...mockInvestigations];
  notesStore = { "inv-001": [...mockNotesInv001] };
  entitiesStore = { "inv-001": [...mockEntitiesInv001] };
  timelineStore = { "inv-001": [...mockTimelineInv001] };
  uuidCounter = 1000;
  caseCounter = 41;
}
