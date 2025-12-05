import { supabase } from './supabase';
import { 
  Campaign, 
  CreateCampaignRequest, 
  UpdateCampaignRequest, 
  GenerateCampaignRequest, 
  ApiResponse 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private async getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken();
    
    const url = `${API_BASE_URL}/api${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Campaign methods
  async getCampaigns(): Promise<ApiResponse<Campaign[]>> {
    return this.request<Campaign[]>('/campaigns');
  }

  async getCampaign(id: string): Promise<ApiResponse<Campaign>> {
    return this.request<Campaign>(`/campaigns/${id}`);
  }

  async createCampaign(data: CreateCampaignRequest): Promise<ApiResponse<Campaign>> {
    return this.request<Campaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(id: string, data: UpdateCampaignRequest): Promise<ApiResponse<Campaign>> {
    return this.request<Campaign>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  async generateCampaign(data: GenerateCampaignRequest): Promise<ApiResponse<Campaign>> {
    return this.request<Campaign>('/campaigns/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.request<{ message: string; timestamp: string }>('/health');
  }
}

export const api = new ApiClient();
