// src/services/categoryApi.ts
import type { ApiResponse, Category } from '../types';

const API_BASE_URL = 'http://localhost:8080'; // /api 제거

class CategoryApiService {
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

  // 카테고리 목록 조회
  async getCategoryList(): Promise<Category[]> {
    const response = await this.request<ApiResponse<Category[]>>('/categories');
    return response.data;
  }

  // 특정 카테고리 조회
  async getCategoryById(id: number): Promise<Category> {
    const response = await this.request<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  }

  // 카테고리별 툴 개수 조회
  async getCategoryToolCount(categoryId: number): Promise<number> {
    const response = await this.request<ApiResponse<{ count: number }>>(`/categories/${categoryId}/tool-count`);
    return response.data.count;
  }
}

export const categoryApiService = new CategoryApiService();