import axios from 'axios';
import type {
  SearchParams,
  SearchResponse,
  HealthResponse,
} from './types';

// API Service Interface
export interface IApiService {
  health(): Promise<HealthResponse>;
  keywordSearch(params: SearchParams, signal?: AbortSignal): Promise<SearchResponse>;
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
}

// Export singleton instance
export const api: IApiService = new ApiService();

export default api;
