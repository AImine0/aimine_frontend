// [마이페이지] 사용자 정보 및 저장한 AI 서비스 목록

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ToolCard from '../components/ToolCard';
import { apiService } from '../services';
import type { AITool } from '../types';

// ✅ 백엔드 BookmarkListResponse와 정확히 일치하도록 수정
interface BookmarkedTool {
  id: number;
  aiServiceId: number;
  serviceName: string;
  serviceSummary: string;
  logoUrl: string;
  categoryDisplayName: string;
  pricingType: string;
  tags: string;        // ✅ tags 속성 (이미 존재)
  websiteUrl: string;  // ✅ websiteUrl 속성 추가 (officialUrl에서 매핑)
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  // 사용자 표시 요소 제거에 따라 사용자 상태는 미사용
  const [bookmarkedTools, setBookmarkedTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // 북마크 데이터를 ToolCard에서 사용할 수 있는 AITool 형태로 변환하는 함수
  const convertBookmarkToAITool = (bookmark: BookmarkedTool): AITool => {
    // 가격 타입 변환
    const mapPricingType = (pricingType: string): 'free' | 'paid' | 'freemium' => {
      switch (pricingType.toUpperCase()) {
        case 'FREE':
          return 'free';
        case 'PAID':
          return 'paid';
        case 'FREEMIUM':
          return 'freemium';
        default:
          return 'freemium';
      }
    };

    // 카테고리 슬러그 변환 함수
    const getCategorySlug = (categoryName: string): string => {
      const categoryMap: Record<string, string> = {
        '챗봇': 'chatbot',
        '텍스트': 'text', 
        '이미지': 'image',
        '비디오': 'video',
        '오디오/음악': 'audio',
        '코드': 'code',
        '3D': '3d',
        '생산성': 'productivity'
      };
      return categoryMap[categoryName] || 'chatbot';
    };

    return {
      id: bookmark.aiServiceId.toString(),
      name: bookmark.serviceName,
      category: getCategorySlug(bookmark.categoryDisplayName),
      description: bookmark.serviceSummary,
      features: [],
      rating: 4.5,
      tags: bookmark.tags ? [bookmark.tags] : [bookmark.categoryDisplayName], // ✅ tags 사용
      url: bookmark.websiteUrl || '', // ✅ websiteUrl 사용
      releaseDate: '',
      company: '',
      pricing: mapPricingType(bookmark.pricingType),
      featured: false,
      categoryLabel: bookmark.categoryDisplayName,
      roles: [],
      userCount: 0,
      aiRating: 4.5,
      logoUrl: bookmark.logoUrl || '/images/Logo/Logo_FINAL.svg',
      serviceImageUrl: bookmark.logoUrl || '/images/Logo/Logo_FINAL.svg',
      priceImageUrl: bookmark.logoUrl || '/images/Logo/Logo_FINAL.svg',
      searchbarLogoUrl: bookmark.logoUrl || '/images/Logo/Logo_FINAL.svg'
    };
  };

  // 인증 확인 및 데이터 로드
  useEffect(() => {
    const loadMyPageData = async () => {
      try {
        // 인증 확인
        if (!apiService.isAuthenticated()) {
          navigate('/');
          return;
        }

        setLoading(true);
        setError(null);

        // 사용자 정보와 북마크 데이터 병렬로 로드
        const bookmarksResponse = await apiService.getBookmarksFixed();
        
        // 북마크 데이터를 AITool 형태로 변환
        const convertedTools = bookmarksResponse.bookmarks.map(convertBookmarkToAITool);
        setBookmarkedTools(convertedTools);

      } catch (error) {
        console.error('마이페이지 데이터 로드 실패:', error);
        setError('데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        
        // 인증 오류인 경우 메인 페이지로 리다이렉트
        if (error instanceof Error && error.message.includes('인증')) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    loadMyPageData();
  }, [navigate]);

  // 상단 텍스트 제거에 따라 브레드크럼 항목 제거

  // 카테고리 칩 목록
  const categoryChips: { id: string; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'chatbot', label: '챗봇' },
    { id: 'text', label: '텍스트' },
    { id: 'image', label: '이미지' },
    { id: 'video', label: '비디오' },
    { id: 'audio', label: '오디오/음악' },
    { id: 'code', label: '코드' },
    { id: '3d', label: '3D' },
    { id: 'productivity', label: '생산성' }
  ];

  // 필터링된 결과
  const filteredTools = activeCategory === 'all'
    ? bookmarkedTools
    : bookmarkedTools.filter((tool) => tool.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header tabs={[]} activeTab="" onTabChange={() => {}} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600" style={{ fontFamily: 'Pretendard' }}>
              마이페이지를 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header tabs={[]} activeTab="" onTabChange={() => {}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">페이지를 불러올 수 없습니다</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header tabs={[]} activeTab="" onTabChange={() => {}} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* 상단바와 저장한 AI 사이 텍스트 제거 - 간격 최소화 */}
        <div className="mt-6 mb-6">
          <h1
            style={{
              fontFamily: 'Pretendard',
              fontWeight: 600,
              fontSize: '32px',
              color: '#202020'
            }}
          >
            저장한 AI
          </h1>
          <p
            style={{
              fontFamily: 'Pretendard',
              fontWeight: 500,
              fontSize: '14px',
              color: '#9B9B9B',
              marginTop: '12px'
            }}
          >
            저장한 AI들을 카테고리별로 모아서 비교해보세요!
          </p>
          {/* 카테고리 필터 칩 */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categoryChips.map((chip) => {
              const isActive = activeCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setActiveCategory(chip.id)}
                  className="inline-flex items-center px-5 py-2 rounded-[12px] transition-colors"
                  style={{
                    borderWidth: '1px',
                    borderColor: isActive ? '#A987E8' : '#BCBCBC',
                    backgroundColor: isActive ? '#F2EEFB' : '#FFFFFF'
                  }}
                >
                  {isActive && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: '6px' }}
                    >
                      <path d="M20 6L9 17L4 12" stroke="#7242C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  <span
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '14px',
                      color: isActive ? '#7242C9' : '#5B5B5B'
                    }}
                  >
                    {chip.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 저장한 AI 섹션 */}
        <section>

          {filteredTools.length === 0 ? (
            /* 빈 상태 - 중앙 정렬 일러스트 + 문구 */
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/images/GlassMorphism/Mypage_Save.png"
                  alt="저장된 AI 없음"
                  style={{ width: '80px', height: '80px', marginBottom: '16px' }}
                />
                <div
                  style={{
                    fontFamily: 'Pretendard',
                    fontWeight: 600,
                    fontSize: '18px',
                    color: '#202020',
                    marginBottom: '8px'
                  }}
                >
                  저장된 AI가 없습니다.
                </div>
                <div
                  style={{
                    fontFamily: 'Pretendard',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: '#202020',
                    lineHeight: 1.6
                  }}
                >
                  AIMine에서 마음에 드는 AI만 모아
                  <br />
                  한눈에 비교해보세요!
                </div>
              </div>
            </div>
          ) : (
            /* ✅ ToolCard 컴포넌트 재사용 - 기존 직접 구현한 카드 대신 */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyPage;