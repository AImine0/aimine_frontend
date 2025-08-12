// [공통 타입 정의] AI 툴, 카테고리, 필터 등 전체 프로젝트에서 사용하는 타입/인터페이스 선언
// src/types/index.ts

// API 공통 응답 구조
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
}

// 카테고리 관련 타입
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  parentId: number | null;
  toolCount: number;
  children?: Category[];
}

// 키워드 타입
export interface Keyword {
  id: number;
  keyword: string;
  type: 'FEATURE' | 'TAG' | 'CATEGORY';
}

// 비디오 타입
export interface Video {
  id: number;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
}

// 리뷰 타입
export interface Review {
  id: number;
  user: {
    nickname: string;
  };
  rating: number;
  content: string;
  createdAt: string;
}

// AI 툴 상세 정보 타입 (API 응답 구조)
export interface AIToolDetail {
  id: number;
  serviceName: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  launchDate: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  pricingType: 'FREE' | 'PAID' | 'FREEMIUM';
  pricingInfo: string;
  pricingLink?: string;
  overallRating: number;
  viewCount: number;
  bookmarkCount: number;
  keywords: Keyword[];
  videos: Video[];
  reviews: Review[];
  // 이미지 매핑을 위한 추가 필드들
  serviceImageUrl?: string;
  priceImageUrl?: string;
  searchbarLogoUrl?: string;
}

// AI 툴 목록 아이템 타입 (API 응답 구조)
export interface AIToolListItem {
  id: number;
  serviceName: string;
  description: string;
  websiteUrl: string;
  logoUrl: string;
  launchDate: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  pricingType: 'FREE' | 'PAID' | 'FREEMIUM';
  pricingInfo: string;
  overallRating: number;
  viewCount: number;
  bookmarkCount: number;
  keywords: string[];
  // 이미지 매핑을 위한 추가 필드들
  serviceImageUrl?: string;
  priceImageUrl?: string;
  searchbarLogoUrl?: string;
}

// 직업/상황별 추천 타입
export interface JobSituation {
  id: number;
  category: string;
  title: string;
  description: string;
  sortOrder: number;
  icon?: string;
  tools?: any[];
  recommendations: Array<{
    tool: {
      id: number;
      serviceName: string;
      description?: string;
      websiteUrl?: string;
      logoUrl: string;
      overallRating?: number;
      category: {
        name: string;
      };
    };
    recommendationText: string;
    sortOrder: number;
  }>;
}

// 기존 프론트엔드용 타입 (더미 데이터 호환성 유지)
export interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  rating: number;
  tags: string[];
  url: string;
  releaseDate: string;
  company: string;
  pricing: 'free' | 'paid' | 'freemium';
  featured?: boolean;
  categoryLabel: string;
  roles?: string[];
  userCount?: number;
  aiRating?: number;
  // 이미지 매핑을 위한 추가 필드들
  logoUrl?: string;
  serviceImageUrl?: string;
  priceImageUrl?: string;
  searchbarLogoUrl?: string;
}

export type FilterType = 'all' | 'free' | 'paid' | 'freemium';
export type SortType = 'name' | 'rating' | 'newest' | 'popular';