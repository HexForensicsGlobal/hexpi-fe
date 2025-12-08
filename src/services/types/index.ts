/**
 * Organization search result with optional relevance score.
 * match_score is populated for related results (partial token matches).
 */
export interface OrganizationResult {
  organization_id: number | null;
  rcNumber: string | null;
  approvedName: string | null;
  objectives: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  email: string | null;
  status: string | null;
  registrationDate: string | null;
  /** Relevance score for related results. Name column matches = +2 points, other columns = +1 point. Null for primary results. */
  match_score: number | null;
}

/**
 * Affiliate search result with optional relevance score.
 * match_score is populated for related results (partial token matches).
 */
export interface AffiliateResult {
  affiliate_id: string | null;
  organization_id: number | null;
  surname: string | null;
  firstname: string | null;
  otherName: string | null;
  email: string | null;
  phoneNumber: string | null;
  occupation: string | null;
  city: string | null;
  state: string | null;
  nationality: string | null;
  affiliate_type: string | null;
  date_of_birth: string | null;
  shares_allotted: string | null;
  share_type: string | null;
  gender: string | null;
  identity_number: string | null;
  /** Relevance score for related results. Name column matches = +2 points, other columns = +1 point. Null for primary results. */
  match_score: number | null;
}

// Legacy type aliases for backward compatibility
export type Organization = OrganizationResult;
export type Affiliate = AffiliateResult;

export interface SearchParams {
  /** Search query. Multi-word queries are tokenized for tiered matching. */
  q: string;
  /** Type of entities to search */
  search_type?: 'organizations' | 'affiliates' | 'both';
  /** Number of primary results to skip for pagination (default: 0) */
  offset?: number;
  /** Maximum number of primary results to return (default: 100, max: 1000) */
  limit?: number;
  /** Maximum number of related/partial-match results to return (default: 20, max: 100) */
  related_limit?: number;
}

/**
 * Search response containing primary and related results.
 * 
 * Primary results (organizations, affiliates): Records where ALL search tokens match.
 * Related results (related_organizations, related_affiliates): Records where 2+ tokens match
 * but not all. These are sorted by match_score (highest first) and represent "Show Others" candidates.
 * 
 * For single-token queries, only primary fields are populated; related fields are empty.
 */
export interface SearchResponse {
  /** Original search query */
  query: string;
  /** Query execution time in milliseconds */
  query_time_ms: number;
  /** Pagination offset used */
  offset: number;
  /** Limit used for primary results */
  limit: number;
  /** Total organizations matching ALL search tokens */
  total_matched_organizations: number;
  /** Total affiliates matching ALL search tokens */
  total_matched_affiliates: number;
  /** Total organizations with partial token matches (2+ but not all) */
  total_related_organizations: number;
  /** Total affiliates with partial token matches (2+ but not all) */
  total_related_affiliates: number;
  /** Total primary results in this response */
  total_in_response: number;
  /** Number of primary organization results in this response */
  organizations_in_response: number;
  /** Number of primary affiliate results in this response */
  affiliates_in_response: number;
  /** Primary organization results where all search tokens match */
  organizations: OrganizationResult[];
  /** Primary affiliate results where all search tokens match */
  affiliates: AffiliateResult[];
  /** Related organization results with partial token matches. Sorted by match_score descending. */
  related_organizations: OrganizationResult[];
  /** Related affiliate results with partial token matches. Sorted by match_score descending. */
  related_affiliates: AffiliateResult[];
}

export interface HealthResponse {
  status: string;
  timestamp?: string;
}

// =============================================================================
// INVESTIGATION / CASE MANAGEMENT TYPES
// =============================================================================

/**
 * Investigation status workflow:
 * draft → active → on-hold → closed
 */
export type InvestigationStatus = 'draft' | 'active' | 'on-hold' | 'closed';

/**
 * Closure reason when investigation status is 'closed'
 */
export type InvestigationClosureReason = 'resolved' | 'unresolved' | 'archived' | null;

/**
 * Investigation priority levels
 */
export type InvestigationPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Journal entry types for structured note-taking
 */
export type InvestigationNoteType = 'hypothesis' | 'finding' | 'lead' | 'decision' | 'general';

/**
 * Role/relationship when linking an entity to an investigation
 */
export type InvestigationEntityRole = 
  | 'subject'           // Primary person/org of interest
  | 'associate'         // Known connection to subject
  | 'witness'           // Person with relevant information
  | 'company-of-interest' // Organization linked to investigation
  | 'other';

/**
 * Type of entity linked to an investigation
 */
export type InvestigationEntityType = 'organization' | 'affiliate';

/**
 * Timeline event types for automatic activity logging
 */
export type InvestigationTimelineEventType = 
  | 'created'
  | 'status_changed'
  | 'entity_added'
  | 'entity_removed'
  | 'note_added'
  | 'note_edited'
  | 'note_deleted'
  | 'priority_changed'
  | 'details_updated'
  | 'collaborator_added'
  | 'collaborator_removed';

/**
 * Main investigation/case entity
 */
