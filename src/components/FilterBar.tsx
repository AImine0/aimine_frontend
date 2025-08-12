// [필터바 컴포넌트] 가격/정렬 필터 및 카운트 - 총 개수, 무료/유료 필터, 정렬 드롭다운
// src/components/FilterBar.tsx
import React, { useState } from 'react';
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
}

const FilterBar: React.FC<FilterBarProps> = ({
  totalCount,
  freeCount,
  paidCount,
  freemiumCount,
  activeFilter,
  onFilterChange,
  sortType,
  onSortChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSortChange = (newSortType: string) => {
    onSortChange(newSortType);
    setIsDropdownOpen(false);
  };

  const getSortLabel = (sortType: string) => {
    return sortType === 'popular' ? '추천순' : '최신순';
  };

  return (
    <div className="flex items-center justify-between mb-6 pb-4" style={{ fontFamily: 'Pretendard' }}>
      <div className="flex items-center space-x-6">
        <span className="font-medium" style={{ fontSize: '16px', color: '#636363', fontFamily: 'Pretendard' }}>
          총 {totalCount}개 <span className="mx-2">|</span>
          <button 
            onClick={() => onFilterChange('free')}
            className="hover:underline"
            style={{ 
              color: activeFilter === 'free' ? '#7248BD' : '#636363',
              fontWeight: activeFilter === 'free' ? 600 : 500,
              fontFamily: 'Pretendard'
            }}
          >
            무료
          </button>
          <span className="mx-2">•</span>
          <button 
            onClick={() => onFilterChange('freemium')}
            className="hover:underline"
            style={{ 
              color: activeFilter === 'freemium' ? '#7248BD' : '#636363',
              fontWeight: activeFilter === 'freemium' ? 600 : 500,
              fontFamily: 'Pretendard'
            }}
          >
            부분 유료
          </button>
          <span className="mx-2">•</span>
          <button 
            onClick={() => onFilterChange('paid')}
            className="hover:underline"
            style={{ 
              color: activeFilter === 'paid' ? '#7248BD' : '#636363',
              fontWeight: activeFilter === 'paid' ? 600 : 500,
              fontFamily: 'Pretendard'
            }}
          >
            유료
          </button>
        </span>
      </div>
      
      <div className="relative">
        <div 
          className="flex items-center gap-2 px-3 py-1 bg-white rounded-md cursor-pointer" 
          style={{ border: '1px solid #DBCBF9', fontFamily: 'Pretendard' }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span style={{ fontSize: '14px', color: '#7E50D1', fontFamily: 'Pretendard' }}>{getSortLabel(sortType)}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#BCBCBC' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} style={{ color: '#636363' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              className="w-full px-3 py-2 text-left hover:bg-gray-50"
              style={{ fontSize: '14px', color: '#7E50D1', fontFamily: 'Pretendard' }}
              onClick={() => handleSortChange('popular')}
            >
              추천순
            </button>
            <button
              className="w-full px-3 py-2 text-left hover:bg-gray-50"
              style={{ fontSize: '14px', color: '#7E50D1', fontFamily: 'Pretendard' }}
              onClick={() => handleSortChange('newest')}
            >
              최신순
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;