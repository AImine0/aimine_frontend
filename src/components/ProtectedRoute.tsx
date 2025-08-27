// [보호된 라우트] 인증이 필요한 페이지 접근 제어

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때 스피너 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: 'Pretendard' }}>
            인증 상태를 확인하는 중...
          </p>
        </div>
      </div>
    );
  }

  // 인증이 필요한 페이지인데 로그인하지 않은 경우
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location.pathname,
          message: '로그인이 필요한 페이지입니다.' 
        }} 
        replace 
      />
    );
  }

  // 인증된 사용자는 접근 허용
  return <>{children}</>;
};

export default ProtectedRoute;