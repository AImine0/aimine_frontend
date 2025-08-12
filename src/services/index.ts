// src/services/index.ts
// 모든 API 서비스들을 한 곳에서 관리

export { apiService } from './api';
export { toolApiService } from './toolApi';
export { categoryApiService } from './categoryApi';
export { jobSituationApiService } from './jobSituationApi';

// API 기본 설정
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API 엔드포인트 상수 (API 명세서에 명시된 것만)
export const API_ENDPOINTS = {
  TOOLS: '/tools',                    // ToolListResponse, ToolDetailResponse
  CATEGORIES: '/categories',          // CategoryListResponse
  JOB_SITUATIONS: '/job-situations',  // JobSituationListResponse
} as const; 