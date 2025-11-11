export interface Organization {
  entry_id: number | null;
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
}

export interface Affiliate {
  entry_id: number | null;
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
}

export interface SearchParams {
  q: string;
  search_type?: 'organizations' | 'affiliates' | 'both';
  offset?: number;
  limit?: number;
}

export interface SearchResponse {
  query: string;
  query_time_ms: number;
  offset: number;
  limit: number;
  total_matched_organizations: number;
  total_matched_affiliates: number;
  total_in_response: number;
  organizations_in_response: number;
  affiliates_in_response: number;
  organizations: Organization[];
  affiliates: Affiliate[];
}

export interface HealthResponse {
  status: string;
  timestamp?: string;
}
