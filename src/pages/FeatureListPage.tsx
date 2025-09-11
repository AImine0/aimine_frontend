import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom'; // 추가
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import KeywordFilter from '../components/KeywordFilter';
import FilterBar from '../components/FilterBar';
import ToolCard from '../components/ToolCard';
import { apiService } from '../services';
import type { FilterType, AITool } from '../types';

// 카테고리별 고정 키워드(기능) 목록
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  chatbot: [
    '전체',
    '이미지 생성',
    '비디오 생성',
    '코드 생성',
    '콘텐츠 생성',
    '아이디어 제공',
    '글쓰기 보조',
    '요약',
    '번역',
    '심리 상담',
    'AI 캐릭터 채팅',
    '논문',
    '교육',
    '개발자 특화'
  ],
  writing: [
    '전체',
    '번역',
    '문장 교정',
    '문법 검사',
    '표절 검사',
    'AI 검사',
    '맞춤법 검사',
    '콘텐츠 작성',
    '요약',
    '녹음본 변환',
    '필기 인식',
    'PDF 인식',
    '논문',
    '마케팅',
    '광고 카피'
  ],
  image: [
    '전체',
    '이미지 생성',
    '이미지 편집',
    '이미지 향상',
    '배경 제거',
    '객체 제거',
    '색감 보정',
    '인물 보정',
    '목업 생성',
    '로고 생성',
    '디자인',
    '게임 아트'
  ],
  video: [
    '전체',
    '비디오 생성',
    '비디오 편집',
    '비디오 향상',
    '비디오 요약',
    '아바타 제공',
    '숏클립 제작',
    '스크립트 작성',
    '립싱크',
    '애니메이션',
    '영화',
    '광고・마케팅'
  ],
  audio: [
    '전체',
    '음악 생성',
    '오디오 편집',
    '오디오 향상',
    '오디오 전사',
    '녹음본 변환',
    '음성 생성',
    '음성 복제',
    '음성 합성',
    '음성 변환',
    '텍스트 음성 변환'
  ],
  '3d': [
    '전체',
    '3D 모델 생성',
    '3D 애니메이션',
    '3D 아이콘 생성',
    '3D 모션 생성',
    '모션 캡쳐',
    '공간 캡쳐',
    '리깅',
    '게임',
    '영화',
    '3D 디자인',
    '제품 디자인',
    '협업'
  ],
  productivity: [
    '전체',
    '데이터 분석',
    '데이터 시각화',
    '업무 자동화',
    '일정 관리',
    '기록 관리',
    '전략 관리',
    '구성원 관리',
    'PPT 생성',
    '컬러 팔레트 생성',
    '학습 도우미',
    '취업 도우미'
  ],
  // 코드 탭은 제공된 세부 목록이 없어 기본값만 표시
  code: ['전체']
};

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

// 정렬 타입 매핑 (UI → API) - 추천순/최신순만
const SORT_TYPE_MAP: Record<string, string> = {
  popular: 'rating', // 추천순 → 평점/인기도 기준 정렬
  newest: 'latest'   // 최신순 → 출시일 기준 정렬  
};

// 가격 타입 매핑 (UI → API)
const PRICING_TYPE_MAP: Record<FilterType, string | undefined> = {
  all: undefined,
  free: 'FREE',
  paid: 'PAID', 
  freemium: 'FREEMIUM'
};

const FeatureListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // 추가
  
  // URL에서 tab 파라미터 읽어서 초기값 설정
  const initialTab = searchParams.get('tab') || 'chatbot';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [activeKeywords, setActiveKeywords] = useState<string[]>(['전체']);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortType, setSortType] = useState('popular');
  const [tools, setTools] = useState<AITool[]>([]);
  const [baseTools, setBaseTools] = useState<AITool[]>([]); // 탭/가격/정렬 기준 원본 목록
  const [keywords, setKeywords] = useState<string[]>(['전체']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 탭 변경 시 카테고리별 고정 키워드 반영
  useEffect(() => {
    const legacy = CATEGORY_KEYWORDS[activeTab] || ['전체'];
    setKeywords(legacy);
  }, [activeTab]);

  // 간단 캐시: 탭/가격/정렬 조합 → 데이터
  const listCacheRef = useRef<Record<string, AITool[]>>({});

  // AI 서비스 목록 가져오기 (탭/정렬 변경 시 네트워크 호출)
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        setError(null);

        // API 파라미터 구성
        const params: any = {
          category: TAB_TO_CATEGORY[activeTab],
          sort: SORT_TYPE_MAP[sortType],
          size: 100 // 충분히 큰 수로 설정
        };
        const cacheKey = JSON.stringify({ tab: activeTab, sort: SORT_TYPE_MAP[sortType] });
        let apiResponse = listCacheRef.current[cacheKey];

        if (!apiResponse) {
          const fetched = await apiService.getAllServices(params);
          if (!Array.isArray(fetched)) {
            console.error('응답이 배열이 아닙니다:', fetched);
            setError('데이터 형식 오류가 발생했습니다.');
            setTools([]);
            return;
          }
          listCacheRef.current[cacheKey] = fetched;
          apiResponse = fetched;
        }

        setBaseTools(apiResponse);
      } catch (error) {
        console.error('AI 서비스 조회 실패:', error);
        setError('AI 서비스를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        setBaseTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [activeTab, sortType]);

  // 선택된 키워드로 클라이언트 사이드 필터링 (즉시 반응, 메모이제이션)
  // 0) 검색용 문자열을 미리 준비 (1회 계산)
  const preparedTools = useMemo(() => {
    return baseTools.map(tool => {
      const featureText = (tool.features || []).join(' ');
      const tagText = Array.isArray(tool.tags) ? tool.tags.join(' ') : String(tool.tags || '');
      const haystack = [tool.name, tool.description, tool.categoryLabel, featureText, tagText]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return { tool, haystack };
    });
  }, [baseTools]);

  // 1) 키워드/가격 필터를 적용
  const filteredTools = useMemo(() => {
    const selected = activeKeywords.filter(k => k !== '전체');
    let list = preparedTools;

    // 1) 키워드 필터
    if (selected.length > 0) {
      const normalizedSelected = selected.map(k => k.toLowerCase());
      list = list.filter(item => normalizedSelected.some(kw => item.haystack.includes(kw)));
    }

    // 2) 가격 필터
    if (activeFilter !== 'all') {
      list = list.filter(item => item.tool.pricing === (activeFilter as any));
    }

    return list.map(item => item.tool);
  }, [preparedTools, activeKeywords, activeFilter]);

  // 파생 리스트를 실제 렌더링 상태에 반영
  useEffect(() => {
    setTools(filteredTools);
  }, [filteredTools]);

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
  
  // 탭 변경 핸들러 수정: URL 파라미터도 함께 업데이트
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // 탭 변경 시 키워드 초기화
    setActiveKeywords(['전체']);
    // URL 파라미터 업데이트
    setSearchParams({ tab });
  };

  // BEST 1,2,3는 상위 3개
  const featuredTools = tools.slice(0, 3);

  // 가격별 개수 계산 (고정: 현재 탭의 전체 목록 기준)
  const filteredFreeCount = baseTools.filter(tool => tool.pricing === 'free').length;
  const filteredPaidCount = baseTools.filter(tool => tool.pricing === 'paid').length;
  const filteredFreemiumCount = baseTools.filter(tool => tool.pricing === 'freemium').length;

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
          keywords={CATEGORY_KEYWORDS[activeTab] || keywords}
          activeKeywords={activeKeywords}
          onKeywordToggle={handleKeywordToggle}
          onReset={handleKeywordReset}
          category={activeTab}
        />

        <FilterBar
          totalCount={baseTools.length}
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
            <section className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: 'start' }}>
                {featuredTools.map((tool, index) => (
                  <ToolCard key={tool.id} tool={tool} rank={index + 1} />
                ))}
              </div>
            </section>

            {/* 전체 리스트 */}
            {restTools.length > 0 && (
              <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: 'start' }}>
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