import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import ToolCard from '../components/ToolCard';
import { roleCombos } from '../data/roleCombos';
import { dummyJobSituations } from '../data/dummyData';
import { getImageMapping } from '../utils/imageMapping';
import { apiService } from '../services';
import type { JobSituation } from '../types';

const roleTabs = [
  { id: 'it', name: 'IT/기술' },
  { id: 'edu', name: '교육/연구' },
  { id: 'art', name: '아트/디자인' },
  { id: 'media', name: '미디어/음악' },
  { id: 'plan', name: '기획/마케팅' },
  { id: 'manage', name: '경영/운영' }
];

const RoleListPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState('it');
  const [jobSituations, setJobSituations] = useState<JobSituation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useApiData, setUseApiData] = useState(false);
  const [expandedSituations, setExpandedSituations] = useState<Set<number>>(new Set());
  const [situationSlides, setSituationSlides] = useState<Record<number, number>>({});
  const activeRoleName = roleTabs.find(tab => tab.id === activeRole)?.name || '';

  // API에서 직업/상황별 추천 가져오기
  useEffect(() => {
    const fetchJobSituations = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiJobSituations = await apiService.getJobSituations();

        if (apiJobSituations && apiJobSituations.length > 0) {
          setJobSituations(apiJobSituations);
          setUseApiData(true);
        } else {
          setJobSituations(dummyJobSituations);
          setUseApiData(false);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        setError(`API 호출에 실패했습니다: ${errorMessage}`);
        setJobSituations(dummyJobSituations);
        setUseApiData(false);
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchJobSituations();
  }, []);

  // 상황별 추천 조합 슬라이더 상태
  const combos = roleCombos[activeRoleName] || [];
  const [comboIdx, setComboIdx] = useState(0);
  const handlePrev = () => setComboIdx(idx => (idx === 0 ? combos.length - 1 : idx - 1));
  const handleNext = () => setComboIdx(idx => (idx === combos.length - 1 ? 0 : idx + 1));

  // 탭이 바뀌면 슬라이더 인덱스 초기화
  useEffect(() => { 
    setComboIdx(0); 
  }, [activeRole]);

  const breadcrumbItems = [
    { label: '직업별' },
    { label: activeRoleName }
  ];

  const [containerLeft, setContainerLeft] = useState(0);
  const [containerRight, setContainerRight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ 권장 방식: ResizeObserver + 안전 여백 클램프
  useLayoutEffect(() => {
    function updatePos() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerLeft(rect.left);
      setContainerRight(window.innerWidth - rect.right);
    }

    // 최초
    updatePos();

    // 창 리사이즈
    window.addEventListener('resize', updatePos);

    // 컨테이너 자체 레이아웃 변화 관찰 (API 데이터 들어올 때 등)
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => updatePos());
      if (containerRef.current) ro.observe(containerRef.current);
    } else {
      // 폴백: 약간 늦게 한 번 더 측정 (아주 구형 브라우저용)
      const t = setTimeout(updatePos, 50);
      // cleanup에 포함
      return () => {
        window.removeEventListener('resize', updatePos);
        clearTimeout(t);
      };
    }

    return () => {
      window.removeEventListener('resize', updatePos);
      ro?.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 현재 탭에 해당하는 상황들만 필터링
  const filteredSituations = jobSituations.filter(situation => {
    // API 카테고리와 프론트엔드 탭명 매핑
    const categoryMapping: Record<string, string> = {
      'IT/기술': 'IT/기술',
      '교육/연구': '교육/연구', 
      '아트/디자인': '아트/디자인',
      '미디어/음악': '미디어/음악',
      '기획/마케팅': '기획/마케팅',
      '경영/운영': '경영/운영'
    };
    const mappedCategory = categoryMapping[situation.category] || situation.category;
    return mappedCategory === activeRoleName;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header tabs={roleTabs} activeTab={activeRole} onTabChange={setActiveRole} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mb-8">
          <h1 className="font-semibold mb-2" style={{ color: '#000000', fontSize: '32px', fontFamily: 'Pretendard' }}>{activeRoleName}</h1>
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

        {/* 상황별 추천 조합 배너 */}
        {combos.length > 0 && (
          <div
            className="w-screen relative left-1/2 -translate-x-1/2 mb-10"
            style={{ background: '#F6F0FF', borderRadius: 0, minHeight: 220, padding: 0 }}
          >
            {/* 왼쪽 화살표 (클램프 적용 + zIndex 상향) */}
            {combos.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute"
                style={{
                  top: '50%',
                  left: `max(${containerLeft - 32}px, 8px)`,
                  transform: 'translateY(-50%)',
                  zIndex: 50,
                  width: 28,
                  height: 79,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="이전"
              >
                <svg width="28" height="79" viewBox="0 0 28 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="20,10 8,39.5 20,69" stroke="#DBCBF9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-row items-start py-8 justify-between">
                {/* 왼쪽 텍스트 영역 */}
                <div className="banner-left-text" style={{ textAlign: 'left' }}>
                  <div className="flex flex-col justify-center items-start">
                    <div className="flex items-center mb-2" style={{ justifyContent: 'flex-start' }}>
                      <span
                        className="inline-block px-4 py-1 mr-2"
                        style={{
                          border: '1px solid #7F50D2',
                          borderRadius: '20px',
                          color: '#7F50D2',
                          fontWeight: 600,
                          fontSize: 16,
                          background: 'none',
                          fontFamily: 'Pretendard'
                        }}
                      >
                        {combos[comboIdx].situation}
                      </span>
                      <span style={{ color: '#000000', fontWeight: 600, fontSize: 24, fontFamily: 'Pretendard' }}>을 위한</span>
                    </div>
                    <div className="mb-2" style={{ textAlign: 'left' }}>
                      <span style={{ color: '#7F50D2', fontWeight: 600, fontSize: 24, fontFamily: 'Pretendard' }}>AIMine</span>
                      <span style={{ color: '#000000', fontWeight: 600, fontSize: 24, fontFamily: 'Pretendard', marginLeft: 8 }}>의 추천 조합!</span>
                    </div>
                    <div className="text-base leading-relaxed mt-12" style={{ fontFamily: 'Pretendard', textAlign: 'left' }}>
                      {(() => {
                        const aiNames = combos[comboIdx].aiList;
                        const regex = new RegExp(`(${aiNames.map(n => n.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")).join('|')}|[.,])`, 'g');
                        return combos[comboIdx].description.split(regex).map((part, i) => {
                          if (aiNames.includes(part)) {
                            return <span key={i} style={{ color: '#7E50D1', fontWeight: 500, fontSize: 14, fontFamily: 'Pretendard' }}>{part}</span>;
                          } else if (part === ',' || part === '.') {
                            return <><span key={i} style={{ color: '#202020', fontWeight: 500, fontSize: 14, fontFamily: 'Pretendard' }}>{part}</span><br key={i} /></>;
                          } else if (part.trim() === '') {
                            return null;
                          } else {
                            return <span key={i} style={{ color: '#202020', fontWeight: 500, fontSize: 14, fontFamily: 'Pretendard' }}>{part}</span>;
                          }
                        });
                      })()}
                    </div>
                  </div>
                </div>

                {/* 오른쪽 AI 도구 indicator */}
                <div className="ai-indicator-set flex justify-end items-center" style={{ position: 'relative', zIndex: 1 }}>
                  <div className="flex flex-col items-end justify-center">
                    {(() => {
                      const dotSize = 15;
                      const gap = 20;
                      const n = combos[comboIdx].aiList.length;
                      if (n === 0) return null;
                      const flexItemWidth = 160 + dotSize;
                      const totalWidth = n * flexItemWidth + (n - 1) * gap;
                      const centers = Array.from({ length: n }, (_, i) => i * (flexItemWidth + gap) + flexItemWidth / 2);
                      return (
                        <>
                          <svg width={totalWidth} height={40} style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }}>
                            {n > 1 && (
                              <line
                                x1={centers[0]}
                                y1={dotSize / 2}
                                x2={centers[n - 1]}
                                y2={dotSize / 2}
                                stroke="#7E50D1"
                                strokeWidth={1}
                              />
                            )}
                            {centers.map((cx, idx) => (
                              <circle key={idx} cx={cx} cy={dotSize / 2} r={dotSize / 2} fill="#7E50D1" />
                            ))}
                          </svg>
                          <div className="flex justify-end" style={{ gap: `${gap}px`, position: 'relative', zIndex: 1 }}>
                            {combos[comboIdx].aiList.map((ai) => {
                              const categoryMap: Record<string, string> = {
                                'ChatGPT': 'chat', 'Claude': 'chat', 'Gemini': 'chat',
                                'DALL-E': 'image', 'Midjourney': 'image', 'Stable Diffusion': 'image', 'PromptoMANIA': 'image', 'Leonardo.ai': 'image', 'Adobe Firefly': 'image',
                                'Runway': 'video', 'Pika': 'video', 'Pika Labs': 'video', 'Animaker': 'video', 'Lumen5': 'video', 'Synthesia': 'video',
                                'ElevenLabs': 'audio', 'Suno AI': 'audio', 'AIVA': 'audio', 'Soundful': 'audio', 'LALAL.AI': 'audio', 'Typecast': 'audio',
                                'GitHub Copilot': 'code', 'Cursor': 'code',
                                'Jasper': 'text', 'Grammarly': 'text', 'Connected Papers': 'text', 'SciSpace': 'text', 'Jenni AI': 'text', 'Copy.ai': 'text', 'Scalenut': 'text', 'Rytr': 'text',
                                'Relume': 'product', 'Relume AI': 'product', 'Galileo AI': 'product', 'Uizard': 'product', 'Gamma': 'product', 'Tome': 'product', 'SlidesAI': 'product', 'Miro AI': 'product', 'Crayon': 'product', 'Magic Design': 'product', 'Make': 'product', 'Shiftee': 'product', 'Zep Quiz': 'product', 'AlphaSense': 'product',
                                'Kaedim': '3d', 'Meshy': '3d', 'Meshy AI': '3d', 'Lumalabs AI': '3d'
                              };
                              
                              const category = categoryMap[ai] || 'chat';
                              const imageMapping = getImageMapping(ai, category);
                              
                              return (
                                <div key={ai} className="flex flex-col items-center" style={{ width: flexItemWidth }}>
                                  <div style={{ height: dotSize + 8 }} />
                                  <span style={{ color: '#7E50D1', fontWeight: 600, fontSize: 14, fontFamily: 'Pretendard', marginBottom: 16 }}>{ai}</span>
                                  <div className="flex items-center justify-center bg-white" style={{ width: 160, height: 160, borderRadius: 40, border: '0.89px solid #DBCBF9' }}>
                                    <img 
                                      src={imageMapping.logo} 
                                      alt={ai} 
                                      style={{ width: 88, height: 88, objectFit: 'contain' }}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/images/Logo/Logo_FINAL.svg';
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 화살표 (클램프 적용 + zIndex 상향) */}
            {combos.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute"
                style={{
                  top: '50%',
                  right: `max(${containerRight - 32}px, 8px)`,
                  transform: 'translateY(-50%)',
                  zIndex: 50,
                  width: 28,
                  height: 79,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="다음"
              >
                <svg width="28" height="79" viewBox="0 0 28 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="8,10 20,39.5 8,69" stroke="#DBCBF9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 상황별 추천 섹션 */}
        <section>
          <h2 className="text-2xl font-bold text-black mb-8">상황별 추천</h2>

          {filteredSituations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">이 직업 분야에 해당하는 상황별 추천이 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">현재 탭: "{activeRoleName}"</p>
              <p className="text-sm text-gray-400">API 데이터: {useApiData ? 'Connected' : 'Not Connected'}</p>
              <div className="mt-4 text-xs text-gray-300">
                <p>사용 가능한 카테고리들:</p>
                <ul className="list-disc list-inside">
                  {[...new Set(jobSituations.map(s => s.category))].map(cat => (
                    <li key={cat}>"{cat}"</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            filteredSituations.map((situation, situationIdx) => {
              // 타입 안전성을 위해 any로 캐스팅
              const situationData = situation as any;
              
              let tools: any[] = [];
              let title = '';
              let description = '';
              let icon = '💡';
              
              // API 데이터인 경우 (recommendations 속성이 있는 경우)
              if ('recommendations' in situationData) {
                const recommendations = situationData.recommendations;
                if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
                  tools = recommendations.map((rec: any, index: number) => {
                    const toolData = rec.tool || rec; // rec.tool이 없을 경우 rec 자체를 사용
                    const categorySlug = getCategorySlug(toolData.category?.name || toolData.categoryName || '생산성');
                    const imageMapping = getImageMapping(toolData.serviceName || toolData.name || 'Unknown Tool', categorySlug);
                    
                    return {
                      id: (toolData.id || index).toString(),
                      name: toolData.serviceName || toolData.name || 'Unknown Tool',
                      category: categorySlug,
                      description: rec.recommendationText || toolData.description || '추천 도구입니다.',
                      features: [],
                      rating: toolData.overallRating || toolData.rating || 0,
                      tags: [],
                      url: toolData.websiteUrl || toolData.url || '',
                      releaseDate: '',
                      company: '',
                      pricing: 'freemium' as const,
                      categoryLabel: toolData.category?.name || toolData.categoryName || '생산성',
                      logoUrl: toolData.logoUrl || imageMapping.logo,
                      serviceImageUrl: imageMapping.serviceImage,
                      priceImageUrl: imageMapping.priceImage,
                      searchbarLogoUrl: imageMapping.searchbarLogo
                    };
                  });
                } else {
                  // 빈 recommendations인 경우 더미 데이터 생성
                  tools = [
                    {
                      id: '1',
                      name: 'Gamma',
                      category: 'product',
                      description: 'PPT 제작, 슬라이드 제작',
                      features: [],
                      rating: 4.5,
                      tags: [],
                      url: '',
                      releaseDate: '',
                      company: '',
                      pricing: 'freemium' as const,
                      categoryLabel: '프레젠테이션',
                      logoUrl: '/images/Logo/Logo_FINAL.svg',
                      serviceImageUrl: '',
                      priceImageUrl: '',
                      searchbarLogoUrl: ''
                    }
                  ];
                }
                title = situationData.title || '제목 없음';
                description = situationData.description || '';
                icon = '💡';
              }
              // 더미 데이터인 경우 (tools 속성이 있는 경우)
              else if ('tools' in situationData) {
                tools = situationData.tools || [];
                title = situationData.title || '제목 없음';
                description = situationData.description || '';
                icon = situationData.icon || '💡';
              }
              else {
                title = situationData.title || '제목 없음';
                description = situationData.description || '';
                icon = '💡';
              }
              
              const showArrows = tools.length > 3;
              const currentSlide = situationSlides[situationData.id] || 0;
              const toolsPerSlide = 3;
              const totalSlides = Math.ceil(tools.length / toolsPerSlide);
              const startIndex = currentSlide * toolsPerSlide;
              const visibleTools = tools.slice(startIndex, startIndex + toolsPerSlide);
              
              return (
                <div key={situationData.id || situationIdx} className="mb-16">
                  <div className="flex items-center mb-2" style={{ justifyContent: 'flex-start' }}>
                    <span className="font-semibold" style={{ fontFamily: 'Pretendard', color: '#000000', fontSize: 24, fontWeight: 600 }}>
                      {title}
                    </span>
                  </div>
                  {description && (
                    <div className="mb-6 text-left" style={{ color: '#000000', fontSize: '14px', fontWeight: 400, fontFamily: 'Pretendard' }}>
                      {description}
                    </div>
                  )}
                  
                  {/* 도구 카드들이 없을 때 임시 메시지 */}
                  {tools.length === 0 ? (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800">이 상황에 대한 도구가 없습니다.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-6 w-full">
                      {visibleTools.map((tool, idx) => {
                        const isLast = showArrows && idx === visibleTools.length - 1;
                        return (
                          <div key={tool.id || idx} className="relative h-full">
                            <ToolCard tool={tool} className="h-full" />
                            {/* 왼쪽(이전) 화살표 */}
                            {showArrows && idx === 0 && currentSlide > 0 && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const newSlide = currentSlide - 1;
                                  setSituationSlides(prev => ({
                                    ...prev,
                                    [situationData.id]: newSlide
                                  }));
                                }}
                                style={{
                                  position: 'absolute',
                                  left: '-20px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  background: '#DBCBF9',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 8px rgba(123, 80, 209, 0.08)',
                                  border: 'none',
                                  cursor: 'pointer',
                                  zIndex: 10,
                                  pointerEvents: 'auto'
                                }}
                                aria-label="이전"
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#C4B5F0'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#DBCBF9'; }}
                              >
                                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <polyline points="9,1 1,8 9,15" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            )}
                            {/* 오른쪽(다음) 화살표 */}
                            {showArrows && isLast && currentSlide < totalSlides - 1 && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const newSlide = (currentSlide + 1) % totalSlides;
                                  setSituationSlides(prev => ({
                                    ...prev,
                                    [situationData.id]: newSlide
                                  }));
                                }}
                                style={{
                                  position: 'absolute',
                                  right: '-20px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  background: '#DBCBF9',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 8px rgba(123, 80, 209, 0.08)',
                                  border: 'none',
                                  cursor: 'pointer',
                                  zIndex: 10,
                                  pointerEvents: 'auto'
                                }}
                                aria-label="다음"
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#C4B5F0'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#DBCBF9'; }}
                              >
                                <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <polyline points="1,1 9,8 1,15" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {/* 3개 미만일 때 빈 칸 채우기 */}
                      {Array.from({ length: 3 - visibleTools.length }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
};

export default RoleListPage;

function getCategorySlug(categoryName: string): string {
  const categoryMap: Record<string, string> = {
    '챗봇': 'chat',
    '이미지 생성': 'image',
    '비디오 생성': 'video',
    '오디오 생성': 'audio',
    '텍스트 생성': 'text',
    '코드 생성': 'code',
    '생산성': 'product',
    '프레젠테이션': 'product',
    'AI 글쓰기 도우미': 'text',
    '논문 검색 AI': 'text',
    '디자인 AI': 'product',
    '프로토타이핑': 'product',
    '영상 생성 AI': 'video',
    '영상 편집 AI': 'video',
    '시장 분석': 'product',
    '협업 도구': 'product',
    '자동화': 'product',
    '3D': '3d'
  };
  return categoryMap[categoryName] || 'product';
}