export interface Investigation {
  /** Unique identifier (UUID) */
  id: string;
  /** Case reference number for display (e.g., "CASE-2025-0042") */
  caseNumber: string;
  /** Investigation title */
  title: string;
  /** Detailed description of the investigation scope and objectives */
  description: string;
  /** Current status in workflow */
  status: InvestigationStatus;
  /** Reason for closure (only when status is 'closed') */
  closureReason: InvestigationClosureReason;
  /** Priority level */
  priority: InvestigationPriority;
  /** Tags for categorization and filtering */
  tags: string[];
  /** User ID of the primary assignee (for future multi-user support) */
  assigneeId: string | null;
  /** User IDs of collaborators (for future multi-user support) */
  collaboratorIds: string[];
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when last updated */
  updatedAt: string;
  /** ISO timestamp when closed (null if not closed) */
  closedAt: string | null;
  /** User ID who created the investigation */
  createdBy: string;
}

/**
 * Journal entry/note attached to an investigation
 */
export interface InvestigationNote {
  /** Unique identifier (UUID) */
  id: string;
  /** Parent investigation ID */
  investigationId: string;
  /** Type of journal entry for filtering and display */
  entryType: InvestigationNoteType;
  /** Note title/summary */
  title: string;
  /** Rich text content (supports markdown) */
  content: string;
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when last updated */
  updatedAt: string;
  /** User ID who created the note */
  createdBy: string;
  /** Whether the note is pinned to top */
  isPinned: boolean;
}

/**
 * Entity (organization or affiliate) linked to an investigation
 */
export interface InvestigationEntity {
  /** Unique identifier for this link (UUID) */
  id: string;
  /** Parent investigation ID */
  investigationId: string;
  /** Type of linked entity */
  entityType: InvestigationEntityType;
  /** ID of the linked organization (if entityType is 'organization') */
  organizationId: number | null;
  /** ID of the linked affiliate (if entityType is 'affiliate') */
  affiliateId: string | null;
  /** Role/relationship to the investigation */
  role: InvestigationEntityRole;
  /** Additional context about why this entity was added */
  notes: string | null;
  /** ISO timestamp when linked */
  linkedAt: string;
  /** User ID who linked the entity */
  linkedBy: string;
  /** Cached snapshot of entity data at time of linking (for display) */
  entitySnapshot: OrganizationResult | AffiliateResult;
}

/**
 * Timeline event for automatic activity logging
 */
export interface InvestigationTimelineEvent {
  /** Unique identifier (UUID) */
  id: string;
  /** Parent investigation ID */
  investigationId: string;
  /** Type of event */
  eventType: InvestigationTimelineEventType;
  /** Human-readable description of what happened */
  description: string;
  /** Additional metadata (e.g., old/new values for changes) */
  metadata: Record<string, unknown> | null;
  /** ISO timestamp when event occurred */
  occurredAt: string;
  /** User ID who triggered the event */
  triggeredBy: string;
}

/**
 * Summary stats for investigation list views
 */
export interface InvestigationStats {
  total: number;
  byStatus: Record<InvestigationStatus, number>;
  byPriority: Record<InvestigationPriority, number>;
}

/**
 * Parameters for fetching/filtering investigations
 */
export interface InvestigationListParams {
  /** Filter by status */
  status?: InvestigationStatus | InvestigationStatus[];
  /** Filter by priority */
  priority?: InvestigationPriority | InvestigationPriority[];
  /** Search query for title/description */
  search?: string;
  /** Filter by tags (any match) */
  tags?: string[];
  /** Sort field */
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'title';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Pagination offset */
  offset?: number;
  /** Pagination limit */
  limit?: number;
}

/**
 * Response for investigation list endpoint
 */
export interface InvestigationListResponse {
  investigations: Investigation[];
  total: number;
  offset: number;
  limit: number;
  stats: InvestigationStats;
}

/**
 * Full investigation detail including related data
 */
export interface InvestigationDetail extends Investigation {
  /** All notes/journal entries */
  notes: InvestigationNote[];
  /** All linked entities */
  entities: InvestigationEntity[];
  /** Activity timeline */
  timeline: InvestigationTimelineEvent[];
}

/**
 * Payload for creating a new investigation
 */
export interface CreateInvestigationPayload {
  title: string;
  description: string;
  priority?: InvestigationPriority;
  tags?: string[];
  status?: InvestigationStatus;
}

/**
 * Payload for updating an investigation
 */
export interface UpdateInvestigationPayload {
  title?: string;
  description?: string;
  status?: InvestigationStatus;
  closureReason?: InvestigationClosureReason;
  priority?: InvestigationPriority;
  tags?: string[];
  assigneeId?: string | null;
  collaboratorIds?: string[];
}

/**
 * Payload for adding a note to an investigation
 */
export interface CreateInvestigationNotePayload {
  entryType: InvestigationNoteType;
  title: string;
  content: string;
  isPinned?: boolean;
}

/**
 * Payload for updating a note
 */
export interface UpdateInvestigationNotePayload {
  entryType?: InvestigationNoteType;
  title?: string;
  content?: string;
  isPinned?: boolean;
}

/**
 * Payload for linking an entity to an investigation
 */
export interface LinkEntityPayload {
  entityType: InvestigationEntityType;
  organizationId?: number;
  affiliateId?: string;
  role: InvestigationEntityRole;
  notes?: string;
}
