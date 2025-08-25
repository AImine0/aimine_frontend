import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import KeywordFilter from '../components/KeywordFilter';
import FilterBar from '../components/FilterBar';
import ToolCard from '../components/ToolCard';
import { apiService } from '../services';
import type { FilterType, AITool } from '../types';

// 카테고리 매핑 (탭 → API category 파라미터)
const TAB_TO_CATEGORY: Record<string, string> = {
  chatbot: 'chatbot',
  writing: 'text',
  image: 'image', 
  video: 'video',
  audio: 'audio',
  code: 'code',
  productivity: 'productivity',
  '3d': '3d'
};

// 정렬 타입 매핑 (UI → API)
const SORT_TYPE_MAP: Record<string, string> = {
  popular: 'rating',
  new: 'latest',
  rating: 'rating'
};

// 가격 타입 매핑 (UI → API)
const PRICING_TYPE_MAP: Record<FilterType, string | undefined> = {
  all: undefined,
  free: 'FREE',
  paid: 'PAID', 
  freemium: 'FREEMIUM'
};

const FeatureListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [activeKeywords, setActiveKeywords] = useState<string[]>(['전체']);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortType, setSortType] = useState('popular');
  const [tools, setTools] = useState<AITool[]>([]);
  const [keywords, setKeywords] = useState<string[]>(['전체']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 키워드 목록 가져오기
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await apiService.getKeywords();
        if (response.keywords && Array.isArray(response.keywords)) {
          const keywordList = response.keywords.map((k: any) => k.keyword);
          setKeywords(['전체', ...keywordList]);
        }
      } catch (error) {
        console.error('키워드 조회 실패:', error);
        // 키워드 로드 실패시 기본값 유지
        setKeywords(['전체']);
      }
    };

    fetchKeywords();
  }, []);

  // AI 서비스 목록 가져오기 (탭, 키워드, 필터, 정렬에 따라)
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        setError(null);

        // API 파라미터 구성
        const params: any = {
          category: TAB_TO_CATEGORY[activeTab],
          sort: SORT_TYPE_MAP[sortType],
          pricing: PRICING_TYPE_MAP[activeFilter],
          size: 100 // 충분히 큰 수로 설정
        };

        // 키워드가 '전체'가 아닌 경우 검색으로 처리
        if (!activeKeywords.includes('전체') && activeKeywords.length > 0) {
          // 키워드 필터링은 검색 API 사용
          const searchResponse = await apiService.search({
            q: activeKeywords.join(' '),
            category: TAB_TO_CATEGORY[activeTab],
            pricing: PRICING_TYPE_MAP[activeFilter],
            sort: SORT_TYPE_MAP[sortType]
          });

          // 검색 결과를 AITool 형식으로 변환
          const searchTools: AITool[] = searchResponse.tools.map(tool => ({
            id: tool.id.toString(),
            name: tool.service_name,
            category: activeTab,
            description: tool.description,
            features: tool.keywords || [],
            rating: tool.overall_rating,
            tags: tool.keywords || [],
            url: '', // API에서 제공되지 않음
            releaseDate: '',
            company: 'Unknown',
            pricing: (tool.pricing_type?.toLowerCase() || 'free') as 'free' | 'paid' | 'freemium',
            featured: false,
            categoryLabel: tool.category_name,
            roles: [],
            userCount: 0,
            aiRating: tool.overall_rating,
            logoUrl: tool.logo_url,
            serviceImageUrl: tool.logo_url,
            priceImageUrl: tool.logo_url,
            searchbarLogoUrl: tool.logo_url
          }));

          setTools(searchTools);
        } else {
          // 일반 서비스 목록 조회
          const apiTools = await apiService.getAllServices(params);
          setTools(apiTools);
        }
      } catch (error) {
        console.error('AI 서비스 조회 실패:', error);
        setError('AI 서비스를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        setTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [activeTab, activeKeywords, activeFilter, sortType]);

  const handleKeywordToggle = (keyword: string) => {
    setActiveKeywords(prev => {
      if (keyword === '전체') return ['전체'];
      const next = prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev.filter(k => k !== '전체'), keyword];
      return next.length === 0 ? ['전체'] : next.filter(k => k !== '전체');
    });
  };

  const handleKeywordReset = () => setActiveKeywords(['전체']);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // 탭 변경 시 키워드 초기화
    setActiveKeywords(['전체']);
  };

  // BEST 1,2,3는 상위 3개
  const featuredTools = tools.slice(0, 3);

  // 가격별 개수 계산
  const filteredFreeCount = tools.filter(tool => tool.pricing === 'free').length;
  const filteredPaidCount = tools.filter(tool => tool.pricing === 'paid').length;
  const filteredFreemiumCount = tools.filter(tool => tool.pricing === 'freemium').length;

  const getTabTitle = (tab: string) => {
    const tabNames: { [key: string]: string } = {
      chatbot: '챗봇',
      writing: '텍스트',
      image: '이미지',
      video: '비디오',
      audio: '오디오/음악',
      code: '코드',
      productivity: '생산성',
      '3d': '3D'
    };
    return tabNames[tab] || '챗봇';
  };

  const breadcrumbItems = [
    { label: '기능별' },
    { label: getTabTitle(activeTab) }
  ];

  const featureTabs = [
    { id: 'chatbot', name: '챗봇' },
    { id: 'writing', name: '텍스트' },
    { id: 'image', name: '이미지' },
    { id: 'video', name: '비디오' },
    { id: 'audio', name: '오디오/음악' },
    { id: 'code', name: '코드' },
    { id: 'productivity', name: '생산성' },
    { id: '3d', name: '3D' }
  ];

  // BEST 제외한 나머지
  const featuredIds = featuredTools.map(tool => tool.id);
  const restTools = tools.filter(tool => !featuredIds.includes(tool.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header tabs={featureTabs} activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-lg text-gray-600">AI 서비스를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header tabs={featureTabs} activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="font-semibold mb-2" style={{ color: '#000000', fontSize: '32px', fontFamily: 'Pretendard' }}>
            {getTabTitle(activeTab)}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium px-3 py-1 rounded-md transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <KeywordFilter
          keywords={keywords}
          activeKeywords={activeKeywords}
          onKeywordToggle={handleKeywordToggle}
          onReset={handleKeywordReset}
        />

        <FilterBar
          totalCount={tools.length}
          freeCount={filteredFreeCount}
          paidCount={filteredPaidCount}
          freemiumCount={filteredFreemiumCount}
          activeFilter={activeFilter}
          onFilterChange={(filter) => {
            setActiveFilter(prev => (prev === filter ? 'all' : filter));
          }}
          sortType={sortType}
          onSortChange={setSortType}
        />

        {tools.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</div>
            <div className="text-gray-400 text-sm">
              다른 키워드나 필터를 시도해보세요.
            </div>
          </div>
        )}

        {tools.length > 0 && (
          <>
            {/* BEST 1,2,3 */}
            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} rank={index + 1} />
                ))}
              </div>
            </section>

            {/* 전체 리스트 */}
            {restTools.length > 0 && (
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FeatureListPage;