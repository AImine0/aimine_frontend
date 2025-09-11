import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import { apiService } from '../services';
import type { AIToolDetail, ReviewListResponse } from '../types';
import { handleImageError } from '../utils/imageMapping';

const ToolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [toolDetail, setToolDetail] = useState<AIToolDetail | null>(null);
  const [reviews, setReviews] = useState<ReviewListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  
  // 리뷰 작성 상태
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // ToolDetailPage.tsx에서 리뷰 조회 부분 수정
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);

        // 병렬로 데이터 조회
        const [toolResponse, reviewsResponse] = await Promise.allSettled([
          apiService.getServiceById(id),
          apiService.getReviews(parseInt(id)) // 특정 서비스의 리뷰만 조회
        ]);

        // 툴 상세 정보 처리
        if (toolResponse.status === 'fulfilled' && toolResponse.value) {
          setToolDetail(toolResponse.value);
        } else {
          throw new Error('AI 서비스를 찾을 수 없습니다.');
        }

        // 리뷰 정보 처리 - 특정 서비스의 리뷰만 조회했으므로 추가 필터링 불필요
        if (reviewsResponse.status === 'fulfilled') {
          setReviews(reviewsResponse.value);
          console.log('🔍 조회된 리뷰 수:', reviewsResponse.value.reviews.length);
          console.log('📝 리뷰 내용:', reviewsResponse.value.reviews);
        } else {
          console.warn('리뷰 조회 실패:', reviewsResponse.reason);
          setReviews({ reviews: [], total_count: 0, average_rating: 0 });
        }

        // 북마크 상태 확인 (로그인한 경우에만)
        if (apiService.isAuthenticated()) {
          try {
            const isBookmarkedTool = await apiService.checkBookmarkStatus(parseInt(id));
            setIsBookmarked(isBookmarkedTool);
          } catch (error) {
            console.warn('북마크 상태 조회 실패:', error);
          }
        }

      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setError(error instanceof Error ? error.message : '페이지를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 리뷰 목록 렌더링 부분에서 불필요한 필터링 제거
  const serviceReviews = reviews?.reviews || []; // 이미 특정 서비스의 리뷰만 조회했으므로 추가 필터링 불필요

  // 북마크 토글 핸들러
  const handleBookmarkToggle = async () => {
    if (!id || !toolDetail || bookmarkLoading) return;
    
    if (!apiService.isAuthenticated()) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    try {
      setBookmarkLoading(true);
      
      if (isBookmarked) {
        await apiService.removeBookmark(parseInt(id));
        setIsBookmarked(false);
      } else {
        await apiService.addBookmark(parseInt(id));
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('북마크 처리 실패:', error);
      alert('북마크 처리 중 오류가 발생했습니다.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  // 리뷰 작성 핸들러 
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !reviewContent.trim()) return;
    
    if (!apiService.isAuthenticated()) {
      alert('리뷰 작성은 로그인이 필요합니다.');
      return;
    }

    try {
      setReviewSubmitting(true);
      
      await apiService.createReview(parseInt(id), reviewRating, reviewContent.trim());
      
      // 🔥 수정: 특정 서비스의 리뷰만 새로고침 (serviceId 파라미터 전달)
      const updatedReviews = await apiService.getReviews(parseInt(id)); // serviceId 전달
      setReviews(updatedReviews);
      
      // 폼 초기화
      setReviewFormVisible(false);
      setReviewContent('');
      setReviewRating(5);
      
      alert('리뷰가 성공적으로 등록되었습니다.');
    } catch (error) {
      console.error('리뷰 작성 실패:', error);
      alert('리뷰 작성 중 오류가 발생했습니다.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // 리뷰 삭제 핸들러 
  const handleReviewDelete = async (reviewId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await apiService.deleteReview(reviewId);
      
      // 🔥 수정: 특정 서비스의 리뷰만 새로고침 (serviceId 파라미터 전달)
      const updatedReviews = await apiService.getReviews(parseInt(id!)); // serviceId 전달
      setReviews(updatedReviews);
      
      alert('리뷰가 삭제되었습니다.');
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI 서비스 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !toolDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header tabs={[]} activeTab="" onTabChange={() => {}} />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">페이지를 찾을 수 없습니다</h1>
            <p className="text-gray-600 mb-6">{error || '요청하신 AI 서비스가 존재하지 않습니다.'}</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              이전 페이지로
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 이미지 매핑 가져오기
  const breadcrumbItems = [
    { label: '기능별' },
    { label: toolDetail.category.name },
    { label: toolDetail.serviceName }
  ];


  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Pretendard' }}>
      <Header tabs={[]} activeTab="" onTabChange={() => {}} />
      
      <main>
        {/* 헤더 섹션 */}
        <div className="relative pt-10 pb-16 mb-12" style={{ backgroundColor: '#F2EEFB' }}>
          <div className="max-w-6xl mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 pt-6">
        
        {/* 메인 히어로 섹션 */}
        <div className="flex items-start gap-12 mb-12">
          {/* 왼쪽: 도구 정보 */}
          <div className="flex-1 max-w-2xl">
            {/* 로고: 배너와 본문 경계에 반쯤 겹치게, 제목 바로 위에 배치 */}
            <div className="-mt-28 md:-mt-32 mb-3 relative z-30">
              <div className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center bg-white rounded-2xl p-4 shadow-md" style={{ border: '1px solid #E4E0F3' }}>
                <img 
                  src={toolDetail.logoUrl}
                  alt={toolDetail.serviceName}
                  className="w-full h-full object-contain"
                  onError={(e) => handleImageError(e, '/images/Logo/Logo_FINAL.svg')}
                />
              </div>
            </div>
            {/* 제목과 액션 (로고 바로 아래에서 시작) */}
            <div className="flex-1">
              <div className="flex items-center justify-between mt-2">
                <h1 className="text-3xl md:text-4xl font-bold text-black">{toolDetail.serviceName}</h1>
                <div className="hidden md:flex items-center gap-3">
                  <button 
                    onClick={handleBookmarkToggle}
                    disabled={bookmarkLoading}
                    className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors ${
                      isBookmarked 
                        ? 'border-purple-600 bg-purple-50 text-purple-600' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {bookmarkLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-6 h-6" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    )}
                  </button>
                  <a 
                    href={toolDetail.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
                  >
                    바로가기
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              {/* 모바일에서 버튼 노출 */}
              <div className="mt-3 flex md:hidden items-center gap-3">
                <button 
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkLoading}
                  className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors ${
                    isBookmarked 
                      ? 'border-purple-600 bg-purple-50 text-purple-600' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {bookmarkLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-6 h-6" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>
                <a 
                  href={toolDetail.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2"
                >
                  바로가기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">{toolDetail.description}</p>
            
            {/* 평점 정보 */}
            <div className="flex items-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">사용자 평점</span>
                <span className="text-gray-500">★</span>
                <span className="font-bold text-lg">{toolDetail.overallRating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">AI 평점</span>
                <span className="text-purple-500">★</span>
                <span className="font-bold text-lg">{toolDetail.overallRating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">리뷰</span>
                <span className="font-bold text-lg">{reviews?.total_count || 0}개</span>
              </div>
            </div>
            
            {/* 주요 기능 */}
            <div className="mb-8">
              <h3 className="text-gray-700 font-medium mb-3">주요 기능</h3>
              <div className="flex flex-wrap gap-2">
                {toolDetail.keywords.map((keyword, index) => (
                  <span key={index} className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 오른쪽: 이미지 갤러리 */}
          <div className="w-80 flex-shrink-0 rounded-2xl p-4" style={{ backgroundColor: '#F2EEFB', border: '1px solid #E4E0F3' }}>
            <img 
              src={toolDetail.serviceImageUrl}
              alt={`${toolDetail.serviceName} 서비스 이미지`}
              className="w-full h-auto object-contain"
              onError={(e) => handleImageError(e, '/images/GlassMorphism/Detailpage/Detailpage_Happy.png')}
            />
          </div>
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 mb-12">
          <nav className="flex gap-8">
            <button
              onClick={() => scrollToSection('pricing')}
              className="pb-4 text-black font-medium border-b-2 border-black text-sm"
            >
              가격 정보
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="pb-4 text-gray-500 font-medium hover:text-black text-sm"
            >
              서비스 리뷰
            </button>
          </nav>
        </div>
        
        {/* 가격 정보 섹션 */}
        <section id="pricing" className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-black">가격 정보</h2>
            <a 
              href={toolDetail.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium"
            >
              공식 사이트 바로가기
            </a>
          </div>
          
          <p className="text-gray-700 mb-12 leading-relaxed text-lg">
            해당 정보는 게시 시점을 기준으로 제공되며, 실제 가격은 상이할 수 있습니다.
            정확한 가격은 공식 사이트에서 확인해주세요.
          </p>
          
          {/* 가격 플랜 이미지 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <img 
              src={toolDetail.priceImageUrl}
              alt={`${toolDetail.serviceName} 가격 정보`}
              className="w-full max-w-4xl mx-auto"
              style={{ 
                backgroundColor: '#f8f9fa', 
                minHeight: '400px', 
                objectFit: 'contain',
                display: 'block'
              }}
              onError={(e) => handleImageError(e, '/images/GlassMorphism/Detailpage/Detailpage_Happy.png')}
            />
          </div>
        </section>
        
        {/* 서비스 리뷰 섹션 */}
        <section id="reviews" className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-8">서비스 리뷰</h2>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {/* 리뷰 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold">{toolDetail.serviceName}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < Math.round(reviews?.average_rating || 0) ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-bold text-lg">{(reviews?.average_rating || 0).toFixed(1)}</span>
                  <span className="text-gray-500">({reviews?.total_count || 0}개 리뷰)</span>
                </div>
              </div>
              
              <button
                onClick={() => setReviewFormVisible(!reviewFormVisible)}
                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium"
              >
                리뷰 작성
              </button>
            </div>
            
            {/* 리뷰 작성 폼 */}
            {reviewFormVisible && (
              <form onSubmit={handleReviewSubmit} className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">평점</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">리뷰 내용</label>
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={4}
                    placeholder="이 서비스에 대한 솔직한 후기를 작성해주세요..."
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={reviewSubmitting || !reviewContent.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reviewSubmitting ? '등록 중...' : '등록'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewFormVisible(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                </div>
              </form>
            )}
            
            {/* 리뷰 목록 */}
            <div className="space-y-6">
              <h4 className="font-medium">
                {serviceReviews.length > 0 ? `${serviceReviews.length}개의 리뷰` : '리뷰'}
              </h4>
              
              {serviceReviews.length > 0 ? (
                serviceReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < Math.round(review.rating) ? "text-yellow-400" : "text-gray-300"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="font-medium">{review.user_nickname}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* 현재 사용자의 리뷰인 경우 삭제 버튼 표시 (실제로는 사용자 인증 정보와 비교) */}
                      { <button
                        onClick={() => handleReviewDelete(review.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        삭제
                      </button> }
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>아직 리뷰가 없습니다.</p>
                  <p className="text-sm mt-2">첫 번째 리뷰를 작성해보세요!</p>
                </div>
              )}
            </div>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default ToolDetailPage;