import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const PromptPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Pretendard' }}>
      <Header tabs={[]} activeTab="" onTabChange={() => {}} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
            className="mt-8 inline-flex items-center justify-center"
            style={{ backgroundColor: '#7E50D1', color: '#FFFFFF', borderRadius: 8, padding: '10px 16px' }}
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


