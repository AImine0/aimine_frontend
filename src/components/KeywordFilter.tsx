// [키워드 필터 컴포넌트] API 기반 키워드 필터링 - 타입별 그룹화, 도구 개수, 검색 기능
import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services';
import type { KeywordListResponse } from '../types';

interface KeywordData {
  id: number;
  keyword: string;
  type: 'FEATURE' | 'FUNCTION' | 'INDUSTRY' | 'USE_CASE';
  tool_count: number;
}

interface KeywordFilterProps {
  keywords?: string[]; // 기존 호환성을 위해 유지
  activeKeywords: string[];
  onKeywordToggle: (keyword: string) => void;
  onReset: () => void;
  category?: string; // 카테고리별 필터링
}

const KeywordFilter: React.FC<KeywordFilterProps> = ({ 
  keywords: legacyKeywords,
  activeKeywords, 
  onKeywordToggle,
  onReset,
  category
}) => {
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [showAll, setShowAll] = useState(false);

  // API에서 키워드 데이터 로드
  useEffect(() => {
    const loadKeywords = async () => {
      // 레거시 키워드가 있으면 API 호출하지 않음
      if (legacyKeywords && legacyKeywords.length > 0) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response: KeywordListResponse = await apiService.getKeywords();
        
        if (response.keywords && Array.isArray(response.keywords)) {
          setKeywordData(response.keywords);
        } else {
          setError('키워드 데이터 형식이 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('키워드 로딩 실패:', error);
        setError('키워드를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadKeywords();
  }, [legacyKeywords, category]);

  // 키워드 타입 설정
  const keywordTypes = [
    { key: 'ALL', name: '전체', color: '#6B7280' },
    { key: 'FEATURE', name: '기능', color: '#3B82F6' },
    { key: 'FUNCTION', name: '용도', color: '#10B981' },
    { key: 'INDUSTRY', name: '산업', color: '#F59E0B' },
    { key: 'USE_CASE', name: '활용', color: '#EF4444' }
  ];

  // 필터링된 키워드들
  const filteredKeywords = useMemo(() => {
    // 레거시 키워드 사용 시
    if (legacyKeywords && legacyKeywords.length > 0) {
      return legacyKeywords
        .filter(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, showAll ? undefined : 20);
    }

    // API 키워드 사용 시
    let filtered = keywordData;

    // 타입 필터링
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(kw => kw.type === selectedType);
    }

    // 검색 쿼리 필터링
    if (searchQuery) {
      filtered = filtered.filter(kw => 
        kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 도구 개수 기준 정렬 (많은 순)
    filtered = filtered.sort((a, b) => b.tool_count - a.tool_count);

    // 표시 개수 제한
    return filtered.slice(0, showAll ? undefined : 15);
  }, [legacyKeywords, keywordData, searchQuery, selectedType, showAll]);

  // 키워드 타입별 색상 반환
  const getTypeColor = (type: string) => {
    return keywordTypes.find(t => t.key === type)?.color || '#6B7280';
  };

  // 키워드 타입별 개수
  const getTypeCount = (type: string) => {
    if (type === 'ALL') return keywordData.length;
    return keywordData.filter(kw => kw.type === type).length;
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="bg-purple-50 rounded-2xl p-6 mb-8 border border-purple-200" style={{ borderColor: '#DBCBF9' }}>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
          <span className="text-gray-600">키워드를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 mb-8 border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 text-sm">{error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mb-8" style={{ backgroundColor: '#F2EEFB', border: 'none', borderRadius: '20px', fontFamily: 'Pretendard' }}>
      
      {/* API 키워드를 사용하는 경우 상단 컨트롤 */}
      {keywordData.length > 0 && (
        <div className="mb-4 space-y-4">
          {/* 검색바 */}
          <div className="relative">
            <input
              type="text"
              placeholder="키워드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              style={{ fontFamily: 'Pretendard' }}
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* 타입 필터 탭 */}
          <div className="flex flex-wrap gap-2">
            {keywordTypes.map((type) => {
              const isActive = selectedType === type.key;
              const count = getTypeCount(type.key);
              
              return (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(type.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    isActive 
                      ? 'bg-white shadow-sm border-2' 
                      : 'bg-white/50 border-2 border-transparent hover:bg-white/80'
                  }`}
                  style={{
                    borderColor: isActive ? type.color : 'transparent',
                    color: type.color,
                    fontFamily: 'Pretendard'
                  }}
                >
                  <span>{type.name}</span>
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 키워드 목록 */}
      <div className="flex flex-wrap gap-3">
        {filteredKeywords.length === 0 ? (
          <div className="w-full text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          filteredKeywords.map((item) => {
            const keyword = typeof item === 'string' ? item : item.keyword;
            const isActive = activeKeywords.includes(keyword);
            const toolCount = typeof item === 'string' ? null : item.tool_count;
            const keywordType = typeof item === 'string' ? null : item.type;
            
            return (
              <button
                key={typeof item === 'string' ? item : item.id}
                onClick={() => onKeywordToggle(keyword)}
                className={`px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1.5 hover:shadow-sm`}
                style={{ 
                  fontSize: '14px',
                  backgroundColor: isActive ? '#ffffff' : '#F2EEFB',
                  border: '1px solid #A987E8',
                  borderRadius: '20px',
                  color: '#7242C9',
                  fontWeight: isActive ? 700 : 600,
                  fontFamily: 'Pretendard'
                }}
              >
                {isActive && (
                  <img src="/images/Icon/Check/20.svg" alt="선택됨" width={20} height={20} />
                )}
                
                <span>{keyword}</span>
                
                {/* API 키워드인 경우 도구 개수와 타입 표시 */}
                {toolCount !== null && (
                  <span 
                    className="text-xs px-1.5 py-0.5 rounded-full bg-opacity-20"
                    style={{ 
                      backgroundColor: getTypeColor(keywordType || ''),
                      color: getTypeColor(keywordType || '')
                    }}
                  >
                    {toolCount}
                  </span>
                )}
              </button>
            );
          })
        )}

        {/* 더 보기 버튼 */}
        {!showAll && ((legacyKeywords && legacyKeywords.length > 20) || (keywordData.length > 15)) && (
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 rounded-full font-medium transition-colors border-2 border-dashed"
            style={{
              fontSize: '14px',
              borderColor: '#A987E8',
              color: '#512E8F',
              fontFamily: 'Pretendard'
            }}
          >
            더 보기 ({((legacyKeywords?.length || keywordData.length) - (legacyKeywords ? 20 : 15))}개 더)
          </button>
        )}

        {/* 초기화 버튼: '전체' 외 키워드가 선택된 경우에만 표시 */}
        {activeKeywords.some(k => k !== '전체') && (
          <button 
            onClick={() => {
              onReset();
              setSearchQuery('');
              setSelectedType('ALL');
              setShowAll(false);
            }}
            className="ml-auto text-sm font-normal flex items-center gap-1 px-3 py-2 rounded-lg transition-colors"
            style={{ color: '#6238AE', fontSize: '14px', fontFamily: 'Pretendard' }}
          >
            <img src="/images/Icon/Reset/20.svg" alt="초기화" width={20} height={20} />
            초기화
          </button>
        )}
        
      </div>
    </div>
  );
};

export default KeywordFilter;