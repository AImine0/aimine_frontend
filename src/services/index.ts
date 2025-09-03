// src/services/index.ts
// 모든 API 서비스들을 한 곳에서 관리

export { apiService } from './api';
export { toolApiService } from './toolApi';
export { categoryApiService } from './categoryApi';
export { jobSituationApiService } from './jobSituationApi';

// API 기본 설정 - URL 수정
export const API_CONFIG = {
  BASE_URL: 'https://aimine.up.railway.app', // /api 제거
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API 엔드포인트 상수 - 백엔드와 일치하도록 수정
export const API_ENDPOINTS = {
  AI_SERVICES: '/ai-services',        // 백엔드 실제 엔드포인트
  CATEGORIES: '/categories',          
  JOB_SITUATIONS: '/job-situations',  
  BOOKMARKS: '/bookmarks',
  REVIEWS: '/reviews',
  KEYWORDS: '/keywords',
  SEARCH: '/search',
  AUTH: '/auth',
  AI_COMBINATIONS: '/ai-combinations'
} as const;