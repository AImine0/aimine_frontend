// [필터바 컴포넌트] 가격/정렬 필터 및 카운트 - 드롭다운 레이아웃 문제 완전 해결
import React, { useState, useEffect, useRef } from 'react';
import type { FilterType } from '../types';

interface FilterBarProps {
  totalCount: number;
  freeCount: number;
  paidCount: number;
  freemiumCount: number;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortType: string;
  onSortChange: (sort: string) => void;
  loading?: boolean;
  showCounts?: boolean;
}

interface SortOption {
  key: string;
  label: string;
  icon: string;
  description: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  totalCount,
  freeCount,
  paidCount,
  freemiumCount,
  activeFilter,
  onFilterChange,
  sortType,
  onSortChange,
  loading = false,
  showCounts = true
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 정렬 옵션들 - 추천순/최신순만
  const sortOptions: SortOption[] = [
    {
      key: 'popular',
      label: '추천순',
      icon: '🔥',
      description: '인기도 기준'
    },
    {
      key: 'newest',
      label: '최신순',
      icon: '🆕',
      description: '출시일 기준'
    }
  ];

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ESC 키로 드롭다운 닫기
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isDropdownOpen]);

  const handleSortChange = (newSortType: string) => {
    onSortChange(newSortType);
    setIsDropdownOpen(false);
  };

  const getCurrentSortOption = () => {
    return sortOptions.find(option => option.key === sortType) || sortOptions[0];
  };

  // 가격 필터 옵션들
  const priceFilters = [
    {
      key: 'all' as FilterType,
      label: '전체',
      count: totalCount,
      color: '#636363'
    },
    {
      key: 'free' as FilterType,
      label: '무료',
      count: freeCount,
      color: '#2E7D33'
    },
    {
      key: 'freemium' as FilterType,
      label: '부분무료',
      count: freemiumCount,
      color: '#1976D2'
    },
    {
      key: 'paid' as FilterType,
      label: '유료',
      count: paidCount,
      color: '#F57C00'
    }
  ];

  // 카운트 표시 컴포넌트
  const CountBadge = ({ count, loading }: { count: number; loading?: boolean }) => {
    if (loading) {
      return (
        <span className="inline-block w-4 h-4 bg-gray-200 rounded animate-pulse ml-1"></span>
      );
    }
    return (
      <span className="text-xs opacity-75 ml-1">
        ({count.toLocaleString()})
      </span>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 3 pb-4" 
         style={{ fontFamily: 'Pretendard' }}>
      
      {/* 가격 필터 섹션 */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {priceFilters.map((filter, index) => {
            const isActive = activeFilter === filter.key;
            const hasCount = filter.count > 0 || filter.key === 'all';
            
            return (
              <React.Fragment key={filter.key}>
                <button
                  onClick={() => onFilterChange(filter.key)}
                  disabled={!hasCount && !loading}
                  className={`text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed`}
                  style={{
                    color: isActive ? '#7248BD' : '#6F6E6E',
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: 'Pretendard'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && !e.currentTarget.disabled) {
                      e.currentTarget.style.color = '#A987E8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive && !e.currentTarget.disabled) {
                      e.currentTarget.style.color = '#6F6E6E';
                    }
                  }}
                >
                  {filter.label}
                  {showCounts && <CountBadge count={filter.count} loading={loading} />}
                </button>
                
                {index < priceFilters.length - 1 && (
                  <span className="text-gray-400 text-xs select-none">•</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 정렬 드롭다운 섹션 */}
      <div className="relative w-32" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center w-full px-4 py-2 bg-white transition-none ${
            isDropdownOpen ? 'rounded-t-xl' : 'rounded-xl'
          }`}
          style={{
            borderTop: '1px solid #DBCBF9',
            borderLeft: '1px solid #DBCBF9',
            borderRight: '1px solid #DBCBF9',
            borderBottom: isDropdownOpen ? 'none' : '1px solid #DBCBF9',
            height: '40px',
            fontFamily: 'Pretendard',
            outline: 'none',
            boxShadow: 'none'
          }}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          {/* 화살표를 제외한 나머지 영역에서 가운데 정렬 */}
          <div className="flex-1 flex items-center justify-center">
            {/* 텍스트와 i버튼을 묶어서 */}
            <div className="flex items-center gap-1.5">
              {/* 텍스트 */}
              <span 
                style={{ 
                  color: '#7E50D1',
                  fontSize: '14px',
                  fontWeight: 700
                }}
              >
                {getCurrentSortOption().label}
              </span>
              
              {/* 추천순 정보 버튼 - 추천순이 선택된 경우에만 표시 */}
              {sortType === 'popular' && (
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center"
                    style={{ 
                      width: '18px', 
                      height: '18px',
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    aria-label="추천순 정보"
                  >
                    <img src="/images/Icon/InfoTooltip/18.svg" alt="정보" width={18} height={18} />
                  </button>

                  {/* 툴팁 */}
                  {showTooltip && (
                    <div 
                      className="absolute right-[-13px] bg-white z-[1001]"
                      style={{ 
                        top: 'calc(100% + 10px)',
                        borderRadius: '12px',
                        border: '1px solid #D9D9E1',
                        boxShadow: '0px 12px 32px rgba(31, 35, 41, 0.12)',
                        fontFamily: 'Pretendard',
                        width: '375px',
                        height: '144px',
                        padding: '16px 20px'
                      }}
                    >
                      {/* 말풍선 꼬리 */}
                      <div
                        className="absolute"
                        style={{
                          top: '-12px',
                          right: '22px',
                          width: 0,
                          height: 0,
                          borderLeft: '10px solid transparent',
                          borderRight: '10px solid transparent',
                          borderBottom: '12px solid #D9D9E1'
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          top: '-11px',
                          right: '23px',
                          width: 0,
                          height: 0,
                          borderLeft: '9px solid transparent',
                          borderRight: '9px solid transparent',
                          borderBottom: '11px solid #FFFFFF',
                          boxShadow: '-1px -1px 6px rgba(31, 35, 41, 0.06)'
                        }}
                      />

                      <p className="text-body3 leading-relaxed text-left" style={{ color: '#202020', lineHeight: '22px' }}>
                        추천순은 AI의 <span className="text-title6" style={{ color: '#202020', fontWeight: 700 }}>사용성</span>(쉽고 직관적으로 사용할 수 있는가), <span className="text-title6" style={{ color: '#202020', fontWeight: 700 }}>유용성</span>(실제 문제 해결에 도움이 되는가), <span className="text-title6" style={{ color: '#202020', fontWeight: 700 }}>감성</span>(사용자에게 긍정적인 인상을 주는가) 측면에 대해 ChatGPT, Gemini, Claude가 평가한 점수를 기반으로 산정되었으며, 해당 점수는 각 서비스의 상세 페이지에서 AI 평점으로 확인하실 수 있습니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* 오른쪽: 드롭다운 화살표만 */}
          <img 
            src="/images/Icon/Arrow/Dropdown18.svg" 
            alt="드롭다운"
            className={`${isDropdownOpen ? 'rotate-180' : ''}`}
            width={18}
            height={18}
          />
        </button>

        {/* 드롭다운 메뉴 */}
        {isDropdownOpen && (
          <div 
            className="absolute left-0 right-0 bg-white rounded-b-xl shadow-lg overflow-hidden"
            role="listbox"
            style={{ 
              top: '40px',
              borderLeft: '1px solid #DBCBF9',
              borderRight: '1px solid #DBCBF9',
              borderBottom: '1px solid #DBCBF9',
              zIndex: 1000,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* 드롭다운과 첫 번째 버튼 사이 구분선 */}
            <div style={{ height: '1px', backgroundColor: '#DBCBF9', width: '100%' }} />
            
            {sortOptions.map((option, index) => {
              const isActive = sortType === option.key;
              
              return (
                <React.Fragment key={option.key}>
                  <button
                    onClick={() => handleSortChange(option.key)}
                    className="w-full px-4 py-3 text-center"
                    role="option"
                    aria-selected={isActive}
                    style={{ 
                      fontFamily: 'Pretendard',
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      fontWeight: isActive ? 700 : 600,
                      color: isActive ? '#7E50D1' : '#8C8C8C'
                    }}
                  >
                    {option.label}
                  </button>
                  
                  {/* 각 버튼 사이 구분선 (마지막 버튼 제외) */}
                  {index < sortOptions.length - 1 && (
                    <div style={{ height: '1px', backgroundColor: '#DBCBF9', width: '100%' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(FilterBar);