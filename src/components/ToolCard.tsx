// [AI 툴 카드 컴포넌트] 개별 AI 도구 정보 표시 - 이름, 설명, BEST 뱃지, 북마크, 평점, 링크 버튼

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { AITool } from '../types';
import { handleImageError } from '../utils/imageMapping';
import { apiService } from '../services';

interface ToolCardProps {
  tool: AITool;
  rank?: number;
  className?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, rank, className }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [statusCheckAttempts, setStatusCheckAttempts] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const handleCardNavigation = () => {
    if (tool.id) {
      navigate(`/tool/${tool.id}`);
    }
  };

  // MyPage인지 확인
  const isMyPage = location.pathname === '/mypage';

  // 인증 상태 및 북마크 상태 확인 (페이지 변경 시마다 실행)
  useEffect(() => {
    const checkAuthAndBookmark = async () => {
      console.log('🔄 ToolCard 상태 확인 시작:', { toolId: tool.id, attempts: statusCheckAttempts });
      
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated && tool.id) {
        try {
          const numericId = parseInt(tool.id);
          if (!isNaN(numericId)) {
            console.log('🔍 북마크 상태 확인 중:', numericId);
            const bookmarkStatus = await apiService.checkBookmarkStatus(numericId);
            setIsBookmarked(bookmarkStatus);
            console.log('✅ 북마크 상태 설정 완료:', bookmarkStatus);
          }
        } catch (error) {
          console.warn('⚠️ 북마크 상태 확인 실패:', error);
          
          if (statusCheckAttempts < 2) {
            console.log('🔄 북마크 상태 재확인 시도');
            setTimeout(() => {
              setStatusCheckAttempts(prev => prev + 1);
            }, 1000);
          }
        }
      } else {
        setIsBookmarked(false);
      }
    };

    checkAuthAndBookmark();
  }, [tool.id, statusCheckAttempts, location.pathname]);

  // 북마크 토글 핸들러
  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔄 북마크 토글 시작:', { 
      toolId: tool.id, 
      isAuthenticated, 
      currentBookmarkState: isBookmarked 
    });
    
    if (!isAuthenticated) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    if (bookmarkLoading) {
      console.log('⏳ 이미 처리 중...');
      return;
    }

    const numericId = parseInt(tool.id);
    if (isNaN(numericId)) {
      console.error('❌ 유효하지 않은 tool.id:', tool.id);
      alert('도구 ID가 올바르지 않습니다.');
      return;
    }

    try {
      setBookmarkLoading(true);
      
      // 현재 실제 서버 상태를 다시 한 번 확인
      console.log('🔍 서버에서 현재 북마크 상태 재확인');
      const currentServerState = await apiService.checkBookmarkStatus(numericId);
      console.log('📊 서버 상태 vs 로컬 상태:', { 
        server: currentServerState, 
        local: isBookmarked 
      });
      
      // 서버 상태와 로컬 상태가 다른 경우 동기화
      if (currentServerState !== isBookmarked) {
        console.log('🔄 상태 동기화 중...');
        setIsBookmarked(currentServerState);
      }
      
      // 실제 서버 상태에 따라 액션 결정
      if (currentServerState) {
        console.log('🗑️ 북마크 제거 시도');
        await apiService.removeBookmark(numericId);
        setIsBookmarked(false);
        console.log('✅ 북마크 제거 완료');
        
        // MyPage에서 북마크 해제 시 페이지 새로고침 (UI에서 카드가 사라지도록)
        if (isMyPage) {
          window.location.reload();
        }
      } else {
        console.log('➕ 북마크 추가 시도');
        await apiService.addBookmark(numericId);
        setIsBookmarked(true);
        console.log('✅ 북마크 추가 완료');
      }
      
    } catch (error) {
      console.error('❌ 북마크 처리 실패:', error);
      
      let errorMessage = '북마크 처리 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('이미 북마크')) {
          errorMessage = '이미 북마크된 서비스입니다.';
          setIsBookmarked(true);
        } else if (error.message.includes('존재하지 않는') || error.message.includes('북마크가 없')) {
          errorMessage = '북마크가 존재하지 않습니다.';
          setIsBookmarked(false);
        } else if (error.message.includes('로그인')) {
          errorMessage = '로그인이 필요합니다.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
      
      // 에러 발생 후 상태 재확인
      try {
        const updatedState = await apiService.checkBookmarkStatus(numericId);
        setIsBookmarked(updatedState);
      } catch (recheckError) {
        console.warn('상태 재확인 실패:', recheckError);
      }
      
    } finally {
      setBookmarkLoading(false);
      console.log('🏁 북마크 토글 완료');
    }
  };

  // 외부 URL로 이동하는 핸들러
  const handleExternalLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (tool.url && tool.url.trim() !== '') {
      // URL이 http:// 또는 https://로 시작하지 않으면 https:// 추가
      let url = tool.url.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      console.log('🔗 외부 링크로 이동:', url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('⚠️ 유효하지 않은 URL:', tool.url);
      alert('유효한 웹사이트 URL이 없습니다.');
    }
  };

  // BEST 뱃지
  const getBestBadge = (rank: number) => {
    return (
      <span className="inline-flex items-center px-2 py-1 font-bold"
            data-best-badge
            style={{ 
              backgroundColor: '#F2EEFB', 
              color: '#7E50D1',
              width: '66px',
              height: '32px',
              borderRadius: '3.26px',
              justifyContent: 'center',
              fontSize: '14px',
              fontFamily: 'Pretendard'
            }}>
        BEST {rank}
      </span>
    );
  };

  // DB tags 컬럼을 우선적으로 표시하는 함수
  const getDisplayTag = () => {
    // 1순위: tags가 배열인 경우 첫 번째 요소 사용 (DB tags 컬럼 내용)
    if (Array.isArray(tool.tags) && tool.tags.length > 0) {
      const firstTag = tool.tags[0];
      if (firstTag && firstTag !== '') {
        return firstTag; // "AI 챗봇" 같은 전체 텍스트를 그대로 사용
      }
    }
    
    // 2순위: tags가 문자열인 경우 (이전 버전 호환성)
    if (typeof tool.tags === 'string' && tool.tags !== '') {
      return tool.tags;
    }
    
    // 3순위: categoryLabel을 fallback으로 사용 (기존 로직 유지)
    return tool.categoryLabel || 'AI 도구';
  };

  const handleCardClick = () => {
    if (!tool.id) return;
    navigate(`/tool/${tool.id}`);
  };

  return (
    <div className={`bg-white rounded-xl group ${className || ''}`} 
         style={{ 
           border: '1px solid #DBCBF9', 
           fontFamily: 'Pretendard', 
           padding: '20px', 
           minHeight: '240px',
           cursor: 'pointer' 
         }}
         onClick={handleCardNavigation}
         onMouseEnter={(e) => {
           e.currentTarget.style.backgroundColor = '#F2EEFB';
           e.currentTarget.style.border = 'none';
           // tags 컴포넌트 hover 효과
           const tagsElement = e.currentTarget.querySelector('[data-tags]');
           if (tagsElement) {
             (tagsElement as HTMLElement).style.backgroundColor = '#DBCBF9';
           }
           // 바로가기 버튼 hover 효과
           const visitButton = e.currentTarget.querySelector('[data-visit-button]');
           if (visitButton) {
             (visitButton as HTMLElement).style.backgroundColor = '#7E50D1';
             const visitIcon = visitButton.querySelector('img');
             if (visitIcon) {
               (visitIcon as HTMLImageElement).src = '/images/Icon/Visit/32/White.svg';
             }
           }
           // BEST 태그 hover 효과
           const bestBadge = e.currentTarget.querySelector('[data-best-badge]');
           if (bestBadge) {
             (bestBadge as HTMLElement).style.backgroundColor = '#E9DFFB';
           }
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.backgroundColor = '#FFFFFF';
           e.currentTarget.style.border = '1px solid #DBCBF9';
           // tags 컴포넌트 원래 색상으로 복원
           const tagsElement = e.currentTarget.querySelector('[data-tags]');
           if (tagsElement) {
             (tagsElement as HTMLElement).style.backgroundColor = '#E9DFFB';
           }
           // 바로가기 버튼 원래 색상으로 복원
           const visitButton = e.currentTarget.querySelector('[data-visit-button]');
           if (visitButton) {
             (visitButton as HTMLElement).style.backgroundColor = '#E9DFFB';
             const visitIcon = visitButton.querySelector('img');
             if (visitIcon) {
               (visitIcon as HTMLImageElement).src = '/images/Icon/Visit/32/Black.svg';
             }
           }
           // BEST 태그 원래 색상으로 복원
           const bestBadge = e.currentTarget.querySelector('[data-best-badge]');
           if (bestBadge) {
             (bestBadge as HTMLElement).style.backgroundColor = '#F2EEFB';
           }
         }}>
      
      {/* 상단: 로고, 카테고리, BEST 뱃지 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2 items-start">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 flex items-center justify-start overflow-hidden">
              {tool.logoUrl ? (
                <img 
                  src={tool.logoUrl} 
                  alt={`${tool.name} 로고`}
                  className="w-full h-full object-contain"
                  onError={(e) => handleImageError(e, '/images/Logo/Logo_FINAL.svg')}
                />
              ) : (
                <span className="text-3xl">🤖</span>
              )}
            </div>
          </div>
          
          {/* DB tags 컬럼 내용 표시 */}
          <span className="inline-flex items-center px-3 py-1 text-body4 font-medium" 
                data-tags
                style={{ 
                  backgroundColor: '#E9DFFB',
                  borderRadius: '100px',
                  color: '#6238AE',
                  width: 'fit-content'
                }}>
            {getDisplayTag()}
          </span>
        </div>

        {/* 오른쪽: BEST 뱃지, 북마크 버튼 (MyPage에서만), 바로가기 버튼 */}
        <div className="flex items-start gap-2 flex-shrink-0">
          {/* BEST 뱃지 */}
          {rank && rank <= 3 && getBestBadge(rank)}

          {/* 북마크 버튼 - MyPage에서만 표시 */}
          {isMyPage && isAuthenticated && (
            <button
              onClick={handleBookmarkToggle}
              disabled={bookmarkLoading}
              className={`flex items-center justify-center ${
                bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                backgroundColor: isBookmarked ? '#E9DFFB' : '#F3F4F6', 
                width: '32px', 
                height: '32px',
                borderRadius: '3.56px'
              }}
              title={isBookmarked ? '북마크 해제' : '북마크 추가'}
              onMouseEnter={(e) => {
                if (!bookmarkLoading) {
                  e.currentTarget.style.backgroundColor = '#DBCBF9';
                }
              }}
              onMouseLeave={(e) => {
                if (!bookmarkLoading) {
                  e.currentTarget.style.backgroundColor = isBookmarked ? '#E9DFFB' : '#F3F4F6';
                }
              }}
            >
              {bookmarkLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <img src="/images/Icon/Save/Filled/32/Purple_Filled.svg" alt="북마크" width={20} height={20} />
              )}
            </button>
          )}

          {/* 바로가기 버튼 - 외부 URL로 이동 */}
          <button
            onClick={handleExternalLink}
            className="flex items-center justify-center"
            data-visit-button
            style={{ 
              backgroundColor: '#E9DFFB', 
              width: '32px', 
              height: '32px',
              borderRadius: '8px'
            }}
            title={`${tool.name} 공식 사이트로 이동`}
          >
            <img src="/images/Icon/Visit/32/Black.svg" alt="바로가기" width={32} height={32} />
          </button>
        </div>
      </div>

      {/* 중간: 제목과 설명 */}
      <div className="mb-4 text-left">
        <h3 className="text-title3 mb-2 line-clamp-1 text-left text-black transition-colors hover:text-purple-600">
          {tool.name}
        </h3>
        <p className="text-title1 line-clamp-2 text-left"
          style={{ 
            color: '#202020',
            height: '56px'
          }}>
          {tool.description}
        </p>
      </div>
    </div>
  );
};

export default ToolCard;