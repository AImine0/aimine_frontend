// src/services/toolApi.ts
import type { 
  ApiResponse, 
  AIToolDetail, 
  AIToolListItem 
} from '../types';

const API_BASE_URL = 'http://localhost:8080'; // /api 제거

class ToolApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // AI 툴 목록 조회 - 백엔드 엔드포인트에 맞게 수정
  async getToolList(): Promise<AIToolListItem[]> {
    const response = await this.request<ApiResponse<AIToolListItem[]>>('/ai-services');
    return response.data;
  }

  // AI 툴 상세 조회 - 백엔드 엔드포인트에 맞게 수정
  async getToolDetail(id: string): Promise<AIToolDetail> {
    try {
      const response = await this.request<AIToolDetail>(`/ai-services/${id}`);
      return response;
    } catch (error) {
      console.warn('API 호출 실패:', error);
      throw error;
    }
  }
}

export const toolApiService = new ToolApiService();