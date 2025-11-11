export interface Organization {
  id: string;
  name: string;
  description?: string;
  founded?: string;
  location?: string;
  website?: string;
  industry?: string;
}

export interface Affiliate {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}
