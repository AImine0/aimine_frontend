// [마이페이지] 사용자 정보 및 저장한 AI 서비스 목록

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import { apiService } from '../services';
import type { BookmarkListResponse, UserProfileResponse } from '../types';
import { handleImageError } from '../utils/imageMapping';

interface BookmarkedTool {
  id: number;
  ai_service_id: number;
  service_name: string;
  service_summary: string;
  logo_url: string;
  category_display_name: string;
  pricing_type: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [bookmarkedTools, setBookmarkedTools] = useState<BookmarkedTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingBookmarks, setRemovingBookmarks] = useState<Set<number>>(new Set());

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
        const [userProfile, bookmarksResponse] = await Promise.all([
          apiService.getUserProfile(),
          apiService.getBookmarks()
        ]);

        setUser(userProfile);
        setBookmarkedTools(bookmarksResponse.bookmarks);

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

  // 북마크 제거 핸들러
  const handleRemoveBookmark = async (serviceId: number) => {
    if (removingBookmarks.has(serviceId)) return;
    
    try {
      setRemovingBookmarks(prev => new Set(prev).add(serviceId));
      
      await apiService.removeBookmark(serviceId);
      
      // 북마크 목록에서 제거
      setBookmarkedTools(prev => 
        prev.filter(tool => tool.ai_service_id !== serviceId)
      );
      
    } catch (error) {
      console.error('북마크 제거 실패:', error);
      alert('북마크 제거 중 오류가 발생했습니다.');
    } finally {
      setRemovingBookmarks(prev => {
        const newSet = new Set(prev);
        newSet.delete(serviceId);
        return newSet;
      });
    }
  };

  // 가격 뱃지
  const getPricingBadge = (pricingType: string) => {
    const type = pricingType.toLowerCase();
    const badgeConfig = {
      free: { text: 'Free', bgColor: '#E8F5E8', textColor: '#2E7D33' },
      paid: { text: 'Paid', bgColor: '#FFF3E0', textColor: '#F57C00' },
      freemium: { text: 'Freemium', bgColor: '#E3F2FD', textColor: '#1976D2' }
    };
    
    const config = badgeConfig[type as keyof typeof badgeConfig] || badgeConfig.freemium;
    
    return (
      <span 
        className="inline-flex items-center px-2 py-1 font-medium text-xs rounded-full"
        style={{ 
          backgroundColor: config.bgColor,
          color: config.textColor,
          fontFamily: 'Pretendard'
        }}
      >
        {config.text}
      </span>
    );
  };

  const breadcrumbItems = [
    { label: '마이페이지' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header tabs={[]} activeTab="" onTabChange={() => {}} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">마이페이지를 불러오는 중...</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* 사용자 정보 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-purple-600">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="font-semibold text-2xl text-black mb-1" style={{ fontFamily: 'Pretendard' }}>
                {user?.name || '사용자'}님의 마이페이지
              </h1>
              <p className="text-gray-600" style={{ fontFamily: 'Pretendard' }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* 저장한 AI 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-xl text-black" style={{ fontFamily: 'Pretendard' }}>
              저장한 AI
            </h2>
            <span className="text-sm text-gray-500" style={{ fontFamily: 'Pretendard' }}>
              총 {bookmarkedTools.length}개
            </span>
          </div>

          {bookmarkedTools.length === 0 ? (
            /* 빈 상태 */
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">📌</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">저장한 AI가 없습니다</h3>
              <p className="text-gray-600 mb-6">
                관심있는 AI 서비스를 저장해보세요. 나중에 쉽게 찾을 수 있습니다.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
                style={{ fontFamily: 'Pretendard' }}
              >
                AI 서비스 둘러보기
              </button>
            </div>
          ) : (
            /* 북마크 목록 */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedTools.map((tool) => (
                <div 
                  key={tool.id}
                  className="bg-white rounded-xl hover:border-purple-200 hover:shadow-lg transition-all duration-200 group"
                  style={{ border: '1px solid #DBCBF9', fontFamily: 'Pretendard', padding: '20px', minHeight: '250px' }}
                >
                  {/* 상단: 로고, 카테고리, 북마크/바로가기 버튼 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {/* 로고 */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <img 
                            src={tool.logo_url} 
                            alt={`${tool.service_name} 로고`}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => handleImageError(e, '/images/Logo/Logo_FINAL.svg')}
                          />
                        </div>
                      </div>
                      
                      {/* 카테고리와 가격 */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full font-medium" 
                               style={{ 
                                 backgroundColor: '#E9DFFB',
                                 borderRadius: '20px',
                                 color: '#202020',
                                 fontSize: '12px',
                                 fontFamily: 'Pretendard'
                               }}>
                            {tool.category_display_name}
                          </span>
                          {getPricingBadge(tool.pricing_type)}
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽: 북마크 제거, 바로가기 버튼 */}
                    <div className="flex items-start gap-2 flex-shrink-0">
                      {/* 북마크 제거 버튼 */}
                      <button
                        onClick={() => handleRemoveBookmark(tool.ai_service_id)}
                        disabled={removingBookmarks.has(tool.ai_service_id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="저장 해제"
                      >
                        {removingBookmarks.has(tool.ai_service_id) ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </button>

                      {/* 상세 페이지 링크 */}
                      <button 
                        onClick={() => navigate(`/tool/${tool.ai_service_id}`)}
                        className="flex items-center justify-center transition-all duration-200 group-hover:bg-purple-100" 
                        style={{ 
                          backgroundColor: '#E9DFFB', 
                          width: '32px', 
                          height: '32px',
                          borderRadius: '3.56px'
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{ color: '#7E50D1' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* 중간: 제목과 설명 */}
                  <div className="mb-4">
                    <button
                      onClick={() => navigate(`/tool/${tool.ai_service_id}`)}
                      className="hover:text-purple-600 transition-colors text-left w-full"
                    >
                      <h3 className="font-semibold mb-2 line-clamp-1" style={{ color: '#000000', fontSize: '20px', fontFamily: 'Pretendard' }}>
                        {tool.service_name}
                      </h3>
                    </button>
                    <p className="text-gray-600 leading-relaxed line-clamp-2" style={{ fontSize: '14px', fontFamily: 'Pretendard' }}>
                      {tool.service_summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyPage;