// src/services/api.ts
import type { 
  ApiResponse, 
  AIToolDetail, 
  AIToolListItem, 
  Category, 
  JobSituation,
  AITool 
} from '../types';
import { 
  dummyCategories, 
  dummyAIToolDetails,
  dummyAIToolListItems,
  transformToAITool 
} from '../data/dummyData';
import { getImageMapping } from '../utils/imageMapping';

const API_BASE_URL = 'http://localhost:8080/api';

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

  // 전체 AI 서비스 조회 - 백엔드가 직접 배열 반환 (첫 번째 방식: 더미 데이터 fallback)
  async getAllServices(): Promise<AITool[]> {
    try {
      // 백엔드가 직접 배열을 반환하므로 바로 받음
      const response = await this.request<AIToolListItem[]>('/tools');
      
      // AIToolListItem[] 타입으로 받아서 AITool[]로 변환
      const tools = Array.isArray(response) ? response : [];
      
      return tools.map(tool => {
        const categorySlug = tool.category?.slug || 'chatbot';
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
          userCount: tool.viewCount,
          aiRating: tool.overallRating,
          logoUrl: imageMapping.logo,
          serviceImageUrl: imageMapping.serviceImage,
          priceImageUrl: imageMapping.priceImage,
          searchbarLogoUrl: imageMapping.searchbarLogo
        };
      });
    } catch (error) {
      console.warn('API 호출 실패, 더미 데이터 사용:', error);
      // 더미 데이터를 AITool[] 형태로 변환하여 반환
      return dummyAIToolListItems.map(item => transformToAITool(item));
    }
  }

  // 특정 서비스 상세 조회 - 백엔드 응답 구조에 맞춤 (첫 번째 방식: 더미 데이터 fallback)
  async getServiceById(id: string): Promise<AIToolDetail | null> {
    try {
      const response = await this.request<ApiResponse<any>>(`/tools/${id}`);
      
      // 백엔드가 success, data, message 구조로 반환
      if (!response.success || !response.data) {
        console.error('Invalid response structure:', response);
        return null;
      }
      
      const toolData = response.data;
      const categorySlug = toolData.category?.slug || 'chatbot';
      const imageMapping = getImageMapping(toolData.serviceName, categorySlug);
      
      // AIToolDetail 형식으로 변환
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
        pricingInfo: toolData.pricingInfo || '',
        pricingLink: toolData.pricingLink,
        overallRating: toolData.overallRating || 0,
        viewCount: toolData.viewCount || 0,
        bookmarkCount: toolData.bookmarkCount || 0,
        keywords: toolData.keywords || [],
        videos: toolData.videos || [],
        reviews: toolData.reviews || [],
        // 이미지 매핑 추가
        serviceImageUrl: imageMapping.serviceImage,
        priceImageUrl: imageMapping.priceImage,
        searchbarLogoUrl: imageMapping.searchbarLogo
      };
      
      return toolDetail;
      
    } catch (error) {
      console.error('상세 조회 실패, 더미 데이터 사용:', error);
      // 더미 데이터 사용
      const dummyDetail = dummyAIToolDetails[id];
      if (dummyDetail) {
        const imageMapping = getImageMapping(dummyDetail.serviceName, dummyDetail.category.slug);
        return {
          ...dummyDetail,
          logoUrl: imageMapping.logo,
          serviceImageUrl: imageMapping.serviceImage,
          priceImageUrl: imageMapping.priceImage,
          searchbarLogoUrl: imageMapping.searchbarLogo
        };
      }
      return null;
    }
  }

  // 카테고리 목록 조회 (첫 번째 방식: 더미 데이터 fallback)
  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.request<ApiResponse<Category[]>>('/categories');
      return response.data;
    } catch (error) {
      console.warn('API 호출 실패, 더미 데이터 사용:', error);
      return dummyCategories;
    }
  }

  // 직업/상황별 추천 조회 (두 번째 방식: 에러 throw)
  async getJobSituations(): Promise<JobSituation[]> {
    try {
      console.log('🔄 API 호출 시작: /job-situations');
      
      // 백엔드가 ApiResponse로 감싸지 않고 직접 배열을 반환
      const response = await this.request<JobSituation[]>('/job-situations');
      
      console.log('📦 API 응답:', response);
      
      // 응답이 배열인지 확인
      if (!Array.isArray(response)) {
        console.warn('⚠️ 예상치 못한 응답 형태:', response);
        throw new Error('예상치 못한 API 응답 형태입니다');
      }
      
      // 빈 배열인 경우 처리
      if (response.length === 0) {
        console.warn('⚠️ API에서 빈 배열 반환');
        throw new Error('API에서 데이터가 없습니다');
      }
      
      console.log('✅ 유효한 응답 확인, 데이터 처리 시작');
      
      return response.map(jobSituation => {
        // recommendations가 있는 경우에만 이미지 매핑 적용
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
        
        // recommendations가 없거나 빈 배열인 경우 그대로 반환
        return jobSituation;
      });
    } catch (error) {
      console.warn('❌ API 호출 실패:', error);
      throw error; // 에러를 다시 throw하여 컴포넌트에서 처리할 수 있도록 함
    }
  }
}

// 싱글톤 인스턴스 생성
export const apiService = new ApiService();