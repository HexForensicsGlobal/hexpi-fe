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
