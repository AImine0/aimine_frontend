import React from 'react';
import type { SearchSuggestion } from '../types';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  searchQuery: string;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ 
  suggestions, 
  searchQuery,
  onSuggestionClick, 
  isVisible 
}) => {
  if (!isVisible) return null;

  // 연관검색어가 없으면 검색어만 표시
  const displaySuggestions = suggestions.length > 0 
    ? suggestions 
    : [{ type: 'KEYWORD' as const, text: searchQuery }];

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
      <div className="max-h-80 overflow-y-auto">
        {displaySuggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.type}-${suggestion.id || index}`}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            {/* AI 서비스: 로고 + 이름 + 태그 */}
            {suggestion.type === 'AI_SERVICE' && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 flex-shrink-0">
                  <img
                    src={suggestion.logoUrl}
                    alt={suggestion.text}
                    className="w-full h-full object-contain rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/Logo/Logo_FINAL.svg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-gray-500">
                    {suggestion.tag}
                  </div>
                </div>
              </div>
            )}

            {/* 카테고리: 경로 표시 */}
            {suggestion.type === 'CATEGORY' && (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex-shrink-0 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div 
                    className="text-sm text-gray-700"
                    style={{ color: '#202020', fontWeight: 700, fontSize: '12px' }}
                  >
                    {suggestion.categoryPath || `홈 > 기능별 > ${suggestion.text}`}
                  </div>
                </div>
              </div>
            )}

            {/* 키워드: 검색 아이콘 + 텍스트 */}
            {suggestion.type === 'KEYWORD' && (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex-shrink-0 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div 
                    className="text-sm"
                    style={{ color: '#202020', fontWeight: 700, fontSize: '12px' }}
                  >
                    {suggestion.text}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;