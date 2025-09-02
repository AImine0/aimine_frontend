// ================================
// 공통 타입
// ================================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// ================================
// 인증/사용자 관리
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
// 북마크 관리 (백엔드 camelCase 응답에 맞춰 수정)
// ================================
export interface BookmarkCreateRequest {
  aiServiceId: number;  // camelCase로 통일
}

export interface BookmarkCreateResponse {
  success: boolean;
  message: string;
  bookmark: {
    userId: number;    // camelCase
    toolId: number;    // camelCase
  };
}

export interface BookmarkDeleteResponse {
  success: boolean;
  message: string;
}

export interface BookmarkListResponse {
  bookmarks: Array<{
    id: number;
    aiServiceId: number;           // camelCase로 변경
    serviceName: string;           // camelCase로 변경  
    serviceSummary: string;        // camelCase로 변경
    logoUrl: string;               // camelCase로 변경
    categoryDisplayName: string;   // camelCase로 변경
    pricingType: string;           // camelCase로 변경
  }>;
  totalCount: number;              // camelCase로 변경
}

// ================================
// 리뷰/평점 관리
// ================================
export interface ReviewCreateRequest {
  toolId: number;
  rating: number;
  content: string;
}

export interface ReviewCreateResponse {
  success: boolean;
  message: string;
  review: {
    id: number;
    user_id: number;
    ai_service_id: number;
    rating: number;
    content: string;
    created_at: string;
  };
}

export interface ReviewDeleteResponse {
  success: boolean;
  message: string;
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

// ================================
// 키워드 관리
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
// 검색 및 필터링
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
// AI 서비스 관리
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
// 카테고리 관리
// ================================
export interface CategoryListResponse {
  categories: Array<{
    id: number;
    name: string;
    displayName: string;
    serviceCount: number;
  }>;
  totalCount: number;
}

// ================================
// AI 조합 추천
// ================================
export interface AiCombinationListResponse {
  combinations: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    isFeatured: boolean;        // camelCase
    aiServices: Array<{         // camelCase
      id: number;
      name: string;
      purpose: string;
    }>;
  }>;
  totalCount: number;           // camelCase
}

export interface AiCombinationDetailResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  isFeatured: boolean;          // camelCase
  aiServices: Array<{           // camelCase
    id: number;
    name: string;
    logoUrl: string;            // camelCase
    purpose: string;
    tag: string;
  }>;
}

// ================================
// 검색 및 필터링 파라미터
// ================================
export interface SearchParams {
  q?: string;
  category?: string;
  pricing?: string;
  sort?: 'rating' | 'latest' | 'popular';
  page?: number;
  size?: number;
}

export interface ServiceListParams {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
  sort?: 'rating' | 'latest' | 'popular';
  pricing?: 'FREE' | 'FREEMIUM' | 'PAID';
}

// ================================
// UI 관련 타입들 (기존 호환성)
// ================================
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
  featured: boolean;
  categoryLabel: string;
  roles: string[];
  userCount: number;
  aiRating: number;
  logoUrl: string;
  serviceImageUrl: string;
  priceImageUrl: string;
  searchbarLogoUrl: string;
}

export interface AIToolListItem {
  id: number;
  serviceName: string;
  description: string;
  websiteUrl: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  pricingType?: string;
  overallRating: number;
  keywords?: string[];
  launchDate: string;
  viewCount?: number;
}

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
  viewCount?: number;
  bookmarkCount?: number;
  keywords: string[];
  videos?: any[];
  reviews: Array<{
    id: number;
    user: {
      nickname: string;
    };
    rating: number;
    content: string;
    createdAt: string;
    updatedAt?: string;
  }>;
  serviceImageUrl: string;
  priceImageUrl: string;
  searchbarLogoUrl: string;
}

export interface JobSituation {
  id: number;
  title: string;
  description: string;
  recommendations?: Array<{
    tool: {
      id: number;
      serviceName: string;
      category?: {
        name: string;
      };
      logoUrl?: string;
    };
  }>;
}

// ================================
// 유틸리티 타입들
// ================================
export type FilterType = 'all' | 'free' | 'paid' | 'freemium';
export type SortType = 'name' | 'rating' | 'newest' | 'popular';
export type PricingType = 'FREE' | 'FREEMIUM' | 'PAID';
export type KeywordType = 'FEATURE' | 'FUNCTION' | 'INDUSTRY' | 'USE_CASE';