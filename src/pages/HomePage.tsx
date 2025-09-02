import React from 'react';
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

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Pretendard' }}>
      <Header tabs={[]} activeTab="" onTabChange={() => {}} />
      <main className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1280px' }}>
        <section className="text-center" style={{ paddingTop: '56px', paddingBottom: '32px' }}>
          <div className="text-gray-900 font-bold" style={{ fontSize: '32px', lineHeight: '40px' }}>나에게 꼭 맞는 AI,</div>
          <div className="text-gray-900 font-extrabold" style={{ fontSize: '36px', lineHeight: '44px', marginTop: '8px' }}>AIMine에서 찾아보세요</div>
          <div className="text-gray-500" style={{ fontSize: '12px', lineHeight: '18px', marginTop: '12px' }}>
            기능별, 직업별로 정리된 AI 서비스 큐레이션으로
            <br />
            당신에게 필요한 도구만 골라보세요!
          </div>
        </section>

        <section style={{ paddingBottom: '64px' }}>
          <div className="grid gap-7" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            {CATEGORY_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.to)}
                className="bg-white rounded-2xl border transition-shadow text-left"
                style={{ borderColor: '#E6EAF2', padding: '18px', height: '156px' }}
              >
                <div className="text-gray-700" style={{ fontSize: '14px', fontWeight: 600 }}>{item.title}</div>
                <div className="w-full flex items-center justify-center" style={{ height: '110px' }}>
                  <img src={item.img} alt={item.title} style={{ maxHeight: '104px' }} />
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


