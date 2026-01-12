import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const CATEGORY_ITEMS: Array<{ id: string; title: string; img: string; to: string }> = [
  { id: 'chatbot', title: '챗봇', img: '/images/GlassMorphism/HomeBtn/Chatbot.png', to: '/features?tab=chatbot' },
  { id: 'writing', title: '텍스트', img: '/images/GlassMorphism/HomeBtn/Text.png', to: '/features?tab=writing' },
  { id: 'image', title: '이미지', img: '/images/GlassMorphism/HomeBtn/Image.png', to: '/features?tab=image' },
  { id: 'video', title: '비디오', img: '/images/GlassMorphism/HomeBtn/Video.png', to: '/features?tab=video' },
  { id: 'audio', title: '오디오/음악', img: '/images/GlassMorphism/HomeBtn/Audio.png', to: '/features?tab=audio' },
  { id: 'code', title: '코드', img: '/images/GlassMorphism/HomeBtn/Code.png', to: '/features?tab=code' },
  { id: '3d', title: '3D', img: '/images/GlassMorphism/HomeBtn/3D.png', to: '/features?tab=3d' },
  { id: 'productivity', title: '생산성', img: '/images/GlassMorphism/HomeBtn/Productivity.png', to: '/features?tab=productivity' }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  
  // 반응형 패딩 상태
  const [horizontalPadding, setHorizontalPadding] = useState(200);
  
  // 버튼 컨테이너 너비 측정 및 scale factor 계산
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const baseWidth = 1040; // 236*4 + 32*3
        setScaleFactor(containerWidth / baseWidth);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateScale);
      resizeObserver.disconnect();
    };
  }, []);
  
  // 화면 크기 변경 시 패딩 업데이트
  useEffect(() => {
    const updatePadding = () => {
      if (window.innerWidth >= 1440) {
        setHorizontalPadding(200);
      } else if (window.innerWidth >= 1024) {
        setHorizontalPadding(64);
      } else if (window.innerWidth >= 768) {
        setHorizontalPadding(32);
      } else if (window.innerWidth >= 640) {
        setHorizontalPadding(24);
      } else {
        setHorizontalPadding(16);
      }
    };
    
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  // scale 함수: 기준값 * scale factor
  const scale = (baseValue: number) => baseValue * scaleFactor;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Pretendard' }}>
      <Header tabs={[]} activeTab="" onTabChange={() => {}} horizontalPadding={horizontalPadding} fullWidth />
      <main 
        className="mx-auto"
        style={{ 
          maxWidth: '1440px',
          paddingLeft: `${horizontalPadding}px`,
          paddingRight: `${horizontalPadding}px`
        }}
      >
        {/* 첫 번째 텍스트 박스 */}
        <section className="text-center" style={{ paddingTop: `${scale(120)}px`, paddingBottom: 0 }}>
          <div
            style={{
              color: '#202020',
              fontSize: `${scale(36)}px`,
              lineHeight: '130%',
              fontWeight: 500,
              letterSpacing: '-0.003em',
              textAlign: 'center'
            }}
          >
            나에게 꼭 맞는 AI,
            <br />
            AIMine에서 찾아보세요
          </div>
          
          {/* 두 번째 텍스트 박스 */}
          <div
            style={{
              color: '#424242',
              fontSize: `${scale(18)}px`,
              lineHeight: '130%',
              marginTop: `${scale(8)}px`,
              fontWeight: 300,
              letterSpacing: '-0.003em',
              textAlign: 'center'
            }}
          >
            기능별, 직업별로 정리된 AI 서비스 큐레이션으로
            <br />
            당신에게 필요한 도구만 골라보세요!
          </div>
        </section>

        {/* 버튼 컴포넌트 영역 */}
        <section style={{ paddingTop: '100px', paddingBottom: `${scale(64)}px` }}>
          <div 
            ref={containerRef}
            className="grid justify-center" 
            style={{ 
              gridTemplateColumns: 'repeat(auto-fit, minmax(236px, 236px))',
              gap: '32px',
              maxWidth: '100%'
            }}
          >
            {CATEGORY_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.to)}
                className="rounded-2xl transition-all duration-200 text-left"
                style={{ 
                  backgroundColor: '#F2EEFB',
                  borderRadius: '20px',
                  padding: 0,
                  width: '236px',
                  height: '136px',
                  overflow: 'hidden',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E9DFFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F2EEFB';
                }}
              >
                {/* 텍스트 */}
                <div 
                  style={{ 
                    position: 'absolute',
                    top: '18px',
                    left: '24px',
                    color: '#202020',
                    fontSize: '20px',
                    fontWeight: 500,
                    lineHeight: '130%',
                    letterSpacing: '-0.003em'
                  }}
                >
                  {item.title}
                </div>

                {/* 이미지 영역 */}
                <img 
                  src={item.img} 
                  alt={item.title}
                  style={{ 
                    position: 'absolute',
                    top: '32px',
                    right: '0px',
                    left: '96px',
                    width: '140px',
                    height: '140px',
                    objectFit: 'contain'
                  }} 
                />
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;