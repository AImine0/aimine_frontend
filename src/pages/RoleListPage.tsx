import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import ToolCard from '../components/ToolCard';
import { roleCombos } from '../data/roleCombos'; // 향후 API로 대체 예정
import { getImageMapping } from '../utils/imageMapping';
import { apiService } from '../services';
import type { JobSituation, AITool } from '../types';

const roleTabs = [
  { id: 'it', name: 'IT/기술' },
  { id: 'edu', name: '교육/연구' },
  { id: 'art', name: '아트/디자인' },
  { id: 'media', name: '미디어/음악' },
  { id: 'plan', name: '기획/마케팅' },
  { id: 'manage', name: '경영/운영' }
];

// ✅ getCategorySlug 함수를 RoleListPage에서 직접 정의
const getCategorySlug = (categoryName: string): string => {
  const categoryMap: Record<string, string> = {
    '챗봇': 'chatbot',
    '텍스트': 'text', 
    '이미지': 'image',
    '비디오': 'video',
    '오디오': 'audio',
    '코드': 'code',
    '3D': '3d',
    '교육': 'education',
    '비즈니스': 'business',
    '창의성': 'creativity',
    '생산성': 'productivity'
  };
  
  return categoryMap[categoryName] || 'chatbot';
};

const RoleListPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState('it');
  const [jobSituations, setJobSituations] = useState<JobSituation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        
        if (apiJobSituations && Array.isArray(apiJobSituations) && apiJobSituations.length > 0) {
          setJobSituations(apiJobSituations);
        } else {
          setError('직업별 추천 데이터가 없습니다.');
          setJobSituations([]);
        }
      } catch (error) {
        console.error('직업별 상황 조회 실패:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        setError(`직업별 추천을 불러오는데 실패했습니다: ${errorMessage}`);
        setJobSituations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobSituations();
  }, []);

  // 재시도 함수
  const handleRetry = () => {
    window.location.reload();
  };

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

  // ResizeObserver + 안전 여백 클램프
  useLayoutEffect(() => {
    function updatePos() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setContainerLeft(rect.left);
      setContainerRight(window.innerWidth - rect.right);
    }

    updatePos();
    window.addEventListener('resize', updatePos);

    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => updatePos());
      if (containerRef.current) ro.observe(containerRef.current);
    } else {
      const t = setTimeout(updatePos, 50);
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
      <div className="min-h-screen bg-white">
        <Header tabs={roleTabs} activeTab={activeRole} onTabChange={setActiveRole} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center justify-center pt-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">직업별 추천을 불러오는 중...</p>
            </div>
          </div>
        </div>
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
          <h1 className="font-semibold mb-2" style={{ color: '#000000', fontSize: '32px', fontFamily: 'Pretendard' }}>
            {activeRoleName}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">데이터 로드 실패</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={handleRetry}
                    className="bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium px-3 py-1 rounded-md transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 상황별 추천 조합 배너 (향후 API로 대체 예정) */}
        {combos.length > 0 && (
          <div
            className="w-screen relative left-1/2 -translate-x-1/2 mb-10"
            style={{ background: '#F6F0FF', borderRadius: 0, minHeight: 220, padding: 0 }}
          >
            {/* 왼쪽 화살표 */}
            {combos.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute"
                style={{
                  top: '50%',
                  left: `max(${containerLeft - 24}px, 8px)`,
                  transform: 'translateY(-50%)',
                  zIndex: 50,
                  width: 40,
                  height: 90,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="이전"
              >
                <img src="/images/Icon/Arrow/Left40x90.svg" alt="이전" width={40} height={90} />
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
                                'DALL-E': 'image', 'Midjourney': 'image', 'Stable Diffusion': 'image', 'PromptoMANIA': 'product', 'Leonardo.ai': 'image', 'Adobe Firefly': 'image',
                                'Runway': 'video', 'Pika': 'video', 'Pika Labs': 'video', 'Animaker': 'video', 'Lumen5': 'video', 'Synthesia': 'video',
                                'ElevenLabs': 'audio', 'Suno AI': 'audio', 'AIVA': 'audio', 'Soundful': 'audio', 'LALAL.AI': 'audio', 'Typecast': 'audio',
                                'GitHub Copilot': 'code', 'Cursor': 'code',
                                'Jasper': 'text', 'Grammarly': 'text', 'Connected Papers': 'text', 'SciSpace': 'text', 'Jenni AI': 'text', 'Copy.ai': 'text', 'Scalenut': 'product', 'Rytr': 'text',
                                'Relume': 'product', 'Relume AI': 'product', 'Galileo AI': 'product', 'Uizard': 'product', 'Gamma': 'product', 'Tome': 'product', 'SlidesAI': 'product', 'Miro AI': 'product', 'Crayon': 'product', 'Magic Design': 'text', 'Make': 'product', 'Shiftee': 'product', 'Zep Quiz': 'product', 'AlphaSense': 'product',
                                'Kaedim': '3d', 'Meshy': '3d', 'Meshy AI': '3d', 'Lumalabs AI': 'video'
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

            {/* 오른쪽 화살표 */}
            {combos.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute"
                style={{
                  top: '50%',
                  right: `max(${containerRight - 24}px, 8px)`,
                  transform: 'translateY(-50%)',
                  zIndex: 50,
                  width: 40,
                  height: 90,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="다음"
              >
                <img src="/images/Icon/Arrow/Right40x90.svg" alt="다음" width={40} height={90} />
              </button>
            )}
          </div>
        )}

        {/* 상황별 추천 섹션 */}
        <section>
          <h2 className="text-2xl font-bold text-black mb-8">상황별 추천</h2>

          {!loading && filteredSituations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">추천 정보가 없습니다</h3>
              <p className="text-gray-600 mb-4">
                "{activeRoleName}" 분야에 대한 상황별 추천이 아직 준비되지 않았습니다.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                현재 이용 가능한 직업 분야:
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {[...new Set(jobSituations.map(s => s.category))].map(cat => (
                    <span key={cat} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                새로고침
              </button>
            </div>
          ) : (
            filteredSituations.map((situation, situationIdx) => {

              const situationData = situation as any;
              
              let tools: AITool[] = [];
              let title = situationData.title || '제목 없음';
              let description = situationData.description || '';
              
              if (situationData.recommendations && Array.isArray(situationData.recommendations)) {
                tools = situationData.recommendations.map((rec: any, index: number) => {
                  const toolData = rec.tool;
                  
                  const toolName = toolData.serviceName || 'Unknown Tool';
                  const toolDescription = toolData.description || `${toolName}는 ${title} 상황에서 활용할 수 있는 AI 도구입니다.`;
                  const toolTags = toolData.tags || toolData.category?.name || 'AI 도구';

                  const logoUrl = toolData.logoUrl || getImageMapping(toolName, getCategorySlug(toolData.category?.name || 'chatbot')).logo;                  
                                    
                  return {
                    id: (toolData.id || index).toString(),
                    name: toolName,
                    category: 'combination',
                    description: toolDescription,
                    features: [],
                    rating: Number(toolData.overallRating) || 4.5,
                    tags: [toolTags], // 배열 형태로 통일
                    url: toolData.websiteUrl || '',
                    releaseDate: '',
                    company: '',
                    pricing: 'freemium' as const,
                    featured: false,
                    roles: [],
                    userCount: 0,
                    aiRating: Number(toolData.overallRating) || 4.5,
                    categoryLabel: toolData.category?.name || 'AI 도구',
                    logoUrl: logoUrl,
                    serviceImageUrl: logoUrl,
                    priceImageUrl: logoUrl,
                    searchbarLogoUrl: logoUrl
                  };
                });
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
                  
                  {tools.length === 0 ? (
                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <div className="text-4xl mb-2">🤖</div>
                      <p className="text-gray-600">이 상황에 대한 AI 도구 추천이 아직 준비되지 않았습니다.</p>
                      <p className="text-sm text-gray-500 mt-1">곧 업데이트될 예정입니다!</p>
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
                                  background: '#E9DFFB',
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
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#E9DFFB'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#E9DFFB'; }}
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
                              >
                                <img src="/images/Icon/Arrow/Right36.svg" alt="다음" width={36} height={36} />
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