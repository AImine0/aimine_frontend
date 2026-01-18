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

  const displaySuggestions = suggestions.length > 0 
    ? suggestions 
    : [{ type: 'KEYWORD' as const, text: searchQuery }];

  return (
    <div 
      className="absolute top-full left-0 right-0 bg-white shadow-lg py-4 z-50" 
      style={{ 
        marginTop: '0px', 
        borderRadius: '0 0 20px 20px', 
        border: '1px solid #8C8C8C', 
        borderTop: 'none' 
      }}
    >
      <div className="max-h-80 overflow-y-auto">
        {displaySuggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.type}-${suggestion.id || index}`}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
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
                  <div 
                    className="text-sm font-medium"
                    style={{ color: '#202020', fontWeight: 600, fontSize: '12px', fontFamily: 'Pretendard' }}
                  >
                    {suggestion.text}
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: '#9B9B9B', fontWeight: 500, fontSize: '10px', fontFamily: 'Pretendard' }}
                  >
                    {suggestion.tag}
                  </div>
                </div>
              </div>
            )}

            {/* 카테고리: 경로 표시 */}
            {suggestion.type === 'CATEGORY' && (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 flex-shrink-0 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div 
                    className="text-sm"
                    style={{ color: '#202020', fontWeight: 600, fontSize: '12px', fontFamily: 'Pretendard' }}
                  >
                    {suggestion.categoryPath || `홈 > 기능별 > ${suggestion.text}`}
                  </div>
                </div>
              </div>
            )}

            {/* 키워드: 아이콘 없이 텍스트만 */}
            {suggestion.type === 'KEYWORD' && (
              <div className="flex items-center px-1">
                <div className="flex-1">
                  <div 
                    className="text-sm"
                    style={{ color: '#202020', fontWeight: 600, fontSize: '12px', fontFamily: 'Pretendard' }}
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