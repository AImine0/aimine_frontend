// src/services/api.ts
import type { 
  // 공통 API 타입들
  ApiResponse, 
  AIToolDetail, 
  Category, 
  JobSituation,
  AITool,
  // 새로운 API 타입들 - camelCase로 수정된 버전들
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
  ServiceListParams,
  BookmarkCreateResponse,
  BookmarkDeleteResponse,
  AuthLogoutResponse,
  ReviewCreateResponse,
  ReviewDeleteResponse,
  CategoryListResponse,
  KeywordListResponse,
  KeywordServiceListResponse,
  KeywordByTypeResponse,
  AiCombinationListResponse,
  AiCombinationDetailResponse
} from '../types/api'; // api.ts에서 임포트
import { getImageMapping } from '../utils/imageMapping';

const API_BASE_URL = 'https://aimine.up.railway.app';

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
    try {
      console.log('구글 로그인 요청 시작');
      
      // 백엔드가 단순 문자열을 받으므로 JSON 래핑 없이 전송
      const response = await this.request<AuthGoogleLoginResponse>('/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'  // JSON이 아닌 plain text로 전송
        },
        body: googleToken  // JSON.stringify 없이 직접 전송
      });
      
      // 토큰 저장
      if (response.access_token) {
        setAuthToken(response.access_token);
        console.log('액세스 토큰 저장 완료');
      }
      
      return response;
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('로그아웃 요청 시작');
      
      const response = await this.request<AuthLogoutResponse>('/auth/logout', {
        method: 'POST'
      }, true);  // requireAuth = true로 Authorization 헤더 자동 추가
      
      // 로컬 토큰 제거
      removeAuthToken();
      console.log('로그아웃 완료, 토큰 제거됨');
      
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 실패하더라도 로컬 토큰은 제거
      removeAuthToken();
      throw error;
    }
  }

  async getUserProfile(): Promise<UserProfileResponse> {
    try {
      console.log('사용자 프로필 조회 시작');
      
      const response = await this.request<UserProfileResponse>('/auth/me', {
        method: 'GET'
      }, true);  // requireAuth = true로 Authorization 헤더 자동 추가
      
      console.log('사용자 프로필 조회 완료:', response.email);
      return response;
      
    } catch (error) {
      console.error('사용자 프로필 조회 실패:', error);
      
      // 401 에러인 경우 토큰 제거 (이미 request 메서드에서 처리되지만 추가 보장)
      if (error instanceof Error && error.message.includes('401')) {
        removeAuthToken();
      }
      
      throw error;
    }
  }

  // 북마크 관련 api

  async addBookmark(aiServiceId: number): Promise<BookmarkCreateResponse> {
    try {
      console.log('북마크 추가 요청:', aiServiceId);
      
      // 백엔드가 camelCase를 기대하므로 수정
      const request: BookmarkCreateRequest = { 
        aiServiceId: aiServiceId  // 이미 camelCase로 올바름
      };
      
      console.log('요청 본문:', JSON.stringify(request));
      
      const response = await this.request<ApiResponse<BookmarkCreateResponse>>('/bookmarks', {
        method: 'POST',
        body: JSON.stringify(request)
      }, true);
      
      if (!response.success) {
        throw new Error(response.message || '북마크 추가 실패');
      }
      
      console.log('북마크 추가 완료:', response.data);
      return response.data;
    } catch (error) {
      console.error('북마크 추가 실패:', error);
      
      // 400 Bad Request 오류 처리
      if (error instanceof Error && error.message.includes('400')) {
        throw new Error('잘못된 요청입니다. 데이터를 확인해주세요.');
      }
      
      // 네트워크/CORS 오류 처리
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      }
      
      // 401 인증 오류 처리
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('로그인이 필요합니다.');
      }
      
      throw error;
    }
  }

  async removeBookmark(serviceId: number): Promise<BookmarkDeleteResponse> {
    try {
      console.log('북마크 제거 요청:', serviceId);
      
      const response = await this.request<ApiResponse<BookmarkDeleteResponse>>(`/bookmarks/${serviceId}`, {
        method: 'DELETE'
      }, true);
      
      if (!response.success) {
        throw new Error(response.message || '북마크 제거 실패');
      }
      
      console.log('북마크 제거 완료');
      return response.data;
    } catch (error) {
      console.error('북마크 제거 실패:', error);
      
      if (error instanceof Error && error.message.includes('400')) {
        throw new Error('잘못된 요청입니다. 서비스 ID를 확인해주세요.');
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('서버에 연결할 수 없습니다.');
      }
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('로그인이 필요합니다.');
      }
      
      throw error;
    }
  }

  async getBookmarks(): Promise<BookmarkListResponse> {
    try {
      console.log('북마크 목록 조회 시작');
      
      const response = await this.request<ApiResponse<BookmarkListResponse>>('/bookmarks', {
        method: 'GET'
      }, true);
      
      if (!response.success) {
        throw new Error(response.message || '북마크 목록 조회 실패');
      }
      
      console.log('북마크 목록 조회 완료');
      return response.data;
    } catch (error) {
      console.error('북마크 목록 조회 실패:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('서버에 연결할 수 없습니다.');
      }
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('로그인이 필요합니다.');
      }
      
      throw error;
    }
  }

  // 백엔드 응답에 맞춰 수정된 북마크 조회 메서드 (MyPage에서 사용)
  async getBookmarksFixed(): Promise<BookmarkListResponse> {
    try {
      console.log('북마크 목록 조회 시작 (수정된 메서드)');
      
      const response = await this.request<ApiResponse<BookmarkListResponse>>('/bookmarks', {
        method: 'GET'
      }, true);
      
      if (!response.success) {
        throw new Error(response.message || '북마크 목록 조회 실패');
      }
      
      console.log('백엔드 응답 구조:', response);
      console.log('실제 데이터:', response.data);
      
      // 백엔드 응답이 camelCase이므로 그대로 반환
      return response.data;
    } catch (error) {
      console.error('북마크 목록 조회 실패:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('서버에 연결할 수 없습니다.');
      }
      
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('로그인이 필요합니다.');
      }
      
      throw error;
    }
  }

  async checkBookmarkStatus(serviceId: number): Promise<boolean> {
    try {
      console.log('🔍 북마크 상태 확인 시작:', serviceId);
      console.log('🔒 인증 확인:', this.isAuthenticated());
      
      // 인증되지 않은 경우 false 반환
      if (!this.isAuthenticated()) {
        console.log('❌ 인증되지 않음, false 반환');
        return false;
      }
      
      const url = `/bookmarks/status?userId=1&serviceId=${serviceId}`;
      console.log('🌐 요청 URL:', `${API_BASE_URL}${url}`);
      
      const response = await this.request<ApiResponse<boolean>>(url, {
        method: 'GET'
      }, true);
      
      console.log('📥 북마크 상태 응답:', response);
      
      if (!response.success) {
        console.warn('⚠️ 북마크 상태 확인 API 실패:', response.message);
        // API 실패 시 북마크 목록에서 직접 확인
        return await this.checkBookmarkStatusFromList(serviceId);
      }
      
      const isBookmarked = Boolean(response.data);
      console.log('✅ 북마크 상태:', isBookmarked);
      return isBookmarked;
      
    } catch (error) {
      console.error('❌ 북마크 상태 확인 실패:', error);
      
      // API 에러 발생 시 북마크 목록에서 직접 확인
      console.log('🔄 북마크 목록에서 상태 확인 시도');
      return await this.checkBookmarkStatusFromList(serviceId);
    }
  }

  // 북마크 목록에서 직접 상태 확인하는 보조 메서드
  async checkBookmarkStatusFromList(serviceId: number): Promise<boolean> {
    try {
      console.log('📋 북마크 목록에서 상태 확인:', serviceId);
      
      const bookmarksResponse = await this.getBookmarks();
      const isBookmarked = bookmarksResponse.bookmarks.some(
        bookmark => bookmark.aiServiceId === serviceId
      );
      
      console.log('✅ 목록에서 확인한 북마크 상태:', isBookmarked);
      return isBookmarked;
      
    } catch (error) {
      console.error('❌ 북마크 목록에서 상태 확인 실패:', error);
      return false; // 실패 시 기본값
    }
  }

  // ================================
  // 리뷰/평점 관리
  // ================================
  
  async createReview(toolId: number, rating: number, content: string): Promise<ReviewCreateResponse> {
    try {
      console.log('리뷰 작성 요청:', { toolId, rating, content });
      
      const request: ReviewCreateRequest = { toolId: toolId, rating, content };
      
      // 백엔드가 ApiResponse로 래핑하여 응답하므로 구조에 맞게 처리
      const response = await this.request<ApiResponse<ReviewCreateResponse>>('/reviews', {
        method: 'POST',
        body: JSON.stringify(request)
      }, true);
      
      if (!response.success) {
        throw new Error(response.message || '리뷰 작성 실패');
      }
      
      console.log('리뷰 작성 완료');
      return response.data;
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      throw error;
    }
  }

  async getReviews(serviceId?: number): Promise<ReviewListResponse> {
    try {
      console.log('리뷰 목록 조회 요청:', serviceId);
      
      // serviceId 파라미터에 따라 endpoint 결정
      const endpoint = serviceId ? `/reviews?serviceId=${serviceId}` : '/reviews';
      
      // 백엔드가 ApiResponse로 래핑하여 응답하므로 구조에 맞게 처리
      const response = await this.request<ApiResponse<ReviewListResponse>>(endpoint, {
        method: 'GET'
      });
      
      if (!response.success) {
        console.warn('리뷰 목록 조회 API 실패:', response.message);
        // API 실패 시 빈 응답 반환
        return {
          reviews: [],
          total_count: 0,
          average_rating: 0
        };
      }
      
      console.log('리뷰 목록 조회 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
      // 에러가 발생해도 빈 응답 반환하여 UI가 깨지지 않도록 함
      return {
        reviews: [],
        total_count: 0,
        average_rating: 0
      };
    }
  }

  async deleteReview(reviewId: number): Promise<ReviewDeleteResponse> {
    try {
      console.log('리뷰 삭제 요청:', reviewId);
      
      // 백엔드가 ApiResponse로 래핑하여 응답하므로 구조에 맞게 처리
      const response = await this.request<ApiResponse<ReviewDeleteResponse>>(`/reviews/${reviewId}`, {
        method: 'DELETE'
      }, true);
      
      if (!response.success) {
        throw new Error(response.message || '리뷰 삭제 실패');
      }
      
      console.log('리뷰 삭제 완료');
      return response.data;
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      throw error;
    }
  }

  async checkReviewStatus(serviceId: number): Promise<boolean> {
    try {
      console.log('리뷰 작성 여부 확인:', serviceId);
      
      const response = await this.request<ApiResponse<boolean>>(`/reviews/status?serviceId=${serviceId}`, {
        method: 'GET'
      }, true);
      
      if (!response.success) {
        console.warn('리뷰 상태 확인 실패:', response.message);
        return false;
      }
      
      return Boolean(response.data);
    } catch (error) {
      console.error('리뷰 상태 확인 실패:', error);
      return false;
    }
  }

  // ================================
  // 검색 및 필터링
  // ================================
  
  async search(params: SearchParams): Promise<SearchResponse> {
    try {
      console.log('검색 요청:', params);
      
      const queryParams = new URLSearchParams();
      
      // 백엔드 파라미터와 정확히 매칭
      if (params.q) queryParams.append('q', params.q);
      if (params.category) queryParams.append('category', params.category);
      if (params.pricing) queryParams.append('pricing', params.pricing);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/search?${queryString}` : '/search';
      
      // 백엔드가 직접 SearchResponse를 반환 (ApiResponse 래핑 없음)
      const response = await this.request<SearchResponse>(endpoint, {
        method: 'GET'
      });
      
      console.log('검색 완료, 결과 수:', response.total_count);
      return response;
    } catch (error) {
      console.error('검색 실패:', error);
      throw error;
    }
  }

  // ================================
  // AI 서비스 관리
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
      
      // 백엔드 파라미터 이름과 정확히 매칭
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sort) queryParams.append('sort', params.sort);
      if (params?.pricing) queryParams.append('pricing', params.pricing);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/ai-services?${queryString}` : '/ai-services';
      
      // 백엔드가 ApiResponse<ServiceListResponse> 형태로 이중 래핑하여 응답
      const response = await this.request<ApiResponse<ServiceListResponse>>(endpoint);
      
      if (!response.success || !response.data) {
        throw new Error('Invalid response structure');
      }
      
      // ServiceListResponse에서 실제 데이터 추출
      const serviceList = response.data;
      if (!Array.isArray(serviceList.data)) {
        console.error('데이터가 배열이 아닙니다:', serviceList.data);
        return [];
      }

      // api.ts의 getAllServices 함수에서 tags 처리 부분 수정

      return serviceList.data.map(tool => {
        const categorySlug = getCategorySlug(tool.category?.name || '생산성');
        const imageMapping = getImageMapping(tool.serviceName, categorySlug);
        
        let tagsArray: string[];
        
        if (tool.tags && tool.tags !== '') {
          // DB tags 컬럼에 값이 있는 경우 - 배열로 변환 (AITool 타입에 맞게)
          tagsArray = [tool.tags]; // 문자열을 배열로 감싸기
        } else {
          // DB tags가 없는 경우 카테고리명을 fallback으로 사용
          tagsArray = [tool.category?.name || '생산성'];
        }
        
        return {
          id: tool.id.toString(),
          name: tool.serviceName,
          category: categorySlug,
          description: tool.description || '',
          features: tool.keywords || [],
          rating: Number(tool.overallRating) || 0,
          tags: tagsArray,
          url: tool.websiteUrl || '',
          releaseDate: tool.launchDate || '',
          company: 'Unknown',
          pricing: this.mapPricingType(tool.pricingType),
          featured: false,
          categoryLabel: tool.category?.name || '챗봇',
          roles: [],
          userCount: 0,
          aiRating: Number(tool.overallRating) || 0,
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
      // 백엔드가 ApiResponse<ServiceDetailResponse> 형태로 응답
      const response = await this.request<ApiResponse<ServiceDetailResponse>>(`/ai-services/${id}`);
      
      if (!response.success || !response.data) {
        console.error('Invalid response structure:', response);
        return null;
      }
      
      // ServiceDetailResponse에서 실제 데이터 추출
      const serviceDetail = response.data;
      const toolData = serviceDetail.data;
      
      const categorySlug = getCategorySlug(toolData.category?.name || '생산성');
      const imageMapping = getImageMapping(toolData.serviceName, categorySlug);
      
      const toolDetail: AIToolDetail = {
        id: toolData.id,
        serviceName: toolData.serviceName,
        description: toolData.description || '',
        websiteUrl: toolData.websiteUrl || '',
        logoUrl: imageMapping.logo,
        launchDate: toolData.launchDate || '',
        category: {
          id: toolData.category?.id || 1,
          name: toolData.category?.name || '챗봇',
          slug: categorySlug
        },
        pricingType: toolData.pricingType || 'FREE',
        pricingInfo: '',
        pricingLink: '',
        overallRating: Number(toolData.overallRating) || 0,
        viewCount: 0,
        bookmarkCount: 0,
        keywords: toolData.keywords?.map(k => k.keyword) || [],
        videos: [],
        reviews: toolData.reviews?.map(r => ({
          id: r.id,
          user: r.user,
          rating: Number(r.rating),
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

  // 가격 타입 매핑 헬퍼 메서드
  private mapPricingType(pricingType: string): 'free' | 'paid' | 'freemium' {
    switch (pricingType?.toUpperCase()) {
      case 'FREE':
        return 'free';
      case 'PAID':
        return 'paid';
      case 'FREEMIUM':
        return 'freemium';
      default:
        return 'free';
    }
  }

  // ================================
  // 카테고리 관리
  // ================================
  
  async getCategories(): Promise<Category[]> {
    try {
      console.log('카테고리 목록 조회 시작');
      
      // 백엔드가 ApiResponse<CategoryListResponse> 형태로 응답
      const response = await this.request<ApiResponse<CategoryListResponse>>('/categories');
      
      if (!response.success || !response.data) {
        throw new Error('카테고리 조회 응답 구조 오류');
      }
      
      // CategoryListResponse에서 실제 카테고리 배열 추출
      const categoryList = response.data;
      
      // 카테고리 데이터를 프론트엔드 Category 타입으로 변환
      const categories: Category[] = categoryList.categories?.map((cat: any) => ({
        id: cat.id,
        name: cat.displayName || cat.name,
        slug: getCategorySlug(cat.displayName || cat.name),
        description: `${cat.displayName || cat.name} 관련 AI 서비스들`,
        toolCount: Number(cat.serviceCount) || 0
      })) || [];
      
      console.log('카테고리 목록 조회 완료, 개수:', categories.length);
      return categories;
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
      throw error;
    }
  }

  // ================================
  // 키워드 관리
  // ================================
  
  async getKeywords(): Promise<any> {
    try {
      console.log('키워드 목록 조회 시작');
      
      const response = await this.request<ApiResponse<KeywordListResponse>>('/keywords');
      
      if (!response.success || !response.data) {
        throw new Error('키워드 조회 응답 구조 오류');
      }
      
      console.log('키워드 목록 조회 완료');
      return response.data;
    } catch (error) {
      console.error('키워드 목록 조회 실패:', error);
      throw error;
    }
  }

  async getKeywordServices(keywordId: number): Promise<any> {
    try {
      console.log('키워드별 AI 서비스 조회:', keywordId);
      
      const response = await this.request<ApiResponse<KeywordServiceListResponse>>(`/keywords/${keywordId}/aiservices`);
      
      if (!response.success || !response.data) {
        throw new Error('키워드 서비스 조회 응답 구조 오류');
      }
      
      console.log('키워드별 AI 서비스 조회 완료');
      return response.data;
    } catch (error) {
      console.error('키워드별 AI 서비스 조회 실패:', error);
      throw error;
    }
  }

  async getKeywordsByType(type: string): Promise<any> {
    try {
      console.log('키워드 타입별 조회:', type);
      
      const response = await this.request<ApiResponse<KeywordByTypeResponse>>(`/keywords?type=${type}`);
      
      if (!response.success || !response.data) {
        throw new Error('키워드 타입별 조회 응답 구조 오류');
      }
      
      console.log('키워드 타입별 조회 완료');
      return response.data;
    } catch (error) {
      console.error('키워드 타입별 조회 실패:', error);
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
    try {
      console.log('AI 조합 목록 조회:', params);
      
      const queryParams = new URLSearchParams();
      
      if (params?.category) queryParams.append('category', params.category);
      if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/ai-combinations?${queryString}` : '/ai-combinations';
      
      const response = await this.request<ApiResponse<AiCombinationListResponse>>(endpoint);
      
      if (!response.success || !response.data) {
        throw new Error('AI 조합 목록 조회 응답 구조 오류');
      }
      
      console.log('AI 조합 목록 조회 완료');
      return response.data;
    } catch (error) {
      console.error('AI 조합 목록 조회 실패:', error);
      throw error;
    }
  }

  async getAICombinationById(id: string): Promise<any> {
    try {
      console.log('AI 조합 상세 조회:', id);
      
      const response = await this.request<ApiResponse<AiCombinationDetailResponse>>(`/ai-combinations/${id}`);
      
      if (!response.success || !response.data) {
        throw new Error('AI 조합 상세 조회 응답 구조 오류');
      }
      
      console.log('AI 조합 상세 조회 완료');
      return response.data;
    } catch (error) {
      console.error('AI 조합 상세 조회 실패:', error);
      throw error;
    }
  }

  async getAICombinationCategories(): Promise<string[]> {
    try {
      console.log('AI 조합 카테고리 목록 조회');
      
      const response = await this.request<ApiResponse<string[]>>('/ai-combinations/categories');
      
      if (!response.success || !response.data) {
        throw new Error('AI 조합 카테고리 조회 응답 구조 오류');
      }
      
      console.log('AI 조합 카테고리 조회 완료');
      return response.data;
    } catch (error) {
      console.error('AI 조합 카테고리 조회 실패:', error);
      throw error;
    }
  }

  // ================================
  // 기존 직업 상황 (유지)
  // ================================
  
  async getJobSituations(): Promise<JobSituation[]> {
    try {
      console.log('직업 상황 조회 시작 (AI 조합 추천 API 사용)');
      
      // AI 조합 추천 API 호출
      const response = await this.request<ApiResponse<AiCombinationListResponse>>('/ai-combinations');
      
      if (!response.success || !response.data) {
        throw new Error('AI 조합 추천 조회 응답 구조 오류');
      }
      
      console.log('AI 조합 추천 조회 완료, 조합 수:', response.data.combinations.length);
      
      // AiCombinationListResponse를 JobSituation[] 형태로 변환
      const jobSituations: JobSituation[] = response.data.combinations.map((combo) => ({
        id: combo.id,
        category: combo.category || '생산성', // 👈 누락된 category 필드 추가
        title: combo.title,
        description: combo.description,
        recommendations: combo.aiServices.map((service) => ({
          tool: {
            id: service.id,
            serviceName: service.name,
            category: {
              name: combo.category || '생산성'
            },
            logoUrl: getImageMapping(service.name, getCategorySlug(combo.category || '생산성')).logo
          }
        }))
      }));
      
      console.log('직업 상황 데이터 변환 완료, 항목 수:', jobSituations.length);
      return jobSituations;
      
    } catch (error) {
      console.error('직업 상황 조회 실패:', error);
      throw error;
    }
  }

  // ================================
  // 유틸리티 메서드
  // ================================
  
  isAuthenticated(): boolean {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
      // JWT 토큰 만료 시간 체크 (기본적인 검증)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('토큰이 만료되었습니다');
        removeAuthToken();
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn('토큰 검증 실패:', error);
      removeAuthToken();
      return false;
    }
  }
  
  getToken(): string | null {
    return getAuthToken();
  }

  // 토큰 갱신이 필요한 경우를 대비한 메서드
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }
    
    try {
      // 현재 사용자 정보를 가져와서 토큰 유효성 확인
      await this.getUserProfile();
      return true;
    } catch (error) {
      console.warn('토큰 갱신 필요:', error);
      removeAuthToken();
      return false;
    }
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const apiService = new ApiService();

// 토큰 관리 함수들도 내보내기
export { getAuthToken, setAuthToken, removeAuthToken };