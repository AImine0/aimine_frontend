import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const CATEGORY_ITEMS: Array<{ id: string; title: string; img: string; to: string }> = [
  { id: 'chatbot', title: '챗봇', img: '/images/GlassMorphism/HomeBtn/HomeBtn_Chatbot.png', to: '/features?tab=chatbot' },
  { id: 'writing', title: '텍스트', img: '/images/GlassMorphism/HomeBtn/HomeBtn_Text.png', to: '/features?tab=writing' },
  { id: 'image', title: '이미지', img: '/images/GlassMorphism/HomeBtn/HomeBtn_Image.png', to: '/features?tab=image' },
  { id: 'video', title: '비디오', img: '/images/GlassMorphism/HomeBtn/HomeBtn_Video.png', to: '/features?tab=video' },
  { id: 'audio', title: '오디오/음악', img: '/images/GlassMorphism/HomeBtn/HomeBtn_Audio.png', to: '/features?tab=audio' },
  { id: 'code', title: '코드', img: '/images/GlassMorphism/HomeBtn/HomeBtn_Code.png', to: '/features?tab=code' },
  { id: '3d', title: '3D', img: '/images/GlassMorphism/HomeBtn/HomeBtn_3D.png', to: '/features?tab=3d' },
  { id: 'productivity', title: '생산성', img: '/images/GlassMorphism/HomeBtn/HomeBtn_Productivity.png', to: '/features?tab=productivity' }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
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

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Pretendard' }}>
      <Header tabs={[]} activeTab="" onTabChange={() => {}} horizontalPadding={horizontalPadding} fullWidth />
      <main 
        className="mx-auto"
        style={{ 
          maxWidth: '1440px',
          paddingLeft: horizontalPadding >= 200 ? `${horizontalPadding}px` : `${horizontalPadding}px`,
          paddingRight: horizontalPadding >= 200 ? `${horizontalPadding}px` : `${horizontalPadding}px`
        }}
      >
        <section className="text-center" style={{ paddingTop: '56px', paddingBottom: '32px', paddingLeft: '0', paddingRight: '0' }}>
          <div
            className="text-gray-900"
            style={{
              color: '#202020',
              fontSize: '36px',
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
          <div
            className="text-gray-500"
            style={{
              color: '#424242',
              fontSize: '18px',
              lineHeight: '130%',
              marginTop: '8px',
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

        <section style={{ paddingBottom: '64px', paddingLeft: '0', paddingRight: '0' }}>
          <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            {CATEGORY_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.to)}
                className="rounded-2xl transition-all duration-200 text-left"
                style={{ 
                  backgroundColor: '#F2EEFB', 
                  padding: '18px', 
                  height: '144px', 
                  overflow: 'hidden' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E9DFFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F2EEFB';
                }}
              >
                <div style={{ color: '#202020', fontSize: '22px', fontWeight: 600, marginTop: '12px', marginLeft: '12px' }}>{item.title}</div>
                <div className="w-full flex items-end justify-end" style={{ height: '98px', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '120px', height: '120px', objectFit: 'contain', transform: 'translateY(14px)' }} />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;


