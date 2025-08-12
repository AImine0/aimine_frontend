// [키워드 필터 컴포넌트] 태그 기반 필터링 - 키워드 선택/해제, 초기화 기능
// src/components/KeywordFilter.tsx
import React from 'react';

interface KeywordFilterProps {
  keywords: string[];
  activeKeywords: string[];
  onKeywordToggle: (keyword: string) => void;
  onReset: () => void;
}

const KeywordFilter: React.FC<KeywordFilterProps> = ({ 
  keywords, 
  activeKeywords, 
  onKeywordToggle,
  onReset
}) => {
  return (
    <div className="bg-purple-50 rounded-2xl p-6 mb-8 border border-purple-200" style={{ borderColor: '#DBCBF9', fontFamily: 'Pretendard' }}>
      <div className="flex flex-wrap gap-3">
        {keywords.map((keyword) => {
          const isActive = activeKeywords.includes(keyword);
          return (
            <button
              key={keyword}
              onClick={() => onKeywordToggle(keyword)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors border flex items-center gap-1 ${
                isActive
                  ? 'bg-white shadow-sm'
                  : 'bg-transparent hover:bg-white hover:bg-opacity-50'
              }`}
              style={{ 
                fontSize: '14px',
                borderColor: '#A987E8',
                color: isActive ? '#6238AE' : '#512E8F',
                fontFamily: 'Pretendard'
              }}
            >
              {isActive && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span>{keyword}</span>
            </button>
          );
        })}
        <button 
          onClick={onReset}
          className="ml-auto text-sm font-normal flex items-center gap-1"
          style={{ color: '#6238AE', fontSize: '14px', fontFamily: 'Pretendard' }}
        >
          <img src="/init_icon.svg" alt="초기화" style={{ width: '20px', height: '20px' }} />
          초기화
        </button>
      </div>
    </div>
  );
};

export default KeywordFilter;