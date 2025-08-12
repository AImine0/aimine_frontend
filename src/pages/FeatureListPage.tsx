import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import KeywordFilter from '../components/KeywordFilter';
import FilterBar from '../components/FilterBar';
import ToolCard from '../components/ToolCard';
import { keywordTags } from '../data/dummyData';
import { apiService } from '../services';
import { dummyAIToolListItems, transformToAITool } from '../data/dummyData';
import type { FilterType, AITool } from '../types';

// ─────────────────────────────────────────────────────────────
// 유틸: 카테고리 정규화 (API/더미/라벨 모두 대응)
// ─────────────────────────────────────────────────────────────
function normalizeCategory(tool: AITool): string {
  // 가능한 여러 위치에서 카테고리 정보 꺼내오기
  const raw =
    (tool as any).category ??
    (tool as any).categorySlug ??
    (tool as any).categoryLabel ??
    (tool as any).categoryName ??
    (tool as any).category?.name ??
    '';

  const v = String(raw).trim().toLowerCase();

  // 한글 라벨 → 슬러그 맵
  const koToSlug: Record<string, string> = {
    '챗봇': 'chat',
    '텍스트': 'text',
    '이미지': 'image',
    '비디오': 'video',
    '오디오': 'audio',
    '오디오/음악': 'audio',
    '음악': 'audio',
    '코드': 'code',
    '생산성': 'product',
    '프레젠테이션': 'product',
    '3d': '3d',
  };

  if (koToSlug[v]) return koToSlug[v];

  // 영문/기존 값 정규화
  if (['chat', 'chatbot'].includes(v)) return 'chat';
  if (['text', 'writing', 'writer'].includes(v)) return 'text';
  if (['image', 'images', 'img', 'design'].includes(v)) return 'image';
  if (['video', 'videos', 'movie'].includes(v)) return 'video';
  if (['audio', 'music', 'sound'].includes(v)) return 'audio';
  if (['code', 'coding', 'developer'].includes(v)) return 'code';
  if (['product', 'productivity', 'productivity/office', 'office', 'tool'].includes(v)) return 'product';
  if (['3d', '3-d', 'three', 'three-d'].includes(v)) return '3d';

  // 모르면 생산성으로 폴백 (혹은 빈 문자열 반환도 가능)
  return 'product';
}

// ─────────────────────────────────────────────────────────────
// 탭 id → 허용 카테고리 슬러그 집합 매핑
// ─────────────────────────────────────────────────────────────
const TAB_CATEGORY_ALLOW: Record<string, Set<string>> = {
  chatbot: new Set(['chat']),
  writing: new Set(['text']),
  image: new Set(['image']),
  video: new Set(['video']),
  audio: new Set(['audio']),
  code: new Set(['code']),
  productivity: new Set(['product']),
  '3d': new Set(['3d']),
};

const FeatureListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [activeKeywords, setActiveKeywords] = useState<string[]>(['전체']);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortType, setSortType] = useState('popular');
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 AI 툴 목록 가져오기 (API 명세서: ToolListResponse)
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const apiTools = await apiService.getAllServices();
        setTools(apiTools);
      } catch (error) {
        console.warn('API 호출 실패, 더미 데이터 사용:', error);
        setError('API 호출에 실패했습니다. 더미 데이터를 표시합니다.');
        setTools(dummyAIToolListItems.map(transformToAITool));
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

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
  const handleTabChange = (tab: string) => setActiveTab(tab);

  // ─────────────────────────────────────────────────────────────
  // 탭 필터 (정규화된 카테고리 기준)
  // ─────────────────────────────────────────────────────────────
  const tabFilteredTools = tools.filter(tool => {
    const cat = normalizeCategory(tool);
    const allow = TAB_CATEGORY_ALLOW[activeTab];
    if (!allow) return true; // 혹시 정의 안 된 탭 id면 전체 노출
    return allow.has(cat);
  });

  // 키워드 필터
  const keywordFilteredTools = tabFilteredTools.filter(tool => {
    if (activeKeywords.includes('전체')) return true;
    const tags = (tool as any).tags ?? [];
    return Array.isArray(tags) && tags.some((k: string) => activeKeywords.includes(k));
  });

  // 가격 필터
  const filteredTools = keywordFilteredTools.filter(tool => {
    if (activeFilter === 'all') return true;
    return tool.pricing === activeFilter;
  });

  // 정렬 (필요 시 확장)
  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortType === 'popular') {
      // 인기 정렬 기준이 없으면 rating으로 대체
      const ar = (a as any).rating ?? 0;
      const br = (b as any).rating ?? 0;
      return br - ar;
    }
    if (sortType === 'new') {
      const ad = new Date((a as any).releaseDate || 0).getTime();
      const bd = new Date((b as any).releaseDate || 0).getTime();
      return bd - ad;
    }
    return 0;
  });

  // BEST 1,2,3는 필터링+정렬된 데이터 기준 상위 3개
  const featuredTools = sortedTools.slice(0, 3);

  // 가격별 개수도 keyword+tab 필터에서 계산
  const filteredFreeCount = keywordFilteredTools.filter(tool => tool.pricing === 'free').length;
  const filteredPaidCount = keywordFilteredTools.filter(tool => tool.pricing === 'paid').length;
  const filteredFreemiumCount = keywordFilteredTools.filter(tool => tool.pricing === 'freemium').length;

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
  const restTools = sortedTools.filter(tool => !featuredIds.includes(tool.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
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
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <KeywordFilter
          keywords={keywordTags}
          activeKeywords={activeKeywords}
          onKeywordToggle={handleKeywordToggle}
          onReset={handleKeywordReset}
        />

        <FilterBar
          totalCount={sortedTools.length}
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

        {/* BEST 1,2,3 */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} rank={index + 1} />
            ))}
          </div>
        </section>

        {/* 전체 리스트 */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FeatureListPage;