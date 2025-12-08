import axios from 'axios';
import type {
  SearchParams,
  SearchResponse,
  HealthResponse,
  Investigation,
  InvestigationDetail,
  InvestigationListParams,
  InvestigationListResponse,
  InvestigationNote,
  InvestigationEntity,
  CreateInvestigationPayload,
  UpdateInvestigationPayload,
  CreateInvestigationNotePayload,
  UpdateInvestigationNotePayload,
  LinkEntityPayload,
  OrganizationResult,
  AffiliateResult,
  CaseGroup,
  CreateCaseGroupPayload,
  UpdateCaseGroupPayload,
} from './types';

// Import mock services for investigation (backend not yet available)
import {
  mockGetInvestigations,
  mockGetInvestigation,
  mockCreateInvestigation,
  mockUpdateInvestigation,
  mockDeleteInvestigation,
  mockAddNote,
  mockUpdateNote,
  mockDeleteNote,
  mockLinkEntity,
  mockUnlinkEntity,
  mockGetGroups,
  mockCreateGroup,
  mockUpdateGroup,
  mockDeleteGroup,
  mockAssignInvestigationToGroup,
} from './investigation/mockInvestigationData';

// =============================================================================
// API SERVICE INTERFACE
// =============================================================================

export interface IApiService {
  // Health checks
  health(): Promise<HealthResponse>;
  searchHealth(): Promise<HealthResponse>;
  
  // Search
  keywordSearch(params: SearchParams, signal?: AbortSignal): Promise<SearchResponse>;

  // Investigation/Case Management
  getInvestigations(params?: InvestigationListParams, signal?: AbortSignal): Promise<InvestigationListResponse>;
  getInvestigation(id: string, signal?: AbortSignal): Promise<InvestigationDetail | null>;
  createInvestigation(payload: CreateInvestigationPayload): Promise<Investigation>;
  updateInvestigation(id: string, payload: UpdateInvestigationPayload): Promise<Investigation | null>;
  deleteInvestigation(id: string): Promise<boolean>;
  
  // Investigation Notes
  addInvestigationNote(investigationId: string, payload: CreateInvestigationNotePayload): Promise<InvestigationNote | null>;
  updateInvestigationNote(investigationId: string, noteId: string, payload: UpdateInvestigationNotePayload): Promise<InvestigationNote | null>;
  deleteInvestigationNote(investigationId: string, noteId: string): Promise<boolean>;
  
  // Investigation Entities
  linkEntityToInvestigation(
    investigationId: string,
    payload: LinkEntityPayload,
    entitySnapshot: OrganizationResult | AffiliateResult
  ): Promise<InvestigationEntity | null>;
  unlinkEntityFromInvestigation(investigationId: string, entityId: string): Promise<boolean>;

  // Case Groups
  getGroups(): Promise<CaseGroup[]>;
  createGroup(payload: CreateCaseGroupPayload): Promise<CaseGroup>;
  updateGroup(id: string, payload: UpdateCaseGroupPayload): Promise<CaseGroup | null>;
  deleteGroup(id: string): Promise<boolean>;
  assignInvestigationToGroup(investigationId: string, groupId: string | null): Promise<Investigation | null>;
}


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =============================================================================
// API SERVICE IMPLEMENTATION
// =============================================================================

// Flag to use mock data for investigations (backend not yet available)
const USE_MOCK_INVESTIGATIONS = true;

class ApiService implements IApiService {
  private client = apiClient;

  // ===========================================================================
  // HEALTH CHECKS
  // ===========================================================================

  async health(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/health');
    return response.data;
  }

  async searchHealth(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/api/v1/search/health');
    return response.data;
  }

  // ===========================================================================
  // SEARCH
  // ===========================================================================

  async keywordSearch(params: SearchParams, signal?: AbortSignal): Promise<SearchResponse> {
    const response = await this.client.get<SearchResponse>('/api/v1/search/keyword', {
      signal,
      params: {
        q: params.q,
        search_type: params.search_type || 'both',
        offset: params.offset || 0,
        limit: params.limit || 100,
        related_limit: params.related_limit ?? 20,
      },
    });
    return response.data;
  }

  // ===========================================================================
  // INVESTIGATIONS - CRUD
  // ===========================================================================

