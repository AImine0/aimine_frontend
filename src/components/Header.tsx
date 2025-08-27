// [헤더 컴포넌트] 로고, 네비게이션, 검색, 인증 - 전체 앱의 상단 헤더 영역

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services';
import type { UserProfileResponse } from '../types';

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
  const navigate = useNavigate();
  const location = useLocation();
  
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        try {
          const userProfile = await apiService.getUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
          // 토큰이 유효하지 않으면 로그아웃 처리
          handleLogout();
        }
      }
    };

    checkAuthStatus();
  }, []);

  // 외부 클릭 감지 (메뉴 닫기)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색 자동완성
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchQuery.length > 1) {
        try {
          const response = await apiService.search({ q: searchQuery, size: 5 });
          setSearchSuggestions(response.suggested_keywords || []);
        } catch (error) {
          console.error('검색 자동완성 실패:', error);
        }
      } else {
        setSearchSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // 검색 실행
  const handleSearch = (query: string = searchQuery) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchQuery('');
      setShowSearchSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  // 로그인 처리 (임시 - 실제로는 Google OAuth)
  const handleLogin = () => {
    // 향후 Google OAuth 구현 예정
    alert('Google OAuth 로그인 기능은 향후 구현 예정입니다.');
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await apiService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬 상태는 초기화
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // 검색 키 이벤트
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSearchSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  // 현재 페이지 확인
  const isSearchPage = location.pathname === '/search';
  const isBookmarkPage = location.pathname === '/bookmarks';

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm" style={{ fontFamily: 'Pretendard' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 왼쪽: 로고 + 네비게이션 */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src="/logo.svg" alt="AIMine" style={{ width: '132px', height: '28px' }} />
            </Link>
            
            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              <Link 
                to="/" 
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-purple-600 ${
                  location.pathname === '/' ? 'text-purple-600' : 'text-gray-700'
                }`}
              >
                기능별
              </Link>
              <Link 
                to="/role" 
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-purple-600 ${
                  location.pathname === '/role' ? 'text-purple-600' : 'text-gray-700'
                }`}
              >
                직업별
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/bookmarks" 
                  className={`px-3 py-2 text-sm font-medium transition-colors hover:text-purple-600 ${
                    isBookmarkPage ? 'text-purple-600' : 'text-gray-700'
                  }`}
                >
                  저장목록
                </Link>
              )}
            </nav>
          </div>

          {/* 중앙: 검색바 */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8" ref={searchRef}>
            <div className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setShowSearchSuggestions(true);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="AI 서비스를 검색하세요..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  style={{ fontFamily: 'Pretendard' }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  onClick={() => handleSearch()}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-4 w-4 text-purple-500 hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* 검색 자동완성 */}
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                      style={{ fontFamily: 'Pretendard' }}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 사용자 메뉴 */}
          <div className="flex items-center gap-3">
            
            {/* 모바일 검색 버튼 */}
            <Link 
              to="/search"
              className="md:hidden p-2 text-purple-600 hover:text-purple-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {isAuthenticated ? (
              /* 로그인된 상태 */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/bookmarks"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      저장목록
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* 로그인 안된 상태 */
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                style={{ fontFamily: 'Pretendard' }}
              >
                로그인
              </button>
            )}

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
              onClick={() => setShowMobileMenu(false)}
            >
              기능별
            </Link>
            <Link
              to="/role"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
              onClick={() => setShowMobileMenu(false)}
            >
              직업별
            </Link>
            {isAuthenticated && (
              <Link
                to="/bookmarks"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                onClick={() => setShowMobileMenu(false)}
              >
                저장목록
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* 구분선 */}
      <div style={{ borderBottomWidth: '1px', borderBottomColor: '#E6EAF2' }}></div>
      
      {/* 탭바 */}
      {tabs.length > 0 && (
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
      )}
    </header>
  );
};

export default Header;