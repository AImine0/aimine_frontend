// [공통 타입 정의] AI 툴, 카테고리, 필터 등 전체 프로젝트에서 사용하는 타입/인터페이스 선언
// src/types/index.ts

// ================================
// 공통 API 타입들
// ================================

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

// ================================
// 인증/사용자 관리 타입들
// ================================
export interface AuthGoogleLoginRequest {
  google_token: string;
}

export interface AuthGoogleLoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  user: {
    id: number;
    google_id: string;
    email: string;
    name: string;
  };
}

export interface AuthLogoutResponse {
  success: boolean;
  message: string;
}

export interface UserProfileResponse {
  id: number;
  google_id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

// ================================
// 북마크 관리 타입들
// ================================
export interface BookmarkCreateRequest {
  ai_service_id: number;
}

export interface BookmarkCreateResponse {
  success: boolean;
  message: string;
  bookmark: {
    user_id: number;
    tool_id: number;
  };
}

export interface BookmarkDeleteResponse {
  success: boolean;
  message: string;
}

export interface BookmarkListResponse {
  bookmarks: Array<{
    id: number;
    ai_service_id: number;
    service_name: string;
    service_summary: string;
    logo_url: string;
    category_display_name: string;
    pricing_type: string;
  }>;
  total_count: number;
}

// ================================
// 리뷰/평점 관리 타입들
// ================================
export interface ReviewCreateRequest {
  tool_id: number;
  rating: number;
  content: string;
}

export interface ReviewListResponse {
  reviews: Array<{
    id: number;
    user_nickname: string;
    rating: number;
    content: string;
    created_at: string;
    updated_at: string;
  }>;
  total_count: number;
  average_rating: number;
}

export interface ReviewDeleteResponse {
  success: boolean;
  message: string;
}

// ================================
// 키워드 관리 타입들
// ================================
export interface KeywordListResponse {
  keywords: Array<{
    id: number;
    keyword: string;
    type: 'FEATURE' | 'FUNCTION' | 'INDUSTRY' | 'USE_CASE';
    tool_count: number;
  }>;
  total_count: number;
}

export interface KeywordServiceListResponse {
  keyword: {
    id: number;
    keyword: string;
    type: 'FEATURE' | 'FUNCTION' | 'INDUSTRY' | 'USE_CASE';
  };
  tools: Array<{
    id: number;
    service_name: string;
    description: string;
    logo_url: string;
    category_name: string;
    pricing_type: 'FREEMIUM' | 'FREE' | 'PAID';
    overall_rating: number;
    bookmark_count: number;
  }>;
  total_count: number;
}

export interface KeywordByTypeResponse {
  keywords: Array<{
    id: number;
    keyword: string;
    type: 'FEATURE' | 'FUNCTION' | 'INDUSTRY' | 'USE_CASE';
    tool_count: number;
  }>;
  total_count: number;
}

// ================================
// 검색 및 필터링 타입들
// ================================
export interface SearchResponse {
  query: string;
  total_count: number;
  tools: Array<{
    id: number;
    service_name: string;
    description: string;
    logo_url: string;
    category_name: string;
    pricing_type: string;
    overall_rating: number;
    keywords: string[];
  }>;
  suggested_keywords: string[];
}

// ================================
// AI 서비스 관리 타입들
// ================================
export interface ServiceListResponse {
  success: boolean;
  data: Array<{
    id: number;
    serviceName: string;
    description: string;
    websiteUrl: string;
    logoUrl: string;
    launchDate: string;
    category: {
      id: number;
      name: string;
    };
    tag: string;
    pricingType: string;
    overallRating: number;
    keywords: string[];
  }>;
}

export interface ServiceDetailResponse {
  success: boolean;
  data: {
    id: number;
    serviceName: string;
    description: string;
    websiteUrl: string;
    logoUrl: string;
    launchDate: string;
    category: {
      id: number;
      name: string;
    };
    pricingType: string;
    overallRating: number;
    keywords: Array<{
      id: number;
      keyword: string;
      type: string;
    }>;
    reviews: Array<{
      id: number;
      user: {
        nickname: string;
      };
      rating: number;
      content: string;
      createdAt: string;
    }>;
  };
}

// ================================
// AI 조합 추천 타입들
// ================================
export interface AiCombinationListResponse {
  combinations: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    is_featured: boolean;
    ai_services: Array<{
      id: number;
      name: string;
      purpose: string;
    }>;
  }>;
  total_count: number;
}