  async getInvestigations(
    params?: InvestigationListParams,
    signal?: AbortSignal
  ): Promise<InvestigationListResponse> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockGetInvestigations(params);
    }

    const response = await this.client.get<InvestigationListResponse>('/api/v1/investigations', {
      signal,
      params,
    });
    return response.data;
  }

  async getInvestigation(id: string, signal?: AbortSignal): Promise<InvestigationDetail | null> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockGetInvestigation(id);
    }

    try {
      const response = await this.client.get<InvestigationDetail>(`/api/v1/investigations/${id}`, {
        signal,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createInvestigation(payload: CreateInvestigationPayload): Promise<Investigation> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockCreateInvestigation(payload);
    }

    const response = await this.client.post<Investigation>('/api/v1/investigations', payload);
    return response.data;
  }

  async updateInvestigation(
    id: string,
    payload: UpdateInvestigationPayload
  ): Promise<Investigation | null> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockUpdateInvestigation(id, payload);
    }

    try {
      const response = await this.client.patch<Investigation>(
        `/api/v1/investigations/${id}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async deleteInvestigation(id: string): Promise<boolean> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockDeleteInvestigation(id);
    }

    try {
      await this.client.delete(`/api/v1/investigations/${id}`);
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  // ===========================================================================
  // INVESTIGATION NOTES
  // ===========================================================================

  async addInvestigationNote(
    investigationId: string,
    payload: CreateInvestigationNotePayload
  ): Promise<InvestigationNote | null> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockAddNote(investigationId, payload);
    }

    try {
      const response = await this.client.post<InvestigationNote>(
        `/api/v1/investigations/${investigationId}/notes`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateInvestigationNote(
    investigationId: string,
    noteId: string,
    payload: UpdateInvestigationNotePayload
  ): Promise<InvestigationNote | null> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockUpdateNote(investigationId, noteId, payload);
    }

    try {
      const response = await this.client.patch<InvestigationNote>(
        `/api/v1/investigations/${investigationId}/notes/${noteId}`,
        payload
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async deleteInvestigationNote(investigationId: string, noteId: string): Promise<boolean> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockDeleteNote(investigationId, noteId);
    }

    try {
      await this.client.delete(`/api/v1/investigations/${investigationId}/notes/${noteId}`);
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  // ===========================================================================
  // INVESTIGATION ENTITIES
  // ===========================================================================

  async linkEntityToInvestigation(
    investigationId: string,
    payload: LinkEntityPayload,
    entitySnapshot: OrganizationResult | AffiliateResult
  ): Promise<InvestigationEntity | null> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockLinkEntity(investigationId, payload, entitySnapshot);
    }

    try {
      const response = await this.client.post<InvestigationEntity>(
        `/api/v1/investigations/${investigationId}/entities`,
        { ...payload, entitySnapshot }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async unlinkEntityFromInvestigation(investigationId: string, entityId: string): Promise<boolean> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockUnlinkEntity(investigationId, entityId);
    }

    try {
      await this.client.delete(`/api/v1/investigations/${investigationId}/entities/${entityId}`);
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  // ===========================================================================
  // CASE GROUPS
  // ===========================================================================

  async getGroups(): Promise<CaseGroup[]> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockGetGroups();
    }

    const response = await this.client.get<CaseGroup[]>('/api/v1/groups');
    return response.data;
  }

  async createGroup(payload: CreateCaseGroupPayload): Promise<CaseGroup> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockCreateGroup(payload);
    }

    const response = await this.client.post<CaseGroup>('/api/v1/groups', payload);
    return response.data;
  }

  async updateGroup(id: string, payload: UpdateCaseGroupPayload): Promise<CaseGroup | null> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockUpdateGroup(id, payload);
    }

    try {
      const response = await this.client.patch<CaseGroup>(`/api/v1/groups/${id}`, payload);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async deleteGroup(id: string): Promise<boolean> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockDeleteGroup(id);
    }

    try {
      await this.client.delete(`/api/v1/groups/${id}`);
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  async assignInvestigationToGroup(investigationId: string, groupId: string | null): Promise<Investigation | null> {
    if (USE_MOCK_INVESTIGATIONS) {
      return mockAssignInvestigationToGroup(investigationId, groupId);
    }

    try {
      const response = await this.client.patch<Investigation>(
        `/api/v1/investigations/${investigationId}/group`,
        { groupId }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

// Export singleton instance
export const api: IApiService = new ApiService();

export default api;
