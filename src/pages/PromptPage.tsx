import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// 반응형 패딩 계산 함수
const getHorizontalPadding = (): number => {
  if (window.innerWidth >= 1440) {
    return 200;
  } else if (window.innerWidth >= 1024) {
    return 64; // lg:px-16
  } else if (window.innerWidth >= 768) {
    return 32; // md:px-8
  } else if (window.innerWidth >= 640) {
    return 24; // sm:px-6
  } else {
    return 16; // 모바일
  }
};

const PromptPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 반응형 패딩 상태
  const [horizontalPadding, setHorizontalPadding] = useState(getHorizontalPadding());
  
  // 화면 크기 변경 시 패딩 업데이트
  useEffect(() => {
    const updatePadding = () => {
      setHorizontalPadding(getHorizontalPadding());
    };
    
    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);
  
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Pretendard' }}>
      <Header
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        horizontalPadding={horizontalPadding}
        fullWidth
      />
      <main
        className="mx-auto py-20"
        style={{ 
          maxWidth: '1440px',
          paddingLeft: horizontalPadding >= 200 ? `${horizontalPadding}px` : `${horizontalPadding}px`,
          paddingRight: horizontalPadding >= 200 ? `${horizontalPadding}px` : `${horizontalPadding}px`
        }}
      >
        <div className="flex flex-col items-center text-center">
          <img src="/images/GlassMorphism/Prompt_Sandglass.png" alt="준비중" style={{ width: 120, height: 120 }} />
          <div style={{ color: '#202020', fontWeight: 600, fontSize: 28, marginTop: 24 }}>서비스 준비중입니다.</div>
          <div style={{ color: '#202020', fontWeight: 400, fontSize: 14, marginTop: 16, lineHeight: 1.7 }}>
            이용에 불편을 드려 죄송합니다.
            <br />
            AIMine의 프롬프트 서비스는 현재 준비 중에 있습니다.
            <br />
            빠른 시일 내에 준비하여 찾아뵙겠습니다.
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-8 inline-flex items-center justify-center transition-colors"
            style={{ backgroundColor: '#7E50D1', color: '#FFFFFF', borderRadius: 8, padding: '10px 16px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6238AE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#7E50D1';
            }}
          >
            <img src="/images/Icon/Home/24.svg" alt="홈" width={24} height={24} style={{ marginRight: 8 }} />
            <span style={{ fontWeight: 500, fontSize: 14 }}>홈으로 가기</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default PromptPage;


