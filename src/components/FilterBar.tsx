// [필터바 컴포넌트] 가격/정렬 필터 및 카운트 - 실시간 개수, 확장된 정렬, 반응형 디자인
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

  // 정렬 옵션들
  const sortOptions: SortOption[] = [
    {
      key: 'popular',
      label: '추천순',
      icon: '🔥',
      description: '인기도 기준'
    },
    {
      key: 'rating', 
      label: '평점순',
      icon: '⭐',
      description: '별점 높은 순'
    },
    {
      key: 'newest',
      label: '최신순',
      icon: '🆕',
      description: '출시일 기준'
    },
    {
      key: 'name',
      label: '이름순',
      icon: '🔤',
      description: '가나다 순'
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
        <span className="font-medium text-sm text-gray-600">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              <span>개</span>
            </div>
          ) : (
            `총 ${totalCount.toLocaleString()}개`
          )}
        </span>

        <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>

        <div className="flex flex-wrap items-center gap-3">
          {priceFilters.map((filter, index) => {
            const isActive = activeFilter === filter.key;
            const hasCount = filter.count > 0 || filter.key === 'all';
            
            return (
              <React.Fragment key={filter.key}>
                <button
                  onClick={() => onFilterChange(filter.key)}
                  disabled={!hasCount && !loading}
                  className={`text-sm transition-all duration-200 hover:underline disabled:opacity-40 disabled:cursor-not-allowed ${
                    isActive ? 'font-semibold' : 'font-medium'
                  }`}
                  style={{
                    color: isActive ? '#7248BD' : filter.color,
                    fontFamily: 'Pretendard'
                  }}
                >
                  {filter.label}
                  {showCounts && <CountBadge count={filter.count} loading={loading} />}
                </button>
                
                {index < priceFilters.length - 1 && (
                  <span className="text-gray-400 text-sm select-none">•</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 정렬 드롭다운 섹션 */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          style={{ border: '1px solid #DBCBF9', fontFamily: 'Pretendard' }}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="text-sm" style={{ color: '#7E50D1' }}>
            {getCurrentSortOption().icon} {getCurrentSortOption().label}
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

        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1"
               role="listbox">
            {sortOptions.map((option, index) => {
              const isActive = sortType === option.key;
              
              return (
                <button
                  key={option.key}
                  onClick={() => handleSortChange(option.key)}
                  className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors duration-150 flex items-center justify-between group ${
                    isActive ? 'bg-purple-50' : ''
                  }`}
                  role="option"
                  aria-selected={isActive}
                  style={{ fontFamily: 'Pretendard' }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span 
                        className="text-sm font-medium"
                        style={{ color: isActive ? '#7248BD' : '#333' }}
                      >
                        {option.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </div>
                  </div>
                  
                  {isActive && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#7248BD' }}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(FilterBar);