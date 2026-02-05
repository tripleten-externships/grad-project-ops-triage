import axios, { AxiosInstance } from 'axios';
import type { Request, RequestCreate, RequestUpdate } from '@shared/types';

/**
 * API Client
 * Communicates with the backend API following the API contract
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // TODO: Add request interceptor for auth tokens
    // TODO: Add response interceptor for error handling
  }

  // Request endpoints (following api-contract.yml)
  async getRequests(params?: {
    status?: string;
    priority?: string;
    category?: string;
    assigned_to?: string;
  }): Promise<Request[]> {
    const response = await this.client.get('/api/requests', { params });
    return response.data;
  }

  async getRequestById(id: string): Promise<Request> {
    const response = await this.client.get(`/api/requests/${id}`);
    return response.data;
  }

  async createRequest(data: RequestCreate): Promise<Request> {
    const response = await this.client.post('/api/requests', data);
    return response.data;
  }

  async updateRequest(id: string, data: Partial<RequestUpdate>): Promise<Request> {
    const response = await this.client.patch(`/api/requests/${id}`, data);
    return response.data;
  }

  async deleteRequest(id: string): Promise<void> {
    await this.client.delete(`/api/requests/${id}`);
  }

  // Triage endpoints
  async assignRequest(id: string, agentId: string): Promise<Request> {
    const response = await this.client.post(`/api/triage/${id}/assign`, {
      agent_id: agentId
    });
    return response.data;
  }

  async updatePriority(id: string, priority: string): Promise<Request> {
    const response = await this.client.patch(`/api/triage/${id}/priority`, {
      priority
    });
    return response.data;
  }

  // Analytics endpoints
  async getMetrics(params?: { start_date?: string; end_date?: string }) {
    const response = await this.client.get('/api/analytics/metrics', { params });
    return response.data;
  }

  // TODO: Add user endpoints
  // TODO: Add webhook subscription endpoints
  // TODO: Add error handling
}

export const api = new ApiClient();
export default api;
