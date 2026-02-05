import type { Request, RequestCreate } from '@shared/types';
import mockRequests from '../../../../contracts/mock-data/requests.json';

/**
 * Mock API Service
 * Uses seed data from contracts for development without backend
 */
class MockApiClient {
  private requests: Request[] = mockRequests as Request[];
  private delay = 500; // Simulate network delay

  private async wait() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async getRequests(params?: {
    status?: string;
    priority?: string;
    category?: string;
    assigned_to?: string;
  }): Promise<Request[]> {
    await this.wait();
    
    let filtered = [...this.requests];
    
    if (params?.status) {
      filtered = filtered.filter(r => r.status === params.status);
    }
    if (params?.priority) {
      filtered = filtered.filter(r => r.priority === params.priority);
    }
    if (params?.category) {
      filtered = filtered.filter(r => r.category === params.category);
    }
    if (params?.assigned_to) {
      filtered = filtered.filter(r => r.assigned_to === params.assigned_to);
    }
    
    return filtered;
  }

  async getRequestById(id: string): Promise<Request> {
    await this.wait();
    
    const request = this.requests.find(r => r.id === id);
    if (!request) {
      throw new Error(`Request ${id} not found`);
    }
    return request;
  }

  async createRequest(data: RequestCreate): Promise<Request> {
    await this.wait();
    
    // Generate new ID
    const maxId = Math.max(
      ...this.requests.map(r => parseInt(r.id.replace('REQ-', '')))
    );
    const newId = `REQ-${String(maxId + 1).padStart(6, '0')}`;
    
    const newRequest: Request = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.requests.push(newRequest);
    return newRequest;
  }

  async updateRequest(id: string, data: Partial<Request>): Promise<Request> {
    await this.wait();
    
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Request ${id} not found`);
    }
    
    this.requests[index] = {
      ...this.requests[index],
      ...data,
      id, // Ensure id doesn't change
      updated_at: new Date().toISOString()
    };
    
    return this.requests[index];
  }

  async deleteRequest(id: string): Promise<void> {
    await this.wait();
    
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Request ${id} not found`);
    }
    
    this.requests.splice(index, 1);
  }

  // TODO: Implement triage endpoints
  // TODO: Implement analytics calculations
  // TODO: Add local storage persistence
}

export const mockApi = new MockApiClient();
export default mockApi;
