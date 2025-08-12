// [AI 툴 카드 컴포넌트] 개별 AI 도구 정보 표시 - 이름, 설명, BEST 뱃지, 링크 버튼
// src/components/ToolCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { AITool } from '../types';
import { handleImageError } from '../utils/imageMapping';

interface ToolCardProps {
  tool: AITool;
  rank?: number;
  className?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, rank, className }) => {
  const getBestBadge = (rank: number) => {
    return (
      <span className="inline-flex items-center px-2 py-1 font-bold"
            style={{ 
              backgroundColor: '#FFE4C4', 
              color: '#7E50D1',
              width: '66px',
              height: '32px',
              borderRadius: '3.26px',
              justifyContent: 'center',
              fontSize: '14px',
              fontFamily: 'Pretendard'
            }}>
        BEST {rank}
      </span>
    );
  };

  return (
    <div className={`bg-white rounded-xl hover:border-purple-200 hover:shadow-lg transition-all duration-200 ${className || ''}`} style={{ border: '1px solid #DBCBF9', fontFamily: 'Pretendard', padding: '20px', minHeight: '250px' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {tool.logoUrl ? (
                <img 
                  src={tool.logoUrl} 
                  alt={`${tool.name} 로고`}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, '/images/Logo/Logo_FINAL.svg')}
                />
              ) : (
                <span className="text-3xl">🤖</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full font-medium w-fit" 
                 style={{ 
                   backgroundColor: '#E9DFFB',
                   borderRadius: '20px',
                   color: '#202020',
                   fontSize: '14px',
                   fontFamily: 'Pretendard'
                 }}>
              {tool.categoryLabel}
            </div>
            <Link to={`/tool/${tool.id}`} className="hover:text-purple-600">
              <h3 className="font-semibold" style={{ color: '#000000', fontSize: '24px', fontFamily: 'Pretendard' }}>{tool.name}</h3>
            </Link>
            <p className="font-semibold leading-relaxed" style={{ color: '#000000', fontSize: '16px', fontFamily: 'Pretendard' }}>{tool.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {rank && rank <= 3 && getBestBadge(rank)}
          <Link to={`/tool/${tool.id}`}>
            <button className="flex items-center justify-center transition-colors shadow-sm" 
                    style={{ 
                      backgroundColor: '#E9DFFB', 
                      width: '32px', 
                      height: '32px',
                      borderRadius: '3.56px'
                    }}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 28 28" strokeWidth="2" style={{ color: '#000000' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7H7a3 3 0 00-3 3v11a3 3 0 003 3h11a3 3 0 003-3v-5M16 5h7m0 0v7m0-7L12 16" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;