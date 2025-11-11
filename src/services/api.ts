import axios from 'axios';
import type {
  Organization,
  Affiliate,
  SearchParams,
  PaginatedResponse,
  HealthResponse,
} from '../types';

// API Service Interface
export interface IApiService {
  health(): Promise<HealthResponse>;
  searchOrganizations(params: SearchParams): Promise<PaginatedResponse<Organization>>;
  searchAffiliates(params: SearchParams): Promise<PaginatedResponse<Affiliate>>;
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

// API Service Implementation
class ApiService implements IApiService {
  private client = apiClient;

  async health(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/health');
    return response.data;
  }

  async searchOrganizations(
    params: SearchParams
  ): Promise<PaginatedResponse<Organization>> {
    const response = await this.client.get<PaginatedResponse<Organization>>(
      '/search/organizations',
      {
        params: {
          query: params.query,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }
    );
    return response.data;
  }

  async searchAffiliates(
    params: SearchParams
  ): Promise<PaginatedResponse<Affiliate>> {
    const response = await this.client.get<PaginatedResponse<Affiliate>>(
      '/search/affiliates',
      {
        params: {
          query: params.query,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }
    );
    return response.data;
  }
}

// Export singleton instance
export const api: IApiService = new ApiService();

export default api;
