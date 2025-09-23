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

  // 더미 리뷰 제거: 실제 서비스 리뷰만 표시

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

  // (임시) 삭제 기능은 더미 리뷰 UI 확인 단계에서는 미사용

  // 탭 상태 (가격 정보 / 서비스 리뷰)
  const [activeTabKey, setActiveTabKey] = useState<'pricing' | 'reviews'>('pricing');
  const handleTabClick = (key: 'pricing' | 'reviews') => {
    setActiveTabKey(key);
    const el = document.getElementById(key);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatRating = (value?: number | null) =>
    Number.isFinite(value as number) ? ((value as number) === 0 ? '0' : (value as number).toFixed(1)) : '-';

  // 평점을 0.5 단위로 반올림하여 해당하는 별 아이콘 경로를 반환하는 함수
  const getRatingIconPath = (rating?: number | null): string => {
    if (!Number.isFinite(rating as number)) return '/images/Icon/Star/18/0.svg';
    
    const roundedRating = Math.round((rating as number) * 2) / 2; // 0.5 단위로 반올림
    return `/images/Icon/Star/18/${roundedRating}.svg`;
  };

  // 날짜 포맷터: YYYY.MM.DD
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}.${m}.${day}`;
    } catch {
      return iso;
    }
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI 서비스 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !toolDetail) {
    return (
      <div className="min-h-screen bg-white">
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
  // 카테고리 한글 라벨 매핑
  const mapCategoryToKorean = (value: string): string => {
    const v = (value || '').toLowerCase();
    const map: Record<string, string> = {
      chatbot: '챗봇',
      chat: '챗봇',
      writing: '텍스트',
      text: '텍스트',
      image: '이미지',
      video: '비디오',
      audio: '오디오/음악',
      code: '코드',
      productivity: '생산성',
      '3d': '3D'
    };
    return map[v] || value;
  };

  const categoryDisplayKo = mapCategoryToKorean(toolDetail.category.slug || toolDetail.category.name);

  const breadcrumbItems = [
    { label: '기능별', href: '/features?category=' + encodeURIComponent(categoryDisplayKo) },
    { label: categoryDisplayKo, href: '/features?category=' + encodeURIComponent(categoryDisplayKo) },
    { label: toolDetail.serviceName }
  ];

  // AI 평점: recommendationScore가 오면 우선 사용, 없으면 overallRating 사용
const aiScoreRaw = toolDetail.recommendationScore ?? toolDetail.overallRating;
// BE에서 BigDecimal이 문자열로 올 수도 있으니 방어
const aiScore = typeof aiScoreRaw === 'string' ? parseFloat(aiScoreRaw) : aiScoreRaw;


  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Pretendard' }}>
      <Header tabs={[]} activeTab="" onTabChange={() => {}} />
      
      <main>
        {/* 헤더 섹션 */}
        <div className="relative pt-[30px] pb-[64px] mb-3 " style={{ backgroundColor: '#F2EEFB' }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="-mb-2">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-48 bg-white">
        
        {/* 메인 히어로 섹션 */}
        <div className="flex items-start justify-between gap-20 mb-12">
          {/* 왼쪽: 도구 정보 */}
          <div className="flex-1 max-w-2xl">
            {/* 로고: 배너와 본문 경계에 반쯤 겹치게 */}
            <div className="-mt-16 md:-mt-20 mb-3 relative z-30">
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-white rounded-2xl p-2 ">
                <img 
                  src={toolDetail.logoUrl}
                  alt={toolDetail.serviceName}
                  className="w-full h-full object-contain"
                  onError={(e) => handleImageError(e, '/images/Logo/Logo_FINAL.svg')}
                />
              </div>
            </div>
            {/* 서비스명과 액션 버튼: 양쪽 끝에 배치 */}
            <div className="flex items-center justify-between mt-1 mb-4">
              <h1 className="text-3xl md:text-4xl" style={{ fontWeight: 600, color: '#202020' }}>{toolDetail.serviceName}</h1>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkLoading}
                  className={`w-10 h-10 flex items-center justify-center transition-colors ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ border: '1px solid #7E50D1', borderRadius: 8, background: 'transparent', margin: 0 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#E9DFFB'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  {bookmarkLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    isBookmarked ? (
                      <img src="/images/Icon/Save/Filled/32/Purple_Filled.svg" alt="북마크됨" width={24} height={24} />
                    ) : (
                      <img src="/images/Icon/Save/24/Purple_Empty.svg" alt="북마크" width={24} height={24} />
                    )
                  )}
                </button>
                <a 
                  href={toolDetail.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                  style={{ backgroundColor: '#7E50D1', color: '#FFFFFF', borderRadius: 8, padding: '8px 12px', margin: 0 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#6238AE'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#7E50D1'; }}
                >
                  <img src="/images/Icon/Visit/24/White.svg" alt="바로가기" width={24} height={24} style={{ marginRight: 4 }} />
                  <span style={{ fontWeight: 500 }}>바로가기</span>
                </a>
              </div>
            </div>
            {/* 모바일에서 버튼 노출은 위 공통 버튼으로 대체 */}
            
            <p className="text-base text-gray-700 mb-6" style={{ fontWeight: 500 }}>{toolDetail.description}</p>
            
            {/* 평점 정보 */}
            <div className="flex items-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <span style={{ color: '#202020', fontWeight: 600 }}>사용자 평점</span>
                <img 
                  src={getRatingIconPath(toolDetail.overallRating)} 
                  alt="사용자 평점" 
                  className="w-4 h-4"
                  onError={(e) => handleImageError(e, '/images/Icon/Star/18/0.svg')}
                />
                <span className="text-lg" style={{ color: '#202020', fontWeight: 700 }}>{formatRating(toolDetail.overallRating)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#202020', fontWeight: 600 }}>AI 평점</span>
                <img 
                  src={getRatingIconPath(aiScore)} 
                  alt="AI 평점" 
                  className="w-4 h-4"
                  onError={(e) => handleImageError(e, '/images/Icon/Star/18/0.svg')}
                />
                <span className="text-lg" style={{ color: '#202020', fontWeight: 700 }}>
                  {formatRating(aiScore)}
                </span>
              </div>

            </div>
            
            {/* 주요 기능 */}
            <div className="mb-8">
              <h3 className="mb-3" style={{ color: '#202020', fontWeight: 700 }}>주요 기능</h3>
              <div className="flex flex-wrap gap-2">
                {toolDetail.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-block text-center px-3 py-1 rounded-full text-sm whitespace-nowrap"
                    style={{ backgroundColor: '#F2EEFB', color: '#512E8F', fontWeight: 700 }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 오른쪽: 이미지 갤러리 */}
          <div className="w-96 flex-shrink-0 rounded-xl p-2 mt-6" style={{ backgroundColor: '#F2EEFB', border: '1px solid #E4E0F3' }}>
            <img 
              src={toolDetail.serviceImageUrl}
              alt={`${toolDetail.serviceName} 서비스 이미지`}
              className="w-full h-auto object-contain"
              onError={(e) => handleImageError(e, '/images/GlassMorphism/Detailpage/Detailpage_Happy.png')}
            />
          </div>
        </div>
        
        {/* 탭 네비게이션 */}
        <div className="mb-12" style={{ borderBottomWidth: '2px', borderBottomColor: '#ECECEC', borderBottomStyle: 'solid' }}>
          <nav className="flex gap-8">
            <button
              onClick={() => handleTabClick('pricing')}
              className="pb-4 text-base"
              style={{ color: activeTabKey === 'pricing' ? '#202020' : '#8C8C8C', fontWeight: 600, borderBottom: activeTabKey === 'pricing' ? '2px solid #202020' : '2px solid transparent', marginBottom: '-2px' }}
            >
              가격 정보
            </button>
            <button
              onClick={() => handleTabClick('reviews')}
              className="pb-4 text-base"
              style={{ color: activeTabKey === 'reviews' ? '#202020' : '#8C8C8C', fontWeight: 600, borderBottom: activeTabKey === 'reviews' ? '2px solid #202020' : '2px solid transparent', marginBottom: '-2px' }}
            >
              서비스 리뷰
            </button>
          </nav>
        </div>
        
        {/* 가격 정보 섹션: 리뷰 탭일 때는 숨김 */}
        {activeTabKey !== 'reviews' && (
        <section id="pricing" className="mb-16">
            <div className="flex items-center justify-between mb-0" style={{ marginBottom: '1px' }}>
              <h2 className="text-2xl" style={{ color: '#000000', fontWeight: 700, fontSize: '18px' }}>가격 정보</h2>
              <a 
                href={toolDetail.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
                style={{ backgroundColor: '#7E50D1', color: '#FFFFFF', borderRadius: 8, padding: '8px 12px', margin: '4px 12px 4px 8px' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#6238AE'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#7E50D1'; }}
              >
                <img src="/images/Icon/Visit/24/White.svg" alt="바로가기" width={24} height={24} style={{ marginRight: 4 }} />
                <span style={{ fontWeight: 500 }}>바로가기</span>
              </a>
            </div>
            
             <p className="mb-6" style={{ color: '#9B9B9B', fontWeight: 600, lineHeight: 1.6, fontSize: '14px' }}>
              본 정보는 게시 시점을 기준으로 제공되며, 실제 가격은 변동될 수 있습니다. 최신 내용은 공식 홈페이지에서 확인해 주세요.
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
        )}
        
        {/* 서비스 리뷰 섹션: 항상 표시 (리뷰 탭에서는 가격 섹션만 숨김) */}
        <section id="reviews" className="mb-36">
            <h2 className="text-sm mb-2" style={{ color: '#4B5563', fontWeight: 600 }}>서비스 리뷰</h2>

            <div className="bg-white">
              {/* 리뷰 헤더: 서비스명 + 보라 별 + 평점 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-semibold">{toolDetail.serviceName}</h3>
                  <div className="flex items-center gap-1">
                    <img 
                      src={getRatingIconPath(reviews?.average_rating)} 
                      alt="평균 평점" 
                      className="w-5 h-5"
                      onError={(e) => handleImageError(e, '/images/Icon/Star/18/0.svg')}
                    />
                    <span className="font-bold text-lg">{(reviews?.average_rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              {/* 리뷰 작성 폼 */}
              <form onSubmit={handleReviewSubmit} className="border border-gray-200 rounded-2xl p-4 mb-6">
                {/* 상단 좌측: 회색 별점 (선택 시 보라색) */}
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="w-5 h-5 flex items-center justify-center"
                      aria-label={`${star}점`}
                    >
                      <img 
                        src={star <= reviewRating ? '/images/Icon/Star/20/5.svg' : '/images/Icon/Star/20/0.svg'} 
                        alt={`${star}점`} 
                        className="w-full h-full"
                        onError={(e) => handleImageError(e, '/images/Icon/Star/20/0.svg')}
                      />
                    </button>
                  ))}
                </div>
                {/* 텍스트 영역 + 우측 하단 등록 버튼 */}
                <div className="relative">
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full p-0 pt-1 pr-20 border-0 bg-transparent outline-none focus:ring-0 resize-none placeholder:text-gray-400"
                    rows={3}
                    placeholder="이 서비스는 어땠나요?"
                    required
                  />
                  <button
                    type="submit"
                    disabled={reviewSubmitting || !reviewContent.trim()}
                    className="absolute right-0 bottom-0 translate-y-1 px-3 py-1.5 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reviewSubmitting ? '등록 중...' : '등록'}
                  </button>
                </div>
              </form>
              
              {/* 리뷰 목록 */}
              <div className="space-y-6">
                <h4 className="font-medium">{serviceReviews.length > 0 ? `${serviceReviews.length}개의 리뷰` : '리뷰'}</h4>
                <div className="border-b border-gray-200" />

                {serviceReviews.length > 0 ? serviceReviews.map((review) => {
                  const rounded = Math.round((review.rating || 0) * 2) / 2;
                  return (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      {/* 별점 (보라색 5개) */}
                      <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map((i) => (
                          <img
                            key={i}
                            src={i <= rounded ? '/images/Icon/Star/24/5.svg' : '/images/Icon/Star/24/0.svg'}
                            alt={i <= rounded ? '채워진 별' : '빈 별'}
                            className="w-5 h-5"
                            onError={(e) => handleImageError(e, '/images/Icon/Star/24/0.svg')}
                          />
                        ))}
                      </div>

                      {/* 내용 */}
                      <p className="text-gray-700 leading-relaxed mb-2">{review.content}</p>

                      {/* 작성자 + 날짜 */}
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{review.user_nickname}</span>
                        <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                  );
                }) : (
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