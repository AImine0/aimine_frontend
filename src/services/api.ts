// src/services/api.ts
import type { 
  // 공통 API 타입들
  ApiResponse, 
  AIToolDetail, 
  Category, 
  JobSituation,
  AITool,
  // 새로운 API 타입들
  AuthGoogleLoginResponse,
  UserProfileResponse,
  BookmarkCreateRequest,
  BookmarkListResponse,
  ReviewCreateRequest,
  ReviewListResponse,
  SearchResponse,
  ServiceListResponse,
  ServiceDetailResponse,
  SearchParams,
  ServiceListParams
} from '../types';
import { getImageMapping } from '../utils/imageMapping';

const API_BASE_URL = 'http://localhost:8080';

// 로컬 스토리지에서 토큰 관리
const TOKEN_KEY = 'access_token';

const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// 카테고리 이름을 slug로 변환하는 함수
const getCategorySlug = (categoryName: string): string => {
  const categoryMap: Record<string, string> = {
    '챗봇': 'chatbot',
    '텍스트': 'text',
    '이미지': 'image',
    '비디오': 'video',
    '오디오': 'audio',
    '코드': 'code',
    '3D': '3d',
    '교육': 'education',
    '비즈니스': 'business',
    '창의성': 'creativity',
    '생산성': 'productivity'
  };
  
  return categoryMap[categoryName] || 'chatbot';
};

class ApiService {
  private async request<T>(
    endpoint: string, 
    options?: RequestInit,
    requireAuth: boolean = false
  ): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      };

      // 인증이 필요한 경우 Authorization 헤더 추가
      if (requireAuth) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // 토큰이 만료된 경우 제거
          removeAuthToken();
          throw new Error('인증이 필요합니다');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ================================
  // 인증/사용자 관리
  // ================================
  
  async loginWithGoogle(googleToken: string): Promise<AuthGoogleLoginResponse> {
    const response = await this.request<AuthGoogleLoginResponse>('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ google_token: googleToken })
    });
    
    // 토큰 저장
    setAuthToken(response.access_token);
    
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST'
    }, true);
    
    // 로컬 토큰 제거
    removeAuthToken();
  }

  async getUserProfile(): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>('/auth/me', {
      method: 'GET'
    }, true);
  }

  // ================================
  // 북마크 관리
  // ================================
  
  async addBookmark(aiServiceId: number): Promise<void> {
    const request: BookmarkCreateRequest = { ai_service_id: aiServiceId };
    await this.request('/bookmarks', {
      method: 'POST',
      body: JSON.stringify(request)
    }, true);
  }

  async removeBookmark(serviceId: number): Promise<void> {
    await this.request(`/bookmarks/${serviceId}`, {
      method: 'DELETE'
    }, true);
  }

  async getBookmarks(): Promise<BookmarkListResponse> {
    return this.request<BookmarkListResponse>('/bookmarks', {
      method: 'GET'
    }, true);
  }

  // ================================
  // 리뷰/평점 관리
  // ================================
  
  async createReview(toolId: number, rating: number, content: string): Promise<ReviewListResponse> {
    const request: ReviewCreateRequest = { tool_id: toolId, rating, content };
    return this.request<ReviewListResponse>('/reviews', {
      method: 'POST',
      body: JSON.stringify(request)
    }, true);
  }

  async getReviews(): Promise<ReviewListResponse> {
    return this.request<ReviewListResponse>('/reviews', {
      method: 'GET'
    });
  }

  async deleteReview(reviewId: number): Promise<void> {
    await this.request(`/reviews/${reviewId}`, {
      method: 'DELETE'
    }, true);
  }

  // ================================
  // 키워드 관리
  // ================================
  
  async getKeywords(): Promise<any> {
    return this.request('/keywords', {
      method: 'GET'
    });
  }

  async getKeywordServices(keywordId: number): Promise<any> {
    return this.request(`/keywords/${keywordId}/aiservices`, {
      method: 'GET'
    });
  }

  async getKeywordsByType(type: string): Promise<any> {
    return this.request(`/keywords?type=${type}`, {
      method: 'GET'
    });
  }

  // ================================
  // 검색 및 필터링
  // ================================
  
  async search(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    
    // undefined가 아닌 값들만 추가
    if (params.q) queryParams.append('q', params.q);
    if (params.category) queryParams.append('category', params.category);
    if (params.pricing) queryParams.append('pricing', params.pricing);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.size) queryParams.append('size', params.size.toString());

    return this.request<SearchResponse>(`/search?${queryParams.toString()}`, {
      method: 'GET'
    });
  }

  // ================================
  // AI 서비스 관리 (기존 tools에서 변경)
  // ================================
  
  async getAllServices(params?: {
    page?: number;
    size?: number;
    category?: string;
    search?: string;
    sort?: string;
    pricing?: string;
  }): Promise<AITool[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/ai-services?${queryString}` : '/ai-services';
      
      const response = await this.request<ServiceListResponse>(endpoint);
      
      if (!response.success || !response.data) {
        throw new Error('Invalid response structure');
      }
      
      const actualData = response.data.data || response.data;
      if (!Array.isArray(actualData)) {
        console.error('데이터가 배열이 아닙니다:', actualData);
        return [];
      }
      return actualData.map(tool => {
        const categorySlug = getCategorySlug(tool.category?.name || '생산성');
        const imageMapping = getImageMapping(tool.serviceName, categorySlug);
        
        return {
          id: tool.id.toString(),
          name: tool.serviceName,
          category: categorySlug,
          description: tool.description,
          features: tool.keywords || [],
          rating: tool.overallRating,
          tags: tool.keywords || [],
          url: tool.websiteUrl,
          releaseDate: tool.launchDate,
          company: 'Unknown',
          pricing: (tool.pricingType?.toLowerCase() || 'free') as 'free' | 'paid' | 'freemium',
          featured: false,
          categoryLabel: tool.category?.name || '챗봇',
          roles: [],
          userCount: 0,
          aiRating: tool.overallRating,
          logoUrl: imageMapping.logo,
          serviceImageUrl: imageMapping.serviceImage,
          priceImageUrl: imageMapping.priceImage,
          searchbarLogoUrl: imageMapping.searchbarLogo
        };
      });
    } catch (error) {
      console.error('AI 서비스 조회 실패:', error);
      throw error;
    }
  }

  async getServiceById(id: string): Promise<AIToolDetail | null> {
    try {
      const response = await this.request<ServiceDetailResponse>(`/ai-services/${id}`);
      
      if (!response.success || !response.data) {
        console.error('Invalid response structure:', response);
        return null;
      }
      
      const toolData = response.data;
      const categorySlug = getCategorySlug(toolData.category?.name || '생산성');
      const imageMapping = getImageMapping(toolData.serviceName, categorySlug);
      
      const toolDetail: AIToolDetail = {
        id: toolData.id,
        serviceName: toolData.serviceName,
        description: toolData.description,
        websiteUrl: toolData.websiteUrl,
        logoUrl: imageMapping.logo,
        launchDate: toolData.launchDate,
        category: toolData.category || {
          id: 1,
          name: '챗봇',
          slug: 'chatbot'
        },
        pricingType: toolData.pricingType || 'FREE',
        pricingInfo: '',
        pricingLink: '',
        overallRating: toolData.overallRating || 0,
        viewCount: 0,
        bookmarkCount: 0,
        keywords: toolData.keywords?.map(k => k.keyword) || [],
        videos: [],
        reviews: toolData.reviews?.map(r => ({
          id: r.id,
          user: r.user,
          rating: r.rating,
          content: r.content,
          createdAt: r.createdAt,
          updatedAt: r.createdAt
        })) || [],
        serviceImageUrl: imageMapping.serviceImage,
        priceImageUrl: imageMapping.priceImage,
        searchbarLogoUrl: imageMapping.searchbarLogo
      };
      
      return toolDetail;
      
    } catch (error) {
      console.error('서비스 상세 조회 실패:', error);
      throw error;
    }
  }

  // ================================
  // AI 조합 추천
  // ================================
  
  async getAICombinations(params?: {
    category?: string;
    featured?: boolean;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/ai-combinations?${queryString}` : '/ai-combinations';
    
    return this.request(endpoint, {
      method: 'GET'
    });
  }

  async getAICombinationById(id: string): Promise<any> {
    return this.request(`/ai-combinations/${id}`, {
      method: 'GET'
    });
  }

  // ================================
  // 기존 카테고리 및 직업 상황 (유지)
  // ================================
  
  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.request<ApiResponse<Category[]>>('/categories');
      return response.data;
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
      throw error;
    }
  }

  async getJobSituations(): Promise<JobSituation[]> {
    try {
      console.log('🔄 API 호출 시작: /job-situations');
      
      const response = await this.request<JobSituation[]>('/job-situations');
      
      console.log('📦 API 응답:', response);
      
      if (!Array.isArray(response)) {
        console.warn('⚠️ 예상치 못한 응답 형태:', response);
        throw new Error('예상치 못한 API 응답 형태입니다');
      }
      
      if (response.length === 0) {
        console.warn('⚠️ API에서 빈 배열 반환');
        throw new Error('API에서 데이터가 없습니다');
      }
      
      console.log('✅ 유효한 응답 확인, 데이터 처리 시작');
      
      return response.map(jobSituation => {
        if (jobSituation.recommendations && Array.isArray(jobSituation.recommendations)) {
          return {
            ...jobSituation,
            recommendations: jobSituation.recommendations.map(rec => ({
              ...rec,
              tool: {
                ...rec.tool,
                logoUrl: getImageMapping(rec.tool.serviceName, getCategorySlug(rec.tool.category?.name || '생산성')).logo
              }
            }))
          };
        }
        
        return jobSituation;
      });
    } catch (error) {
      console.warn('❌ API 호출 실패:', error);
      throw error;
    }
  }

  // ================================
  // 유틸리티 메서드
  // ================================
  
  isAuthenticated(): boolean {
    return getAuthToken() !== null;
  }
  
  getToken(): string | null {
    return getAuthToken();
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const apiService = new ApiService();

// 토큰 관리 함수들도 내보내기
export { getAuthToken, setAuthToken, removeAuthToken };