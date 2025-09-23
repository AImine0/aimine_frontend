// [검색 페이지] 통합 검색 및 고급 필터링 - AI 서비스 전체 검색

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import FilterBar from '../components/FilterBar';
import ToolCard from '../components/ToolCard';
import { apiService } from '../services';
import type { FilterType, AITool } from '../types';

// SearchParams 인터페이스를 직접 정의
interface SearchApiParams {
  q?: string;
  category?: string;
  pricing?: string;
  sort?: string;
  page?: number;
  size?: number;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 상태 관리
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // 필터 상태
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortType, setSortType] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  
  // 카운트 상태
  const [counts, setCounts] = useState({
    total: 0,
    free: 0,
    paid: 0,
    freemium: 0
  });

  // URL 파라미터에서 초기값 설정
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const pricing = searchParams.get('pricing') || 'all';
    const sort = searchParams.get('sort') || 'popular';

    setSearchQuery(query);
    setSelectedCategory(category);
    setActiveFilter(pricing as FilterType);
    setSortType(sort);
  }, [searchParams]);

  // 검색 실행
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setTotalCount(0);
        setSuggestedKeywords([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const searchApiParams: SearchApiParams = {
          q: searchQuery,
          category: selectedCategory || undefined,
          pricing: activeFilter === 'all' ? undefined : activeFilter.toUpperCase(),
          sort: sortType,
          size: 50
        };

        const response = await apiService.search(searchApiParams);
        
        console.log('검색 API 응답:', response);
        console.log('response.tools:', response.tools);
        console.log('response.tools 길이:', response.tools?.length);
        
        // 백엔드 camelCase 응답에 맞게 필드명 변경
        const tools: AITool[] = (response.tools || []).map(tool => {
          // 가격 타입 변환
          const getPricingType = (pricingType: string): 'free' | 'paid' | 'freemium' => {
            const type = pricingType?.toLowerCase();
            if (type === 'free') return 'free';
            if (type === 'paid') return 'paid';
            return 'freemium';
          };

          return {
            id: tool.id.toString(),
            name: tool.serviceName,
            category: selectedCategory || 'search',
            description: tool.description,
            features: tool.keywords || [],
            rating: Number(tool.overallRating) || 0,
            tags: tool.keywords || [],
            url: '',
            releaseDate: '',
            company: 'Unknown',
            pricing: getPricingType(tool.pricingType),
            featured: false,
            categoryLabel: tool.categoryName,
            roles: [],
            userCount: 0,
            aiRating: Number(tool.overallRating) || 0,
            logoUrl: tool.logoUrl || '/images/Logo/Logo_FINAL.svg',
            serviceImageUrl: tool.logoUrl || '/images/Logo/Logo_FINAL.svg',
            priceImageUrl: tool.logoUrl || '/images/Logo/Logo_FINAL.svg',
            searchbarLogoUrl: tool.logoUrl || '/images/Logo/Logo_FINAL.svg'
          };
        });

        setSearchResults(tools);
        setTotalCount(response.totalCount || 0);
        setSuggestedKeywords(response.suggestedKeywords || []);
        
        console.log('최종 tools 배열:', tools);
        console.log('tools 길이:', tools.length);

        // 가격별 카운트 계산
        const newCounts = {
          total: tools.length,
          free: tools.filter(t => t.pricing === 'free').length,
          paid: tools.filter(t => t.pricing === 'paid').length,
          freemium: tools.filter(t => t.pricing === 'freemium').length
        };
        setCounts(newCounts);

      } catch (error) {
        console.error('검색 실패:', error);
        setError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setSearchResults([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, selectedCategory, activeFilter, sortType]);

  // URL 파라미터 업데이트
  const updateURLParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    setSearchParams(newSearchParams);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    updateURLParams({ 
      pricing: filter === 'all' ? '' : filter 
    });
  };

  const handleSortChange = (sort: string) => {
    setSortType(sort);
    updateURLParams({ sort });
  };

  // 새로운 검색
  const handleNewSearch = (query: string) => {
    setSearchQuery(query);
    updateURLParams({ q: query });
  };

  // 카테고리 필터
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    updateURLParams({ category });
  };

  const breadcrumbItems = [
    { label: '검색' },
    ...(searchQuery ? [{ label: `"${searchQuery}"` }] : [])
  ];

  // 카테고리 옵션들
  const categoryOptions = [
    { key: '', name: '전체 카테고리' },
    { key: 'chatbot', name: '챗봇' },
    { key: 'text', name: '텍스트' },
    { key: 'image', name: '이미지' },
    { key: 'video', name: '비디오' },
    { key: 'audio', name: '오디오/음악' },
    { key: 'code', name: '코드' },
    { key: 'productivity', name: '생산성' },
    { key: '3d', name: '3D' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header tabs={[]} activeTab="" onTabChange={() => {}} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색어가 없을 때만 브레드크럼 표시 */}
        {!searchQuery && <Breadcrumb items={breadcrumbItems} />}

        {/* 검색 결과 제목 */}
        {searchQuery && (
          <div className="mb-8">
            <h1 
              className="font-semibold" 
              style={{ 
                color: '#202020', 
                fontWeight: 600, 
                fontSize: '24px', 
                fontFamily: 'Pretendard' 
              }}
            >
              '{searchQuery}'에 대한 검색 결과
            </h1>
          </div>
        )}

        {/* 검색 헤더 - 검색어가 없을 때만 표시 */}
        {!searchQuery && (
          <div className="mb-8">
            <h1 className="font-semibold mb-4" style={{ color: '#000000', fontSize: '32px', fontFamily: 'Pretendard' }}>
              AI 서비스 검색
            </h1>

            {/* 검색바 */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleNewSearch(searchQuery);
                      }
                    }}
                    placeholder="찾고 있는 AI 서비스를 입력하세요..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                    style={{ fontFamily: 'Pretendard' }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleNewSearch(searchQuery)}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                style={{ fontFamily: 'Pretendard' }}
              >
                검색
              </button>
            </div>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categoryOptions.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryFilter(category.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{ fontFamily: 'Pretendard' }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과가 있는 경우 */}
        {searchQuery && (
          <>
            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* 로딩 상태 */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">검색 중...</p>
                </div>
              </div>
            )}

            {/* 검색 결과 */}
            {!loading && searchQuery && searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            )}

            {/* 검색 결과 없음 */}
            {!loading && searchQuery && searchResults.length === 0 && !error && (
              <div className="text-center py-12">
                <h3 
                  className="mb-2"
                  style={{ 
                    color: '#202020', 
                    fontWeight: 600, 
                    fontSize: '18px',
                    fontFamily: 'Pretendard'
                  }}
                >
                  '{searchQuery}'에 대한 검색 결과가 없습니다.
                </h3>
                <p 
                  className="mb-8"
                  style={{ 
                    color: '#202020', 
                    fontWeight: 400, 
                    fontSize: '16px',
                    fontFamily: 'Pretendard'
                  }}
                >
                  검색어를 다시 한 번 확인해주세요.
                </p>
                
                {/* 추천키워드 컨테이너 */}
                <div 
                  className="mx-auto max-w-2xl"
                  style={{
                    backgroundColor: '#F2EEFB',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <p 
                    className="mb-4"
                    style={{ 
                      fontWeight: 600, 
                      fontSize: '16px',
                      fontFamily: 'Pretendard'
                    }}
                  >
                    <span style={{ color: '#8B5CF6' }}>추천키워드</span>
                    <span style={{ color: '#202020' }}>로 검색해보세요!</span>
                  </p>
                  
                  {/* 추천 검색어 버튼들 */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      '챗봇',
                      'ChatGPT', 
                      '이미지 생성',
                      '콘텐츠 작성',
                      '업무 자동화',
                      '교육/연구',
                      '기획/마케팅',
                      'AI 코드 어시스턴트'
                    ].map((keyword, index) => (
                      <button
                        key={index}
                        onClick={() => handleNewSearch(keyword)}
                        className="flex items-center gap-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '20px',
                          paddingTop: '4px',
                          paddingRight: '12px',
                          paddingBottom: '4px',
                          paddingLeft: '8px',
                          color: '#202020',
                          fontWeight: 500,
                          fontSize: '12px',
                          fontFamily: 'Pretendard',
                          width: 'fit-content',
                          border: '1px solid #E5E7EB'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>{keyword}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 초기 상태 (검색어 없음) */}
        {!searchQuery && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI 서비스 검색</h3>
            <p className="text-gray-600 mb-6">
              원하는 AI 서비스를 검색해보세요. 다양한 기능과 용도의 AI 도구를 찾을 수 있습니다.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800 mb-1">인기 검색어</div>
                <div className="text-gray-600">ChatGPT, Midjourney, Gamma</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800 mb-1">기능별</div>
                <div className="text-gray-600">텍스트 생성, 이미지 생성</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800 mb-1">용도별</div>
                <div className="text-gray-600">업무, 창작, 학습</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800 mb-1">가격별</div>
                <div className="text-gray-600">무료, 유료, 부분유료</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;