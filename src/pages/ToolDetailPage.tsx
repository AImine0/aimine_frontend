// src/pages/ToolDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import { apiService } from '../services';
import { dummyAIToolDetails } from '../data/dummyData';
import type { AIToolDetail } from '../types';
import { handleImageError, getImageMapping } from '../utils/imageMapping';

const ToolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [toolDetail, setToolDetail] = useState<AIToolDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToolDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const detail = await apiService.getServiceById(id);
        setToolDetail(detail);
      } catch (error) {
        console.warn('API 호출 실패, 더미 데이터 사용:', error);
        setError('API 호출에 실패했습니다. 더미 데이터를 표시합니다.');
        
        // 더미 데이터에서 찾기
        const detail = dummyAIToolDetails[id];
        if (detail) {
          setToolDetail(detail);
        } else {
          setToolDetail(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchToolDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!toolDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">AI 도구를 찾을 수 없습니다</h1>
          <p className="text-gray-600">요청하신 AI 도구가 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  // 이미지 매핑 가져오기
  const imageMapping = getImageMapping(toolDetail.serviceName, toolDetail.category.slug);

  const breadcrumbItems = [
    { label: '기능별' },
    { label: toolDetail.category.name },
    { label: toolDetail.serviceName }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Pretendard' }}>
      <Header tabs={[]} activeTab="" onTabChange={() => {}} />
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 mb-4">
          {error}
        </div>
      )}
      
      <main>
        {/* 헤더 섹션 */}
        <div className="bg-purple-100 p-6 mb-8">
          <div className="max-w-6xl mx-auto px-4">
            <Breadcrumb items={breadcrumbItems} />
            
            {/* 로고 박스 */}
            <div className="flex items-center gap-4 mt-4">
              <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 bg-purple-200 rounded-lg p-2 overflow-hidden">
                <img 
                  src={imageMapping.logo}
                  alt={toolDetail.serviceName}
                  className="w-full h-full object-contain"
                  onError={(e) => handleImageError(e, '/images/Logo/Logo_FINAL.svg')}
                />
              </div>
              <h1 className="text-3xl font-bold text-black">{toolDetail.serviceName}</h1>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4">
        
        {/* 메인 히어로 섹션 */}
        <div className="flex items-start gap-12 mb-12">
          {/* 왼쪽: 도구 정보 */}
          <div className="flex-1 max-w-2xl">
            {/* 제목과 액션 버튼들 */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-black">{toolDetail.serviceName}</h1>
              <div className="flex items-center gap-3">
                <button 
                  className="w-12 h-12 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
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
                <span className="font-bold text-lg">{toolDetail.overallRating}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">AI 평점</span>
                <span className="text-purple-500">★</span>
                <span className="font-bold text-lg">{toolDetail.overallRating}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">조회수</span>
                <span className="font-bold text-lg">{toolDetail.viewCount.toLocaleString()}</span>
              </div>
            </div>
            
            {/* 주요 기능 */}
            <div className="mb-8">
              <h3 className="text-gray-700 font-medium mb-3">주요 기능</h3>
              <div className="flex flex-wrap gap-2">
                {toolDetail.keywords.map((keyword) => (
                  <span key={keyword.id} className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {keyword.keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 오른쪽: 이미지 갤러리 */}
          <div className="w-80 flex-shrink-0 bg-purple-100 rounded-lg p-4">
            <img 
              src={imageMapping.serviceImage}
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
              onClick={() => scrollToSection('videos')}
              className="pb-4 text-gray-500 font-medium hover:text-black text-sm"
            >
              관련 영상
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
            {toolDetail.pricingLink && (
              <a 
                href={toolDetail.pricingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-medium"
              >
                공식 가격 바로가기
              </a>
            )}
          </div>
          
          <p className="text-gray-700 mb-12 leading-relaxed text-lg">
            {toolDetail.pricingInfo || '해당 정보는 게시 시점을 기준으로 제공되며, 실제 가격은 상이할 수 있습니다.'}
          </p>
          
          {/* 가격 플랜 이미지 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <img 
              src={imageMapping.priceImage}
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
        
        {/* 관련 영상 섹션 */}
        <section id="videos" className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-8">관련 영상</h2>
          
          {toolDetail.videos && toolDetail.videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {toolDetail.videos.map((video) => (
                <div key={video.id} className="flex flex-col">
                  {/* 썸네일 이미지 컨테이너 */}
                  <a 
                    href={video.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video relative">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* 썸네일 로드 실패 시 대체 배경 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 hidden">
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        <div className="text-center z-10 absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* 재생 버튼 오버레이 */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                      {/* 영상 길이 표시 */}
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </a>
                  {/* 제목 (컨테이너 아래) */}
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 기본 영상 카드 */}
              <div className="flex flex-col">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="text-center z-10">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-xl font-bold">{toolDetail.serviceName}</div>
                      <div className="text-xl font-bold">시작하기</div>
                      <div className="text-sm">+ 초보 꿀팁</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-900">{toolDetail.serviceName} 마스터하기: 초보자를 위한 완벽 가이드</h3>
                </div>
              </div>
            </div>
          )}
        </section>
        
        {/* 서비스 리뷰 섹션 */}
        <section id="reviews" className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-8">서비스 리뷰</h2>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {/* 리뷰 헤더 */}
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-semibold">{toolDetail.serviceName}</h3>
              <div className="flex items-center gap-2">
                <div className="flex text-blue-500">
                  <span>★★★★</span><span className="text-gray-300">★</span>
                </div>
                <span className="font-bold text-lg">{toolDetail.overallRating}</span>
              </div>
            </div>
            
            {/* 리뷰 입력 */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex text-blue-500">
                  <span>★★★★</span><span className="text-gray-300">★</span>
                </div>
                <span className="text-gray-500">이 서비스는 어땠나요?</span>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700">
                등록
              </button>
            </div>
            
            {/* 리뷰 목록 */}
            <div className="space-y-6">
              <h4 className="font-medium">
                {toolDetail.reviews ? `${toolDetail.reviews.length}개의 리뷰` : '리뷰'}
              </h4>
              
              {toolDetail.reviews && toolDetail.reviews.length > 0 ? (
                toolDetail.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex text-blue-500 mb-2">
                      {'★'.repeat(Math.round(review.rating))}
                    </div>
                    <p className="text-gray-700 mb-2 leading-relaxed">{review.content}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{review.user.nickname}</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
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