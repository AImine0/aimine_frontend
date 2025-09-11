// [브레드크럼 컴포넌트] 페이지 경로 표시 - 현재 위치와 네비게이션 경로 안내
// src/components/Breadcrumb.tsx
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb" style={{ fontFamily: 'Pretendard' }}>
      <ol className="flex items-center space-x-0.5">
        <li>
          <div className="flex items-center">
            <a href="/" className="text-sm font-medium" style={{ color: '#9B9B9B', fontFamily: 'Pretendard' }}>
              홈
            </a>
          </div>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 h-4 w-4 mx-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
                style={{ color: '#9B9B9B' }}
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a 1 1 0 010 1.414l-4 4a 1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-sm font-medium hover:text-gray-700"
                  style={{ color: '#9B9B9B', fontFamily: 'Pretendard' }}
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-sm font-medium" style={{ color: '#9B9B9B', fontFamily: 'Pretendard' }}>
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;