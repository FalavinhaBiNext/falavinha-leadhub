import { Lead, LeadsResponse, ApiResponse } from '@/types/lead';

const API_BASE_URL = 'https://tributario.falavinhanext.com.br/api/api/v1';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new ApiError(`HTTP ${response.status}: ${errorText}`, response.status);
  }
  
  const data = await response.json();
  return data;
};

export const leadsApi = {
  async getAllLeads(): Promise<LeadsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/leads/findAll`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = await handleResponse<any>(response);
      
      // Transform the API response to match our interface
      return {
        leads: data.leads || data || [],
        total: data.total || data.length || 0,
        page: 1,
        totalPages: 1
      };
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error instanceof ApiError ? error : new ApiError('Failed to fetch leads');
    }
  },

  async toggleLeadStatus(leadId: string): Promise<ApiResponse<Lead>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/leads/changeAtivo/${leadId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      return await handleResponse<ApiResponse<Lead>>(response);
    } catch (error) {
      console.error('Error toggling lead status:', error);
      throw error instanceof ApiError ? error : new ApiError('Failed to update lead status');
    }
  },

  async assignConsultor(leadId: string, consultorId: string): Promise<ApiResponse<Lead>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/leads/${leadId}/assign-consultor`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ consultorId }),
        }
      );
      
      return await handleResponse<ApiResponse<Lead>>(response);
    } catch (error) {
      console.error('Error assigning consultor:', error);
      throw error instanceof ApiError ? error : new ApiError('Failed to assign consultor');
    }
  }
};