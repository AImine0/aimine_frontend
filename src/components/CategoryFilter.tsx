// [카테고리 필터 컴포넌트] 카테고리별 필터링 - 아이콘, 이름, 개수 표시
// src/components/CategoryFilter.tsx
import React from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 ${
            activeCategory === category.id
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.name}
          {category.count > 0 && (
            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;