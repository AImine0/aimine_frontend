// [AI 툴 카드 컴포넌트] 개별 AI 도구 정보 표시 - 이름, 설명, BEST 뱃지, 북마크, 평점, 링크 버튼
// src/components/ToolCard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // 인증 상태 및 북마크 상태 확인
  useEffect(() => {
    const checkAuthAndBookmark = async () => {
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        try {
          const bookmarks = await apiService.getBookmarks();
          const isBookmarkedTool = bookmarks.bookmarks.some(
            bookmark => bookmark.ai_service_id.toString() === tool.id
          );
          setIsBookmarked(isBookmarkedTool);
        } catch (error) {
          console.warn('북마크 상태 조회 실패:', error);
        }
      }
    };

    checkAuthAndBookmark();
  }, [tool.id]);

  // 북마크 토글 핸들러
  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    if (bookmarkLoading) return;

    try {
      setBookmarkLoading(true);
      
      if (isBookmarked) {
        await apiService.removeBookmark(parseInt(tool.id));
        setIsBookmarked(false);
      } else {
        await apiService.addBookmark(parseInt(tool.id));
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('북마크 처리 실패:', error);
      alert('북마크 처리 중 오류가 발생했습니다.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  // BEST 뱃지
  const getBestBadge = (rank: number) => {
    return (
      <span className="inline-flex items-center px-2 py-1 font-bold"
            style={{ 
              backgroundColor: '#FFE4C4', 
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

  // 가격 뱃지
  const getPricingBadge = (pricing: string) => {
    const badgeConfig = {
      free: { text: 'Free', bgColor: '#E8F5E8', textColor: '#2E7D33' },
      paid: { text: 'Paid', bgColor: '#FFF3E0', textColor: '#F57C00' },
      freemium: { text: 'Freemium', bgColor: '#E3F2FD', textColor: '#1976D2' }
    };
    
    const config = badgeConfig[pricing as keyof typeof badgeConfig] || badgeConfig.freemium;
    
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

  // 별점 표시
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {/* 꽉 찬 별들 */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {/* 반 별 */}
        {hasHalfStar && (
          <div className="relative">
            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* 빈 별들 */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        <span className="text-sm font-medium text-gray-700 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl hover:border-purple-200 hover:shadow-lg transition-all duration-200 group ${className || ''}`} 
         style={{ border: '1px solid #DBCBF9', fontFamily: 'Pretendard', padding: '20px', minHeight: '280px' }}>
      
      {/* 상단: 로고, 카테고리, 북마크/BEST 뱃지 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {tool.logoUrl ? (
                <img 
                  src={tool.logoUrl} 
                  alt={`${tool.name} 로고`}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => handleImageError(e, '/images/Logo/Logo_FINAL.svg')}
                />
              ) : (
                <span className="text-3xl">🤖</span>
              )}
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
                {tool.categoryLabel}
              </span>
              {getPricingBadge(tool.pricing)}
            </div>
          </div>
        </div>

        {/* 오른쪽: 북마크, BEST 뱃지, 링크 버튼 */}
        <div className="flex items-start gap-2 flex-shrink-0">
          {/* 북마크 버튼 */}
          <button
            onClick={handleBookmarkToggle}
            disabled={bookmarkLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isBookmarked 
                ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-400'
            } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={isAuthenticated ? (isBookmarked ? '북마크 해제' : '북마크 추가') : '로그인이 필요합니다'}
          >
            {bookmarkLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>

          {/* BEST 뱃지 */}
          {rank && rank <= 3 && getBestBadge(rank)}

          {/* 상세 페이지 링크 */}
          <Link to={`/tool/${tool.id}`}>
            <button className="flex items-center justify-center transition-all duration-200 group-hover:bg-purple-100" 
                    style={{ 
                      backgroundColor: '#E9DFFB', 
                      width: '32px', 
                      height: '32px',
                      borderRadius: '3.56px'
                    }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{ color: '#7E50D1' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* 중간: 제목과 설명 */}
      <div className="mb-4">
        <Link to={`/tool/${tool.id}`} className="hover:text-purple-600 transition-colors">
          <h3 className="font-semibold mb-2 line-clamp-1" style={{ color: '#000000', fontSize: '20px', fontFamily: 'Pretendard' }}>
            {tool.name}
          </h3>
        </Link>
        <p className="text-gray-600 leading-relaxed line-clamp-2" style={{ fontSize: '14px', fontFamily: 'Pretendard' }}>
          {tool.description}
        </p>
      </div>

      {/* 하단: 평점, 사용자 수, 주요 기능 */}
      <div className="space-y-3">
        {/* 평점과 사용자 수 */}
        <div className="flex items-center justify-between">
          {renderStars(tool.rating || tool.aiRating || 0)}
          
          {tool.userCount && tool.userCount > 0 && (
            <div className="flex items-center gap-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span className="text-xs font-medium">
                {tool.userCount >= 1000 ? `${(tool.userCount / 1000).toFixed(1)}k` : tool.userCount}
              </span>
            </div>
          )}
        </div>

        {/* 주요 기능 태그들 */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tool.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
                style={{ fontFamily: 'Pretendard' }}
              >
                {tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-gray-400 text-xs">
                +{tool.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolCard;