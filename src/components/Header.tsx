// [헤더 컴포넌트] 로고, 네비게이션, 탭바 - 전체 앱의 상단 헤더 영역
// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Tab {
  id: string;
  name: string;
}

interface HeaderProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <header className="bg-white" style={{ fontFamily: 'Pretendard' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img src="/logo.svg" alt="AIMine" style={{ width: '132px', height: '28px' }} />
            </div>
            
            <nav className="hidden md:flex items-center space-x-8 ml-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                기능별
              </Link>
              <Link to="/role" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                직업별
              </Link>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                프롬프트
              </a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <button style={{ color: '#7E50D1', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0, background: 'none', border: 'none' }}>
              <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#7E50D1', display: 'block' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <img src="/mypage_icon.svg" alt="마이페이지" style={{ width: '30px', height: '30px', display: 'block' }} />
          </div>
        </div>
      </div>
      
      {/* 상단 메뉴 아래 선 */}
      <div style={{ borderBottomWidth: '2px', borderBottomColor: '#E6EAF2' }}></div>
      
      {/* 탭바 */}
      <div style={{ position: 'relative' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-1 font-semibold text-base whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-600 text-purple-700 bg-white rounded-t-lg'
                    : 'text-gray-500 hover:text-purple-700'
                }`}
                style={{ 
                  color: activeTab === tab.id ? '#7E50D1' : '#6A7685',
                  borderBottomWidth: activeTab === tab.id ? '2px' : '0',
                  background: activeTab === tab.id ? '#fff' : 'transparent',
                  fontFamily: 'Pretendard'
                }}
              >
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ height: '1px', background: '#E6EAF2', marginTop: '-1px' }} />
      </div>
    </header>
  );
};

export default Header;