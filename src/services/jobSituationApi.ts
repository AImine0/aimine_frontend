// src/services/jobSituationApi.ts
import type { ApiResponse, JobSituation } from '../types';

const API_BASE_URL = 'http://localhost:8080'; // /api 제거

class JobSituationApiService {
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

  // 직업/상황별 추천 목록 조회
  async getJobSituationList(): Promise<JobSituation[]> {
    const response = await this.request<ApiResponse<JobSituation[]>>('/job-situations');
    return response.data;
  }

  // 특정 직업/상황별 추천 조회
  async getJobSituationById(id: number): Promise<JobSituation> {
    const response = await this.request<ApiResponse<JobSituation>>(`/job-situations/${id}`);
    return response.data;
  }

  // 카테고리별 직업/상황 추천 조회
  async getJobSituationsByCategory(category: string): Promise<JobSituation[]> {
    const response = await this.request<ApiResponse<JobSituation[]>>(
      `/job-situations/category/${encodeURIComponent(category)}`
    );
    return response.data;
  }
}

export const jobSituationApiService = new JobSituationApiService();