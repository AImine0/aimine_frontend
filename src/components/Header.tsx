// [헤더 컴포넌트] 로고, 네비게이션, 검색, 인증 - 전체 앱의 상단 헤더 영역

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLogin from './GoogleLogin';
import LoginModal from './LoginModal';
import { apiService } from '../services';
import SearchSuggestions from './SearchSuggestions';
import type { SearchSuggestion } from '../types/api';

interface Tab {
  id: string;
  name: string;
}

interface HeaderProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  horizontalPadding?: number;
  fullWidth?: boolean;
}

const Header: React.FC<HeaderProps> = ({ tabs, activeTab, onTabChange, horizontalPadding, fullWidth = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'signup'>('login');
  const [showRecommendedKeywords, setShowRecommendedKeywords] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);  
  
  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 로컬스토리지 키와 설정
  const LOCAL_SEARCH_HISTORY_KEY = 'aimine_search_history';
  const MAX_LOCAL_HISTORY = 10;

  // 로컬스토리지에서 검색어 이력 가져오기
  const getLocalSearchHistory = (): string[] => {
    try {
      const stored = localStorage.getItem(LOCAL_SEARCH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('로컬 검색어 이력 로드 실패:', error);
      return [];
    }
  };

  // 로컬스토리지에 검색어 저장
  const saveToLocalSearchHistory = (query: string) => {
    try {
      const current = getLocalSearchHistory();
      const updated = [query, ...current.filter(item => item !== query)].slice(0, MAX_LOCAL_HISTORY);
      localStorage.setItem(LOCAL_SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('로컬 검색어 저장 실패:', error);
    }
  };

  // 로컬스토리지에서 특정 검색어 삭제
  const removeFromLocalSearchHistory = (query: string) => {
    try {
      const current = getLocalSearchHistory();
      const updated = current.filter(item => item !== query);
      localStorage.setItem(LOCAL_SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('로컬 검색어 삭제 실패:', error);
    }
  };

  // 최근 검색어 로드 (로그인 상태에 따라 다른 소스 사용)
  const loadRecentSearches = async () => {
    if (isAuthenticated) {
      // 로그인된 사용자: 서버에서 가져오기
      try {
        const searches = await apiService.getSearchHistory();
        setRecentSearches(searches);
      } catch (error) {
        console.error('최근 검색어 로드 실패:', error);
        // 서버 실패 시 로컬스토리지에서 가져오기
        setRecentSearches(getLocalSearchHistory());
      }
    } else {
      // 로그인되지 않은 사용자: 로컬스토리지에서 가져오기
      setRecentSearches(getLocalSearchHistory());
    }
  };

  // 한글 완성 체크 함수
  const isKoreanComplete = (text: string): boolean => {
    const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ]/;
    return !koreanRegex.test(text.slice(-1));
  };

  // 컴포넌트 마운트 시 최근 검색어 로드
  useEffect(() => {
    loadRecentSearches();
  }, [isAuthenticated]);

  // 최근 검색어 삭제
  const handleDeleteRecentSearch = async (query: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (isAuthenticated) {
      // 로그인된 사용자: 서버에서 삭제
      try {
        await apiService.deleteSearchQuery(query);
        setRecentSearches(prev => prev.filter(search => search !== query));
      } catch (error) {
        console.error('검색어 삭제 실패:', error);
      }
    } else {
      // 로그인되지 않은 사용자: 로컬스토리지에서 삭제
      removeFromLocalSearchHistory(query);
      setRecentSearches(prev => prev.filter(search => search !== query));
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
        setShowRecommendedKeywords(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색 자동완성
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 1 && isKoreanComplete(searchQuery) && isSearchFocused) {
        try {
          const result = await apiService.getSearchSuggestions(searchQuery);
          setSuggestions(result.suggestions);
          setShowSuggestions(true);
          setShowRecommendedKeywords(false);
        } catch (error) {
          console.error('연관검색어 조회 실패:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else if (searchQuery.length === 0 && isSearchFocused) {
        setShowSuggestions(false);
        setShowRecommendedKeywords(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, isSearchFocused]);

  // 검색 실행
  const handleSearch = (query: string = searchQuery) => {
    if (query.trim()) {
      const trimmedQuery = query.trim();
      
      // 검색어 저장 (로그인 상태와 관계없이)
      if (isAuthenticated) {
        // 로그인된 사용자: 서버에 저장 (백엔드에서 자동 처리)
        setTimeout(() => {
          loadRecentSearches();
        }, 500);
      } else {
        // 로그인되지 않은 사용자: 로컬스토리지에 저장
        saveToLocalSearchHistory(trimmedQuery);
        setRecentSearches(prev => [trimmedQuery, ...prev.filter(item => item !== trimmedQuery)].slice(0, MAX_LOCAL_HISTORY));
      }

      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery('');
      setShowSearchSuggestions(false);
      setShowRecommendedKeywords(false);
      setIsSearchFocused(false);
    }
  };

  // 연관검색어 클릭 핸들러
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const queryText = suggestion.text;
    setSearchQuery('');
    setShowSuggestions(false);
    setShowRecommendedKeywords(false);
    setIsSearchFocused(false);
    
    navigate(`/search?q=${encodeURIComponent(queryText)}`);
    
    if (isAuthenticated) {
      setTimeout(() => {
        loadRecentSearches();
      }, 500);
    } else {
      saveToLocalSearchHistory(queryText);
      setRecentSearches(prev => [queryText, ...prev.filter(item => item !== queryText)].slice(0, MAX_LOCAL_HISTORY));
    }
  };

  // 로그인 처리
  const handleLogin = () => {
    setLoginModalMode('login');
    setShowLoginModal(true);
  };

  // 로그인 성공 처리
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    loadRecentSearches();
  };

  // 로그인 오류 처리
  const handleLoginError = (error: string) => {
    console.error('로그인 오류:', error);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      // 로그아웃 후 로컬스토리지 검색어로 전환
      setRecentSearches(getLocalSearchHistory());
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // 검색 키 이벤트
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSearchSuggestions(false);
      setShowRecommendedKeywords(false);
      setIsSearchFocused(false);
    }
  };

  // 검색바 blur 이벤트 핸들러
  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
      setShowSuggestions(false);
      setShowRecommendedKeywords(false);
    }, 200); // 200ms 딜레이로 클릭 이벤트가 먼저 실행되도록
  };

  // 추천 검색어 데이터
  const recommendedKeywords = [
    '챗봇',
    'ChatGPT', 
    '이미지 생성',
    '콘텐츠 작성',
    '업무 자동화',
    '교육/연구',
    '기획/마케팅',
    'AI 코드 어시스턴트'
  ];

  const containerClassName = [
    fullWidth ? 'w-full' : 'max-w-7xl mx-auto',
    horizontalPadding !== undefined 
      ? 'px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[200px]' 
      : 'px-4 sm:px-6 lg:px-8'
  ]
    .join(' ')
    .trim();

  return (
    <header className="bg-white sticky top-0 z-40" style={{ fontFamily: 'Pretendard', borderBottom: '1px solid #ECECEC' }}>
      <div className="mx-auto" style={{ maxWidth: '1440px' }}>
        <div className={containerClassName}>
          <div className="flex items-center justify-between h-16">
            
            {/* 왼쪽: 로고 + 네비게이션 */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img src="/logo.svg" alt="AIMine" style={{ width: '132px', height: '28px' }} />
              </Link>
              
              {/* 데스크톱 네비게이션 */}
              <nav className="hidden lg:flex items-center space-x-6 ml-8 flex-shrink-0">
                <Link 
                  to="/features" 
                  className={`px-3 py-2 text-base font-semibold transition-colors whitespace-nowrap`}
                  style={{ 
                    color: location.pathname.startsWith('/features') ? '#7E50D1' : '#202020' 
                  }}
                  onClick={() => {
                    // 기능별 페이지에 있을 때 상단 탭바를 항상 '챗봇'으로 리셋
                    if (location.pathname.startsWith('/features')) {
                      onTabChange('chatbot');
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (!location.pathname.startsWith('/features')) {
                      e.currentTarget.style.color = '#A987E8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!location.pathname.startsWith('/features')) {
                      e.currentTarget.style.color = '#202020';
                    }
                  }}
                >
                  기능별
                </Link>
                <Link 
                  to="/role" 
                  className={`px-3 py-2 text-base font-semibold transition-colors whitespace-nowrap`}
                  style={{ 
                    color: location.pathname === '/role' ? '#7E50D1' : '#202020' 
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== '/role') {
                      e.currentTarget.style.color = '#A987E8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== '/role') {
                      e.currentTarget.style.color = '#202020';
                    }
                  }}
                >
                  직업별
                </Link>
                <Link 
                  to="/prompt" 
                  className={`px-3 py-2 text-base font-semibold transition-colors whitespace-nowrap`}
                  style={{ 
                    color: location.pathname === '/prompt' ? '#7E50D1' : '#202020' 
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== '/prompt') {
                      e.currentTarget.style.color = '#A987E8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== '/prompt') {
                      e.currentTarget.style.color = '#202020';
                    }
                  }}
                >
                  프롬프트
                </Link>
              </nav>
            </div>

            {/* 오른쪽: 검색 + 사용자 메뉴 */}
            <div className="flex items-center gap-4">
              {/* 데스크톱 검색바 */}
              <div className="hidden lg:flex" style={{ width: '359px' }} ref={searchRef}>
                <div className="relative w-full">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        setIsSearchFocused(true);
                        if (searchQuery.length > 1) {
                          setShowSearchSuggestions(true);
                        } else {
                          setShowRecommendedKeywords(true);
                        }
                      }}
                      onBlur={handleSearchBlur}
                      onKeyPress={handleKeyPress}
                      placeholder="원하는 AI 서비스를 검색해보세요."
                      className="w-full pl-4 pr-4 py-2 border focus:outline-none focus:ring-0 focus:border-[#9B9B9B] text-sm placeholder:font-normal placeholder-[#9B9B9B]"
                      style={{ 
                        fontFamily: 'Pretendard', 
                        borderColor: '#9B9B9B',
                        borderRadius: showRecommendedKeywords || showSearchSuggestions || showSuggestions ? '20px 20px 0 0' : '20px'
                      }}
                    />
                    <button
                      onClick={() => handleSearch()}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <img src="/images/Icon/Magnifier/20.svg" alt="검색" width={20} height={20} />
                    </button>
                  </div>

                  {/* 검색 자동완성 */}
                  {showSearchSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg py-4 z-50" style={{ marginTop: '0px', borderRadius: '0 0 20px 20px', border: '1px solid #8C8C8C', borderTop: 'none' }}>
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

                  {/* 연관검색어 드롭다운 */}
                  <SearchSuggestions
                    suggestions={suggestions}
                    searchQuery={searchQuery}
                    onSuggestionClick={handleSuggestionClick}
                    isVisible={showSuggestions}
                  />

                  {/* 최근 검색어 + 추천 검색어 드롭다운 */}
                  {showRecommendedKeywords && searchQuery.length <= 1 && (
                    <div className="absolute top-full left-0 right-0 bg-white shadow-lg py-4 z-50" style={{ marginTop: '0px', borderRadius: '0 0 20px 20px', border: '1px solid #8C8C8C', borderTop: 'none' }}>
                      
                      {/* 최근 검색어 섹션 - 로그인 상태와 관계없이 표시 */}
                      {recentSearches.length > 0 && (
                        <div className="mb-4">
                          <div className="px-4 mb-3">
                            <h3 
                              className="text-sm font-bold"
                              style={{ 
                                color: '#202020', 
                                fontWeight: 700, 
                                fontSize: '12px',
                                fontFamily: 'Pretendard'
                              }}
                            >
                              최근 검색어
                            </h3>
                          </div>
                          
                          <div className="px-4 space-y-1">
                            {recentSearches.slice(0, 5).map((query, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between py-1 hover:bg-gray-50 rounded px-2 -mx-2"
                              >
                                <button
                                  onClick={() => handleSearch(query)}
                                  className="flex-1 text-left"
                                  style={{
                                    color: '#202020',
                                    fontWeight: 500,
                                    fontSize: '12px',
                                    fontFamily: 'Pretendard'
                                  }}
                                >
                                  {query}
                                </button>
                                <button
                                  onClick={(e) => handleDeleteRecentSearch(query, e)}
                                  className="ml-2 p-1 hover:bg-gray-200 rounded"
                                >
                                  <svg 
                                    width="12" 
                                    height="12" 
                                    viewBox="0 0 12 12" 
                                    fill="none"
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <path 
                                      d="M9 3L3 9M3 3L9 9" 
                                      stroke="currentColor" 
                                      strokeWidth="1.5" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 추천 검색어 제목 */}
                      <div className="px-4 mb-3">
                        <h3 
                          className="text-sm font-bold"
                          style={{ 
                            color: '#202020', 
                            fontWeight: 700, 
                            fontSize: '12px',
                            fontFamily: 'Pretendard'
                          }}
                        >
                          추천 검색어
                        </h3>
                      </div>
                      
                      {/* 추천 검색어 버튼들 */}
                      <div className="px-4 flex flex-wrap gap-2">
                        {recommendedKeywords.map((keyword, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(keyword)}
                            className="flex items-center gap-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap"
                            style={{
                              backgroundColor: '#F2EEFB',
                              borderRadius: '20px',
                              paddingTop: '4px',
                              paddingRight: '12px',
                              paddingBottom: '4px',
                              paddingLeft: '8px',
                              color: '#202020',
                              fontWeight: 500,
                              fontSize: '12px',
                              fontFamily: 'Pretendard',
                              width: 'fit-content'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#E9DFFB';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#F2EEFB';
                            }}
                          >
                            <img 
                              src="/images/Icon/Magnifier/18/Purple.svg" 
                              alt="검색" 
                              width={18} 
                              height={18} 
                            />
                            <span>{keyword}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 모바일 검색 버튼 */}
              <Link 
                to="/search"
                className="lg:hidden p-2 text-purple-600 hover:text-purple-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              {isAuthenticated ? (
                /* 로그인된 상태 */
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center justify-center rounded-full transition-colors"
                    style={{
                      width: `${36 + 8.67 * 2}px`,  // 53.34px
                      height: `${36 + 8.67 * 2}px`, // 53.34px
                      padding: '8.67px'
                    }}
                    aria-label="사용자 메뉴 열기"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D8D8D8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <img src="/images/Icon/Login/36.svg" alt="사용자" width={36} height={36} />
                  </button>

                  {showUserMenu && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50"
                      style={{ border: '1px solid #BCBCBC' }}
                    >
                      <Link
                        to="/mypage"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-800 hover:bg-[#ECECEC]"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <img src="/images/Icon/Save/24/Black_Empty.svg" alt="저장" width={24} height={24} />
                        저장한 AI 보기
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-800 hover:bg-[#ECECEC]"
                      >
                        <img src="/images/Icon/Logout/24.svg" alt="로그아웃" width={24} height={24} />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* 로그인 안된 상태 */
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                    style={{
                      fontFamily: 'Pretendard',
                      backgroundColor: '#FFFFFF',
                      color: '#7E50D1',
                      border: '1px solid #7E50D1'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E9DFFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => {
                      setLoginModalMode('signup');
                      setShowLoginModal(true);
                    }}
                    className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                    style={{ fontFamily: 'Pretendard', backgroundColor: '#7E50D1' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#6238AE';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#7E50D1';
                    }}
                  >
                    회원가입
                  </button>
                </div>
              )}

              {/* 모바일 메뉴 버튼 */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/features"
              className="block px-3 py-2 text-base font-medium transition-colors"
              style={{ 
                color: location.pathname.startsWith('/features') ? '#7E50D1' : '#374151' 
              }}
              onClick={() => setShowMobileMenu(false)}
              onMouseEnter={(e) => {
                if (!location.pathname.startsWith('/features')) {
                  e.currentTarget.style.color = '#A987E8';
                }
              }}
              onMouseLeave={(e) => {
                if (!location.pathname.startsWith('/features')) {
                  e.currentTarget.style.color = '#374151';
                }
              }}
            >
              기능별
            </Link>
            <Link
              to="/role"
              className="block px-3 py-2 text-base font-medium transition-colors"
              style={{ 
                color: location.pathname === '/role' ? '#7E50D1' : '#374151' 
              }}
              onClick={() => setShowMobileMenu(false)}
              onMouseEnter={(e) => {
                if (location.pathname !== '/role') {
                  e.currentTarget.style.color = '#A987E8';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/role') {
                  e.currentTarget.style.color = '#374151';
                }
              }}
            >
              직업별
            </Link>
            <Link
              to="/prompt"
              className="block px-3 py-2 text-base font-medium transition-colors"
              style={{ 
                color: location.pathname === '/prompt' ? '#7E50D1' : '#374151' 
              }}
              onClick={() => setShowMobileMenu(false)}
              onMouseEnter={(e) => {
                if (location.pathname !== '/prompt') {
                  e.currentTarget.style.color = '#A987E8';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/prompt') {
                  e.currentTarget.style.color = '#374151';
                }
              }}
            >
              프롬프트
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/mypage"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  마이페이지
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleLogin();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                >
                  로그인
                </button>
                <button
                  onClick={() => {
                    setLoginModalMode('signup');
                    setShowLoginModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* 구분선 */}
      {tabs.length > 0 && (
        <div style={{ borderBottom: '1px solid #ECECEC' }}></div>
      )}
      
      {/* 탭바 */}
      {tabs.length > 0 && (
        <div className="mx-auto" style={{ maxWidth: '1440px' }}>
          <div style={{ position: 'relative' }}>
            <div className={containerClassName}>
              <div className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`py-4 px-1 text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-2 bg-white rounded-t-lg'
                        : 'hover:border-b-2 hover:border-transparent'
                    }`}
                    style={{ 
                      color: activeTab === tab.id ? '#7E50D1' : '#6F6E6E',
                      fontWeight: activeTab === tab.id ? 700 : 600,
                      borderBottomColor: activeTab === tab.id ? '#7E50D1' : 'transparent',
                      borderBottomWidth: activeTab === tab.id ? '2px' : '0',
                      background: activeTab === tab.id ? '#fff' : 'transparent',
                      fontFamily: 'Pretendard'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.color = '#A987E8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.color = '#6F6E6E';
                      }
                    }}
                  >
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div
              className={containerClassName}
              style={{
                height: '0px',
                background: 'transparent',
                marginTop: '0'
              }}
            />
          </div>
        </div>
      )}

      {/* 로그인 모달 */}
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} mode={loginModalMode} />
    </header>
  );
};

export default Header;