export interface AiCombinationDetailResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  is_featured: boolean;
  ai_services: Array<{
    id: number;
    name: string;
    logo_url: string;
    purpose: string;
    tag: string;
  }>;
}

// ================================
// 기존 UI 호환성 타입들
// ================================

// 카테고리 관련 타입
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: number | null;
  toolCount?: number;
  children?: Category[];
}

// 키워드 타입 (기존 호환성)
export interface Keyword {
  id: number;
  keyword: string;
  type: 'FEATURE' | 'TAG' | 'CATEGORY' | 'FUNCTION' | 'INDUSTRY' | 'USE_CASE';
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

// 리뷰 타입 (기존 호환성)
export interface Review {
  id: number;
  user: {
    nickname: string;
  };
  rating: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

// AI 툴 상세 정보 타입 (API 응답 구조 + 이미지 매핑)
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
    slug?: string;
  };
  pricingType: string;
  pricingInfo?: string;
  pricingLink?: string;
  overallRating: number;
  recommendationScore?: number;
  viewCount?: number;
  bookmarkCount?: number;
  keywords: string[]; // 문자열 배열로 통일
  videos?: Video[];
  reviews?: Review[];
  // 이미지 매핑을 위한 추가 필드들
  serviceImageUrl: string;
  priceImageUrl: string;
  searchbarLogoUrl: string;
}

// AI 툴 목록 아이템 타입 (API 응답 구조)
export interface AIToolListItem {
  id: number;
  serviceName: string;
  description: string;
  websiteUrl: string;
  logoUrl?: string;
  launchDate: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  pricingType?: string;
  pricingInfo?: string;
  overallRating: number;
  viewCount?: number;
  bookmarkCount?: number;
  keywords?: string[];
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
  sortOrder?: number;
  icon?: string;
  tools?: any[];
  recommendations?: Array<{
    tool: {
      id: number;
      serviceName: string;
      description?: string;
      websiteUrl?: string;
      logoUrl?: string;
      overallRating?: number;
      category?: {
        name: string;
      };
    };
    recommendationText?: string;
    sortOrder?: number;
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
  tags: string[] | string;
  url: string;
  releaseDate: string;
  company: string;
  pricing: 'free' | 'paid' | 'freemium';
  featured: boolean;
  categoryLabel: string;
  roles: string[];
  userCount: number;
  aiRating: number;
  // 이미지 매핑을 위한 추가 필드들
  logoUrl: string;
  serviceImageUrl: string;
  priceImageUrl: string;
  searchbarLogoUrl: string;
}

// ================================
// 유틸리티 타입들
// ================================
export type FilterType = 'all' | 'free' | 'paid' | 'freemium';
export type SortType = 'name' | 'rating' | 'newest' | 'popular';
export type PricingType = 'FREE' | 'FREEMIUM' | 'PAID';
export type KeywordType = 'FEATURE' | 'FUNCTION' | 'INDUSTRY' | 'USE_CASE';

// 검색 및 필터링 파라미터
export interface SearchParams {
  q?: string;
  category?: string;
  pricing?: string;
  sort?: string; // 더 유연하게 변경
  page?: number;
  size?: number;
}

export interface ServiceListParams {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
  sort?: string; // 더 유연하게 변경
  pricing?: string; // 더 유연하게 변경
}