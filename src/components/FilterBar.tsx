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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4" 
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
                  className={`text-sm transition-all duration-200 hover:underline disabled:opacity-40 disabled:cursor-not-allowed ${
                    isActive ? 'font-semibold' : 'font-normal'
                  }`}
                  style={{
                    color: isActive ? '#7E50D1' : '#6F6E6E',
                    fontFamily: 'Pretendard'
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
          className={`flex items-center justify-between w-full gap-2 px-4 py-2 bg-white transition-none ${
            isDropdownOpen ? 'rounded-t-xl' : 'rounded-xl'
          }`}
          style={{
            // 핵심 수정: 드롭다운이 열릴 때 하단 테두리 제거
            borderTop: '1px solid #DBCBF9',
            borderLeft: '1px solid #DBCBF9',
            borderRight: '1px solid #DBCBF9',
            borderBottom: isDropdownOpen ? 'none' : '1px solid #DBCBF9', // 열릴 때 하단 제거!
            height: '40px',
            fontFamily: 'Pretendard',
            outline: 'none',
            boxShadow: 'none'
          }}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span 
            style={{ 
              color: '#7E50D1',
              fontSize: '14px',
              fontWeight: 700,
              textAlign: 'center',
              flex: 1
            }}
          >
            {getCurrentSortOption().label}
          </span>
          
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            style={{ color: '#636363' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 드롭다운 메뉴 */}
        {isDropdownOpen && (
          <div 
            className="absolute left-0 right-0 bg-white rounded-b-xl shadow-lg overflow-hidden"
            role="listbox"
            style={{ 
              top: '40px', // 버튼 높이만큼 정확히 아래에 위치
              borderLeft: '1px solid #DBCBF9',
              borderRight: '1px solid #DBCBF9',
              borderBottom: '1px solid #DBCBF9',
              // borderTop은 아예 제거 - 구분선으로만 처리
              zIndex: 1000,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* 드롭다운과 첫 번째 버튼 사이 구분선 - 이제 유일한 구분선 */}
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