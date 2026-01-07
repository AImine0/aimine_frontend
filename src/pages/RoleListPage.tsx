import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const BANNER_ARROW_SCREEN_GAP = 120;
const BANNER_ARROW_WIDTH = 40;
const BANNER_CONTENT_ARROW_GAP = 40;
const BANNER_CONTENT_VERTICAL_PADDING = 40;
const BANNER_CONTENT_SIDE_PADDING =
  BANNER_ARROW_SCREEN_GAP + BANNER_ARROW_WIDTH + BANNER_CONTENT_ARROW_GAP;
const BANNER_FIXED_HEIGHT = 293;

const RoleListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('it');
  const [jobSituations, setJobSituations] = useState<JobSituation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [situationSlides, setSituationSlides] = useState<Record<number, number>>({});
  
  // 반응형 패딩 상태
  const [horizontalPadding, setHorizontalPadding] = useState(200);
  
  // 화면 크기 변경 시 패딩 업데이트
  useEffect(() => {
    const updatePadding = () => {
      if (window.innerWidth >= 1440) {
        setHorizontalPadding(200);
      } else if (window.innerWidth >= 1024) {
        setHorizontalPadding(64); // lg:px-16 고정
      } else if (window.innerWidth >= 768) {
        setHorizontalPadding(32); // md:px-8 고정
      } else if (window.innerWidth >= 640) {
        setHorizontalPadding(24); // sm:px-6 고정
      } else {
        setHorizontalPadding(16); // 모바일
      }
    };
    
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);
  const activeRoleName = roleTabs.find(tab => tab.id === activeRole)?.name || '';
  const roleSubDescriptions: Record<string, string> = {
    it: '개발자와 기술자를 위한 AI 서비스들을 상황별로 추천해드려요',
    edu: '교육자와 연구자를 위한 AI 서비스들을 상황별로 추천해드려요',
    art: '예술가와 디자이너를 위한 AI 서비스들을 상황별로 추천해드려요',
    media: '영상, 사운드, 마케팅까지. 콘텐츠 제작자들을 위한 AI 서비스들을 추천해드려요',
    plan: '기획자와 마케터를 위한 AI 서비스들을 상황별로 추천해드려요',
    manage: '비즈니스 운영진과 HR 매니저를 위한 AI 서비스들을 상황별로 추천해드려요'
  };
  const activeRoleDescription = roleSubDescriptions[activeRole] || activeRoleName;
  const toolIdMap: Record<string, string> = {
    'Connected Papers': '70',
    'SciSpace': '68',
    'Jenni AI': '47',
    'Gamma': '239',
    'Zep Quiz': '249',
    'ChatGPT': '1',
    'Animaker': '128',
    'ElevenLabs': '143',
    'Relume': '286',
    'Galileo AI': '284',
    'Uizard': '283',
    'PromptoMANIA': '289',
    'Midjourney': '72',
    'Kaedim': '179',
    'Meshy': '167',
    'Lumalabs AI': '101',
    'Copy.ai': '58',
    'Pika': '103',
    'Typecast': '147',
    'AIVA': '136',
    'Soundful': '137',
    'LALAL.AI': '159',
    'Lumen5': '104',
    'Runway': '100',
    'Crayon': '255',
    'Miro AI': '275',
    'Tome': '240',
    'Scalenut': '274',
    'Magic Design': '46',
    'Make': '226',
    'Shiftee': '268',
    'AlphaSense': '254'
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header
          tabs={roleTabs}
          activeTab={activeRole}
          onTabChange={setActiveRole}
          horizontalPadding={horizontalPadding}
          fullWidth
        />
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
        <Header
          tabs={roleTabs}
          activeTab={activeRole}
          onTabChange={setActiveRole}
          horizontalPadding={horizontalPadding}
          fullWidth
        />
      <main
        className="mx-auto py-8"
        style={{ maxWidth: '1440px', paddingLeft: horizontalPadding, paddingRight: horizontalPadding }}
      >
        <div style={{ marginBottom: 10 }}>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div style={{ marginBottom: 48 }}>
          <h1
            className="font-semibold"
            style={{ color: '#000000', fontSize: '32px', fontFamily: 'Pretendard', marginBottom: 0 }}
          >
            {activeRoleName}
          </h1>
          <p
            style={{
              marginTop: 6,
              color: '#9B9B9B',
              fontWeight: 400,
              fontFamily: 'Pretendard',
              fontSize: 14
            }}
          >
            {activeRoleDescription}
          </p>
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
            className="w-screen relative left-1/2 -translate-x-1/2 mb-[72px]"
            style={{ background: '#F6F0FF', borderRadius: 0, height: BANNER_FIXED_HEIGHT, padding: 0, boxSizing: 'border-box' }}
          >
            <div className="mx-auto" style={{ maxWidth: '1440px', height: '100%', position: 'relative', paddingLeft: '200px', paddingRight: '200px' }}>
            {/* 왼쪽 화살표 */}
            {combos.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute"
                style={{
                  top: '50%',
                  left: '80px',
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

            <div
              style={{
                paddingTop: BANNER_CONTENT_VERTICAL_PADDING,
                paddingBottom: BANNER_CONTENT_VERTICAL_PADDING,
                height: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div className="flex flex-row items-start justify-between">
                {/* 왼쪽 텍스트 영역 */}
                <div className="banner-left-text" style={{ textAlign: 'left' }}>
                  <div className="flex flex-col justify-center items-start">
                    <div className="flex items-center" style={{ justifyContent: 'flex-start', marginBottom: 4 }}>
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
                      <span style={{ color: '#000000', fontWeight: 500, fontSize: 24, fontFamily: 'Pretendard' }}>을 위한</span>
                    </div>
                    <div className="mb-[76px]" style={{ textAlign: 'left' }}>
                      <span style={{ color: '#7F50D2', fontWeight: 500, fontSize: 24, fontFamily: 'Pretendard' }}>AIMine</span>
                      <span style={{ color: '#000000', fontWeight: 500, fontSize: 24, fontFamily: 'Pretendard', marginLeft: 8 }}>의 추천 조합!</span>
                    </div>
                    <div className="text-base leading-relaxed" style={{ fontFamily: 'Pretendard', textAlign: 'left' }}>
                      {(() => {
                        const aiNames = combos[comboIdx].aiList;
                        const regex = new RegExp(`(${aiNames.map(n => n.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1")).join('|')}|[.,])`, 'g');
                        return combos[comboIdx].description.split(regex).map((part, i) => {
                          if (aiNames.includes(part)) {
                            return <span key={`ai-name-${i}`} style={{ color: '#7E50D1', fontWeight: 500, fontSize: 14, fontFamily: 'Pretendard' }}>{part}</span>;
                          } else if (part === ',' || part === '.') {
                            return <><span key={`punct-${i}`} style={{ color: '#202020', fontWeight: 500, fontSize: 14, fontFamily: 'Pretendard' }}>{part}</span><br key={`br-${i}`} /></>;
                          } else if (part.trim() === '') {
                            return null;
                          } else {
                            return <span key={`text-${i}`} style={{ color: '#202020', fontWeight: 500, fontSize: 14, fontFamily: 'Pretendard' }}>{part}</span>;
                          }
                        });
                      })()}
                    </div>
                  </div>
                </div>

                {/* 오른쪽 AI 도구 indicator */}
                <div className="ai-indicator-set flex justify-end items-center" style={{ position: 'relative', zIndex: 1, marginTop: '2px' }}>
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
                          <svg width={totalWidth} height={40} style={{ position: 'absolute', left: 0, top: 0, zIndex: 0, marginBottom: 4 }}>
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
                              <circle key={`combo-circle-${comboIdx}-${idx}`} cx={cx} cy={dotSize / 2} r={dotSize / 2} fill="#7E50D1" />
                            ))}
                          </svg>
                          <div className="flex justify-end" style={{ gap: `${gap}px`, position: 'relative', zIndex: 1, marginTop: 4 }}>
                            {combos[comboIdx].aiList.map((ai, aiIdx) => {
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
                              const toolId = toolIdMap[ai];
                              const handleLogoClick = () => {
                                if (toolId) {
                                  navigate(`/tool/${toolId}`);
                                }
                              };
                              
                              return (
                                <div key={`combo-ai-${comboIdx}-${aiIdx}-${ai}`} className="flex flex-col items-center" style={{ width: flexItemWidth }}>
                                  <div style={{ height: dotSize + 8 }} />
                                  <span style={{ color: '#7E50D1', fontWeight: 600, fontSize: 14, fontFamily: 'Pretendard', marginBottom: 15 }}>{ai}</span>
                                  <div
                                    className="flex items-center justify-center bg-white"
                                    style={{
                                      width: 160,
                                      height: 160,
                                      borderRadius: 20,
                                      border: '1px solid #DBCBF9',
                                      backgroundColor: '#FFFFFF',
                                      cursor: toolId ? 'pointer' : 'default'
                                    }}
                                    onClick={handleLogoClick}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E9DFFB'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                                  >
                                    <img 
                                      src={imageMapping.logo} 
                                      alt={ai} 
                                      style={{ width: 160, height: 160, objectFit: 'contain' }}
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
                  right: `80px`,
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
          </div>
        )}

        {/* 상황별 추천 섹션 */}
        <section>

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
                    <span key={`available-category-${cat}`} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
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
              
              // 반응형: 화면 크기에 따라 표시할 카드 개수 결정
              const getToolsPerSlide = () => {
                if (window.innerWidth >= 1024) return 3; // lg 이상: 3개 (기존 디자인 유지)
                if (window.innerWidth >= 640) return 2;  // sm 이상: 2개
                return 1; // 모바일: 1개
              };
              
              const toolsPerSlide = getToolsPerSlide();
              const showArrows = tools.length > toolsPerSlide;
              const currentSlide = situationSlides[situationData.id] || 0;
              // 슬라이드 시작 인덱스 계산: toolsPerSlide개씩 끊되, 나머지가 있으면 마지막 슬라이드는 겹쳐서 항상 toolsPerSlide개 표시
              const fullGroups = Math.floor(tools.length / toolsPerSlide);
              const hasRemainder = tools.length % toolsPerSlide !== 0;
              const slideStartIndices: number[] = [];
              for (let i = 0; i < fullGroups; i++) {
                slideStartIndices.push(i * toolsPerSlide);
              }
              if (hasRemainder && tools.length >= toolsPerSlide) {
                slideStartIndices.push(Math.max(0, tools.length - toolsPerSlide));
              }
              const totalSlides = slideStartIndices.length || 1;
              const startIndex = slideStartIndices[Math.min(currentSlide, totalSlides - 1)] || 0;
              const visibleTools = tools.slice(startIndex, startIndex + toolsPerSlide);
              
              return (
                <div key={`situation-${situationData.category}-${situationData.id}-${situationIdx}`} style={{ marginBottom: situationIdx === filteredSituations.length - 1 ? 64 : 100 }}>
                  <div className="flex items-center" style={{ justifyContent: 'flex-start', marginBottom: 4 }}>
                    <span className="font-semibold" style={{ fontFamily: 'Pretendard', color: '#000000', fontSize: 24, fontWeight: 500 }}>
                      {title}
                    </span>
                  </div>
                  {description && (
                    <div
                      className="text-left"
                      style={{ color: '#000000', fontSize: '14px', fontWeight: 300, fontFamily: 'Pretendard', marginBottom: 24 }}
                    >
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                      {visibleTools.map((tool, idx) => {
                        const startIdx = currentSlide * toolsPerSlide;
                        const globalToolIdx = startIdx + idx;
                        const isLast = showArrows && idx === visibleTools.length - 1;
                        return (
                          <div key={`situation-${situationData.id}-tool-${tool.id}-${globalToolIdx}`} className="relative h-full">
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
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#DBCBF9'; }}
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
                                  right: '-40px',
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
                                aria-label="다음"
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#DBCBF9'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#E9DFFB'; }}
                              >
                                <img src="/images/Icon/Arrow/Right36.svg" alt="다음" width={36} height={36} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {/* toolsPerSlide개 미만일 때 빈 칸 채우기 */}
                      {Array.from({ length: Math.max(0, toolsPerSlide - visibleTools.length) }).map((_, i) => (
                        <div key={`situation-${situationData.id}-empty-${currentSlide}-${i}`} />
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