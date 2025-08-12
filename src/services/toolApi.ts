// src/services/toolApi.ts
import type { 
  ApiResponse, 
  AIToolDetail, 
  AIToolListItem 
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

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

  // AI 툴 목록 조회 (API 명세서: ToolListResponse)
  async getToolList(): Promise<AIToolListItem[]> {
    const response = await this.request<ApiResponse<AIToolListItem[]>>('/tools');
    return response.data;
  }

  // AI 툴 상세 조회 (API 명세서: ToolDetailResponse)
  async getToolDetail(id: string): Promise<AIToolDetail> {
    try {
      const response = await this.request<AIToolDetail>(`/tools/${id}`);
      return response;
    } catch (error) {
      console.warn('API 호출 실패:', error);
      throw error; // 에러를 다시 throw하여 컴포넌트에서 처리할 수 있도록 함
    }
  }
}

export const toolApiService = new ToolApiService(); 